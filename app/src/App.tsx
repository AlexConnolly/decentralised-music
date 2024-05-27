import React, { useCallback, useEffect, useRef, useState } from "react";
import MusicApiService, { Track } from "./services/api/MusicApiService";
import { useTrack } from "./providers/TrackContext";
import { PlayerComponent } from "./components/player/player.component";
import { ApplicationRouter } from "./routes/ApplicationRouter";
import { useNavigate } from "react-router-dom";

interface AppState {
    isDrawerOpen: boolean;
}

export function App() {

    const [state, setState] = useState<AppState>({ isDrawerOpen: false });

    return (
        <div className="w-full h-full bg-gray-100 flex flex-col">
            <div className="w-full h-16 bg-slate-950 flex flex-row">
                <div className="flex-grow px-4 text-white font-bold h-16 bg-slate-900 flex justify-center content-center items-center">
                    <i className="gg-music text-white ml-2 mr-2"></i> decentrify
                </div>
                <div className="w-16 h-16 bg-slate-950 flex justify-center content-center items-center" onClick={() => {
                    setState({ isDrawerOpen: !state.isDrawerOpen });
                }}>
                    <i className="gg-layout-list text-white"></i>
                </div>
            </div>
            <div className="flex-grow bg-gray-100 flex flex-col border-t-4 border-teal-600">
                <div className="flex-grow overflow-x-scroll" style={{height: "50px"}}>
                    <ApplicationRouter></ApplicationRouter>
                </div>
                <div className="h-44">
                    <PlayerComponent></PlayerComponent>
                </div>
            </div>
            {
                state.isDrawerOpen && (
                    <div className="absolute top-0 left0 inset-0">
                        <div className="bg-black bg-opacity-50 absolute top-0 left-0 inset-0" onClick={() => {
                            setState({ isDrawerOpen: false });
                        }}></div>
                        <div className="bg-slate-900 relative top-0 right-0 w-52 h-full">
                            <div className="flex flex-col">
                                <div>
                                    <div className="p-4 text-white bg-slate-800 cursor-pointer" onClick={() => {
                                        window.location.href = "/music";
                                    }}>
                                        Tracks
                                    </div>
                                    <div className="p-4 text-white bg-slate-800 cursor-pointer" onClick={() => {
                                        window.location.href = "/albums";
                                    }}>
                                        Albums
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
