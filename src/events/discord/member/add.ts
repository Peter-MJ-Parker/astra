import { EventType, eventModule } from "@sern/handler";
import { Events, Guild, GuildMember, TextChannel } from "discord.js";
import { welcomeCreate } from "#utils";
import { client } from "#Astra";
import db from "../../../Structures/mongo/schemas/guild.js";

export default eventModule({
	type: EventType.Discord,
	name: Events.GuildMemberAdd,
	async execute(member: GuildMember) {
		const Guild = await db.findOne({ id: member.guild.id });
		const guild = (await client.guilds.fetch(
			`716249660838379541`
		)) as Guild;
		const welcomeChannel = (await guild.channels.fetch(
			`1079286439671513118`
		)) as TextChannel;
		const memberCount = guild.members.cache.filter((m) => !m.user.bot).size;
		welcomeCreate(member, guild?.name!, memberCount, welcomeChannel);
	},
});
