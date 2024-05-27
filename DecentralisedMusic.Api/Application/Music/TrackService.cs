using Id3;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace DecentralisedMusic.Api.Application.Music
{
    public class Track
    {
        public string TrackId { get; set; }
        public string Title { get; set; }
        public string Album { get; set; }
        public string Artist { get; set; }
        public string Duration { get; set; }
        public string ImageUrl { get; set; }
        public string Path { get; set; }
    }

    public class Album
    {
        public string AlbumId { get; set; }
        public string Name { get; set; }
        public string Artist { get; set; }
        public List<Track> Tracks { get; set; }

        public string ImageUrl { get; set; }
    }

    public class TrackService
    {
        private readonly string _tracksPath;
        private readonly List<Track> _tracks;
        private readonly Dictionary<string, Album> _albums;
        private readonly FileSystemWatcher _fileWatcher;
        private bool _isCacheValid;

        private static readonly Lazy<TrackService> _instance = new Lazy<TrackService>(() => new TrackService("C:/Downloads"));

        public static TrackService Instance => _instance.Value;

        private TrackService(string tracksPath)
        {
            _tracksPath = tracksPath;
            _tracks = new List<Track>();
            _albums = new Dictionary<string, Album>();
            _isCacheValid = false;
            _fileWatcher = new FileSystemWatcher(_tracksPath, "*.mp3");
            _fileWatcher.Created += OnFileCreated;
            _fileWatcher.EnableRaisingEvents = true;
        }

        public string GetTrackPath(string trackId)
        {
            return _tracks.FirstOrDefault(t => t.TrackId == trackId)?.Path ?? string.Empty;
        }

        public List<Track> GetTracks()
        {
            if (!_isCacheValid)
            {
                LoadTracks();
                _isCacheValid = true;
            }
            return _tracks;
        }

        public List<Album> GetAlbums()
        {
            return _albums.Values.ToList();
        }

        public Album GetAlbum(string albumId)
        {
            return _albums.Values.FirstOrDefault(x => x.AlbumId == albumId);
        }

        private void LoadTracks()
        {
            _tracks.Clear();
            _albums.Clear();

            foreach (var filePath in Directory.GetFiles(_tracksPath, "*.mp3", SearchOption.AllDirectories))
            {
                AddTrack(filePath);
            }
        }

        private async void AddTrack(string filePath)
        {
            using (var mp3Stream = new FileStream(filePath, FileMode.Open))
            {
                var mp3 = new Mp3(mp3Stream);
                var tag = mp3.GetTag(Id3TagFamily.Version2X);

                string albumName = tag?.Album ?? string.Empty;
                string artistName = tag?.Artists ?? string.Empty;
                string albumKey = string.Join("_", new string[] { albumName, artistName });

                if (albumKey == "_")
                    albumKey = "";

                string imageUrl = "";

                if (tag?.Pictures != null && tag.Pictures.Any())
                {
                    // Assuming the first picture is the album cover
                    var picture = tag.Pictures.First();
                    imageUrl = $"data:{picture.MimeType};base64,{Convert.ToBase64String(picture.PictureData)}";
                }
                else
                {
                    imageUrl = await ImageSearchService.GetFirstImageUrlAsync(tag?.Title ?? Path.GetFileNameWithoutExtension(filePath));
                }

                if (!_albums.ContainsKey(albumKey))
                {
                    _albums[albumKey] = new Album
                    {
                        AlbumId = Guid.NewGuid().ToString(),
                        Name = albumName,
                        Artist = artistName,
                        Tracks = new List<Track>(),
                        ImageUrl = imageUrl
                    };
                }

                var newTrack = new Track
                {
                    TrackId = Guid.NewGuid().ToString(),
                    Title = tag?.Title ?? Path.GetFileNameWithoutExtension(filePath),
                    Album = albumName,
                    Artist = artistName,
                    Duration = mp3.Audio.Duration.ToString(@"mm\:ss"),
                    ImageUrl = imageUrl,
                    Path = filePath
                };

                _tracks.Add(newTrack);

                _albums[albumKey].Tracks.Add(newTrack);
            }
        }

        private void OnFileCreated(object sender, FileSystemEventArgs e)
        {
            if (Path.GetExtension(e.FullPath).Equals(".mp3", StringComparison.OrdinalIgnoreCase))
            {
                AddTrack(e.FullPath);
                _isCacheValid = true;
            }
        }
    }
}
