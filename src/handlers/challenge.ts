import { Guild, Message, User } from "discord.js";
import { nanoid } from "nanoid";
import { prefix } from "../config";
import type { ExtraData, Game } from "../types";
import { BaseHandler } from "./base";

export class ChallengeHandler extends BaseHandler {
  _name = "challenge handler"
  async onMessage(message: Message, { normalized, mentions }: ExtraData) {
    if(normalized.startsWith(`${prefix}challenge`)) {
      const challengee = mentions.first() as User
      if(challengee === undefined) {
        message.channel.send('You need to mention a user')
        return true
      }
      const challenger = message.author

      if(challengee.bot) {
        message.channel.send('You can\'t play against a bot')
        return true
      }

      const game: Game = {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        participants: [
          challengee.id,
          challenger.id
        ],
        id: nanoid(32),
        lastMessage: ''
      }

      this.store.newGame(game, {
        guild: message.guild as Guild,
        user: challenger
      })

      message.channel.send('Game successfully created! You can move with `chess move <move>`')

      return true
    } else {
      return false
    }
  }
}