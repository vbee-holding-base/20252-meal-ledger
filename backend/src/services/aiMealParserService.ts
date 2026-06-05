export interface MealParserParticipantContext {
  id: string;
  name: string;
}

export interface MealParserRestaurantContext {
  id: string;
  name: string;
  address: string;
}

export interface ParsedMealParticipant {
  name: string;
  amount: number;
  rawText?: string;
}

export interface ParsedMealDraft {
  restaurantName: string | null;
  date: string;
  totalAmount: number | null;
  participants: ParsedMealParticipant[];
  notes: string[];
}

interface ParseMealTextInput {
  text: string;
  now: Date;
  participants: MealParserParticipantContext[];
  restaurants: MealParserRestaurantContext[];
}

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta";

const mealDraftSchema = {
  type: "object",
  properties: {
    restaurantName: {
      type: "string",
      nullable: true,
    },
    date: {
      type: "string",
    },
    totalAmount: {
      type: "number",
      nullable: true,
    },
    participants: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          amount: {
            type: "number",
          },
          rawText: {
            type: "string",
          },
        },
        required: ["name", "amount"],
      },
    },
    notes: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: ["restaurantName", "date", "totalAmount", "participants", "notes"],
};

const buildPrompt = ({
  text,
  now,
  participants,
  restaurants,
}: ParseMealTextInput) => `
Bạn là service bóc tách dữ liệu bữa ăn trưa từ text tiếng Việt.

Hãy trả về JSON đúng schema đã yêu cầu.
Không trả về markdown.
Không giải thích ngoài JSON.

Quy tắc:
- Nếu text không nói thời gian, dùng thời điểm hiện tại: ${now.toISOString()}.
- Chuẩn hóa tiền Việt Nam sang VND:
  - "55k", "55 K", "55 ngàn", "55 nghìn" = 55000
  - "1tr2", "1 triệu 2", "1.2tr" = 1200000
- Chỉ bóc tách những người thực sự ăn/uống/có món trong text.
- Các từ "tôi", "mình", "owner", "người trả tiền" chỉ là người thanh toán, không tự động tính là participant nếu text không nói rõ có ăn.
- Nếu tên người gần đúng với danh sách participants, hãy dùng tên chuẩn trong danh sách.
- Nếu quán ăn gần đúng với danh sách restaurants, hãy dùng tên chuẩn trong danh sách.
- Nếu không chắc chắn thông tin nào, vẫn bóc tách phần chắc chắn và thêm lý do vào notes.
- Không được tự bịa số tiền, người, quán ăn.

Danh sách participants đã cấu hình:
${JSON.stringify(participants)}

Danh sách restaurants đã cấu hình:
${JSON.stringify(restaurants)}

Text cần bóc tách:
"${text}"
`;

export const parseMealTextWithGemini = async (
  input: ParseMealTextInput,
): Promise<ParsedMealDraft> => {
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
          responseSchema: mealDraftSchema,
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

  return JSON.parse(responseText) as ParsedMealDraft;
};