using SafeSchoolApp.Models;

namespace SafeSchoolApp.Services
{
    public interface IReportService
    {
        Report CreateReport(Report report);
        Report? GetReportByTrackingCode(string code);
        List<Report> GetAllReports();
    }

    /// <summary>
    /// Service xử lý nghiệp vụ quản lý báo cáo bắt nạt học đường
    /// Sinh mã bí mật Tracking Code (VD: SS-89A12B) bảo mật cho học sinh
    /// </summary>
    public class ReportService : IReportService
    {
        private static readonly List<Report> _reports = new List<Report>();
        private static int _nextId = 1;

        public ReportService()
        {
            // Seed một số dữ liệu mẫu ban đầu để giao diện hiển thị phong phú
            if (!_reports.Any())
            {
                CreateReport(new Report
                {
                    IsAnonymous = true,
                    SchoolName = "THPT Nguyễn Trãi",
                    LocationDetail = "Căn tin & Sân thể thao",
                    BullyingType = "Bắt nạt mạng & Lăng mạ",
                    Description = "Có nhóm học sinh lập group mạng xã hội ghép ảnh chế giễu và đe dọa đánh sau giờ học.",
                    SeverityLevel = "Khẩn cấp vừa",
                    Status = "Đã tiếp nhận & Đang xác minh",
                    AdminNotes = "Ban Giám hiệu và Chuyên gia tâm lý đã gửi thư làm việc với GVCN lớp."
                });

                CreateReport(new Report
                {
                    IsAnonymous = false,
                    ReporterName = "Lê Hoàng Nam",
                    ReporterPhone = "0987654321",
                    SchoolName = "THCS Lê Lợi",
                    LocationDetail = "Cổng trường sau giờ tan học",
                    BullyingType = "Tống tiền & Bạo lực thể xác",
                    Description = "Một số bạn lớp 9 chặn đường chặn xe xin tiền tiêu xài, nếu không đưa sẽ bị đánh.",
                    SeverityLevel = "Rất nguy hiểm/Khẩn cấp",
                    Status = "Đã chuyển Cảnh sát & Nhà trường",
                    AdminNotes = "Đã làm việc với Tổng đài 111 và Cảnh sát khu vực hỗ trợ trực tiếp."
                });
            }
        }

        public Report CreateReport(Report report)
        {
            report.Id = _nextId++;
            report.CreatedAt = DateTime.Now;
            
            // Tự động sinh mã tra cứu bảo mật dạng SS-XXXXXX nếu chưa có
            if (string.IsNullOrWhiteSpace(report.TrackingCode))
            {
                report.TrackingCode = "SS-" + Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper();
            }

            if (report.IsAnonymous)
            {
                report.ReporterName = "Học sinh ẩn danh";
                report.ReporterPhone = null;
            }

            _reports.Add(report);
            return report;
        }

        public Report? GetReportByTrackingCode(string code)
        {
            return _reports.FirstOrDefault(r => r.TrackingCode.Equals(code.Trim(), StringComparison.OrdinalIgnoreCase));
        }

        public List<Report> GetAllReports()
        {
            return _reports.OrderByDescending(r => r.CreatedAt).ToList();
        }
    }
}
