import { disable, publish } from '#plugins';
import { commandModule, CommandType } from '@sern/handler';
import {
	ApplicationCommandOptionType,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js';
import { createModal } from '#utils';

export default commandModule({
	type: CommandType.Slash,
	plugins: [disable()],
	description: 'Manage your custom modals.',
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: 'mod',
			description: 'What would you like to do?',
			required: true,
			autocomplete: true,
			command: {
				onEvent: [],
				async execute(ctx) {
					const focusedValue = ctx.options.getFocused();
					const choices = ['new', 'edit', 'delete'];
					const filtered = choices.filter((choice) =>
						choice.startsWith(focusedValue)
					);
					await ctx.respond(
						filtered.map((choice) => ({
							name: choice,
							value: choice,
						}))
					);
				},
			},
		},
	],
	execute: async ({ interaction }, [, options]) => {
		const choice = options.getString('mod', true);
		if (!choice) return null;
		switch (choice) {
			case 'new':
				const text: TextInputBuilder[] = [
					new TextInputBuilder({
						custom_id: 'first',
						label: 'First',
						placeholder: 'First',
						style: TextInputStyle.Short,
						required: true,
						type: 4,
					}),

					new TextInputBuilder({
						custom_id: 'second',
						label: 'Second',
						placeholder: 'Second',
						style: 1,
						required: true,
						type: 4,
					}),
				];

				try {
					text.forEach(async (val, i) => {
						const requiredItems = [
							val.data.custom_id,
							val.data.label,
							val.data.placeholder,
							val.data.style,
							val.data.required,
						];
						if (!requiredItems.some((x) => {}))
							return await interaction.reply({
								content: `Field \`${text[i].data.label}\` is missing required item(s): ${val.data}. Please review.`,
							});
					});
					const modal = createModal('12222', 'This is a test modal', text);
					await interaction.showModal(modal);
				} catch (error: any) {
					console.log(error);
				}

				break;
			case 'edit':
				break;
			case 'delete':
				break;
		}
	},
});
