using SafeSchoolApp.Models;

namespace SafeSchoolApp.Services
{
    public interface IForumService
    {
        List<ForumPost> GetPosts(string? category = null, string? search = null);
        ForumPost? GetPostById(int id);
        ForumPost CreatePost(ForumPost post);
        ForumComment AddComment(int postId, ForumComment comment);
        bool ToggleLike(int postId);
    }

    /// <summary>
    /// Service quản lý Diễn đàn tâm sự & hỗ trợ học đường
    /// Hỗ trợ chia sẻ ẩn danh, bình luận an toàn & tương thích 100%
    /// </summary>
    public class ForumService : IForumService
    {
        private static readonly List<ForumPost> _posts = new List<ForumPost>();
        private static int _nextPostId = 1;
        private static int _nextCommentId = 1;

        public ForumService()
        {
            if (!_posts.Any())
            {
                SeedData();
            }
        }

        private void SeedData()
        {
            var p1 = new ForumPost
            {
                Id = _nextPostId++,
                Title = "Làm sao để vượt qua cảm giác sợ hãi khi bị cô lập ở lớp?",
                Category = "Tâm sự học đường",
                Content = "Mình bị một nhóm bạn trong lớp thêu dệt chuyện sai sự thật rồi rủ cả lớp không ai nói chuyện với mình. Mỗi ngày đến trường với mình là một cơn ác mộng. Có bạn nào từng trải qua cảm giác này và vượt qua được không?",
                AuthorName = "Học sinh ẩn danh (Lớp 11)",
                IsAnonymous = true,
                LikesCount = 24,
                CreatedAt = DateTime.Now.AddHours(-5),
                Comments = new List<ForumComment>
                {
                    new ForumComment
                    {
                        Id = _nextCommentId++,
                        PostId = 1,
                        AuthorName = "Nguyễn Minh Tuấn",
                        IsAnonymous = false,
                        Content = "Chào bạn! Mình từng ở trong hoàn cảnh tương tự năm lớp 9. Bạn đừng giấu một mình nhé, hãy tâm sự với thầy cô chủ nhiệm hoặc gọi cho Tổng đài 111. Bạn không có lỗi gì cả!",
                        CreatedAt = DateTime.Now.AddHours(-3)
                    },
                    new ForumComment
                    {
                        Id = _nextCommentId++,
                        PostId = 1,
                        AuthorName = "Chuyên viên Tâm lý Minh Anh",
                        IsAnonymous = false,
                        Content = "Chào em. Cô lập xã hội là một dạng bắt nạt tâm lý nghiêm trọng. Em hãy thử tìm kiếm sự kết nối từ các bạn câu lạc bộ khác hoặc tham khảo dịch vụ tư vấn AI / Đơn báo cáo ẩn danh của SafeSchool nhé.",
                        CreatedAt = DateTime.Now.AddHours(-2)
                    }
                }
            };

            var p2 = new ForumPost
            {
                Id = _nextPostId++,
                Title = "Quy định pháp luật xử lý hành vi đe dọa, đánh đập bạn học thế nào?",
                Category = "Hỏi đáp pháp lý",
                Content = "Em muốn hỏi theo Luật Trẻ em 2016 và Bộ luật Hình sự, những học sinh cấp 3 có hành vi bạo lực học đường tống tiền hoặc gây thương tích sẽ bị xử lý như thế nào?",
                AuthorName = "Trần Đức Anh",
                IsAnonymous = false,
                LikesCount = 42,
                CreatedAt = DateTime.Now.AddDays(-1),
                Comments = new List<ForumComment>
                {
                    new ForumComment
                    {
                        Id = _nextCommentId++,
                        PostId = 2,
                        AuthorName = "Luật sư Học đường",
                        IsAnonymous = false,
                        Content = "Căn cứ Nghị định 80/2017/NĐ-CP và Luật Trẻ em 2016, người có hành vi bạo lực học đường tùy mức độ có thể bị xử lý kỷ luật buột đình chỉ học, xử phạt hành chính hoặc truy cứu trách nhiệm hình sự nếu từ đủ 14 tuổi trở lên.",
                        CreatedAt = DateTime.Now.AddHours(-18)
                    }
                }
            };

            var p3 = new ForumPost
            {
                Id = _nextPostId++,
                Title = "Bí quyết giúp con mở lòng khi bị bắt nạt (Dành cho Phụ huynh)",
                Category = "Góc tư vấn phụ huynh",
                Content = "Là cha mẹ, thấy con đi học về lầm lì, bỏ ăn và thương tích nhẹ trên tay nhưng hỏi con không nói. Sau đây là bài chia sẻ kinh nghiệm gia đình tôi đã kiên nhẫn đồng hành cùng con vượt qua.",
                AuthorName = "Phụ huynh giấu tên",
                IsAnonymous = true,
                LikesCount = 56,
                CreatedAt = DateTime.Now.AddDays(-2),
                Comments = new List<ForumComment>()
            };

            _posts.Add(p1);
            _posts.Add(p2);
            _posts.Add(p3);
        }

        public List<ForumPost> GetPosts(string? category = null, string? search = null)
        {
            var query = _posts.AsQueryable();

            if (!string.IsNullOrWhiteSpace(category) && category != "Tất cả")
            {
                query = query.Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.Title.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                                         p.Content.Contains(search, StringComparison.OrdinalIgnoreCase));
            }

            return query.OrderByDescending(p => p.CreatedAt).ToList();
        }

        public ForumPost? GetPostById(int id)
        {
            return _posts.FirstOrDefault(p => p.Id == id);
        }

        public ForumPost CreatePost(ForumPost post)
        {
            post.Id = _nextPostId++;
            post.CreatedAt = DateTime.Now;
            post.LikesCount = 0;
            post.Comments = new List<ForumComment>();

            if (post.IsAnonymous)
            {
                post.AuthorName = "Học sinh ẩn danh";
            }

            _posts.Add(post);
            return post;
        }

        public ForumComment AddComment(int postId, ForumComment comment)
        {
            var post = GetPostById(postId);
            if (post == null) throw new Exception("Không tìm thấy bài viết");

            comment.Id = _nextCommentId++;
            comment.PostId = postId;
            comment.CreatedAt = DateTime.Now;

            if (comment.IsAnonymous)
            {
                comment.AuthorName = "Bạn đọc ẩn danh";
            }

            post.Comments.Add(comment);
            return comment;
        }

        public bool ToggleLike(int postId)
        {
            var post = GetPostById(postId);
            if (post != null)
            {
                post.LikesCount++;
                return true;
            }
            return false;
        }
    }
}
