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
    }

    public class TrackService
    {
        private readonly string _tracksPath;
        private readonly List<Track> _tracks;
        private readonly FileSystemWatcher _fileWatcher;
        private bool _isCacheValid; 
        
        private static readonly Lazy<TrackService> _instance = new Lazy<TrackService>(() => new TrackService("C:/Downloads"));
        
        public static TrackService Instance => _instance.Value;

        private TrackService(string tracksPath)
        {
            _tracksPath = tracksPath;
            _tracks = new List<Track>();
            _isCacheValid = false;
            _fileWatcher = new FileSystemWatcher(_tracksPath, "*.mp3");
            _fileWatcher.Created += OnFileCreated;
            _fileWatcher.EnableRaisingEvents = true;
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

        private void LoadTracks()
        {
            _tracks.Clear();

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

                if (tag != null)
                {
                    string searchTerm = tag.Title == null ? "" : tag.Title;

                    _tracks.Add(new Track
                    {
                        TrackId = Path.GetFileNameWithoutExtension(filePath),
                        Title = tag.Title,
                        Album = tag.Album,
                        Artist = tag.Artists,
                        Duration = mp3.Audio.Duration.ToString(@"mm\:ss"),
                        ImageUrl = await ImageSearchService.GetFirstImageUrlAsync(searchTerm)
                    });
                } else
                {
                    _tracks.Add(new Track()
                    {
                        TrackId = Path.GetFileNameWithoutExtension(filePath),
                        Title = Path.GetFileNameWithoutExtension(filePath),
                        Album = "",
                        Artist = "",
                        Duration = mp3.Audio.Duration.ToString(@"mm\:ss"),
                        ImageUrl = await ImageSearchService.GetFirstImageUrlAsync(Path.GetFileNameWithoutExtension(filePath))
                    });
                }
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
