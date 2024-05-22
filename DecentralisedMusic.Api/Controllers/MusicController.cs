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
        private readonly string _tracksPath = Path.Combine(Directory.GetCurrentDirectory(), "Files");

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
            var tracks = new List<object>();

            foreach (var filePath in Directory.GetFiles(_tracksPath, "*.mp3"))
            {
                using (var mp3Stream = new FileStream(filePath, FileMode.Open))
                {
                    var mp3 = new Mp3(mp3Stream);
                    var tag = mp3.GetTag(Id3TagFamily.Version2X);

                    if (tag != null)
                    {
                        tracks.Add(new
                        {
                            TrackId = Path.GetFileNameWithoutExtension(filePath),
                            Title = tag.Title,
                            Album = tag.Album,
                            Artist = tag.Artists,
                            Duration = mp3.Audio.Duration.ToString(@"mm\:ss")
                        });
                    }
                }
            }

            return Ok(tracks);
        }
    }
}
