using Id3;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace DecentralisedMusic.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MusicController : ControllerBase
    {
        private readonly string _tracksPath = "C:\\Users\\AlexConnolly\\Downloads";

        [HttpGet("{trackId}/stream")]
        public IActionResult StreamTrack(string trackId)
        {
            var filePath = Path.Combine(_tracksPath, trackId + ".mp3");

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            return File(stream, "audio/mpeg", enableRangeProcessing: true);
        }

        [HttpGet()]
        public IActionResult ListAllTracks()
        {
            return Ok(Application.Music.TrackService.Instance.GetTracks());
        }
    }
}
