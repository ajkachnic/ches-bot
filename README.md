# chess-bot

## Setup

As a prerequesists, you must have `node` installed. Also you'll need pnpm; Install it like this

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