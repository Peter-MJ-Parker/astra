import { ASTRA } from "#client";
import { Sern, Dependencies, Singleton, single } from "@sern/handler";
import { Sparky } from "#handler";
import pkg from "mongoose";
import { MusicPlayer } from "#music";

export const client = new ASTRA();

interface MyDependencies extends Dependencies {
	"@sern/client": Singleton<ASTRA>;
	"@sern/logger": Singleton<Sparky>;
	mongoose: Singleton<pkg.Connection>;
	player: Singleton<MusicPlayer>;
}

export const useContainer = Sern.makeDependencies<MyDependencies>({
	build: (root) =>
		root
			.add({ "@sern/client": single(() => client) })
			.upsert({
				"@sern/logger": single(() => new Sparky("debug", "highlight")),
			})
			.add({ mongoose: single(() => pkg.connection) })
			.add({ player: single(() => new MusicPlayer(client)) }),
});

client.start(useContainer);
