import { Guild, User } from "discord.js";
import { Game } from "../types";

export interface GameInfo {
  user: User,
  guild: Guild
}
export abstract class BaseStore {
  // Create
  abstract newGame(game: Game, info: GameInfo): void
  //Read
  abstract findGame(info: GameInfo): Game | undefined
  abstract getGame(id: string, guild: string): Game | undefined
  // Update
  abstract updateGame(updated: Game, guild: string): Game
  // Delete
  abstract removeGame(info: GameInfo): void
}