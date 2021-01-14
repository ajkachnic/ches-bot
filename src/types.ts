import {Collection, User} from 'discord.js'

export interface Game {
  fen: string;
  black: string;
  white: string;
  turn: 'w' | 'b';
  id: string;
  lastMessage: string;
}

export interface ExtraData {
  normalized: string;
  mentions: Collection<string, User>;
}
