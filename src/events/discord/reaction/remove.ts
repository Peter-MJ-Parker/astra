import { EventType, eventModule } from "@sern/handler";
import { Events } from "discord.js";

export default eventModule({
  type: EventType.Discord,
  name: Events.MessageReactionRemove,
  async execute() {},
});
