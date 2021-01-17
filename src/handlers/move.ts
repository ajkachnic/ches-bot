import {SvgRenderer} from '../board/svg'
import {prefix} from '../config'
import type {ExtraData} from '../types'
import {BaseHandler} from './base'
import {analyzeGame} from '../analyze'
import {GameInfo} from '../store/base'

import {Chess, ChessInstance, Move} from 'chess.js'
import {Message, MessageAttachment, MessageEmbed} from 'discord.js'
import svg2img from 'svg2img'

export class MoveHandler extends BaseHandler {
  _name = 'move handler'

  async createImage(chess: ChessInstance, move: Move) {
    const fen = chess.fen()
    const history = chess.history({
      verbose: true
    })
    const renderer = new SvgRenderer()
    const rendered = renderer.board(fen, {
      size: 400,
      orientation: chess.turn(),
      lastMove: move
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
    const {author, channel} = message
    const command = 'move'
    if (normalized.startsWith(command)) {
      const g = this.store.findGame({
        guild: message.guild!,
        user: author
      })
      if (g === undefined) {
        await channel.send(`You aren't currently in a game.
Run \`${prefix}challenge @user\` to create one`)
        return true
      }

      let game = g
      if (g.turn === 'b' && author.id !== g.black) {
        await channel.send(`It isn't your turn, <@${author.id}>`)
        return true
      }

      if (g.turn === 'w' && author.id !== g.white) {
        await channel.send(`It isn't your turn, <@${author.id}>`)
        return true
      }

      const chess = Chess(game.fen)

      const move = message.content.slice(command.length + 1)
      const legal = chess.move(move, {
        sloppy: true
      })
      if (legal === null) {
        await channel.send(`${move} is an invalid move`)
        await message.react('❌')
        return true
      }

      const info = {
        guild: message.guild!,
        user: author
      }

      if (chess.in_stalemate()) {
        const attachment = await this.createImage(chess, legal)
        await channel.send('The game is in stalemate. In a sense, you\'re both losers. Here\'s the final board', attachment)
        this.endGame(info)
        return true
      }

      if (chess.in_checkmate()) {
        const attachment = await this.createImage(chess, legal)
        await channel.send(`Checkmate. Congrats <@${author.id}>. Here's the final board`, attachment)
        this.endGame(info)
        return true
      }

      if (chess.in_draw()) {
        const attachment = await this.createImage(chess, legal)
        await channel.send('The game is a draw. In a sense, you both lost. Here\'s the board', attachment)
        this.endGame(info)
        return true
      }

      const fen = chess.fen()
      game = this.store.updateGame({
        ...game,
        fen,
        turn: chess.turn(),
        moves: chess.history({
          verbose: true
        }).map(move => {
          return move.from + move.san
        })
      }, (message.guild!).id)

      try {
        await message.delete()
      } catch {
        console.log('Couldn\'t remove a message')
      }

      if (game.lastMessage !== '') {
        await (await channel.messages.fetch(game.lastMessage)).delete()
      }

      const attachment = await this.createImage(chess, legal)

      const next = chess.turn() === 'b' ? game.black : game.white

      const analysis = await analyzeGame(game.fen)
      const embed = new MessageEmbed()
        .setTitle('Move successful')
        .setDescription(`It's your move, <@${next}>. ${chess.in_check() ? 'You appear to be in check, so move carefully. ' : ''}`)
        .attachFiles([attachment])
        .setImage('attachment://board.jpg')
      if (analysis) {
        embed.addField('Opening', analysis.name)
      }

      const message_ = await channel.send({embed})
      this.store.updateGame({
        ...game,
        lastMessage: message_.id,
        opening: analysis ? analysis.name : game.opening
      }, (message.guild!).id)

      return true
    }

    return false
  }
}
