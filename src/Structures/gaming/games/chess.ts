import GameBase from "../src/game-base.js";
import GameResult, { ResultType } from "../src/game-result.js";
import type Position from "../src/position.js";
import type { GameContent } from "../src/game-content.js";
import {
	DiscordUser,
	DiscordEmbed,
	DiscordMessageReactionAdd,
	DiscordInteraction,
	DiscordSelectMenu,
	DiscordSelectOption,
	DiscordMessageButton,
	DiscordButtonStyle,
} from "discord-minimal";
import {
	ActionRowBuilder,
	BaseInteraction,
	ButtonBuilder,
	ButtonStyle,
	CacheType,
	EmbedBuilder,
	Interaction,
	MessageComponentInteraction,
	MessageReaction,
	StringSelectMenuBuilder,
	User,
} from "discord.js";

export default class ChessGame extends GameBase {
	private gameBoard: number[] = [];
	private aiMoveStack: Move[] = [];

	private selectedMove: Move = { fx: 0, fy: 0, tx: 0, ty: 0, replaced: -1 };
	private message = "\u200b";

	constructor() {
		super("chess", true);
	}

	private getGameDesc(): string {
		return (
			"**Welcome to Chess!**\n" +
			"- To play simply use the reactions provided to first select your piece you want to move\n" +
			"- Next hit the check reaction\n" +
			"- Now select where you want that piece to be moved!\n" +
			"- To go back to the piece selection hit the back reaction!\n" +
			"- Hit the check reaction to confirm your movement!\n" +
			"- If the piece dose not move check below to possibly see why!\n" +
			"- You do play against an AI, however the AI is not particularly very smart!\n" +
			"- There is no castling and you must actually take the king to win!\n"
		);
	}

	public newGame(
		interaction: MessageComponentInteraction<CacheType>,
		player2: User | null,
		onGameEnd: (result: GameResult) => void
	): void {
		if (super.isInGame()) return;

		this.gameBoard = [
			2, 3, 4, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 11, 11, 11, 11, 11, 11, 11, 11, 12, 13, 14, 15, 16, 14, 13,
			12,
		];

		this.player1Turn = true;
		this.selectedMove = { fx: 0, fy: 0, tx: 0, ty: 0, replaced: -1 };
		this.message = "\u200b";

		super.newGame(interaction, player2, onGameEnd);
	}

