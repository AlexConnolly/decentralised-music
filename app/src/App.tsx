import React, { useCallback, useEffect, useRef } from "react";
import MusicApiService, { Track } from "./services/api/MusicApiService";
import { useTrack } from "./providers/TrackContext";

interface AppState {
    tracks: Track[];
}

export function App() {
    const { currentTrack, setCurrentTrack, subscribeToTrackChanges } = useTrack();
    const musicApiService = new MusicApiService();

    const [state, setState] = React.useState<AppState>({ tracks: [] });

    const currentAudio = useRef(new Audio());

    useEffect(() => {
        musicApiService.getTrackList().then(tracks => {
            setState({ tracks: tracks });
        });
    }, []);

    const handleTrackChange = useCallback(
        (track: Track | null) => {
            if (track == null) {
                return;
            }

            musicApiService.getTrackStream(track.TrackId).then(streamUrl => {
                if (currentAudio.current.src !== streamUrl) {
                    currentAudio.current.src = streamUrl;
                    currentAudio.current.play();
                }
            });
        },
        [musicApiService]
    );

    useEffect(() => {
        const unsubscribe = subscribeToTrackChanges(handleTrackChange);
        return () => unsubscribe();
    }, [handleTrackChange, subscribeToTrackChanges]);

    return (
        <div className="w-full h-full bg-gray-100 flex flex-col">
            <div className="flex flex-row flex-1">
                <div className="w-16 h-full bg-slate-950"></div>
                <div className="flex-1 h-full bg-gray-100 flex flex-col">
                    <div className="bg-gray-200 w-full shadow-xl p-4">
                        <input
                            type="text"
                            className="px-4 h-10 border border-gray-300 rounded-md w-full"
                            placeholder="Search for music"
                        />
                    </div>
                    <div className="p-4">
                        <div className="bg-white rounded w-full shadow p-4">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th className="text-left">Title</th>
                                        <th className="text-left">Artist</th>
                                        <th className="text-left">Album</th>
                                        <th className="text-left">Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {state.tracks.map(track => (
                                        <tr key={track.TrackId}>
                                            <td
                                                className="text-purple-600 font-bold text-center py-4 flex flex-row justify-center content-center items-center"
                                                onClick={() => setCurrentTrack(track)}
                                            >
                                                <i className="gg-play-button-o bg-purple-300"></i>
                                            </td>
                                            <td className="p-3">{track.Title}</td>
                                            <td>{track.Artist}</td>
                                            <td>{track.Album}</td>
                                            <td>{track.Duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-16 bg-slate-950">
                {currentTrack && (
                    <div className="text-white p-4">
                        <div className="flex flex-row items-center">
                            <img src="" className="w-16 h-16" alt="Track Thumbnail" />
                            <div className="ml-4">
                                <div>{currentTrack.Title}</div>
                                <div>{currentTrack.Artist}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
