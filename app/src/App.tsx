import React, { useCallback, useEffect, useRef } from "react";
import MusicApiService, { Track } from "./services/api/MusicApiService";
import { useTrack } from "./providers/TrackContext";
import { PlayerComponent } from "./components/player/player.component";
import { ApplicationRouter } from "./routes/ApplicationRouter";

export function App() {
    return (
        <div className="w-full h-full bg-gray-100 flex flex-col">
            <div className="w-full h-16 bg-slate-950 flex flex-row">
                <div className="flex-grow px-4 text-white font-bold h-16 bg-slate-900 flex justify-center content-center items-center">
                    <i className="gg-music text-white ml-2 mr-2"></i> decentrify
                </div>
                <div className="w-16 h-16 bg-slate-950 flex justify-center content-center items-center">
                    <i className="gg-layout-list text-white"></i>
                </div>
            </div>
            <div className="flex-grow bg-gray-100 flex flex-col border-t-4 border-teal-600">
                <ApplicationRouter></ApplicationRouter>
                <PlayerComponent></PlayerComponent>
            </div>
            <div className="absolute top-0 left-0 inset-0 bg-black bg-opacity-50 hidden">
                <div className="bg-slate-900 relative top-0 left-10 h-full">test</div>
            </div>
        </div>
    );
}