	protected getContent(): GameContent {
		const row1 =
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				new StringSelectMenuBuilder({
					custom_id: "from_letter",
				}).addOptions(
					new DiscordSelectOption("From A", "0").setDefault(
						this.selectedMove.fx === 0
					),
					new DiscordSelectOption("From B", "1").setDefault(
						this.selectedMove.fx === 1
					),
					new DiscordSelectOption("From C", "2").setDefault(
						this.selectedMove.fx === 2
					),
					new DiscordSelectOption("From D", "3").setDefault(
						this.selectedMove.fx === 3
					),
					new DiscordSelectOption("From E", "4").setDefault(
						this.selectedMove.fx === 4
					),
					new DiscordSelectOption("From F", "5").setDefault(
						this.selectedMove.fx === 5
					),
					new DiscordSelectOption("From G", "6").setDefault(
						this.selectedMove.fx === 6
					),
					new DiscordSelectOption("From H", "7").setDefault(
						this.selectedMove.fx === 7
					)
				)
			);
		const row2 =
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				new StringSelectMenuBuilder({
					custom_id: "from_number",
				}).addOptions(
					new DiscordSelectOption("From 1", "0").setDefault(
						this.selectedMove.fy === 0
					),
					new DiscordSelectOption("From 2", "1").setDefault(
						this.selectedMove.fy === 1
					),
					new DiscordSelectOption("From 3", "2").setDefault(
						this.selectedMove.fy === 2
					),
					new DiscordSelectOption("From 4", "3").setDefault(
						this.selectedMove.fy === 3
					),
					new DiscordSelectOption("From 5", "4").setDefault(
						this.selectedMove.fy === 4
					),
					new DiscordSelectOption("From 6", "5").setDefault(
						this.selectedMove.fy === 5
					),
					new DiscordSelectOption("From 7", "6").setDefault(
						this.selectedMove.fy === 6
					),
					new DiscordSelectOption("From 8", "7").setDefault(
						this.selectedMove.fy === 7
					)
				)
			);
		const row3 =
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				new StringSelectMenuBuilder({
					custom_id: "to_letter",
				}).addOptions(
					new DiscordSelectOption("To A", "0").setDefault(
						this.selectedMove.tx === 0
					),
					new DiscordSelectOption("To B", "1").setDefault(
						this.selectedMove.tx === 1
					),
					new DiscordSelectOption("To C", "2").setDefault(
						this.selectedMove.tx === 2
					),
					new DiscordSelectOption("To D", "3").setDefault(
						this.selectedMove.tx === 3
					),
					new DiscordSelectOption("To E", "4").setDefault(
						this.selectedMove.tx === 4
					),
					new DiscordSelectOption("To F", "5").setDefault(
						this.selectedMove.tx === 5
					),
					new DiscordSelectOption("To G", "6").setDefault(
						this.selectedMove.tx === 6
					),
					new DiscordSelectOption("To H", "7").setDefault(
						this.selectedMove.tx === 7
					)
				)
			);
		const row4 =
			new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
				new StringSelectMenuBuilder({
					custom_id: "to_number",
				}).addOptions(
					new DiscordSelectOption("To 1", "0").setDefault(
						this.selectedMove.ty === 0
					),
					new DiscordSelectOption("To 2", "1").setDefault(
						this.selectedMove.ty === 1
					),
					new DiscordSelectOption("To 3", "2").setDefault(
						this.selectedMove.ty === 2
					),
					new DiscordSelectOption("To 4", "3").setDefault(
						this.selectedMove.ty === 3
					),
					new DiscordSelectOption("To 5", "4").setDefault(
						this.selectedMove.ty === 4
					),
					new DiscordSelectOption("To 6", "5").setDefault(
						this.selectedMove.ty === 5
					),
					new DiscordSelectOption("To 7", "6").setDefault(
						this.selectedMove.ty === 6
					),
					new DiscordSelectOption("To 8", "7").setDefault(
						this.selectedMove.ty === 7
					)
				)
			);
		const row5 = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("confirm")
				.setLabel("Confirm")
				.setStyle(ButtonStyle.Secondary)
		);
		return {
			embeds: [
				new EmbedBuilder()
					.setColor("#d6b881")
					.setTitle("Chess")
					.setDescription(this.getGameDesc())
					.addFields(
						{ name: "Turn:", value: this.getDisplayForTurn() },
						{ name: "Message:", value: this.message }
					)
					.setImage(
						`https://api.theturkey.dev/discordgames/genchessboard?gb=${this.gameBoard.join(
							","
						)}&s1=${this.selectedMove.fx},${
							this.selectedMove.fy
						}&s2=${this.selectedMove.tx},${this.selectedMove.ty}`
					)
					.setFooter({
						text: `Currently Playing: ${this.gameStarter.username}`,
					})
					.setTimestamp(),
			],
			components: [row1, row2, row3, row4, row5],
		};
	}

	protected getGameOverContent(result: GameResult): GameContent {
		return {
			embeds: [
				new EmbedBuilder()
					.setColor("#d6b881")
					.setTitle("Chess")
					.setDescription("GAME OVER! " + this.getWinnerText(result))
					.setImage(
						`https://api.theturkey.dev/discordgames/genchessboard?gb=${this.gameBoard.join(
							","
						)}&s1=${this.selectedMove.fx},${
							this.selectedMove.fy
						}&s2=${this.selectedMove.tx},${this.selectedMove.ty}`
					)
					.setTimestamp(),
			],
			components: [],
		};
	}

	private endTurn(): void {
		let blackKing = false;
		let whiteKing = false;

		this.gameBoard.forEach((p) => {
			if (p == 6) blackKing = true;
			else if (p == 16) whiteKing = true;
		});

		if (!blackKing || !whiteKing) {
			this.gameOver({
				result: ResultType.WINNER,
				name: this.getDisplayForTurn(),
				score: this.gameBoard.join(","),
			});
		}

		this.player1Turn = !this.player1Turn;

		if (!this.player1Turn && this.player2 == null && this.isInGame()) {
			this.makeBestMove();
			this.endTurn();
		}
	}

	public onReaction(reaction: MessageReaction): void {}

	public onInteraction(interaction: any): void {
		const id = interaction.customId;
		const val = interaction.isButton()
			? ""
			: (interaction.values[0] as string);

		switch (id) {
			case "confirm":
				// eslint-disable-next-line no-case-declarations
				const fromIndex =
					this.selectedMove.fy * 8 + this.selectedMove.fx;
				// eslint-disable-next-line no-case-declarations
				const fromPiece = this.gameBoard[fromIndex];
				// eslint-disable-next-line no-case-declarations
				const toIndex = this.selectedMove.ty * 8 + this.selectedMove.tx;
				if (
					(fromPiece >= 10 && this.player1Turn) ||
					(fromPiece > 0 && fromPiece < 10 && !this.player1Turn)
				) {
					this.message = "\u200b";
					const moveInfo = this.canPieceMoveTo(
						fromPiece,
						this.selectedMove
					);
					if (moveInfo.valid) {
						this.gameBoard[fromIndex] = 0;
						this.gameBoard[toIndex] = fromPiece;
						this.selectedMove = {
							fx: -1,
							fy: -1,
							tx: -1,
							ty: -1,
							replaced: -1,
						};
						this.endTurn();
					} else {
						this.message = moveInfo.msg;
					}
				} else if (fromPiece == 0) {
					this.message = "There is no piece at that location!";
				} else {
					this.message = "You cannot move that piece!";
				}
				break;
			case "from_letter":
				this.selectedMove.fx = parseInt(val);
				break;
			case "from_number":
				this.selectedMove.fy = parseInt(val);
				break;
			case "to_letter":
				this.selectedMove.tx = parseInt(val);
				break;
			case "to_number":
				this.selectedMove.ty = parseInt(val);
				break;
		}

		this.step(false);
		interaction
			.update(
				this.result
					? this.getGameOverContent(this.result)
					: this.getContent()
			)
			.catch((e: unknown) => super.handleError(e, "update interaction"));
	}

	private canPieceMoveTo(piece: number, selectedMove: Move): MoveCheck {
		const blackPiece = piece < 10;

		switch (piece % 10) {
			case 1:
				return this.checkPawnMove(blackPiece, selectedMove);
			case 2:
				return this.checkRookMove(blackPiece, selectedMove);
			case 3:
				return this.checkKnightMove(blackPiece, selectedMove);
			case 4:
				return this.checkBishopMove(blackPiece, selectedMove);
			case 5:
				// eslint-disable-next-line no-case-declarations
				const rookMove = this.checkRookMove(blackPiece, selectedMove);
				if (rookMove.valid)
					return this.checkBishopMove(blackPiece, selectedMove);
				return rookMove;
			case 6:
				return this.checkKingMove(blackPiece, selectedMove);
		}
		return { valid: false, msg: "Invalid Piece!" };
	}

	private checkPawnMove(blackPiece: boolean, selectedMove: Move): MoveCheck {
		const xDiff = selectedMove.fx - selectedMove.tx;
		const yDiff = selectedMove.fy - selectedMove.ty;
		const pieceAt = this.gameBoard[selectedMove.ty * 8 + selectedMove.tx];
		if (
			pieceAt != 0 &&
			((blackPiece && pieceAt < 10) || (!blackPiece && pieceAt > 10))
		)
			return { valid: false, msg: "You already have a piece there!" };

		const pieceAtDiff =
			pieceAt != 0 &&
			((blackPiece && pieceAt > 10) || (!blackPiece && pieceAt < 10));

		if (Math.abs(xDiff) > 1) {
			return { valid: false, msg: "A Pawn cannot move like that!" };
		} else if (xDiff == 0) {
			if (yDiff > 0 && !blackPiece) {
				const checkJump = this.checkJumps([
					{ x: selectedMove.fx, y: selectedMove.fy - 1 },
				]);
				if (checkJump.valid) {
					if (
						(yDiff == 2 && selectedMove.fy == 6) ||
						(yDiff == 1 && !pieceAtDiff)
					)
						return {
							valid: true,
							msg: "A Pawn cannot top that position!",
						};
					return { valid: false, msg: "\u200b" };
				} else {
					return checkJump;
				}
			} else if (yDiff < 0 && blackPiece) {
				const checkJump = this.checkJumps([
					{ x: selectedMove.fx, y: selectedMove.fy + 1 },
				]);
				if (checkJump.valid) {
					if (
						(yDiff == -2 && selectedMove.fy == 1) ||
						(yDiff == -1 && !pieceAtDiff)
					)
						return {
							valid: true,
							msg: "A Pawn cannot top that position!",
						};
					return { valid: false, msg: "\u200b" };
				} else {
					return checkJump;
				}
			} else {
				return {
					valid: false,
					msg: "A Pawn cannot top that position!",
				};
			}
		} else {
			if (Math.abs(yDiff) == 1 && pieceAtDiff)
				return { valid: true, msg: "\u200b" };
			return { valid: false, msg: "You cannot take that piece!" };
		}
	}

	private checkRookMove(blackPiece: boolean, selectedMove: Move): MoveCheck {
		const xDiff = selectedMove.fx - selectedMove.tx;
		const yDiff = selectedMove.fy - selectedMove.ty;
		const pieceAt = this.gameBoard[selectedMove.ty * 8 + selectedMove.tx];
		const pieceAtDiff =
			pieceAt == 0 ||
			(blackPiece && pieceAt > 10) ||
			(!blackPiece && pieceAt < 10);

		if (xDiff != 0 && yDiff == 0 && pieceAtDiff) {
			const betweenPos = [];
			const inc = -(xDiff / Math.abs(xDiff));
			for (let i = selectedMove.fx + inc; i != selectedMove.tx; i += inc)
				betweenPos.push({ x: i, y: selectedMove.fy });
			return this.checkJumps(betweenPos);
		} else if (yDiff != 0 && xDiff == 0 && pieceAtDiff) {
			const betweenPos = [];
			const inc = -(yDiff / Math.abs(yDiff));
			for (let i = selectedMove.fy + inc; i != selectedMove.ty; i += inc)
				betweenPos.push({ x: selectedMove.fx, y: i });
			return this.checkJumps(betweenPos);
		}
		return { valid: false, msg: "A Rook cannot move like that" };
	}

	private checkKnightMove(
		blackPiece: boolean,
		selectedMove: Move
	): MoveCheck {
		const xDiff = selectedMove.fx - selectedMove.tx;
		const yDiff = selectedMove.fy - selectedMove.ty;
		const pieceAt = this.gameBoard[selectedMove.ty * 8 + selectedMove.tx];
		const pieceAtDiff =
			pieceAt == 0 ||
			(blackPiece && pieceAt > 10) ||
			(!blackPiece && pieceAt < 10);
		if (Math.abs(xDiff) == 2 && Math.abs(yDiff) == 1 && pieceAtDiff)
			return { valid: true, msg: "\u200b" };
		else if (Math.abs(xDiff) == 1 && Math.abs(yDiff) == 2 && pieceAtDiff)
			return { valid: true, msg: "\u200b" };
		return { valid: false, msg: "A Knight cannot move like that" };
	}

	private checkBishopMove(
		blackPiece: boolean,
		selectedMove: Move
	): MoveCheck {
		const xDiff = selectedMove.fx - selectedMove.tx;
		const yDiff = selectedMove.fy - selectedMove.ty;
		const pieceAt = this.gameBoard[selectedMove.ty * 8 + selectedMove.tx];
		const pieceAtDiff =
			pieceAt == 0 ||
			(blackPiece && pieceAt > 10) ||
			(!blackPiece && pieceAt < 10);

		if (Math.abs(xDiff) == Math.abs(yDiff) && pieceAtDiff) {
			const betweenPos = [];
			const incX = -(xDiff / Math.abs(xDiff));
			const incY = -(yDiff / Math.abs(yDiff));
			let j = selectedMove.fy + incY;
			for (
				let i = selectedMove.fx + incX;
				i != selectedMove.tx;
				i += incX
			) {
				betweenPos.push({ x: i, y: j });
				j += incY;
			}
			return this.checkJumps(betweenPos);
		}
		return { valid: false, msg: "A Bishop cannot move like that" };
	}

	private checkKingMove(blackPiece: boolean, selectedMove: Move): MoveCheck {
		const xDiff = selectedMove.fx - selectedMove.tx;
		const yDiff = selectedMove.fy - selectedMove.ty;
		const pieceAt = this.gameBoard[selectedMove.ty * 8 + selectedMove.tx];
		const pieceAtDiff =
			pieceAt == 0 ||
			(blackPiece && pieceAt > 10) ||
			(!blackPiece && pieceAt < 10);

		if (Math.abs(xDiff) <= 1 && Math.abs(yDiff) <= 1 && pieceAtDiff) {
			return { valid: true, msg: "\u200b" };
		}
		return { valid: false, msg: "A King cannot move like that" };
	}

	private checkJumps(positions: Position[]): MoveCheck {
		for (let i = 0; i < positions.length; i++)
			if (this.gameBoard[positions[i].y * 8 + positions[i].x] != 0)
				return {
					valid: false,
					msg:
						"Cannot jump over piece at " +
						positions[i].x +
						", " +
						positions[i].y,
				};
		return { valid: true, msg: "\u200b" };
	}

	private makeBestMove(): void {
		const depth = 4;
		const bestMove: Move = this.minimaxRoot(depth, true);
		this.gameBoard[bestMove.ty * 8 + bestMove.tx] =
			this.gameBoard[bestMove.fy * 8 + bestMove.fx];
		this.gameBoard[bestMove.fy * 8 + bestMove.fx] = 0;
	}

	private minimaxRoot(depth: number, isMaximizingPlayer: boolean): Move {
		const newGameMoves: Move[] = this.getValidMoves();
		let bestMove = -9999;
		let bestMoveFound!: Move;

		newGameMoves.forEach((gameMove) => {
			this.makeTempMove(gameMove);
			const value: number = this.minimax(
				depth - 1,
				-10000,
				10000,
				!isMaximizingPlayer
			);
			this.undoTempMove();
			if (value >= bestMove) {
				bestMove = value;
				bestMoveFound = gameMove;
			}
		});
		return bestMoveFound;
	}

	private minimax(
		depth: number,
		alpha: number,
		beta: number,
		isMaximizingPlayer: boolean
	): number {
		if (depth === 0) return -this.evaluateBoard();

		const newGameMoves: Move[] = this.getValidMoves();

		let bestMove: number = isMaximizingPlayer ? -9999 : 9999;
		newGameMoves.forEach((gameMove) => {
			this.makeTempMove(gameMove);

			if (isMaximizingPlayer) {
				bestMove = Math.max(
					bestMove,
					this.minimax(depth - 1, alpha, beta, !isMaximizingPlayer)
				);
				this.undoTempMove();
				alpha = Math.max(alpha, bestMove);
			} else {
				bestMove = Math.min(
					bestMove,
					this.minimax(depth - 1, alpha, beta, !isMaximizingPlayer)
				);
				this.undoTempMove();
				beta = Math.min(beta, bestMove);
			}

			if (beta <= alpha) return bestMove;
		});
		return bestMove;
	}

	private evaluateBoard(): number {
		let totalEvaluation = 0;
		for (let x = 0; x < 8; x++)
			for (let y = 0; y < 8; y++)
				totalEvaluation =
					totalEvaluation +
					this.getPieceValue(this.gameBoard[y * 8 + x], x, y);
		return totalEvaluation;
	}

	private getPieceValue(piece: number, x: number, y: number): number {
		if (piece == 0) return 0;

		const absoluteValue = this.getAbsoluteValue(piece, piece < 10, x, y);
		return piece < 10 ? absoluteValue : -absoluteValue;
	}

	private getAbsoluteValue(
		piece: number,
		isWhite: boolean,
		x: number,
		y: number
	): number {
		switch (piece % 10) {
			case 1:
				return (
					10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x])
				);
			case 2:
				return (
					50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x])
				);
			case 3:
				return 30 + knightEval[y][x];
			case 4:
				return (
					30 +
					(isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x])
				);
			case 5:
				return 90 + evalQueen[y][x];
			case 6:
				return (
					900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x])
				);
			default:
				throw "Unknown piece type: " + piece;
		}
	}

	private getValidMoves(): Move[] {
		const validMoves: Move[] = [];
		for (let x = 0; x < 8; x++) {
			for (let y = 0; y < 8; y++) {
				const piece = this.gameBoard[y * 8 + x];
				if (piece != 0 && piece < 10) {
					for (let tx = 0; tx < 8; tx++) {
						for (let ty = 0; ty < 8; ty++) {
							const move: Move = {
								fx: x,
								fy: y,
								tx: tx,
								ty: ty,
								replaced: -1,
							};
							if (this.canPieceMoveTo(piece, move).valid) {
								validMoves.push(move);
							}
						}
					}
				}
			}
		}
		return validMoves;
	}

	private makeTempMove(move: Move): void {
		move.replaced = this.gameBoard[move.ty * 8 + move.tx];
		this.aiMoveStack.push(move);
		const piece = this.gameBoard[move.fy * 8 + move.fx];
		this.gameBoard[move.fy * 8 + move.fx] = 0;
		this.gameBoard[move.ty * 8 + move.tx] = piece;
	}

	private undoTempMove(): void {
		const move = this.aiMoveStack.pop();
		if (move !== undefined) {
			this.gameBoard[move.fy * 8 + move.fx] =
				this.gameBoard[move.ty * 8 + move.tx];
			this.gameBoard[move.ty * 8 + move.tx] = move.replaced;
		}
	}

	private getDisplayForTurn(): string {
		return this.player1Turn
			? this.gameStarter.username
			: this.player2
			? this.player2?.username ?? "ERR"
			: "CPU";
	}
}

