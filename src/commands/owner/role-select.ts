import { publish } from '#plugins';
import { commandModule, CommandType } from '@sern/handler';
import { ActionRowBuilder, RoleSelectMenuBuilder } from 'discord.js';

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description: 'Select a role',
  options: [],
  execute: async (ctx, options) => {
    await ctx.reply({
      components: [
        new ActionRowBuilder<RoleSelectMenuBuilder>({
          components: [
            new RoleSelectMenuBuilder({
              custom_id: 'setup-menu',
              placeholder: 'Select a role'
            })
          ]
        })
      ]
    })
  },
});