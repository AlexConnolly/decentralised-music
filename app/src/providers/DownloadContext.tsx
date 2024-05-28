import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import MusicApiService from '../services/api/MusicApiService';

interface DownloadContextProps {
    downloadingQueue: string[];
    progress: { [key: string]: number };
    addTracksToDownloadQueue: (tracks: string[]) => void;
    hasFileDownloaded: (trackId: string) => Promise<boolean>;
}

const DownloadContext = createContext<DownloadContextProps | undefined>(undefined);

export const DownloadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [downloadingQueue, setDownloadingQueue] = useState<string[]>([]);
    const [progress, setProgress] = useState<{ [key: string]: number }>({});
    const musicApiService = new MusicApiService();
    const isDownloading = useRef(false);

    const addTracksToDownloadQueue = useCallback((tracks: string[]) => {
        setDownloadingQueue(prevQueue => [...prevQueue, ...tracks]);
    }, []);

    const downloadTracks = useCallback(async () => {
        if (isDownloading.current) return; // Prevent re-entry if already downloading

        isDownloading.current = true;
        try {
            for (let track of downloadingQueue) {
                try {
                    setProgress(prevProgress => ({ ...prevProgress, [track]: 0 }));
                    await musicApiService.downloadTrack(track);
                    setProgress(prevProgress => ({ ...prevProgress, [track]: 100 }));
                    setDownloadingQueue(prevQueue => prevQueue.filter(t => t !== track));
                } catch (error) {
                    console.error('Error downloading track', error);
                    setProgress(prevProgress => ({ ...prevProgress, [track]: -1 })); // -1 indicates error
                }
            }
        } finally {
            isDownloading.current = false;
        }
    }, [downloadingQueue, musicApiService]);

    const hasFileDownloaded = useCallback((trackId: string) => {
        return musicApiService.hasFileDownloaded(trackId);
    }, [musicApiService]);

    useEffect(() => {
        if (downloadingQueue.length > 0) {
            downloadTracks();
        }
    }, [downloadingQueue, downloadTracks]);

    return (
        <DownloadContext.Provider value={{ downloadingQueue, progress, addTracksToDownloadQueue, hasFileDownloaded }}>
            {children}
        </DownloadContext.Provider>
    );
};

export const useDownload = (): DownloadContextProps => {
    const context = useContext(DownloadContext);
    if (context === undefined) {
        throw new Error('useDownload must be used within a DownloadProvider');
    }
    return context;
};
