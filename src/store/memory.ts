import {Game} from '../types'
import {BaseStore, GameInfo} from './base'

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
    if (games) {
      games[game.id] = game
    } else {
      this.games[info.guild.id] = {}
      this.games[info.guild.id][game.id] = game
    }
  }

  findGame(info: GameInfo): Game | undefined {
    if (info.guild.id in this.games) {
      for (const game of Object.values(this.games[info.guild.id])) {
        if ([game?.white, game?.black].includes(info.user.id)) {
          return game
        }

        console.log('User not in games')
      }
    }

    return undefined
  }

  getGame(id: string, guild: string): Game | undefined {
    return this.games[guild][id]
  }

  updateGame(updated: Game, guild: string): Game {
    this.games[guild][updated.id] = updated
    return updated
  }

  removeGame(info: GameInfo) {
    const game = this.findGame(info)
    if (game !== undefined) {
      this.games[info.guild.id][game.id || ''] = undefined
    }
  }
}
