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

            <div className={"grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4"}>
                {state.albums.map((album, index) => (
                    <div className="bg-white rounded-lg shadow" onClick={() => {
                        navigate(`/albums/${album.AlbumId}`);
                    }}>
                        <img src={album.ImageUrl} className="w-full rounded-lg bg-gray-100 aspect-video border-0" />

                        <div className="p-4">
                            <h2 className="text-xl font-semibold">{album.Name || "Untitled"}</h2>
                            <p>{album.Artist || "No artist"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}