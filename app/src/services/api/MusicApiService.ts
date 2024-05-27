import axios from 'axios';

var BASE_URL = 'https://decentrify-api.serveo.net/api/music';

// Use localhost BASE_URL for development
if (window.location.hostname === 'localhost') {
    BASE_URL = 'https://localhost:7220/api/music';
}

export interface Track {
    TrackId: string;
    Title: string;
    Album: string;
    Artist: string;
    Duration: string;
    ImageUrl: string;
}

class MusicApiService {
    async getTrackList(): Promise<Track[]> {
        try {
            const response = await axios.get<Track[]>(`${BASE_URL}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching track list', error);
            throw error;
        }
    }

    async getTrackStream(trackId: string): Promise<string> {
        const cacheName = 'track-stream-cache';
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(`${BASE_URL}/${trackId}/stream`);

        if (cachedResponse) {
            const blob = await cachedResponse.blob();
            const url = URL.createObjectURL(blob);
            return url;
        }

        try {
            const response = await axios.get(`${BASE_URL}/${trackId}/stream`, {
                responseType: 'blob'
            });
            const responseToCache = new Response(response.data);
            await cache.put(`${BASE_URL}/${trackId}/stream`, responseToCache);
            const url = URL.createObjectURL(response.data);
            return url;
        } catch (error) {
            console.error('Error fetching track stream', error);
            throw error;
        }
    }

    async getArtwork(trackId: string): Promise<string> {
        const cacheName = 'artwork-cache';
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(`${BASE_URL}/${trackId}/artwork`);

        if (cachedResponse) {
            const blob = await cachedResponse.blob();
            const url = URL.createObjectURL(blob);
            return url;
        }

        try {
            const response = await axios.get(`${BASE_URL}/${trackId}/artwork`, {
                responseType: 'blob'
            });
            const responseToCache = new Response(response.data);
            await cache.put(`${BASE_URL}/${trackId}/artwork`, responseToCache);
            const url = URL.createObjectURL(response.data);
            return url;
        } catch (error) {
            console.error('Error fetching artwork', error);
            throw error;
        }
    }
}

export default MusicApiService;
