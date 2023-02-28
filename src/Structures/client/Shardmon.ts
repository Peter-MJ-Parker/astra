import { env } from "#utils";
import { ShardingManager } from "discord.js";

const manager = new ShardingManager(`${process.cwd()}/dist/Astra.js`, {
	token: env.DISCORD_TOKEN,
});

manager.on("shardCreate", async (shard) => {
	console.log(`Shard online: ` + shard.id);
});

await manager.spawn();
