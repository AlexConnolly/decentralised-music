import axios from 'axios';
import MusicApiService, { Track } from './MusicApiService';

export interface Album {
    Name: string;
    Artist: string;
    Tracks: Track[];
    AlbumId: string;
    ImageUrl : string;
}

var BASE_URL = 'https://decentrify-api.serveo.net/api/albums';

// Use localhost BASE_URL for development
if (window.location.hostname === 'localhost') {
    BASE_URL = 'https://localhost:7220/api/albums';
}

const musicApiService = new MusicApiService();

export class AlbumApiService {
    async getAlbumList(): Promise<Album[]> {
        try {
            const response = await axios.get<Album[]>(`${BASE_URL}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching album list', error);
            throw error;
        }
    }

    async getAlbum(albumId: string): Promise<Album> {
        try {
            const response = await axios.get<Album>(`${BASE_URL}/${albumId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching album', error);
            throw error;
        }
    }

    hasAlbumDownloaded(tracks: string[]): boolean {
        return tracks.every(track => musicApiService.hasFileDownloaded(track));
    }
}