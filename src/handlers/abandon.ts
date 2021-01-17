import {Message} from 'discord.js'
import {prefix} from '../config'
import type {ExtraData} from '../types'
import {BaseHandler} from './base'

export class AbandonHandler extends BaseHandler {
  _name = 'abandon handler'
  async onMessage(message: Message, {normalized}: ExtraData) {
    const aliases = ['abandon', 'resign', 'leave', 'concede']
    if (normalized.startsWith(prefix)) {
      const cmd = normalized.slice(prefix.length).split(' ')[0]
      console.log(cmd)
      if (aliases.includes(cmd)) {
        if (message.guild === null) {
          await message.channel.send('Please use in a server environment')
          return true
        }

        this.store.removeGame({
          user: message.author,
          guild: message.guild
        })
        await message.channel.send(`<@${message.author.id}> has conceded`)
        return true
      }

      return false
    }

    return false
  }
}
