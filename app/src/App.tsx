import React, { useCallback, useEffect, useRef } from "react";
import MusicApiService, { Track } from "./services/api/MusicApiService";
import { useTrack } from "./providers/TrackContext";
import { PlayerComponent } from "./components/player/player.component";

interface AppState {
    tracks: Track[];
    currentAudio: HTMLAudioElement;
    currentTrack: Track | null;
}

export function App() {
    const { setCurrentTrack } = useTrack();
    const musicApiService = new MusicApiService();

    const [state, setState] = React.useState<AppState>({ tracks: [], currentAudio: new Audio(), currentTrack: null});

    useEffect(() => {
        musicApiService.getTrackList().then(tracks => {
            setState({ tracks: tracks, currentAudio: state.currentAudio, currentTrack: state.currentTrack});
        });
    }, []);

    return (
        <div className="w-full h-full bg-gray-100 flex flex-col">
            <div className="flex flex-row flex-1">
                <div className="w-16 h-full bg-slate-950">
                    <div className="w-16 h-16 bg-slate-900 flex justify-center content-center items-center">
                        <i className="gg-music text-white"></i>
                    </div>
                    <div className="w-16 h-16 bg-slate-950 flex justify-center content-center items-center">
                        <i className="gg-layout-list text-white"></i>
                    </div>
                </div>
                <div className="flex-1 h-full bg-gray-100 flex flex-col">
                    <div className="bg-gray-200 w-full shadow-xl p-4">
                        <input
                            type="text"
                            className="px-4 h-10 border border-gray-300 rounded-md w-full"
                            placeholder="Search for music"
                        />
                    </div>
                    <div className="p-4 flex-1">
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
                    
                    <PlayerComponent></PlayerComponent>
                </div>
            </div>

        </div>
    );
}
