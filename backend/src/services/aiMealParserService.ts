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

export interface ParsedMealParticipant {
  name: string;
  amount: number;
  rawText?: string;
}

export interface ParsedMealDraft {
  restaurantName: string | null;
  date: string;
  payerName: string | null;
  payerIsOwner: boolean;
  totalAmount: number | null;
  ownerShareAmount: number | null;
  participants: ParsedMealParticipant[];
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
    ownerShareAmount: {
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
  required: [
    "restaurantName",
    "date",
    "payerName",
    "payerIsOwner",
    "totalAmount",
    "ownerShareAmount",
    "participants",
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
Bạn là service bóc tách dữ liệu bữa ăn trưa từ text tiếng Việt.

Hãy trả về JSON đúng schema đã yêu cầu.
Không trả về markdown.
Không giải thích ngoài JSON.

Khái niệm nghiệp vụ:
- Owner là người sở hữu hệ thống, thường là người đứng ra trả tiền hộ.
- Participants là những người đi ăn cùng owner.
- Công nợ chỉ tính số tiền participants cần trả lại owner.
- Owner không bao giờ bị tính là người nợ chính mình.
- Nếu owner cũng ăn, phần tiền owner ăn phải đưa vào ownerShareAmount, không đưa vào participants.
- Nếu người trả tiền không phải owner, vẫn parse dữ liệu nhưng phải ghi chú vào notes.

Thông tin owner:
${JSON.stringify(owner)}

Quy tắc:
- Nếu text không nói thời gian, dùng thời điểm hiện tại: ${now.toISOString()}.
- Chuẩn hóa tiền Việt Nam sang VND:
  - "55k", "55 K", "55 ngàn", "55 nghìn" = 55000
  - "1tr2", "1 triệu 2", "1.2tr" = 1200000
- Nếu text nói một người "đứng ra trả", "trả tiền", "thanh toán", hãy gán người đó vào payerName.
- Nếu payerName khớp owner.name hoặc owner.aliases, payerIsOwner = true.
- Nếu payerName không khớp owner.name hoặc owner.aliases, payerIsOwner = false.
- Nếu không thấy rõ ai trả tiền, payerName = null và payerIsOwner = true vì hệ thống mặc định owner là người trả.
- Nếu payerIsOwner = true, participants chỉ gồm những người cần trả tiền lại cho owner.
- Không đưa owner vào participants nếu owner là người trả tiền.
- Nếu tổng tiền lớn hơn tổng tiền participants, và payer là owner, phần chênh lệch là ownerShareAmount nếu ngữ cảnh hợp lý.
- Ví dụ: "Nam trả 200k. Minh ăn 50k, Hải ăn 60k", nếu Nam là owner thì ownerShareAmount = 90000.
- Nếu owner không ăn hoặc không xác định phần owner ăn, ownerShareAmount có thể là 0 hoặc null.
- Nếu tên người gần đúng với danh sách participants, hãy dùng tên chuẩn trong danh sách.
- Nếu quán ăn gần đúng với danh sách restaurants, hãy dùng tên chuẩn trong danh sách.
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