import { env } from "#utils";
import { v2 } from "@google-cloud/translate";
import config from "./google-config.json" assert { type: "json" };

const translate = () =>
  new v2.Translate({
    projectId: env.GoogleID,
    credentials: config,
  });

async function detectLanguage(content: string) {
  try {
    let response = await translate().detect(content);
    return response[0].language;
  } catch (error) {
    console.log(`Error at detectLanguage --> ${error}`);
    return 0;
  }
}

export async function Translate(text: string, target: string) {
  let call = detectLanguage(text);
  const [translation] = await translate().translate(text, target);
  console.log(`Locale: ${call}\nText: ${text}`);
  console.log(`Translation: ${translation}`);
}
