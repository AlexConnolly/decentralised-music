import { useParams } from "react-router-dom";
import { Album, AlbumApiService } from "../services/api/AlbumApiService";
import { useEffect, useState } from "react";
import { useTrack } from "../providers/TrackContext";

interface AlbumRouteState {
    album: Album;
}

export function AlbumRoute() {

    // Get the albumId from the URL
    const { albumId } = useParams();

    const albumApiService = new AlbumApiService();

    const [state, setState] = useState<AlbumRouteState>({ album: { Name: "", Artist: "", Tracks: [] } });

    useEffect(() => {
        albumApiService.getAlbum(albumId!).then((album) => {
            setState({ album: album });
        });
    }, [albumId]);
    
    const { setCurrentTrack, addTracksToPlaylist } = useTrack();

    return (
        <div className="h-full">
            <div className="bg-gray-200 w-full shadow-xl p-4 border-b-2 border-gray-300 flex flex-row">
                <div className="flex-grow">
                    <h1 className="text-xl">{state.album.Name || "Untitled"}</h1>
                    <p>{state.album.Artist || "No artist"}</p>
                </div>

                <div className="">
                    <button className="bg-emerald-600 text-center flex flex-row justify-center items-center content-center text-white w-10 h-10 text-2xl rounded-full" onClick={() => {
                        // Add all tracks to the playlist
                        addTracksToPlaylist(state.album.Tracks);
                    }}>
                        <i className="gg-play-button text-white"></i>
                    </button>
                </div>
            </div>

            <div className="">
                {state.album.Tracks.map((track, index) => (
                    <div className="bg-white p-4">
                        <h2 className="">{(index + 1) + ". " + track.Title}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}