using SafeSchoolApp.Models;

namespace SafeSchoolApp.Services
{
    public interface IAiSupportService
    {
        AiChatMessage GenerateAiResponse(string userMessage);
    }

    /// <summary>
    /// Service Trợ lý AI Khẩn cấp & Tư vấn Tâm lý Học đường
    /// Phản hồi thông minh, đồng cảm, phân loại nguy cơ và chỉ dẫn hành động khẩn cấp
    /// </summary>
    public class AiSupportService : IAiSupportService
    {
        public AiChatMessage GenerateAiResponse(string userMessage)
        {
            string messageLower = userMessage.ToLower().Trim();
            string responseText;
            string? action = null;

            if (messageLower.Contains("đánh") || messageLower.Contains("bạo lực") || messageLower.Contains("chặn đường") || messageLower.Contains("tống tiền") || messageLower.Contains("nguy hiểm"))
            {
                responseText = "🛡️ **CẢNH BÁO NGUY HIỂM KHẨN CẤP!**\n\nNếu em đang bị đe dọa trực tiếp hoặc gặp nguy hiểm về thể xác:\n" +
                               "1. Hãy di chuyển ngay tới khu vực đông người (phòng bảo vệ, văn phòng giáo viên, cửa hàng đông đúc).\n" +
                               "2. Gọi ngay Tổng đài Khẩn cấp **111** (Bảo vệ Trẻ em 24/7) hoặc **113** (Cảnh sát phản ứng nhanh).\n" +
                               "3. Nhấn nút 'Báo cáo Ẩn danh' trên SafeSchool để Ban giám hiệu & Chuyên gia lập tức can thiệp bảo vệ em.";
                action = "emergency_call";
            }
            else if (messageLower.Contains("cô lập") || messageLower.Contains("buồn") || messageLower.Contains("sợ") || messageLower.Contains("tâm sự") || messageLower.Contains("áp lực"))
            {
                responseText = "🤝 **SafeSchool luôn ở bên em!**\n\nCảm giác bị cô lập hay xa lánh rất đau đớn, nhưng em hãy nhớ: **Em không hề cô đơn và em không làm gì sai cả.**\n\n" +
                               "💡 Lời khuyên nhanh:\n" +
                               "- Đừng giữ nỗi sợ một mình. Hãy tìm một người em thực sự tin tưởng (thầy cô, phụ huynh, anh chị) để chia sẻ.\n" +
                               "- Em có thể viết bài chia sẻ ẩn danh trên **Diễn đàn SafeSchool** để nhận lời khuyên từ các bạn đồng cảm và chuyên gia tâm lý.";
                action = "visit_forum";
            }
            else if (messageLower.Contains("báo cáo") || messageLower.Contains("ẩn danh") || messageLower.Contains("bảo mật") || messageLower.Contains("gửi tin"))
            {
                responseText = "🔒 **Hệ thống Báo cáo Ẩn danh SafeSchool:**\n\n- Khi gửi đơn báo cáo ẩn danh, hệ thống sẽ KHÔNG lưu tên, SĐT hay địa chỉ IP của em.\n" +
                               "- Em sẽ nhận được một **Mã Tra Cứu Bí Mật** (Ví dụ: `SS-89A12B`) để theo dõi tiến độ xử lý mà không lo bị lộ danh tính.\n" +
                               "- Em có muốn mở trang Báo cáo Ẩn danh ngay bây giờ không?";
                action = "create_report";
            }
            else if (messageLower.Contains("pháp lý") || messageLower.Contains("luật") || messageLower.Contains("bị phạt"))
            {
                responseText = "⚖️ **Về mặt Pháp lý bảo vệ học sinh:**\n\n- Theo **Luật Trẻ em 2016** và **Nghị định 80/2017/NĐ-CP**, mọi hành vi bạo lực, lăng mạ, bôi nhọ danh dự học sinh đều là vi phạm pháp luật nghiêm trọng.\n" +
                               "- Nhà trường có nghĩa vụ tạm đình chỉ học sinh vi phạm và phối hợp cùng Cảnh sát xử lý nếu có dấu hiệu hành hung, tống tiền hoặc nhục mạ trên mạng.";
                action = "read_laws";
            }
            else
            {
                responseText = "👋 Chào em! Tôi là **AI Support SafeSchool** - Trợ lý hỗ trợ và phòng chống bắt nạt học đường.\n\n" +
                               "Tôi có thể giúp em:\n" +
                               "1. 🚨 Hướng dẫn xử lý khi gặp tình huống khẩn cấp / bị đe dọa.\n" +
                               "2. 🔒 Hướng dẫn gửi Báo cáo Bắt nạt Ẩn danh an toàn 100%.\n" +
                               "3. 🤝 Tư vấn giải tỏa áp lực tâm lý học đường.\n" +
                               "4. 📞 Kết nối trực tiếp với Tổng đài 111 & Cảnh sát 113.\n\nEm đang cần hỗ trợ ở vấn đề nào?";
            }

            return new AiChatMessage
            {
                Sender = "ai",
                Message = responseText,
                Timestamp = DateTime.Now,
                SuggestedAction = action
            };
        }
    }
}
