using Microsoft.AspNetCore.Mvc;

namespace PolyglotApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatusController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "healthy",
            version = "1.0.0",
            message = "Polyglot API is running",
            timestamp = DateTime.UtcNow
        });
    }
}
