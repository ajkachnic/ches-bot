import { Collection, User } from "discord.js";

export interface Game {
  fen: string,
  participants: string[],
  id: string,
  lastMessage: string
}

export interface ExtraData {
  normalized: string,
  mentions: Collection<string, User>
}