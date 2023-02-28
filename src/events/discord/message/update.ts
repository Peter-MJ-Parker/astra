import { EventType, eventModule } from "@sern/handler";
import { Events, Message, PartialMessage } from "discord.js";

export default eventModule({
  type: EventType.Discord,
  name: Events.MessageUpdate,
  execute(
    oldMessage: Message | PartialMessage,
    newMessage: Message | PartialMessage
  ) {},
});
