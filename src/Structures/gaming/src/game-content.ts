import type {
	ActionRowBuilder,
	EmbedBuilder,
	MessageActionRowComponentBuilder,
} from "discord.js";

export interface GameContent {
	embeds?: EmbedBuilder[];
	components: ActionRowBuilder<MessageActionRowComponentBuilder>[];
}
