//@ts-nocheck
import {
	DiscordMinimal,
	INTENTS,
	DiscordUser,
	Snowflake,
	DiscordEmbed,
	DiscordReady,
	DiscordMessageReactionAdd,
	DiscordInteraction,
	DiscordMessageDelete,
	DiscordMessageDeleteBulk,
	DiscordApplicationCommand,
	DiscordApplicationCommandOption,
	DiscordApplicationCommandOptionType,
	createGlobalApplicationCommand,
} from "discord-minimal";
//Structures
import type GameBase from "./src/game-base.js";
import GameResult, { ResultType } from "./src/game-result.js";

//Games
import SnakeGame from "./games/snake.js";
import HangmanGame from "./games/hangman.js";
import MinesweeperGame from "./games/minesweeper.js";
import Connect4Game from "./games/connect4.js";
import ChessGame from "./games/chess.js";
import TicTacToeGame from "./games/tic-tac-toe.js";
import FloodGame from "./games/flood.js";
import TwentyFortyEightGame from "./games/2048.js";
import config from "./src/config.json" assert { type: "json" };
export { config };
export const { emojis } = config;
export * from "./src/config.js";

type CommandObject = {
	[key: string]: () => GameBase;
};
const commandGameMap: CommandObject = {
	snake: () => new SnakeGame(),
	hangman: () => new HangmanGame(),
	connect4: () => new Connect4Game(),
	minesweeper: () => new MinesweeperGame(),
	chess: () => new ChessGame(),
	tictactoe: () => new TicTacToeGame(),
	flood: () => new FloodGame(),
	"2048": () => new TwentyFortyEightGame(),
};

const playerGameMap = new Map<Snowflake, Map<Snowflake, GameBase>>();

