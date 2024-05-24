import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { Track } from '../services/api/MusicApiService';

interface TrackContextProps {
    currentTrack: Track | null;
    setCurrentTrack: (track: Track | null) => void;
    subscribeToTrackChanges: (callback: (track: Track | null) => void) => () => void;
}

const TrackContext = createContext<TrackContextProps | undefined>(undefined);

export const TrackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentTrack, setCurrentTrackState] = useState<Track | null>(null);
    const subscribers = useRef<Set<(track: Track | null) => void>>(new Set());

    const setCurrentTrack = useCallback((track: Track | null) => {
        setCurrentTrackState(track);
        subscribers.current.forEach(callback => callback(track));
    }, []);

    const subscribeToTrackChanges = useCallback((callback: (track: Track | null) => void) => {
        subscribers.current.add(callback);
        return () => {
            subscribers.current.delete(callback);
        };
    }, []);

    return (
        <TrackContext.Provider value={{ currentTrack, setCurrentTrack, subscribeToTrackChanges }}>
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
