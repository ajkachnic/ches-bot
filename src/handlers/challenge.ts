import {Guild, Message, User} from 'discord.js'
import {nanoid} from 'nanoid'
import {prefix} from '../config'
import type {ExtraData, Game} from '../types'
import {BaseHandler} from './base'

export class ChallengeHandler extends BaseHandler {
  _name = 'challenge handler'
  async onMessage(message: Message, {normalized, mentions}: ExtraData) {
    if (normalized.startsWith(`${prefix}challenge`)) {
      const challengee = mentions.first()!
      if (challengee === undefined) {
        await message.channel.send('You need to mention a user')
        return true
      }

      const challenger = message.author

      if (challengee.bot) {
        await message.channel.send('You can\'t play against a bot')
        return true
      }

      const game: Game = {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        white: challenger.id,
        black: challengee.id,
        turn: 'w',
        id: nanoid(32),
        lastMessage: ''
      }

      this.store.newGame(game, {
        guild: message.guild!,
        user: challenger
      })

      await message.channel.send('Game successfully created! You can move with `chess move <move>`')

      return true
    }

    return false
  }
}
