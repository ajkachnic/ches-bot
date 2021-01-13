import { Collection, User } from "discord.js";

export interface Game {
  fen: string,
  participants: User[],
  id: string
}

export interface ExtraData {
  normalized: string,
  mentions: Collection<string, User>
}