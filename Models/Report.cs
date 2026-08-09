using System.ComponentModel.DataAnnotations;

namespace SafeSchoolApp.Models
{
    /// <summary>
    /// Model quản lý thông tin Đơn Báo Cáo Bắt Nạt Học Đường
    /// Có tùy chọn Ẩn danh (IsAnonymous) bảo mật cao
    /// </summary>
    public class Report
    {
        public int Id { get; set; }

        [Required]
        public string TrackingCode { get; set; } = string.Empty; // Mã bí mật dùng để tra cứu trạng thái báo cáo

        public bool IsAnonymous { get; set; } = true; // Mặc định ẩn danh để bảo vệ người báo cáo

        // Thông tin người báo cáo (nếu không chọn ẩn danh)
        public string? ReporterName { get; set; }
        public string? ReporterPhone { get; set; }
        public string? ReporterRole { get; set; } // Học sinh, Phụ huynh, Nhân chứng

        // Thông tin sự việc bắt nạt
        [Required(ErrorMessage = "Vui lòng nhập tên trường học")]
        public string SchoolName { get; set; } = string.Empty;

        public string? LocationDetail { get; set; } // Lớp học, cổng trường, căn tin, trên mạng (cyberbullying)...

        [Required(ErrorMessage = "Vui lòng chọn loại hình bắt nạt")]
        public string BullyingType { get; set; } = string.Empty; // Bạo lực thể xác, Lăng mạ/Tâm lý, Cô lập, Bắt nạt mạng, Tống tiền

        [Required(ErrorMessage = "Vui lòng mô tả chi tiết sự việc")]
        public string Description { get; set; } = string.Empty;

        public string SeverityLevel { get; set; } = "Khẩn cấp vừa"; // Nhẹ, Khẩn cấp vừa, Rất nguy hiểm/Khẩn cấp

        public string? EvidenceFile { get; set; } // Ảnh/Video/Tài liệu chứng cứ đính kèm

        public string Status { get; set; } = "Đang xử lý"; // Đã tiếp nhận, Đang minh xác, Đã xử lý, Đã chuyển Cảnh sát/Nhà trường

        public DateTime IncidentDate { get; set; } = DateTime.Now;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string AdminNotes { get; set; } = "Ban tư vấn SafeSchool đang phối hợp xác minh thông tin.";
    }
}
