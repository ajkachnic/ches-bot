import { Guild, Message, User } from "discord.js";
import { nanoid } from "nanoid";
import { prefix } from "../config";
import type { ExtraData, Game } from "../types";
import { BaseHandler } from "./base";

export class AbandonHandler extends BaseHandler {
  _name = "abandon handler"
  async onMessage(message: Message, { normalized, mentions }: ExtraData) {
    if(normalized.startsWith(`${prefix}abandon`)) {
      if(message.guild === null) {
        await message.channel.send('Please use in a server environment')
        return true
      }
      this.store.removeGame({
        user: message.author,
        guild: message.guild as Guild
      })
      await message.channel.send(`<@${message.author.id}> has conceded`)
      return true
    }
    return false

  }
}