using Microsoft.AspNetCore.Mvc;
using SafeSchoolApp.Models;
using SafeSchoolApp.Services;

namespace SafeSchoolApp.Controllers
{
    public class ReportController : Controller
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        public IActionResult Index()
        {
            return View(new Report());
        }

        [HttpPost]
        public IActionResult Submit(Report report)
        {
            if (ModelState.IsValid)
            {
                var createdReport = _reportService.CreateReport(report);
                TempData["TrackingCode"] = createdReport.TrackingCode;
                TempData["IsAnonymous"] = createdReport.IsAnonymous;
                return RedirectToAction("Success", new { code = createdReport.TrackingCode });
            }
            return View("Index", report);
        }

        public IActionResult Success(string code)
        {
            var report = _reportService.GetReportByTrackingCode(code);
            if (report == null) return RedirectToAction("Index");
            return View(report);
        }

        [HttpGet]
        public IActionResult Track(string? code)
        {
            if (string.IsNullOrWhiteSpace(code)) return View(null);
            var report = _reportService.GetReportByTrackingCode(code);
            ViewBag.SearchCode = code;
            return View(report);
        }
    }
}
