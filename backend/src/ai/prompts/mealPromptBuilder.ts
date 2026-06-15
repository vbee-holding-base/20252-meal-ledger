import {
    ParseMealTextInput,
} from "../types/mealParserTypes";
export const buildPrompt = ({
  text,
  now,
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