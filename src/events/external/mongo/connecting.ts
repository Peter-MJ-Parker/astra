import { logger } from "#utils";
import { EventType, eventModule } from "@sern/handler";

export default eventModule({
  type: EventType.External,
  name: "connecting",
  emitter: "mongoose",
  plugins: [],
  execute() {
    logger().info("[DATABASE] - Mongoose is connecting...");
  },
});
