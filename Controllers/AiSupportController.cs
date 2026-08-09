using Microsoft.AspNetCore.Mvc;
using SafeSchoolApp.Services;

namespace SafeSchoolApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiSupportController : ControllerBase
    {
        private readonly IAiSupportService _aiSupportService;

        public AiSupportController(IAiSupportService aiSupportService)
        {
            _aiSupportService = aiSupportService;
        }

        [HttpPost("chat")]
        public IActionResult Chat([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { message = "Nội dung tin nhắn không được để trống." });
            }

            var aiResponse = _aiSupportService.GenerateAiResponse(request.Message);
            return Ok(aiResponse);
        }

        public class ChatRequest
        {
            public string Message { get; set; } = string.Empty;
        }
    }
}
