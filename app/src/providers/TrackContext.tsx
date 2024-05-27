import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import MusicApiService, { Track } from '../services/api/MusicApiService';

interface TrackContextProps {
    currentTrack: Track | null;
    setCurrentTrack: (track: Track | null) => void;
    subscribeToTrackChanges: (callback: (track: Track | null, audio: HTMLAudioElement | null) => void) => () => void;
    addTrackToPlaylist: (track: Track) => void;
}

const TrackContext = createContext<TrackContextProps | undefined>(undefined);

export const TrackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentTrack, setCurrentTrackState] = useState<Track | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const subscribers = useRef<Set<(track: Track | null, audio: HTMLAudioElement | null) => void>>(new Set());

    const musicApiService = new MusicApiService();

    const playlist = useRef<Track[]>([]);

    const addTrackToPlaylist = useCallback((track: Track) => {
        // If there is no track playing, start playing the track, else add it to the playlist using audioRef.current
        if(audioRef.current == null) {
            setCurrentTrack(track);
        } else {

            // Check to see whether current track has completed playing
            if(audioRef.current.ended) {
                setCurrentTrack(track);
            } else {
                // Add the track to the playlist
                playlist.current.push(track);
            }
        }
    }, []);

    const setCurrentTrack = useCallback(async (track: Track | null) => {
        if (audioRef.current) {
            audioRef.current.pause();
        }

        if (track) {
            try {
                const streamUrl = await musicApiService.getTrackStream(track.TrackId);

                audioRef.current = new Audio(streamUrl);
                audioRef.current.play();

                // Listen for track end to play next track
                audioRef.current.addEventListener('ended', () => {
                    // Remember that a track can be added to a playlist twice
                    if(playlist.current.length != 0) {
                        const nextTrack = playlist.current.shift();
                        setCurrentTrack(nextTrack!);
                    }
                });
                
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
                        if(audioRef.current)
                            audioRef.current.play();
                    });

                    navigator.mediaSession.setActionHandler('pause', () => {
                        if(audioRef.current)
                            audioRef.current.pause();
                    });
                }

                setCurrentTrackState(track);
            } catch (error) {
                console.error('Error fetching track stream', error);
                setCurrentTrackState(null);
                audioRef.current = null;
            }
        } else {
            setCurrentTrackState(null);
            audioRef.current = null;
        }
        subscribers.current.forEach(callback => callback(track, audioRef.current));
    }, [musicApiService]);

    const togglePlay = useCallback(() => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, []);

    const subscribeToTrackChanges = useCallback((callback: (track: Track | null, audio: HTMLAudioElement | null) => void) => {
        subscribers.current.add(callback);
        return () => {
            subscribers.current.delete(callback);
        };
    }, []);

    return (
        <TrackContext.Provider value={{ currentTrack, setCurrentTrack, subscribeToTrackChanges, addTrackToPlaylist }}>
            {children}
        </TrackContext.Provider>
    );
};

export const useTrack = (): TrackContextProps => {
    const context = useContext(TrackContext);
    if (context === undefined) {
        throw new Error('useTrack must be used within a TrackProvider');
    }
    return context;
};
