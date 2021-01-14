import {SvgRenderer} from '../board/svg'
import {prefix} from '../config'
import type {ExtraData, Game} from '../types'
import {BaseHandler} from './base'

import {Chess, ChessInstance} from 'chess.js'
import {Guild, Message, MessageAttachment, Client} from 'discord.js'
import svg2img from 'svg2img'
import {GameInfo} from '../store/base'

export class MoveHandler extends BaseHandler {
  _name = 'move handler'

  async createImage(chess: ChessInstance) {
    const fen = chess.fen()
    const renderer = new SvgRenderer()
    const rendered = renderer.board(fen, {
      size: 400,
      orientation: chess.turn()
    })
    const file: Buffer = await new Promise((resolve, reject) => {
      svg2img(rendered, {
        width: 400,
        height: 400
      }, (error, buf) => {
        if (error) {
          reject(error)
          return
        }

        resolve(buf)
      })
    })
    return new MessageAttachment(file, 'board.jpg')
  }

  endGame(info: GameInfo) {
    this.store.removeGame(info)
  }

  async onMessage(message: Message, {normalized, mentions}: ExtraData) {
    const command = 'move'
    if (normalized.startsWith(command)) {
      const g = this.store.findGame({
        guild: message.guild!,
        user: message.author
      })
      if (g === undefined) {
        await message.channel.send(`You aren't currently in a game.
Run \`${prefix}challenge @user\` to create one`)
        return true
      }

      let game = g
      const chess = Chess(game.fen)

      const move = message.content.slice(command.length + 1)
      const legal = chess.move(move, {
        sloppy: true
      })
      if (legal === null) {
        await message.channel.send(`${move} is an invalid move`)
        await message.react('❌')
        return true
      }

      const info = {
        guild: message.guild!,
        user: message.author
      }

      if (chess.in_stalemate()) {
        const attachment = await this.createImage(chess)
        await message.channel.send('The game is in stalemate. In a sense, you\'re both losers. Here\'s the final board', attachment)
        this.endGame(info)
        return true
      }

      if (chess.in_checkmate()) {
        const attachment = await this.createImage(chess)
        await message.channel.send(`Checkmate. Congrats <@${message.author.id}>. Here's the final board`, attachment)
        this.endGame(info)
        return true
      }

      if (chess.in_draw()) {
        const attachment = await this.createImage(chess)
        await message.channel.send('The game is a draw. In a sense, you both lost. Here\'s the board', attachment)
        this.endGame(info)
        return true
      }

      const fen = chess.fen()
      game = this.store.updateGame({
        ...game,
        fen
      }, (message.guild!).id)

      try {
        await message.delete()
      } catch {
        console.log('Couldn\'t remove a message')
      }

      if (game.lastMessage !== '') {
        await (await message.channel.messages.fetch(game.lastMessage)).delete()
      }

      const attachment = await this.createImage(chess)
      const message_ = await message.channel.send('Here\'s the board', attachment)
      this.store.updateGame({
        ...game,
        lastMessage: message_.id
      }, (message.guild!).id)

      return true
    }

    return false
  }
}
