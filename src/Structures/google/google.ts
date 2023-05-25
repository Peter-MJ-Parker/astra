import { client } from '#Astra';
import { env } from '#utils';
import { v2, v3 } from '@google-cloud/translate';
import { EmbedBuilder } from 'discord.js';
import config from './google-config.json' assert { type: 'json' };
import { langs } from './languages.js';
export { langs };

export class Google extends v3.TranslationServiceClient {
	parent: string;
	mimeType: string;
	constructor() {
		super({ projectId: env.GoogleID, credentials: config });
		this.parent = `projects/${env.GoogleID}/locations/global`;
		this.mimeType = 'text/plain';
	}

	async detected(text: string) {
		const detectRequest = {
			parent: this.parent,
			content: text,
		};

		let languageCode: string = '';
		const [response] = await this.detectLanguage(detectRequest);
		for (const language of response.languages!) {
			languageCode += language.languageCode!;
		}
		return `${languageCode}`;
	}

	async translate(text: string, target: string) {
		const locale = await this.detected(text);
		const translateRequest = {
			parent: this.parent,
			contents: [text],
			mimeType: this.mimeType,
			sourceLanguageCode: `${locale}`,
			targetLanguageCode: `${target}`,
		};
		let newt: string = '';
		const [response] = await this.translateText(translateRequest);
		for (const translation of response.translations!) {
			newt += `${translation.translatedText}`;
		}
		return new EmbedBuilder({
			fields: [
				{
					name: `${await this.textTranslate('Original Language:', locale)}`,
					value: `${locale}`,
				},
				{
					name: `${await this.textTranslate('Target Language:', locale)}`,
					value: `${target}`,
				},
				{
					name: `${await this.textTranslate('Translation:', locale)}`,
					value: `${newt}`,
				},
			],
			footer: {
				text: `${await this.textTranslate(
					'Automatic translation by: ',
					locale
				)} ${client.user?.tag}`,
				icon_url: client.user?.displayAvatarURL(),
			},
		});
	}

	async fullTranslate(text: string, target: string) {}

	async translateEmbed() {
		const newEmbed = new EmbedBuilder();
		return null;
	}

	async textTranslate(text: string, target: string) {
		// Translates the text into the target language. "text" can be a string for
		// translating a single piece of text, or an array of strings for translating
		// multiple texts.
		const translate = new v2.Translate({
			projectId: env.GoogleID,
			credentials: config,
		});
		let [translation] = await translate.translate(text, target);
		return translation;
	}

	async checkSupportedLanguages() {
		const request = {
			parent: this.parent,
		};

		const [response] = await this.getSupportedLanguages(request);
		for (const language of response.languages!) {
			console.log(language.languageCode);
		}
	}
}

// export async function Translate(text: string, target: string) {
//   try {
//     // let call = await detectLanguage(text);
//     // if (call === target) {
//     //   return `Same language`;
//     // }
//     const [translation] = await google().translateText(text, target);
//     console.log(`Text: ${text}`);
//     console.log(`Translation: ${translation}`);
//     return translation;
//   } catch (error) {
//     console.log(error);
//     return `An error occured during translation!`;
//   }
// }

// async function translateText() {
//   // Construct request
//   const request = {
//     parent: `projects/${projectId}/locations/${location}`,
//     contents: [text],
//     mimeType: "text/plain", // mime types: text/plain, text/html
//     sourceLanguageCode: "en",
//     targetLanguageCode: "sr-Latn",
//   };

//   // Run request
//   const [response] = await google().translateText(request);

//   for (const translation of response.translations) {
//     console.log(`Translation: ${translation.translatedText}`);
//   }
// }
