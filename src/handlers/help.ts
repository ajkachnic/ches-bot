import {Message} from 'discord.js'
import {prefix} from '../config'
import type {ExtraData} from '../types'
import {BaseHandler} from './base'

export class HelpHandler extends BaseHandler {
  _name = 'help handler'
  async onMessage(message: Message, {normalized, mentions}: ExtraData) {
    if (normalized.startsWith(`${prefix}help`)) {
      await message.channel.send(`**Chess bot help**
\`chess challenge @user\`: Starts a new game
\`chess abandon\`        : Ends the current game
\`move <move>\`    : Make a move (with algebraic notation)`)
      return true
    }

    return false
  }
}
