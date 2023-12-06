import { EventType, eventModule } from "@sern/handler";
import { Events, GuildMember } from "discord.js";

export default eventModule({
  type: EventType.Discord,
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember) {},
});
