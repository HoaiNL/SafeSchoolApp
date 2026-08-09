using Microsoft.AspNetCore.Mvc;

namespace SafeSchoolApp.Controllers
{
    /// <summary>
    /// Controller xử lý Đăng nhập / Đăng ký người dùng
    /// Hỗ trợ 3 phương thức: Số điện thoại, Username/Password, Gmail Google OAuth
    /// </summary>
    public class AuthController : Controller
    {
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult LoginByPhone(string phoneNumber, string password)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber) || string.IsNullOrWhiteSpace(password))
            {
                return Json(new { success = false, message = "Vui lòng nhập đầy đủ Số điện thoại và Mật khẩu!" });
            }

            // Giả lập đăng nhập SĐT thành công
            HttpContext.Session.SetString("UserPhone", phoneNumber);
            HttpContext.Session.SetString("UserName", "Học sinh " + phoneNumber.Substring(Math.Max(0, phoneNumber.Length - 4)));
            
            return Json(new { 
                success = true, 
                message = "Đăng nhập bằng Số điện thoại thành công!", 
                userName = HttpContext.Session.GetString("UserName") 
            });
        }

        [HttpPost]
        public IActionResult LoginByUsername(string username, string password)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                return Json(new { success = false, message = "Vui lòng nhập đầy đủ Tên tài khoản và Mật khẩu!" });
            }

            HttpContext.Session.SetString("UserName", username);
            return Json(new { 
                success = true, 
                message = "Đăng nhập thành công!", 
                userName = username 
            });
        }

        [HttpPost]
        public IActionResult LoginWithGmail(string gmailToken)
        {
            // Giả lập Google OAuth Sign In thành công
            string googleName = "Nguyễn Văn An (Google Acc)";
            HttpContext.Session.SetString("UserName", googleName);
            HttpContext.Session.SetString("UserEmail", "an.nguyen@gmail.com");

            return Json(new { 
                success = true, 
                message = "Đăng nhập bằng tài khoản Google (Gmail) thành công!", 
                userName = googleName 
            });
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Index", "Home");
        }
    }
}
