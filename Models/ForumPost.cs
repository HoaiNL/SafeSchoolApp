namespace SafeSchoolApp.Models
{
    /// <summary>
    /// Model quản lý bài viết trên Diễn đàn chia sẻ & hỗ trợ tâm lý
    /// </summary>
    public class ForumPost
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Category { get; set; } = "Tâm sự học đường"; // Tâm sự học đường, Hỏi đáp pháp lý, Kinh nghiệm vượt qua, Góc tư vấn phụ huynh

        public string Content { get; set; } = string.Empty;

        public string AuthorName { get; set; } = "Học sinh ẩn danh";

        public bool IsAnonymous { get; set; } = true;

        public int LikesCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public List<ForumComment> Comments { get; set; } = new List<ForumComment>();
    }

    /// <summary>
    /// Model quản lý bình luận trên bài viết diễn đàn
    /// </summary>
    public class ForumComment
    {
        public int Id { get; set; }

        public int PostId { get; set; }

        public string AuthorName { get; set; } = "Bạn đọc ẩn danh";

        public bool IsAnonymous { get; set; } = true;

        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
