import { Game } from "../types";
import { BaseStore, GameInfo } from "./base";

/*
{
  "guild-id": {
    "game-id": {}
  }
}
*/
type Games = Record<string, Record<string, Game |undefined>>

export class MemoryStore extends BaseStore {
  games: Games = {}
  newGame(game: Game, info: GameInfo) {
    const games = this.games[info.guild.id]
    if(games) {
      games[game.id] = game
    } else {
      this.games[info.guild.id] = {}
      this.games[info.guild.id][game.id] = game
    }
    console.log(this.games)
  }

  findGame(info: GameInfo): Game | undefined {
    if(info.guild.id in this.games) {
      for(const game of Object.values(this.games[info.guild.id])) {
        if(game?.participants.includes(info.user)) {
          return game
        }
      }
    }
    return undefined
  }
  getGame(id: string, guild: string): Game | undefined {
    return this.games[guild][id]
  }

  updateGame(updated: Game, guild: string) {
    this.games[guild][updated.id] = updated
  }
  removeGame(info: GameInfo) {
    const game = this.findGame(info)
    if(game !== undefined) {
      this.games[info.guild.id][game.id || ''] = undefined
    }
  }
}