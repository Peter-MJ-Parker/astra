import { capitalise } from '#utils';
import {
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    ComponentEmojiResolvable,
} from 'discord.js';

export function createModal(
    id: string,
    title: string,
    components: TextInputBuilder[]
) {
    const rows: ActionRowBuilder<TextInputBuilder>[] = components.map((field) => {
        return new ActionRowBuilder<TextInputBuilder>({
            components: [field],
        });
    });
    return new ModalBuilder({
        custom_id: id.toString(),
        title: capitalise(title).toString(),
        components: rows,
    });
}
export function createButton(
    buttonstyle: "Primary" | "Seconday" | "Success" | "Danger" | "Link",
    label: string,
    emoji: ComponentEmojiResolvable,
    custom_id?: string
) {
    if (buttonstyle === "Link") {
        return new ButtonBuilder({
            label,
            type: ComponentType.Button,
            style: ButtonStyle.Link,
        });
    } else {
        const arr = ["Primary", "Seconday", "Success", "Danger"].forEach((Style) => {

            return new ButtonBuilder({
                custom_id,
                label,
                emoji,
                type: ComponentType.Button,
                // style: Style.
            })
        });

    }
}

export function createButtonRow(components: ButtonBuilder[] = []) {
    if (components.length > 25)
        throw new Error('Cannot attach more than 25 buttons to one message.');
    if (components.length <= 5) {
        return new ActionRowBuilder<ButtonBuilder>({
            components,
        });
    } else {
        components.map((button) => { });
    }
}
