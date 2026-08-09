using Microsoft.AspNetCore.Mvc;
using SafeSchoolApp.Services;

namespace SafeSchoolApp.Controllers
{
    public class NewsController : Controller
    {
        private readonly INewsService _newsService;

        public NewsController(INewsService newsService)
        {
            _newsService = newsService;
        }

        public IActionResult Index(string? category)
        {
            var articles = _newsService.GetAllNews(category);
            ViewBag.CurrentCategory = category ?? "Tất cả";
            return View(articles);
        }

        public IActionResult Detail(int id)
        {
            var article = _newsService.GetNewsById(id);
            if (article == null) return NotFound();
            
            ViewBag.RelatedNews = _newsService.GetAllNews().Where(a => a.Id != id).Take(3).ToList();
            return View(article);
        }
    }
}
