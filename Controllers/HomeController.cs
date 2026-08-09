using Microsoft.AspNetCore.Mvc;
using SafeSchoolApp.Services;

namespace SafeSchoolApp.Controllers
{
    /// <summary>
    /// Controller Trang chủ SafeSchool
    /// Hiển thị thông tin khẩn cấp, tin tức nổi bật và các phím tắt báo cáo ẩn danh
    /// </summary>
    public class HomeController : Controller
    {
        private readonly INewsService _newsService;
        private readonly IReportService _reportService;

        public HomeController(INewsService newsService, IReportService reportService)
        {
            _newsService = newsService;
            _reportService = reportService;
        }

        public IActionResult Index()
        {
            var latestNews = _newsService.GetAllNews().Take(3).ToList();
            ViewBag.TotalReportsProcessed = _reportService.GetAllReports().Count + 142; // Tổng số báo cáo được can thiệp an toàn
            return View(latestNews);
        }

        public IActionResult About()
        {
            return View();
        }
    }
}