export async function initCommands(appId: Snowflake) {
	const vsSubCommand = new DiscordApplicationCommandOption(
		"vs",
		"User you wish to play against",
		DiscordApplicationCommandOptionType.USER
	);

	createGlobalApplicationCommand(
		new DiscordApplicationCommand(
			appId,
			"gamesbot",
			"GamesBot help and info"
		)
	);
	createGlobalApplicationCommand(
		new DiscordApplicationCommand(
			appId,
			"listgames",
			"List available games"
		)
	);
	createGlobalApplicationCommand(
		new DiscordApplicationCommand(
			appId,
			"endgame",
			"End the game you are currently playing"
		)
	);
	createGlobalApplicationCommand(
		new DiscordApplicationCommand(appId, "snake", "Play Snake")
	);
	createGlobalApplicationCommand(
		new DiscordApplicationCommand(appId, "hangman", "Play Hangman")
	);
	const connect4Command = new DiscordApplicationCommand(
		appId,
		"connect4",
		"Play Connect4"
	);
	connect4Command.addOption(vsSubCommand);
	createGlobalApplicationCommand(connect4Command);
	createGlobalApplicationCommand(
		new DiscordApplicationCommand(appId, "minesweeper", "Play Minesweeper")
	);
	const ticTacToeCommand = new DiscordApplicationCommand(
		appId,
		"tictactoe",
		"Play Tic-Tac-Toe"
	);
	ticTacToeCommand.addOption(vsSubCommand);
	createGlobalApplicationCommand(ticTacToeCommand);
	const chessCommand = new DiscordApplicationCommand(
		appId,
		"chess",
		"Play Chess"
	);
	chessCommand.addOption(vsSubCommand);
	createGlobalApplicationCommand(chessCommand);
	createGlobalApplicationCommand(
		new DiscordApplicationCommand(appId, "flood", "Play Flood")
	);
	createGlobalApplicationCommand(
		new DiscordApplicationCommand(appId, "2048", "Play 2048")
	);
}
/*
client.on("interactionCreate", async (interaction: Interaction) => {
  const userGame = getPlayersGame(
    interaction.guildId as Snowflake,
    interaction.member?.user?.id as Snowflake
  );

  if (interaction.isCommand()) {
    if (!interaction.guildId) {
      interaction
        .reply({ content: "This command can only be run inside a guild!" })
        .catch(console.log);
      return;
    }

    const guildId: Snowflake = interaction.guildId;
    const userId = interaction.member?.user?.id ?? interaction.user?.id;
    const command = interaction.commandName;
    if (!command || !userId) {
      interaction
        .reply({
          content: "The command or user was missing somehow.... awkward...",
        })
        .catch(console.log);
      return;
    }
    if (Object.keys(commandGameMap).includes(command)) {
      const game = commandGameMap[command]();

      const player2Option = interaction.command?.options.find(
        (o) => o.name === "vs"
      );
      let player2: User;
      if (player2Option) {
        if (!game.doesSupportMultiplayer()) {
          interaction
            .reply({ content: "Sorry that game is not a multiplayer game!" })
            .catch(console.log);
          return;
        } else {
          const users = interaction.command?.resolved?.users;
          const player2Id = player2Option.value
          player2 = player2Id && users ? users[player2Id] : undefined;
        }
      }
      if (userId === player2?.id) {
        interaction
          .reply({ content: "You cannot play against yourself!" })
          .catch(console.log);
        return;
      }

      if (!playerGameMap.has(guildId))
        playerGameMap.set(guildId, new Map<Snowflake, GameBase>());

      if (userGame) {
        interaction
          .reply({
            content:
              "You must either finish or end your current game (`/endgame`) before you can play another!",
          })
          .catch(console.log);
        return;
      } else if (player2 && playerGameMap.get(guildId)?.has(player2.id)) {
        interaction
          .reply({
            content:
              "The person you are trying to play against is already in a game!",
          })
          .catch(console.log);
        return;
      }

      const foundGame = Array.from(
        playerGameMap.get(guildId)?.values() ?? []
      ).find((g) => g.getGameId() === game.getGameId());
      if (foundGame !== undefined && foundGame.isInGame()) {
        interaction
          .reply({
            content: "Sorry, there can only be 1 instance of a game at a time!",
          })
          .catch(console.log);
        return;
      }

      game.newGame(interaction, player2 ?? null, (result: GameResult) => {
        playerGameMap.get(guildId)?.delete(userId);
        if (player2) playerGameMap.get(guildId)?.delete(player2.id);
      });
      playerGameMap.get(guildId)?.set(userId, game);
      if (player2) playerGameMap.get(guildId)?.set(player2.id, game);
    } else if (command === "endgame") {
      const playerGame = playerGameMap.get(guildId);
      if (!!playerGame && playerGame.has(userId)) {
        const game = playerGame.get(userId);
        if (game) {
          game.gameOver({ result: ResultType.FORCE_END });
          if (game?.player2) playerGame.delete(game.player2.id);
        }
        playerGame.delete(userId);
        interaction
          .reply({ content: "Your game was ended!" })
          .catch(console.log);
        return;
      }
      interaction
        .reply({ content: "Sorry! You must be in a game first!" })
        .catch(console.log);
      return;
    } else if (command === "listgames") {
      const embed = new DiscordEmbed()
        .setColor("#fc2eff")
        .setTitle("Available Games")
        .setDescription(
          `
                🐍 - Snake (/snake)
                
                🅰️ - Hangman (/hangman)
                
                🔵 - Connect4 (/connect4)
                
                💣 - Minesweeper (/minesweeper)
                
                ♟️ - Chess (/chess)
                
                ❌ - Tic-Tac-Toe (/tictactoe)
                
                🟪 - Flood (/flood)
                
                8️⃣ - 2048 (/2048)
                `
        )
        .setTimestamp();
      interaction.reply({ embeds: [embed] }).catch(console.log);
    } else if (command === "gamesbot") {
      const embed = new DiscordEmbed()
        .setColor("#fc2eff")
        .setTitle("Games Bot")
        .setDescription(
          "Welcome to GamesBot!\n\nThis bot adds lots of little games that you can play right from your Discord chat!\n\nUse `/listgames` to list all available games!\n\nAll games are started via slash commands (ex: `/flood`) and any game can be ended using `/endgame`.\n\nOnly 1 instance of each game may be active at a time and a user can only be playing 1 instance of a game at a time"
        )
        .setTimestamp();
      interaction.reply({ embeds: [embed] }).catch(console.log);
    }

    return;
  }

  if (!userGame) {
    interaction.deferUpdate().catch(console.log);
    return;
  }

  userGame.onInteraction(interaction);
});

client.on("messageReactionAdd", (reaction: DiscordMessageReactionAdd) => {
  const userId = reaction.user_id;
  const userGame = getPlayersGame(reaction.guild_id ?? null, userId);
  if (!userGame) return;

  if (userGame.player1Turn && userId !== userGame.gameStarter.id) return;
  if (
    !userGame.player1Turn &&
    !!userGame.player2?.id &&
    userId !== userGame.player2.id
  )
    return;
  if (
    !userGame.player1Turn &&
    !userGame.player2?.id &&
    userId !== userGame.gameStarter.id
  )
    return;

  userGame.onReaction(reaction);
  reaction.remove();
});

client.on("messageDelete", (message: DiscordMessageDelete) => {
  handleMessageDelete(message.guild_id, message.id);
});

client.on("messageDeleteBulk", (messages: DiscordMessageDeleteBulk) => {
  messages.ids.forEach((id: Snowflake) =>
    handleMessageDelete(messages.guild_id, id)
  );
});

const handleMessageDelete = (
  guild_id: Snowflake | undefined,
  message_id: Snowflake
) => {
  if (!guild_id) return;

  const guidGames = playerGameMap.get(guild_id);
  if (!guidGames) return;

  guidGames.forEach((game: GameBase, userId: Snowflake) => {
    if (game.getMessageId() === message_id)
      game.gameOver({ result: ResultType.DELETED });
  });
};

const getPlayersGame = (
  guildId: Snowflake | null,
  userId: Snowflake
): GameBase | null => {
  if (!guildId) return null;

  const guidGames = playerGameMap.get(guildId);
  if (!guidGames) return null;

  const userGame = guidGames.get(userId);
  if (!userGame) return null;

  return userGame;
};

*/
