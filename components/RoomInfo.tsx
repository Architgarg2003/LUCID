


// Importing the RoomInfo component
import type { RoomInfo as RoomInfoType } from "@/pages/api/room_info/[room]";

import { useCallback, useEffect, useMemo, useState } from "react";

import { setIntervalAsync, clearIntervalAsync } from "set-interval-async";

type Props = {
  roomName: string;
};

const DEFAULT_ROOM_INFO: RoomInfoType = { num_participants: 0 };

export function RoomInfo({ roomName }: Props) {
  const [roomInfo, setRoomInfo] = useState<RoomInfoType>(DEFAULT_ROOM_INFO);

  const fetchRoomInfo = useCallback(async () => {
    const res = await fetch(`/api/room_info/${roomName}`);
    const roomInfo = (await res.json()) as RoomInfoType;
    setRoomInfo(roomInfo);
  }, [roomName]);

  useEffect(() => {
    fetchRoomInfo();
    const interval = setIntervalAsync(fetchRoomInfo, 1000);
    return () => {
      clearIntervalAsync(interval);
      console.log("in room ",roomInfo.num_participants )
    };
  }, [fetchRoomInfo]);

  return (
    <div>
      <div className="flex flex-col items-center">
        <span className="countdown font-mono text-7xl mb-2">
          <span >{ roomInfo.num_participants }</span>
            
        </span>
        <div className="text-md mb-5">Participants currently in room</div>
      </div>
    </div>
  );
}
