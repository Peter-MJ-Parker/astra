import { logger } from "#utils";
import { EventType, eventModule } from "@sern/handler";
import pkg from "mongoose";
const { connection } = pkg;

export default eventModule({
  type: EventType.External,
  name: "connected",
  emitter: "mongoose",
  plugins: [],
  execute() {
    logger().success(
      `[DATABASE] - Mongoose has successfully connected to: ${connection.name}`
    );
  },
});
