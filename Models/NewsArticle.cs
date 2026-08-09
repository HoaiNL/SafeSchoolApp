namespace SafeSchoolApp.Models
{
    /// <summary>
    /// Model tin tức, bài viết kiến thức & kỹ năng ứng phó bắt nạt học đường
    /// </summary>
    public class NewsArticle
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Summary { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public string Category { get; set; } = "Kỹ năng phòng vệ"; // Kỹ năng phòng vệ, Tư vấn tâm lý, Pháp lý học đường, Câu chuyện cảm hứng

        public string Author { get; set; } = "Chuyên gia Tâm lý SafeSchool";

        public string ImageUrl { get; set; } = string.Empty;

        public string ReadTime { get; set; } = "4 phút đọc";

        public DateTime PublishedDate { get; set; } = DateTime.Now;

        public List<string> Tags { get; set; } = new List<string>();
    }

    /// <summary>
    /// DTO tin nhắn giao tiếp với AI Trợ Lý Khẩn Cấp & Tâm Lý
    /// </summary>
    public class AiChatMessage
    {
        public string Sender { get; set; } = "user"; // user, ai
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public string? SuggestedAction { get; set; } // e.g. "call_111", "create_report", "talk_counselor"
    }
}
