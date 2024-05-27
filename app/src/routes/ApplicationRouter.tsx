import { Router, Route, BrowserRouter, Routes } from "react-router-dom";
import { MusicRoute } from "./Music.Route";
import { AlbumsRoute } from "./Albums.Route";
import { AlbumRoute } from "./Album.Route";

export function ApplicationRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <div>
                        <h1>Home</h1>
                        <p>Welcome to Decentrify!</p>
                    </div>
                }></Route>

                <Route path="/music" element={
                    <MusicRoute></MusicRoute>
                }></Route>

                <Route path="/albums" element={
                    <AlbumsRoute></AlbumsRoute>
                }></Route>

                <Route path="/albums/:albumId" element={
                    <AlbumRoute></AlbumRoute>
                }></Route>
            </Routes>
        </BrowserRouter>
    );
}