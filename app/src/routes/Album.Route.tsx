import { useParams } from "react-router-dom";
import { Album, AlbumApiService } from "../services/api/AlbumApiService";
import { useEffect, useState, useMemo } from "react";
import { useTrack } from "../providers/TrackContext";
import { useDownload } from "../providers/DownloadContext";
import MusicApiService from "../services/api/MusicApiService";

interface AlbumRouteState {
    album: Album;
    hasDownloaded: boolean;
}

export function AlbumRoute() {

    // Get the albumId from the URL
    const { albumId } = useParams();

    const albumApiService = new AlbumApiService();
    const musicApiService = new MusicApiService();

    const [state, setState] = useState<AlbumRouteState>({ album: { AlbumId: "", Name: "", Artist: "", Tracks: [], ImageUrl: "" }, hasDownloaded: false});

    const { downloadingQueue, progress, addTracksToDownloadQueue, hasFileDownloaded } = useDownload();

    const handleDownloadClick = async (tracks: string[]) => {
        // Get all tracks that are not downloaded
        const tracksToDownload = await Promise.all(tracks.map(async (trackId) => {
            const isDownloaded = await hasFileDownloaded(trackId);
            return !isDownloaded ? trackId : null;
        }));
        // Filter out null values
        const filteredTracksToDownload = tracksToDownload.filter(trackId => trackId !== null) as string[];
        // Add tracks to the download queue
        addTracksToDownloadQueue(filteredTracksToDownload);
    };

    useEffect(() => {
        albumApiService.getAlbum(albumId!).then((album) => {
            var hasDownloaded = albumApiService.hasAlbumDownloaded(album.Tracks.map(track => track.TrackId));
            setState({ album: album, hasDownloaded: hasDownloaded});
        });
    }, [albumId]);
    
    const { setCurrentTrack, addTracksToPlaylist } = useTrack();

    // Calculate overall progress
    const overallProgress = useMemo(() => {
        const totalTracks = state.album.Tracks.length;
        const downloadedTracks = state.album.Tracks.filter(track => progress[track.TrackId] === 100).length;
        return totalTracks > 0 ? (downloadedTracks / totalTracks) * 100 : 0;
    }, [state.album.Tracks, progress]);

    useEffect(() => {
        if(albumApiService.hasAlbumDownloaded(state.album.Tracks.map(track => track.TrackId))) {
            setState({ album: state.album, hasDownloaded: true});
        }
    }, [downloadingQueue]);

    return (
        <div className="h-full">
            <div className="bg-gray-200 w-full shadow-xl p-4 border-b-2 border-gray-300 flex flex-row">
                <div className="flex-grow">
                    <h1 className="text-xl">{state.album.Name || "Untitled"}</h1>
                    <p>{state.album.Artist || "No artist"}</p>
                </div>

                <div className="flex flex-row">
                    {
                        !state.hasDownloaded && (
                            <button className="bg-emerald-600 text-center mr-2 flex flex-row justify-center items-center content-center text-white w-10 h-10 text-2xl rounded-full" onClick={() => {
                                handleDownloadClick(state.album.Tracks.map(track => track.TrackId));
                            }}>
                                <i className="gg-software-download text-white"></i>
                            </button>
                        )
                    }

                    <button className="bg-emerald-600 text-center flex flex-row justify-center items-center content-center text-white w-10 h-10 text-2xl rounded-full" onClick={() => {
                        // Add all tracks to the playlist
                        addTracksToPlaylist(state.album.Tracks);
                    }}>
                        <i className="gg-play-button text-white"></i>
                    </button>
                </div>
            </div>

            <div className="p-4">
                {downloadingQueue.length > 0 && (
                    <div className="w-full bg-gray-300 rounded-full h-4 mb-4">
                        <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${overallProgress}%` }}></div>
                    </div>
                )}
                {state.album.Tracks.map((track, index) => (
                    <div key={track.TrackId} className="bg-white p-4 mb-2 shadow rounded-lg">
                        <h2>{(index + 1) + ". " + track.Title}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}
