import { EventType, eventModule } from "@sern/handler";
import { Events, Message } from "discord.js";

export default eventModule({
  type: EventType.Discord,
  name: Events.MessageDelete,
  execute(message: Message) {},
});
