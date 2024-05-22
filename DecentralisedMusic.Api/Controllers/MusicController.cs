using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DecentralisedMusic.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MusicController : ControllerBase
    {
        [HttpGet("{trackId}")]
        public IActionResult StreamTrack(string trackId)
        {
            var filePath = Path.Combine("Files", trackId + ".mp3");

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            return File(stream, "audio/mpeg", enableRangeProcessing: true);
        }
    }
}
