import { env } from "#utils";
import { v2 } from "@google-cloud/translate";
import config from "./google-config.json" assert { type: "json" };
import languages from "./languages.json" assert { type: "json" };

export { languages };
const translate = () =>
  new v2.Translate({
    projectId: env.GoogleID,
    credentials: config,
  });

export async function detectLanguage(content: string) {
  try {
    let response = await translate().detect(content);
    return response[0].language as string;
  } catch (error) {
    console.log(`Error at detectLanguage --> ${error}`);
    return 0;
  }
}

export async function Translate(text: string, target: string) {
  try {
    let call = await detectLanguage(text);
    if (call === target) {
      return `Same language`;
    }
    const [translation] = await translate().translate(text, target);
    console.log(`Locale: ${call}\nText: ${text}`);
    console.log(`Translation: ${translation}`);
    return translation;
  } catch (error) {
    console.log(error);
    return `An error occured during translation!`;
  }
}
