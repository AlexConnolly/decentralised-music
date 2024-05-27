using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DecentralisedMusic.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumsController : ControllerBase
    {
        [HttpGet()]
        public IActionResult ListAllAlbums()
        {
            return Ok(Application.Music.TrackService.Instance.GetAlbums());
        }

        [HttpGet("{albumId}")]
        public IActionResult GetAlbum(string albumId)
        {
            return Ok(Application.Music.TrackService.Instance.GetAlbum(albumId));
        }

    }
}
