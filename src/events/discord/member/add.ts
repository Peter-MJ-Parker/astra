import { EventType, eventModule } from '@sern/handler';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    Events,
    Guild,
    GuildMember,
    TextChannel,
} from 'discord.js';
import { welcomeCreate, IMPwelcomeCreate } from '#utils';
import { client } from '#Astra';
import guildSchema from '#schemas/guild';

export default eventModule({
    type: EventType.Discord,
    name: Events.GuildMemberAdd,
    async execute(member: GuildMember) {
        const Guild = await guildSchema.findOne({ guildId: member.guild.id });
        const guild = (await client.guilds.fetch(Guild?.guildId!)) as Guild;
        const welcomeChannel = (await guild.channels.fetch(
            Guild?.welcome_channel!
        )) as TextChannel;
        const memberCount = guild.members.cache.filter((m) => !m.user.bot).size;

        let mod = member.guild?.channels.cache.get(
            Guild?.memberAdd?.messageEdit?.channelId!
        ) as TextChannel;
        let embeds = [
            new EmbedBuilder({
                author: {
                    name: 'New member joined!',
                    icon_url: member.client.user.displayAvatarURL()!,
                },
                title: member.user.tag,
                thumbnail: { url: member.avatarURL()! },
                fields: [
                    { name: 'ID', value: member.id },
                    {
                        name: 'Verification: ',
                        value: `Pending...`,
                    },
                ],
                footer: {
                    text: 'NOTE: Verify button will bypass any member authentication!',
                },
            }),
        ];

        const components = [
            new ActionRowBuilder<ButtonBuilder>({
                components: ['✅|Verify', '👢|Kick', '💥|Ban'].map((button) => {
                    const [emoji, name] = button.split('|');
                    return new ButtonBuilder({
                        custom_id: `member-${name.toLowerCase().toString()}`,
                        style: ButtonStyle.Danger,
                        label: name.toString(),
                        emoji: emoji.toString(),
                    });
                }),
            }),
        ];
        let msg = await mod.send({
            embeds,
            components,
        });
        await Guild?.updateOne({
            $set: {
                memberAdd: {
                    messageEdit: { channelId: msg.channelId, messageId: msg.id },
                },
            },
        }).then(() => console.log(Guild));

        let _reaction = Guild?.memberAdd?.reaction;
        if (_reaction === false || !_reaction) {
            if (member.guild.id === '986842020662374400') {
                IMPwelcomeCreate(
                    member,
                    member.guild.name,
                    member.guild.systemChannel!
                );
            }
            welcomeCreate(member, guild?.name!, memberCount, welcomeChannel);
        } else if (_reaction === true) {
        }
    },
});
