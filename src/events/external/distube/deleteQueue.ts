import { EventType, eventModule } from "@sern/handler";
import { Events } from "distube";

export default eventModule({
  type: EventType.External,
  emitter: "player",
  name: Events.DELETE_QUEUE,
  execute() {},
});
