import { useCallback, useEffect, useState } from "react";
import MusicApiService, { Track } from "../../services/api/MusicApiService";
import { useTrack } from "../../providers/TrackContext";
import { useModal } from "../core/modal/ModalManagerProvider";

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

                setState((prevState) => {

                    // Kill the previous audio element
                    prevState.currentAudio.pause();
                    prevState.currentAudio.src = "";

                    // Create a new audio element
                    const audio = new Audio(streamUrl);
                    audio.play();

                    // Update the media session 
                    if ('mediaSession' in navigator) {
                        navigator.mediaSession.metadata = new MediaMetadata({
                            title: track.Title,
                            artist: track.Artist,
                            album: track.Album,
                            artwork: [
                                { src: track.ImageUrl, sizes: '96x96', type: 'image/png' },
                                { src: track.ImageUrl, sizes: '128x128', type: 'image/png' },
                                { src: track.ImageUrl, sizes: '192x192', type: 'image/png' },
                                { src: track.ImageUrl, sizes: '256x256', type: 'image/png' },
                                { src: track.ImageUrl, sizes: '384x384', type: 'image/png' },
                                { src: track.ImageUrl, sizes: '512x512', type: 'image/png' },
                            ]
                        });

                        navigator.mediaSession.setActionHandler('play', () => {
                            audio.play();
                        });

                        navigator.mediaSession.setActionHandler('pause', () => {
                            audio.pause();
                        });

                        navigator.mediaSession.setActionHandler('previoustrack', () => {

                        }
                        );
                    }

                    return { currentAudio: audio, currentTrack: track };
                });
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

    const { setCurrentModal, closeCurrentModal } = useModal();

    const openModal = () => {
      setCurrentModal({
        title: "Example Modal",
        content: <div>This is an example modal</div>,
        button: {
            text: "Close",
            onClick: () => {
                closeCurrentModal();
            }
        }
      });
    };

    return (
        <div className="w-full h-24 bg-slate-200 border-t-2 border-t-gray-300 flex flex-col justify-center content-center items-center">

            {state.currentTrack && (
                <div className="text-white px-4 flex flex-row w-full">
                    <div className="flex flex-col justify-center content-center items-center">
                        {
                            state.currentAudio.paused ? (
                                <button className="shadow-xl bg-purple-600 text-white h-10 w-10 rounded-full flex flex-row justify-center content-center items-center" onClick={() => state.currentAudio.play()}>
                                    <i className="gg-play-button-o"></i>
                                    
                                </button>
                            ) : (
                                <button className="shadow-xl bg-purple-600 text-white h-10 w-10 rounded-full flex flex-row justify-center content-center items-center" onClick={() => state.currentAudio.pause()}>
                                    <i className="gg-play-pause-o"></i>
                                </button>
                            )
                        }
                    </div>

                    <div className="flex flex-row items-center ml-2 flex-1">
                        <img src={state.currentTrack.ImageUrl} className="hidden mt-2 w-12 h-12 bg-slate-400 shadow-lg rounded" alt="Track Thumbnail" />
                        <div className="ml-3 w-full">
                            <div className="w-full flex flex-row">
                                <div className="flex-grow text-slate-800">
                                    <span className="font-semibold">{state.currentTrack.Title || "Unknown"} - <span className="text-slate-600">{state.currentTrack.Artist || "Unknown"}</span></span>
                                    <div className="text-slate-600">{formatTime(state.currentAudio.currentTime)} / {formatTime(state.currentAudio.duration)}</div>
                                </div>
                                <div className="flex flex-col items-center justify-center content-center">
                                    <div className="flex flex-row">
                                        <button className="bg-gray-400 shadow text-white w-8 h-8 mr-3 text-center rounded-md shadow-xl flex flex-row justify-center content-center items-center" onClick={() => {
                                            openModal();
                                        }}>
                                            <i className="gg-play-list-add"></i>
                                        </button>
                                        <button className="bg-red-500 shadow text-white w-8 h-8 text-center rounded-md shadow-xl flex flex-row justify-center content-center items-center">
                                            <i className="gg-heart"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="cursor-pointer h-2 mb-2 rounded-full w-full bg-slate-400 shadow-xl shadow-blue-500/50" onMouseDown={
                                (e) => {
                                    // Let the user drag the progress bar but also simply click on it to jump to a specific time
                                    const rect = e.currentTarget.getBoundingClientRect();

                                    const clickX = e.clientX - rect.left;
                                    const width = rect.width;
                                    const percentage = clickX / width;

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