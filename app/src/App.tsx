import React, { useCallback, useEffect, useRef } from "react";
import MusicApiService, { Track } from "./services/api/MusicApiService";
import { useTrack } from "./providers/TrackContext";
import { PlayerComponent } from "./components/player/player.component";

interface AppState {
    tracks: Track[];
    filteredTracks: Track[];
    currentAudio: HTMLAudioElement;
    currentTrack: Track | null;
    searchQuery: string;
}

export function App() {
    const { setCurrentTrack, addTrackToPlaylist } = useTrack();
    const musicApiService = new MusicApiService();

    const [state, setState] = React.useState<AppState>({ tracks: [], currentAudio: new Audio(), currentTrack: null, searchQuery: "", filteredTracks: []});

    useEffect(() => {
        musicApiService.getTrackList().then(tracks => {
            setState({ tracks: tracks, currentAudio: state.currentAudio, currentTrack: state.currentTrack, searchQuery: state.searchQuery, filteredTracks: tracks});
        });
    }, []);

    return (
        <div className="w-full h-full bg-gray-100 flex flex-col">
            <div className="w-full h-16 bg-slate-950 flex flex-row">
                <div className="flex-grow px-4 text-white font-bold h-16 bg-slate-900 flex justify-center content-center items-center">
                    <i className="gg-music text-white ml-2 mr-2"></i> decentrify
                </div>
                <div className="w-16 h-16 bg-slate-950 flex justify-center content-center items-center">
                    <i className="gg-layout-list text-white"></i>
                </div>
            </div>
            <div className="flex-grow bg-gray-100 flex flex-col border-t-4 border-teal-600">
                <div className="bg-gray-200 w-full shadow-xl p-4 border-b-2 border-gray-300">
                    <input
                        type="text"
                        className="px-4 h-10 border border-gray-300 rounded-md w-full"
                        placeholder="Search for music"
                        value={state.searchQuery}
                        onChange={(e) => {
                            // Filter tracks
                            var filteredTracks = state.tracks.filter(track => {
                                return track.Title.toLowerCase().includes(e.target.value.toLowerCase());
                            });

                            setState({ tracks: state.tracks, currentAudio: state.currentAudio, currentTrack: state.currentTrack, searchQuery: e.target.value, filteredTracks: filteredTracks});
                        }}
                    />
                </div>
                <div className="flex-grow flex flex-col overflow-hidden" style={{height: "10px"}}>
                    <div className="bg-white rounded w-full shadow overflow-auto">
                        <table className="w-full text-slate-600">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th className="text-left"></th>
                                    <th className="text-left"></th>
                                    <th className="text-left"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {state.filteredTracks.map((track, index) => (
                                    <tr
                                        key={track.TrackId}
                                        className={`p-3 text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                                        onDoubleClick={() => {
                                            setCurrentTrack(track);
                                        }}
                                    >
                                        <td
                                            className="p-3 w-full"
                                            onDoubleClick={() => {

                                            }}
                                        >
                                            {track.Title}
                                        </td>
                                        <td>{track.Artist}</td>
                                        <td className="p-4 text-slate-400">{track.Duration}</td>
                                        <td
                                            className="mr-3 cursor-pointer text-emerald-800 font-bold text-center py-4 flex flex-row justify-center content-center items-center"
                                        >
                                            <div className="flex flex-row">
                                                <button
                                                    className="bg-gray-400 shadow text-white w-8 h-8 mr-3 text-center rounded-md shadow-xl flex flex-row justify-center content-center items-center"
                                                    onClick={() => {
                                                        addTrackToPlaylist(track);
                                                    }}
                                                >
                                                    <i className="gg-add"></i>
                                                </button>
                                                <button className="bg-emerald-500 shadow text-white w-8 h-8 text-center rounded-md shadow-xl flex flex-row justify-center content-center items-center" onClick={() => {
                                                    setCurrentTrack(track);
                                                }}>
                                                    <i className="gg-play-button"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <PlayerComponent></PlayerComponent>
            </div>
            <div className="absolute top-0 left-0 inset-0 bg-black bg-opacity-50 hidden">
                <div className="bg-slate-900 relative top-0 left-10 h-full">test</div>
            </div>
        </div>
    );
}
