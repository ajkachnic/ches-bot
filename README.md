# chess-bot

## Todos

- [ ] Fix bug where you can join multiple games at one
- [ ] Fix bug where you can play against yourself (maybe)
- [ ] Ping players to notify them of their move
- [ ] Add more board rendering options
- [ ] Add rank and file to the board
- [ ] Allow playing in DMs (less channel spam too)
- [ ] Add support to somehow play chess bots
- [ ] Add database instead of in memory (should be pretty easy due to the modular implementation)
- [ ] Add a config file for setting some general options
- [ ] Add more analysis stuff (like advantage bars)
- [ ] Improve the documentation
- [ ] Refactor some ugly code
- [ ] Maybe abstract board rendering logic to an npm module
- [ ] Add some performance benchmarks to make sure it stays fast
- [ ] Maybe unit tests?
- [ ] Add time control options (probably not though)

## Setup

As a prerequisites, you must have `node` installed. Also you'll need pnpm; Install it like this

```sh
npm i -g pnpm
```

First off, clone the git repository. Then install it's dependencies:

```sh
git clone https://github.com/ajkachnic/chess-bot.git
pnpm install
```

From here, you need to add a `BOT_TOKEN` environment variable in a `.env` file, like so:

```sh
BOT_TOKEN="token here"
```

To build the bot, run `pnpm run build`. You can then run `node dist/index.js` to start the bot up.

## Usage

The default prefix is `chess` (used for all commands except `move`), but this can be easily changed by editing the `src/config.ts` file.

The bot supports the following commands:
- `chess challenge <user>`
- `chess help`
- `chess resign`
- `move <san-move>`