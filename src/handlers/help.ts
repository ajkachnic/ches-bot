import {Message, MessageEmbed} from 'discord.js'
import {prefix} from '../config'
import type {ExtraData} from '../types'
import {BaseHandler} from './base'

export class HelpHandler extends BaseHandler {
  _name = 'help handler'
  async onMessage(message: Message, {normalized, mentions}: ExtraData) {
    if (normalized.startsWith(`${prefix}help`)) {
      const embed = new MessageEmbed()

      embed.setTitle('Help')
      embed.setURL('https://github.com/ajkachnic/chess-bot')
      embed.addField('Commands', `\`chess challenge @user\`: Start a new game
\`chess resign\`: Resign from the current game
\`move <move>\`  : Make a move (with SAN format)
\`chess help\`   : View the menu you see right now`)
      embed.addField('Report bugs', 'Please go to https://github.ajkachnic/chess-bot/issues to report any bugs/issues')

      await message.channel.send(embed)
      return true
    }

    return false
  }
}
