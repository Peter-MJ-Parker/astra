import { DiscordAPIError, Snowflake } from "discord-minimal";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CacheType,
	CommandInteraction,
	Interaction,
	Message,
	MessageComponentInteraction,
	MessageReaction,
	TextChannel,
	User,
} from "discord.js";

import type { GameContent } from "./game-content.js";
import GameResult, { ResultType } from "./game-result.js";

export default abstract class GameBase {
	protected gameId!: number;
	protected gameType: string;
	protected isMultiplayerGame: boolean;
	protected inGame = false;
	protected result: GameResult | undefined = undefined;
	protected gameMessage: Message | undefined = undefined;
	public gameStarter!: User;
	public player2: User | null = null;
	public player1Turn = true;
	protected onGameEnd: (result: GameResult) => void = () => {};

	protected gameTimeoutId: NodeJS.Timeout | undefined;

	protected abstract getContent(): GameContent;
	protected abstract getGameOverContent(result: GameResult): GameContent;
	public abstract onReaction(reaction: MessageReaction): void;
	public abstract onInteraction(
		interaction: MessageComponentInteraction<CacheType> | undefined
	): void;

	constructor(gameType: string, isMultiplayerGame: boolean) {
		this.gameType = gameType;
		this.isMultiplayerGame = isMultiplayerGame;
	}

	public newGame(
		interaction: MessageComponentInteraction<CacheType>,
		player2: User | null,
		onGameEnd: (result: GameResult) => void
	): void {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this.gameStarter = interaction.user ?? interaction.member!.user!;
		this.player2 = player2;
		this.onGameEnd = onGameEnd;
		this.inGame = true;

		interaction
			.reply({ content: "Game started. Happy Playing!" })
			.catch(console.log);

		const content = this.getContent();
		(interaction.channel as TextChannel)
			?.send({
				embeds: content.embeds!,
				components: content.components!,
			})
			.then((msg) => {
				this.gameMessage = msg;
				this.gameTimeoutId = setTimeout(
					() => this.gameOver({ result: ResultType.TIMEOUT }),
					60000
				);
			})
			.catch((e) => this.handleError(e, "send message/ embed"));
	}

	protected step(edit = false): void {
		if (edit) this.gameMessage?.edit(this.getContent());

		if (this.gameTimeoutId) clearTimeout(this.gameTimeoutId);
		this.gameTimeoutId = setTimeout(
			() => this.gameOver({ result: ResultType.TIMEOUT }),
			60000
		);
	}

	public handleError(e: unknown, perm: string): void {
		if (e instanceof DiscordAPIError) {
			const de = e as DiscordAPIError;
			switch (de.code) {
				case 10003:
					this.gameOver({
						result: ResultType.ERROR,
						error: "Channel not found!",
					});
					break;
				case 10008:
					this.gameOver({
						result: ResultType.DELETED,
						error: "Message was deleted!",
					});
					break;
				case 10062:
					console.log("Unknown Interaction??");
					break;
				case 50001:
					if (this.gameMessage)
						(this.gameMessage.channel as TextChannel)
							.send(
								"The bot is missing access to preform some of it's actions!"
							)
							.catch(() => {
								console.log(
									"Error in the access error handler!"
								);
							});
					else console.log("Error in the access error handler!");

					this.gameOver({
						result: ResultType.ERROR,
						error: "Missing access!",
					});
					break;
				case 50013:
					if (this.gameMessage)
						(this.gameMessage.channel as TextChannel)
							.send(
								`The bot is missing the '${perm}' permissions it needs order to work!`
							)
							.catch(() => {
								console.log(
									"Error in the permission error handler!"
								);
							});
					else console.log("Error in the permission error handler!");

					this.gameOver({
						result: ResultType.ERROR,
						error: "Missing permissions!",
					});
					break;
				default:
					console.log("Encountered a Discord error not handled! ");
					console.log(e);
					break;
			}
		} else {
			this.gameOver({
				result: ResultType.ERROR,
				error: "Game embed missing!",
			});
		}
	}

	public gameOver(
		result: GameResult,
		interaction: MessageComponentInteraction | undefined = undefined
	): void {
		if (!this.inGame) return;

		this.result = result;
		this.inGame = false;

		const gameOverContent = this.getGameOverContent(result);

		if (result.result !== ResultType.FORCE_END) {
			this.onGameEnd(result);
			this.gameMessage
				?.edit(gameOverContent)
				.catch((e) => this.handleError(e, ""));
			this.gameMessage?.reactions.removeAll();
		} else {
			if (interaction)
				interaction
					.update(gameOverContent)
					.catch((e) => this.handleError(e, "update interaction"));
			else
				this.gameMessage
					?.edit(gameOverContent)
					.catch((e) => this.handleError(e, ""));
		}

		if (this.gameTimeoutId) clearTimeout(this.gameTimeoutId);
	}

	protected getWinnerText(result: GameResult): string {
		if (result.result === ResultType.TIE) return "It was a tie!";
		else if (result.result === ResultType.TIMEOUT)
			return "The game went unfinished :(";
		else if (result.result === ResultType.FORCE_END)
			return "The game was ended";
		else if (result.result === ResultType.ERROR)
			return "ERROR: " + result.error;
		else if (result.result === ResultType.WINNER)
			return "`" + result.name + "` has won!";
		else if (result.result === ResultType.LOSER)
			return "`" + result.name + "` has lost!";
		return "";
	}

	public setGameId(id: number): void {
		this.gameId = id;
	}

	public getGameId(): number {
		return this.gameId;
	}

	public getGameType(): string {
		return this.gameType;
	}

	public getMessageId(): Snowflake {
		return this.gameMessage?.id ?? "";
	}

	public isInGame(): boolean {
		return this.inGame;
	}

	public doesSupportMultiplayer(): boolean {
		return this.isMultiplayerGame;
	}

	public createMessageActionRowButton(buttonInfo: string[][]) {
		return new ActionRowBuilder<ButtonBuilder>().addComponents(
			...buttonInfo.map(([id, label]) =>
				new ButtonBuilder()
					.setCustomId(id)
					.setLabel(label)
					.setStyle(ButtonStyle.Secondary)
			)
		);
	}
}
