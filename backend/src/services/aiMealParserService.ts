export interface MealParserOwnerContext {
  id: string;
  name: string;
  aliases: string[];
}

export interface MealParserParticipantContext {
  id: string;
  name: string;
}

export interface MealParserRestaurantContext {
  id: string;
  name: string;
  address: string;
}

export interface ParsedMealRawEntry {
  personName: string;
  amount: number | null;
  rawText?: string;
}

export interface ParsedMealRaw {
  restaurantName: string | null;
  date: string | null;
  payerName: string | null;
  totalAmount: number | null;
  entries: ParsedMealRawEntry[];
  notes: string[];
}

interface ParseMealTextInput {
  text: string;
  now: Date;
  owner: MealParserOwnerContext;
  participants: MealParserParticipantContext[];
  restaurants: MealParserRestaurantContext[];
}

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";

const rawMealParseSchema = {
  type: "object",
  properties: {
    restaurantName: {
      type: "string",
      nullable: true,
    },
    date: {
      type: "string",
      nullable: true,
    },
    payerName: {
      type: "string",
      nullable: true,
    },
    payerName: {
      type: "string",
      nullable: true,
    },
    payerIsOwner: {
      type: "boolean",
    },
    totalAmount: {
      type: "number",
      nullable: true,
    },
    entries: {
      type: "array",
      items: {
        type: "object",
        properties: {
          personName: {
            type: "string",
          },
          amount: {
            type: "number",
            nullable: true,
          },
          rawText: {
            type: "string",
          },
        },
        required: ["personName", "amount"],
      },
    },
    notes: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: [
    "restaurantName",
    "date",
    "payerName",
    "totalAmount",
    "entries",
    "notes",
  ],
};

const buildPrompt = ({
  text,
  now,
  owner,
  participants,
  restaurants,
}: ParseMealTextInput) => `
Bạn là bộ bóc tách dữ liệu từ text tiếng Việt.

Nhiệm vụ duy nhất của bạn là parse text thành JSON raw.
Không validate nghiệp vụ.
Không đánh giá đúng/sai.
Không loại bỏ dữ liệu bất thường.
Không tự sửa dữ liệu bất thường.
Không trả markdown.
Không giải thích ngoài JSON.

Cần trích xuất:
- restaurantName: tên quán nếu có, không có thì null.
- date: ngày giờ bữa ăn nếu có. Nếu không có thời gian, dùng thời điểm hiện tại: ${now.toISOString()}.
- payerName: người trả tiền nếu text có nói. Nếu không nói ai trả tiền thì null.
- totalAmount: tổng tiền nếu có, không có thì null.
- entries: danh sách người được nhắc tới cùng số tiền tương ứng.
- notes: ghi chú parse nếu text mơ hồ.

Quy tắc parse tiền:
- "55k", "55 K", "55 ngàn", "55 nghìn" = 55000.
- "1tr2", "1 triệu 2", "1.2tr" = 1200000.
- Nếu text ghi số tiền âm như "-90k", giữ nguyên là -90000.
- Nếu không xác định được số tiền của một người, amount = null.

Danh sách participants dưới đây chỉ dùng để hỗ trợ chuẩn hóa tên nếu khớp rõ ràng.
Không dùng danh sách này để đánh giá hợp lệ hay không hợp lệ.
Nếu tên không có trong danh sách, vẫn giữ nguyên tên đã parse.

Participants context:
${JSON.stringify(participants)}

Danh sách restaurants dưới đây chỉ dùng để hỗ trợ chuẩn hóa tên quán nếu khớp rõ ràng.
Không dùng danh sách này để đánh giá hợp lệ hay không hợp lệ.
Nếu quán không có trong danh sách, vẫn giữ nguyên tên đã parse.

Restaurants context:
${JSON.stringify(restaurants)}

Text cần parse:
"${text}"
`;

export const parseMealTextWithGemini = async (
  input: ParseMealTextInput,
): Promise<ParsedMealRaw> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  const response = await fetch(
    `${GEMINI_API_URL}/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: buildPrompt(input),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: rawMealParseSchema,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (typeof responseText !== "string" || responseText.trim() === "") {
    throw new Error("Gemini response did not contain parseable text");
  }

  return JSON.parse(responseText) as ParsedMealRaw;
};