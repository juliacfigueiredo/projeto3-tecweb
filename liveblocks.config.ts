import { LiveList, createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { Message } from "@prisma/client";

const client = createClient({
  publicApiKey: "pk_dev_C3M0H1DtEmybAV5aONRwf0i_0K-T1HU5ke4ORP8W9d4iFHnJFJeU_xlqmfGBbH5B",
});

type Presence = {
  username: string;
};

type Storage = {
  scientist: LiveList<{ username: string, text: string }>;
};

type UserMeta = {}

export type RoomEvent = {
  message: {
    text: string;
    username: string;
  }
}

export const { RoomProvider, useOthers, useBroadcastEvent, useEventListener } = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);