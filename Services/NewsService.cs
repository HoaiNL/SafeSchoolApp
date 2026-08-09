using SafeSchoolApp.Models;

namespace SafeSchoolApp.Services
{
    public interface INewsService
    {
        List<NewsArticle> GetAllNews(string? category = null);
        NewsArticle? GetNewsById(int id);
    }

    /// <summary>
    /// Service cung cấp tin tức, bài viết kỹ năng & kiến thức bảo vệ bản thân
    /// </summary>
    public class NewsService : INewsService
    {
        private static readonly List<NewsArticle> _articles = new List<NewsArticle>();

        public NewsService()
        {
            if (!_articles.Any())
            {
                SeedNews();
            }
        }

        private void SeedNews()
        {
            _articles.Add(new NewsArticle
            {
                Id = 1,
                Title = "5 Kỹ năng tự vệ an toàn khi đối mặt với hành vi bạo lực học đường",
                Summary = "Hướng dẫn chi tiết các bước thoát hiểm, giữ bình tĩnh, ứng xử thông minh và tìm kiếm trợ giúp ngay lập tức khi bị nhóm bạn đe dọa.",
                Category = "Kỹ năng phòng vệ",
                Author = "Chuyên gia An ninh Học đường",
                ReadTime = "5 phút đọc",
                PublishedDate = DateTime.Now.AddDays(-1),
                ImageUrl = "/images/skills-defense.jpg",
                Content = @"Bắt nạt học đường không chỉ ảnh hưởng đến thể xác mà còn gây tổn thương tâm lý lâu dài. Sau đây là 5 nguyên tắc vàng giúp em tự bảo vệ bản thân:

1. **Giữ khoảng cách an toàn và bình tĩnh:** Không tỏ ra hoảng sợ nhưng cũng không kích động đối phương. Thở sâu và tìm hướng di chuyển thoát ra ngoài.
2. **Hét to và di chuyển về nơi đông người:** Di chuyển ngay về phía văn phòng giáo viên, phòng bảo vệ, hoặc khu vực căn tin đông đúc.
3. **Không chịu đựng một mình:** Ngay sau sự việc, hãy ghi lại thời gian, địa điểm, tên những người liên quan và gửi Đơn báo cáo ẩn danh trên SafeSchool.
4. **Lưu lại bằng chứng (với Bắt nạt mạng):** Chụp màn hình tin nhắn, tài khoản nhắn tin đe dọa trước khi chặn.
5. **Gọi ngay hotline 111 khi khẩn cấp:** Tổng đài Quốc gia Bảo vệ Trẻ em luôn trực 24/7 sẵn sàng can thiệp.",
                Tags = new List<string> { "Kỹ năng", "Tự vệ", "Bắt nạt thể xác" }
            });

            _articles.Add(new NewsArticle
            {
                Id = 2,
                Title = "Nhận diện Cyberbullying (Bắt nạt trên mạng) và cách chặn đứng tức thì",
                Summary = "Cách xử lý khi bị lập group antifan, bôi nhọ ảnh cá nhân hoặc nhắn tin đe dọa trên Facebook, TikTok, Zalo.",
                Category = "Tư vấn tâm lý",
                Author = "ThS. Tâm lý Nguyễn Thanh Hà",
                ReadTime = "4 phút đọc",
                PublishedDate = DateTime.Now.AddDays(-3),
                ImageUrl = "/images/cyberbullying.jpg",
                Content = @"Bắt nạt trên không gian mạng (Cyberbullying) có thể diễn ra 24/7 khiến học sinh căng thẳng tột độ.

**Các bước hành động ngay lập tức:**
- **Không đáp trả:** Những kẻ bắt nạt mạng thường muốn thấy sự hoảng loạn của nạn nhân. Sự im lặng và chụp chứng cứ là vũ khí tốt nhất.
- **Sử dụng công cụ Chặn & Báo cáo (Report):** Chặn tài khoản quấy rối trên nền tảng MXH.
- **Thông báo với Ban tư vấn nhà trường:** Sử dụng chức năng báo cáo trên website SafeSchool để nhà trường hỗ trợ làm việc với cơ quan an ninh mạng nếu cần thiết.",
                Tags = new List<string> { "Bắt nạt mạng", "An toàn internet", "Tâm lý" }
            });

            _articles.Add(new NewsArticle
            {
                Id = 3,
                Title = "Luật Trẻ em 2016 và Quyền được bảo vệ của Học sinh trong Nhà trường",
                Summary = "Những quy định pháp lý quan trọng mọi học sinh và phụ huynh cần biết để bảo vệ quyền lợi hợp pháp khi bị xâm hại hoặc bạo lực.",
                Category = "Pháp lý học đường",
                Author = "Luật sư Học đường Việt Nam",
                ReadTime = "6 phút đọc",
                PublishedDate = DateTime.Now.AddDays(-5),
                ImageUrl = "/images/legal-rights.jpg",
                Content = @"Theo Điều 37 Luật Trẻ em 2016, trẻ em có quyền được bảo vệ dưới mọi hình thức để không bị bạo lực, bỏ mặc, bỏ rơi.

Mọi hành vi dung túng, bao che hoặc cố tình che giấu hành vi bạo lực học đường đều vi phạm quy định pháp luật. Tổng đài 111 là cơ quan được Nhà nước cấp quyền tiếp nhận và điều phối giải cứu khẩn cấp cho trẻ em toàn quốc.",
                Tags = new List<string> { "Pháp luật", "Luật Trẻ em", "Tổng đài 111" }
            });

            _articles.Add(new NewsArticle
            {
                Id = 4,
                Title = "Hành trình từ nạn nhân bị cô lập trở thành Thủ lĩnh Câu lạc bộ Sách",
                Summary = "Câu chuyện truyền cảm hứng có thật của Minh Anh - cựu học sinh THPT chuyên đã chiến thắng nỗi sợ bắt nạt học đường.",
                Category = "Câu chuyện cảm hứng",
                Author = "Ban Biên tập SafeSchool",
                ReadTime = "7 phút đọc",
                PublishedDate = DateTime.Now.AddDays(-7),
                ImageUrl = "/images/inspiring-story.jpg",
                Content = @"'Tôi từng nghĩ mình là người cô đơn nhất thế giới khi cả lớp không ai trò chuyện. Nhưng nhờ dũng cảm chia sẻ với thầy cô tư vấn và tham gia nhóm hỗ trợ, tôi đã lấy lại sự tự tin...'",
                Tags = new List<string> { "Câu chuyện", "Nghị lực", "Tự tin" }
            });
        }

        public List<NewsArticle> GetAllNews(string? category = null)
        {
            if (!string.IsNullOrWhiteSpace(category) && category != "Tất cả")
            {
                return _articles.Where(a => a.Category.Equals(category, StringComparison.OrdinalIgnoreCase)).ToList();
            }
            return _articles;
        }

        public NewsArticle? GetNewsById(int id)
        {
            return _articles.FirstOrDefault(a => a.Id == id);
        }
    }
}
