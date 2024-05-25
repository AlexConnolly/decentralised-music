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
        [HttpGet("{trackId}/stream")]
        public IActionResult StreamTrack(string trackId)
        {
            string filePath = Application.Music.TrackService.Instance.GetTrackPath(trackId);

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
