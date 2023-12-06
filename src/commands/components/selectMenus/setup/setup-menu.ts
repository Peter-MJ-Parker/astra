import { commandModule, CommandType } from '@sern/handler';

export default commandModule({
  type: CommandType.RoleSelect,
  plugins: [],
  description: '',
  execute: async (ctx) => {
    console.log(ctx)
    await ctx.reply({
      embeds: [
        {
          description: `\`\`\`${JSON.stringify(ctx.user, null, 4)}\`\`\``
        }
      ]
    })
  },
});
