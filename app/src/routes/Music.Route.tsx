import React, { useEffect } from "react";
import { useTrack } from "../providers/TrackContext";
import MusicApiService, { Track } from "../services/api/MusicApiService";

interface MusicRouteState {
    tracks: Track[];
    filteredTracks: Track[];
    currentAudio: HTMLAudioElement;
    currentTrack: Track | null;
    searchQuery: string;
}

export function MusicRoute() {

    const { setCurrentTrack, addTracksToPlaylist } = useTrack();
    const musicApiService = new MusicApiService();

    const [state, setState] = React.useState<MusicRouteState>({ tracks: [], currentAudio: new Audio(), currentTrack: null, searchQuery: "", filteredTracks: []});

    useEffect(() => {
        musicApiService.getTrackList().then(tracks => {
            setState({ tracks: tracks, currentAudio: state.currentAudio, currentTrack: state.currentTrack, searchQuery: state.searchQuery, filteredTracks: tracks});
        });
    }, []);

    return (
        <div className="h-full">
            
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
                
                <div className="flex-grow flex flex-col overflow-hidden">
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
                                                        addTracksToPlaylist([track]);
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
        </div>
    )
}