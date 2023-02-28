import fs from "fs";
import axios from "axios";
import { EmbedBuilder, GuildEmoji } from "discord.js";
import { useContainer } from "#Astra";
import pkg from "glob";
const { glob } = pkg;
import { promisify } from "util";
const PG = promisify(glob);
import { load } from "./load.js";
export * from "../google/google.js";

export { welcomeCreate } from "./WelcomeCanvas/welcome.js";
export const logger = () => useContainer("@sern/logger")[0];
export const player = () => useContainer("player");
export { badLinks, autoMute } from "./badLinks.js";

export const rds = fs.readdirSync;
export const env = load({
  DISCORD_TOKEN: String,
  CONNECT: String,
  defaultPrefix: String,
  GENIUS: String,
  SPOTIFY_CLIENT_ID: String,
  SPOTIFY_SECRET: String,
  GIPHY: String,
  ownerIDs: Array,
  GoogleID: String,
  GoogleAPI: String,
});

export async function loadFiles(dir: string) {
  const Files = await PG(`${process.cwd().replace(/\\/g, "/")}/${dir}/**/*.js`);
  Files.forEach((file) => delete require.cache[require.resolve(file)]);
  return Files;
}

export function isPic(str: string, boolean: any) {
  if (boolean) return /\.(jpe?g|png|gif|webp)$/i.test(str);
  if (!boolean) return /\.(jpe?g|png|webp)$/i.test(str);
  else return false;
}

export async function getMeme() {
  let nonNSFW = null;

  while (nonNSFW === null) {
    const response = await axios.get("https://reddit.com/r/memes.json");
    const { data } =
      response.data.data.children[
        Math.floor(Math.random() * response.data.data.children.length)
      ];
    if (data.over_18 === false) nonNSFW = data;
  }

  return new EmbedBuilder()
    .setColor("NotQuiteBlack")
    .setURL("https://reddit.com" + nonNSFW.permalink)
    .setTitle(nonNSFW.title)
    .setDescription(
      `🤖 **Sub-Reddit**: \`r/${nonNSFW.subreddit}\`\n⬆️ **Upvotes**: \`${nonNSFW.ups}\` - ⬇️ **Downvotes**: \`${nonNSFW.downs}\``
    )
    .setFooter({ text: `Meme by ${nonNSFW.author}` })
    .setImage(nonNSFW.url);
}

export async function findEmoji(interaction: any) {
  let emos: object[] = [];
  let math: number;
  let newEmo: any;
  let EMOJI: GuildEmoji;
  await fetch("https://emoji.gg/api/", {
    method: "GET",
  }).then(async (res) => {
    await res.json().then(async (data) => {
      data.forEach((e: any) => {
        emos.push({ name: e.title, url: e.image });
        math = Math.floor(Math.random() * emos.length + 1);
        newEmo = emos[math];
      });
      // EMOJI = await interaction.guild!.emojis.create({
      // 	attachment: `${newEmo.url}`,
      // 	name: newEmo.name,
      // });
      return interaction.reply({
        content: newEmo.url,
      });
    });
  });
}

export async function sticker(interaction: any) {
  await fetch(
    `https://tenor.googleapis.com/v2/search?q=hello&key=${env.GoogleAPI}&limit=1&random=true&searchfilter=sticker`,
    {
      method: "GET",
    }
  ).then(async (res) => {
    let data = await res.json();
    console.log(data);
    await interaction.reply({
      content: data.results[0].itemurl.toString(),
    });
  });
}

export function capitalise(string: string) {
  return string
    .split(" ")
    .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
    .join(" ");
}

export function eventCapitalise(string: string) {
  return string
    .split(" ")
    .map((str) => str.slice(0, 1).toLowerCase() + str.slice(1))
    .join(" ");
}
