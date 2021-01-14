import { SvgRenderer } from "../board/svg";
import { prefix } from "../config";
import type { ExtraData, Game } from "../types";
import { BaseHandler } from "./base";

import { Chess } from "chess.js";
import { Guild, Message, MessageAttachment } from "discord.js";
import svg2img from 'svg2img'
export class MoveHandler extends BaseHandler {
  _name = "move handler"
  async onMessage(message: Message, { normalized, mentions }: ExtraData) {
    const command = `${prefix}move`
    if(normalized.startsWith(command)) {
      const g = this.store.findGame({
        guild: message.guild as Guild,
        user: message.author
      })
      if(g === undefined) {
        await message.channel.send(`You aren\'t currently in a game.
Run \`${prefix}challenge @user\` to create one`)
        return true
      }
      const game = g as Game
      const chess = Chess(game.fen)

      const move = message.content.slice(command.length + 1)
      const legal = chess.move(move, {
        sloppy: true
      })
      if(legal == null) {
        await message.channel.send(`${move} is an invalid move`)
        return true
      }

      if(chess.in_stalemate()) {
        await message.channel.send(`The game is in stalemate. In a sense, you're both losers`)
        return true
      }
      if(chess.in_checkmate()) {
        await message.channel.send(`Checkmate. Congrats <@${message.author.id}>`)
        return true
      }
      if(chess.in_draw()) {
        await message.channel.send(`The game is a draw. In a sense, you both lost`)
        this.store.removeGame({
          guild: message.guild as Guild,
          user: message.author
        })
        return true
      }

      const fen = chess.fen()
      this.store.updateGame({
        ...game,
        fen
      }, (message.guild as Guild).id)    
      const renderer = new SvgRenderer()
      const rendered = renderer.board(fen, 400)
      const file: Buffer = await new Promise((resolve, reject) => {
        svg2img(rendered, {
          width: 400,
          height: 400
        }, (err, buf) => {
          if(err) return reject(err)
          resolve(buf)
        })
      })
      const attachment = new MessageAttachment(file, 'board.jpg')
      try {
        await message.delete()
      } catch {
        console.log(`Couldn't remove a message`)
      }
      await message.channel.send(`Here's the board`, attachment)
      return true
    } else {
      return false
    }
  }
}