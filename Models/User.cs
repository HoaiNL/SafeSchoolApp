namespace SafeSchoolApp.Models
{
    /// <summary>
    /// Model quản lý thông tin người dùng hệ thống SafeSchool
    /// Hỗ trợ 3 phương thức đăng nhập: Số điện thoại, Username/Password, Gmail (Google Auth)
    /// </summary>
    public class User
    {
        public int Id { get; set; }
        
        public string Username { get; set; } = string.Empty;
        
        public string? PhoneNumber { get; set; }
        
        public string? Email { get; set; }
        
        public string FullName { get; set; } = string.Empty;
        
        public string? PasswordHash { get; set; }
        
        public bool IsGmailAccount { get; set; } = false;
        
        public string Role { get; set; } = "Student"; // Student, Parent, Counselor, Admin
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
