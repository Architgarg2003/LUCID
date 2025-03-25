"use client";

import { WebAudioContext } from "@/providers/audio/webAudio";
import { BottomBar } from "@/components/BottomBar";
import { RoomInfo } from "@/components/RoomInfo";
import { UsernameInput } from "@/components/UsernameInput";
import {
    ConnectionDetails,
    ConnectionDetailsBody,
} from "@/pages/api/connection_details";
import { LiveKitRoom } from "@livekit/components-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
    CharacterName,
    CharacterSelector,
} from "@/components/CharacterSelector";
import { useMobile } from "@/util/useMobile";
import { GameView } from "@/components/GameView";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from "@clerk/clerk-react";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";




export default function Page() {
    const [connectionDetails, setConnectionDetails] =
        useState<ConnectionDetails | null>(null);
    const [selectedCharacter, setSelectedCharacter] =
        useState<CharacterName>("doux");
    const isMobile = useMobile();
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    const { userId } = useAuth() as {userId:string};
    const router = useRouter();
    if (!userId) {
        router.push("/");
    }

    const getUserLeaderboardData = useQuery(api.LeaderBoard.getUserLeaderboardData, { userId: userId })
    console.log("getUserLeaderboardData", getUserLeaderboardData);
    const username = getUserLeaderboardData?.username || "";

    useEffect(() => {
        setAudioContext(new AudioContext());
        return () => {
            setAudioContext((prev) => {
                prev?.close();
                return null;
            });
        };
    }, []);
    const room_name = 'AXIOM STAGE'

    const humanRoomName = useMemo(() => {
        return decodeURI(room_name);
    }, [room_name]);

    const requestConnectionDetails = useCallback(
        async (username: string) => {
            const body: ConnectionDetailsBody = {
                room_name,
                username,
                character: selectedCharacter,
            };
            const response = await fetch("/api/connection_details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (response.status === 200) {
                return response.json();
            }

            const { error } = await response.json();
            throw error;
        },
        [room_name, selectedCharacter]
    );

    if (!audioContext) {
        return null;
    }

    const HandleJoin = async () => {
        try {
            const connectionDetails = await requestConnectionDetails(username);
            setConnectionDetails(connectionDetails);
        } catch (e: any) {
            toast.error(e.message || "Failed to join the room");
        }
    };


    // If we don't have any connection details yet, show the username form
    if (connectionDetails === null) {
        return (
            <div className="w-screen h-screen flex flex-col items-center justify-center">
                <Toaster />
                <h2 className="md:text-7xl text-4xl text-[#7c3aed] font-bold mb-3">{humanRoomName}</h2>
                <RoomInfo roomName={room_name} />
                <div className="divider"></div>
                <CharacterSelector
                    selectedCharacter={selectedCharacter}
                    onSelectedCharacterChange={setSelectedCharacter}
                />
                <Button className="h-10 w-80 bg-black text-white mt-3" onClick={HandleJoin}>
                    Join Now
                </Button>
            </div>
        );
    }

    // Show the room UI
    return (
        <div>
            <LiveKitRoom
                token={connectionDetails.token}
                serverUrl={connectionDetails.ws_url}
                connect={true}
                connectOptions={{ autoSubscribe: false }}
                options={{ expWebAudioMix: { audioContext } }}
            >
                <WebAudioContext.Provider value={audioContext}>
                    <div className="flex h-screen w-screen">
                        <div
                            className={`flex ${isMobile ? "flex-col-reverse" : "flex-col"
                                } w-full h-full`}
                        >
                            <div className="grow flex">
                                <div className="grow">
                                    <GameView />
                                </div>
                            </div>
                            <div className="bg-neutral">
                                <BottomBar />
                            </div>
                        </div>
                    </div>
                </WebAudioContext.Provider>
            </LiveKitRoom>
        </div>
    );
}
