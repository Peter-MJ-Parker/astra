import GameBase from "../src/game-base.js";
import GameResult, { ResultType } from "../src/game-result.js";
import fetch from "node-fetch";
import type { GameContent } from "../src/game-content.js";
import {
	CacheType,
	CommandInteraction,
	EmbedBuilder,
	Interaction,
	MessageComponentInteraction,
	MessageReaction,
	User,
} from "discord.js";

//unicode fun...
const reactions = new Map([
	["🅰️", "A"],
	["🇦", "A"],
	["🅱️", "B"],
	["🇧", "B"],
	["🇨", "C"],
	["🇩", "D"],
	["🇪", "E"],
	["🇫", "F"],
	["🇬", "G"],
	["🇭", "H"],
	["ℹ️", "I"],
	["🇮", "I"],
	["🇯", "J"],
	["🇰", "K"],
	["🇱", "L"],
	["Ⓜ️", "M"],
	["🇲", "M"],
	["🇳", "N"],
	["🅾️", "O"],
	["⭕", "O"],
	["🇴", "O"],
	["🅿️", "P"],
	["🇵", "P"],
	["🇶", "Q"],
	["🇷", "R"],
	["🇸", "S"],
	["🇹", "T"],
	["🇺", "U"],
	["🇻", "V"],
	["🇼", "W"],
	["✖️", "X"],
	["❎", "X"],
	["❌", "X"],
	["🇽", "X"],
	["🇾", "Y"],
	["💤", "Z"],
	["🇿", "Z"],
]);

export default class HangmanGame extends GameBase {
	private word = "";
	private guessed: string[] = [];
	private wrongs = 0;

	constructor() {
		super("hangman", false);
	}

	public newGame(
		interaction: MessageComponentInteraction<CacheType>,
		player2: User | null,
		onGameEnd: (result: GameResult) => void
	): void {
		if (this.inGame) return;

		fetch("https://api.theturkey.dev/randomword")
			.then((resp) => resp.text())
			.then((word) => {
				this.word = word.toUpperCase();
				this.guessed = [];
				this.wrongs = 0;

				super.newGame(interaction, player2, onGameEnd);
			})
			.catch(console.log);
	}

	protected getContent(): GameContent {
		return {
			embeds: [
				new EmbedBuilder()
					.setColor("#db9a00")
					.setTitle("Hangman")
					.setDescription(this.getDescription())
					.addFields(
						{
							name: "Letters Guessed",
							value:
								this.guessed.length == 0
									? "\u200b"
									: this.guessed.join(" "),
						},
						{
							name: "How To Play",
							value: "React to this message using the emojis that look like letters (🅰️, 🇹, )",
						}
					)
					.setFooter({
						text: `Currently Playing: ${this.gameStarter.username}`,
					})
					.setTimestamp(),
			],
			components: [],
		};
	}

	protected getGameOverContent(result: GameResult): GameContent {
		return {
			embeds: [
				new EmbedBuilder()
					.setColor("#db9a00")
					.setTitle("Hangman")
					.setDescription(
						`${this.getWinnerText(result)}\n\nThe Word was:\n${
							this.word
						}\n\n${this.getDescription()}`
					)
					.setTimestamp(),
			],
			components: [],
		};
	}

	private makeGuess(reaction: string) {
		if (reactions.has(reaction)) {
			const letter = reactions.get(reaction);
			if (letter === undefined) return;

			if (!this.guessed.includes(letter)) {
				this.guessed.push(letter);

				if (this.word.indexOf(letter) == -1) {
					this.wrongs++;

					if (this.wrongs == 5) {
						this.gameOver({
							result: ResultType.LOSER,
							name: this.gameStarter.username,
							score: this.word,
						});
						return;
					}
				} else if (
					!this.word
						.split("")
						.map((l) => (this.guessed.includes(l) ? l : "_"))
						.includes("_")
				) {
					this.gameOver({
						result: ResultType.WINNER,
						name: this.gameStarter.username,
						score: this.word,
					});
					return;
				}
			}
		}

		this.step(true);
	}

	private getDescription(): string {
		return (
			"```" +
			"|‾‾‾‾‾‾|   \n|     " +
			(this.wrongs > 0 ? "🎩" : " ") +
			"   \n|     " +
			(this.wrongs > 1 ? "😟" : " ") +
			"   \n|     " +
			(this.wrongs > 2 ? "👕" : " ") +
			"   \n|     " +
			(this.wrongs > 3 ? "🩳" : " ") +
			"   \n|    " +
			(this.wrongs > 4 ? "👞👞" : " ") +
			"   \n|     \n|__________\n\n" +
			this.word
				.split("")
				.map((l) => (this.guessed.includes(l) ? l : "_"))
				.join(" ") +
			"```"
		);
	}

	public onReaction(reaction: MessageReaction): void {
		const reactName = reaction.emoji.name;
		if (reactName) this.makeGuess(reactName);
		else this.step(true);
	}

	public onInteraction(
		interaction: MessageComponentInteraction<CacheType>
	): void {}
}
