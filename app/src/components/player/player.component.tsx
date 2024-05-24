import { useCallback, useEffect, useState } from "react";
import MusicApiService, { Track } from "../../services/api/MusicApiService";
import { useTrack } from "../../providers/TrackContext";

interface PlayerComponentState {
    currentAudio: HTMLAudioElement;
    currentTrack: Track | null;
}

export function PlayerComponent() {
    
    const { subscribeToTrackChanges } = useTrack();
    const musicApiService = new MusicApiService();

    const [state, setState] = useState<PlayerComponentState>({ currentAudio: new Audio(), currentTrack: null });

    const handleTrackChange = useCallback(
        (track: Track | null) => {
            if (track == null) {
                return;
            }

            musicApiService.getTrackStream(track.TrackId).then(streamUrl => {
                const audio = new Audio(streamUrl);
                audio.play();
                setState({ currentAudio: audio, currentTrack: track});
            });
        },
        [musicApiService]
    );

    // Update the current track progress 
    useEffect(() => {
        if (state.currentTrack && state.currentAudio) {
            state.currentAudio.addEventListener('timeupdate', () => {
                // Just to force a re-render
                setState({ currentAudio: state.currentAudio, currentTrack: state.currentTrack });
            });
        }
    }, [state.currentAudio, state.currentTrack]);

    useEffect(() => {
        const unsubscribe = subscribeToTrackChanges(handleTrackChange);
        return () => unsubscribe();
    }, [handleTrackChange, subscribeToTrackChanges]);

    function formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    return (
        <div className="w-full h-16 bg-slate-950">
            {state.currentTrack && (
                <div className="text-white px-4 flex flex-row w-full">
                    <div className="flex flex-col justify-center content-center items-center">
                        {
                            state.currentAudio.paused ? (
                                <button className="bg-purple-600 text-white h-10 w-10 rounded-full flex flex-row justify-center content-center items-center" onClick={() => state.currentAudio.play()}>
                                    <i className="gg-play-button-o"></i>
                                    
                                </button>
                            ) : (
                                <button className="bg-purple-600 text-white h-10 w-10 rounded-full flex flex-row justify-center content-center items-center" onClick={() => state.currentAudio.pause()}>
                                    <i className="gg-play-pause-o"></i>
                                </button>
                            )
                        }
                    </div>

                    <div className="flex flex-row items-center ml-4 flex-1">
                        <img src={state.currentTrack.ImageUrl} className="mt-2 w-12 h-12 bg-gray-200 rounded" alt="Track Thumbnail" />
                        <div className="ml-4 w-full">
                            <div className="w-full flex flex-row">
                                <div className="flex-1">{state.currentTrack.Title || "Unknown"} - <span className="text-slate-600">{state.currentTrack.Artist || "Unknown"}</span></div>
                                <div className="text-slate-600">{formatTime(state.currentAudio.currentTime)} / {formatTime(state.currentAudio.duration)}</div>
                            </div>
                            
                            <div className="h-2 rounded-full w-full bg-gray-100" onMouseDown={
                                (e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const percentage = x / rect.width;
                                    state.currentAudio.currentTime = state.currentAudio.duration * percentage;
                                }
                            }>
                                <div className="h-2 bg-purple-600 rounded-full mt-2" style={{ width: `${(state.currentAudio.currentTime / state.currentAudio.duration) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}