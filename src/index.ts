import dotenv from 'dotenv'
dotenv.config()
import { Client, User } from 'discord.js'
import { BaseHandler } from './handlers/base';
import { ChallengeHandler } from './handlers/challenge';
import { MemoryStore } from './store/memory';
import { MoveHandler } from './handlers/move';
import { AbandonHandler } from './handlers/abandon';
import { HelpHandler } from './handlers/help';

const client = new Client();

const store = new MemoryStore();
const handlers = [
  ChallengeHandler,
  MoveHandler,
  AbandonHandler,
  HelpHandler
]

const allHandlers = async (f: (h: BaseHandler) => Promise<boolean>, fName: string) => {
  for (const Handler of handlers) {
    const handler = new Handler(client, store)
    try {
      const res = await f(handler)
      if (res) break
    } catch (error) {
      console.log(`> ${handler._name} errored in ${fName}!`)
      console.log(error)
    }
  }
}

client.once('ready', () => {
  console.log(`I'm ready...`)
})

client.on('message', async message => {
  const normalized = message.content.toLowerCase()
  const mentions = message.mentions.users

  await allHandlers(async (handler) => await handler.onMessage(message, { normalized, mentions }), 'onMessage')
})

client.login(process.env.BOT_TOKEN)