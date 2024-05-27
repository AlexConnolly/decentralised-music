import { useEffect, useState } from "react";
import { Album, AlbumApiService } from "../services/api/AlbumApiService";
import { useNavigate } from "react-router-dom";

interface AlbumsRouteState {
    albums: Album[];
}

export function AlbumsRoute() {

    const albumApiService = new AlbumApiService();

    const navigate = useNavigate();

    const [state, setState] = useState<AlbumsRouteState>({ albums: [] });

    useEffect(() => {
        albumApiService.getAlbumList().then((albums) => {
            setState({ albums: albums });
        });
    }, []);

    return (
        <div className="h-full">
            <div className="bg-gray-200 w-full shadow-xl p-4 border-b-2 border-gray-300">
                <h1 className="text-xl">Albums</h1>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
                {state.albums.map((album, index) => (
                    <div className="bg-white rounded-lg flex flex-col items-center content-center justify-center shadow p-4" onClick={() => {
                        navigate(`/albums/${album.AlbumId}`);
                    }} style={{
                        backgroundImage: `url(${album.ImageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}>
                        <h2 className="text-xl font-semibold">{album.Name || "Untitled"}</h2>
                        <p>{album.Artist || "No artist"}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}