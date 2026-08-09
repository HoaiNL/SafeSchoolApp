using Microsoft.AspNetCore.Mvc;
using SafeSchoolApp.Models;
using SafeSchoolApp.Services;

namespace SafeSchoolApp.Controllers
{
    public class ForumController : Controller
    {
        private readonly IForumService _forumService;

        public ForumController(IForumService forumService)
        {
            _forumService = forumService;
        }

        public IActionResult Index(string? category, string? search)
        {
            var posts = _forumService.GetPosts(category, search);
            ViewBag.CurrentCategory = category ?? "Tất cả";
            ViewBag.SearchQuery = search;
            return View(posts);
        }

        public IActionResult Detail(int id)
        {
            var post = _forumService.GetPostById(id);
            if (post == null) return NotFound();
            return View(post);
        }

        [HttpPost]
        public IActionResult CreatePost(ForumPost post)
        {
            if (ModelState.IsValid)
            {
                var created = _forumService.CreatePost(post);
                return RedirectToAction("Index");
            }
            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult AddComment(int postId, string content, bool isAnonymous, string? authorName)
        {
            if (!string.IsNullOrWhiteSpace(content))
            {
                var comment = new ForumComment
                {
                    Content = content,
                    IsAnonymous = isAnonymous,
                    AuthorName = isAnonymous ? "Bạn đọc ẩn danh" : (string.IsNullOrWhiteSpace(authorName) ? "Học sinh" : authorName)
                };
                _forumService.AddComment(postId, comment);
            }
            return RedirectToAction("Detail", new { id = postId });
        }

        [HttpPost]
        public IActionResult LikePost(int id)
        {
            bool success = _forumService.ToggleLike(id);
            return Json(new { success });
        }
    }
}