const pawnEvalWhite: number[][] = [
	[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
	[5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
	[1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
	[0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
	[0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
	[0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
	[0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
	[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
];

const pawnEvalBlack: number[][] = pawnEvalWhite.slice().reverse();

const knightEval: number[][] = [
	[-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
	[-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
	[-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
	[-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
	[-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
	[-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
	[-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
	[-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
];

const bishopEvalWhite: number[][] = [
	[-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
	[-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
	[-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
	[-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
	[-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
	[-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
	[-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
	[-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
];

const bishopEvalBlack: number[][] = bishopEvalWhite.slice().reverse();

const rookEvalWhite: number[][] = [
	[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
	[0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
];

const rookEvalBlack: number[][] = rookEvalWhite.slice().reverse();

const evalQueen: number[][] = [
	[-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
	[-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
	[-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
	[-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
	[0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
	[-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
	[-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
	[-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
];

const kingEvalWhite: number[][] = [
	[-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	[-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	[-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	[-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	[-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
	[-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
	[2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
	[2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
];

const kingEvalBlack: number[][] = kingEvalWhite.slice().reverse();

interface Move {
	fx: number;
	fy: number;
	tx: number;
	ty: number;
	replaced: number;
}

interface MoveCheck {
	valid: boolean;
	msg: string;
}
