import axios from 'axios';

const BASE_URL = 'https://decentrify.serveo.net/api/music';

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
        try {
            const response = await axios.get(`${BASE_URL}/${trackId}/stream`, {
                responseType: 'blob'
            });
            const url = URL.createObjectURL(response.data);
            return url;
        } catch (error) {
            console.error('Error fetching track stream', error);
            throw error;
        }
    }

    async getArtwork(trackId: string): Promise<string> {
        try {
            const response = await axios.get(`${BASE_URL}/${trackId}/artwork`, {
                responseType: 'blob'
            });
            const url = URL.createObjectURL(response.data);
            return url;
        } catch (error) {
            console.error('Error fetching artwork', error);
            throw error;
        }
    }
}

export default MusicApiService;
