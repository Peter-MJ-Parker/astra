export const messagesOptions = [
	{
		name: 'bulk_delete',
		description: 'Deletes messages in bulk from a specified channel.',
		type: 1,
		options: [
			{
				name: 'bulk_amount',
				description: 'Amount of messages to delete from channel.',
				type: 10,
				min_value: 1,
				max_value: 100,
				required: true,
			},
			{
				name: 'channel',
				description:
					'Channel to delete messages from. [No choice = current channel]',
				type: 7,
				channel_types: [0, 11, 12],
			},
			{
				name: 'bulk_reason',
				description: 'Reason for purging these messages.',
				type: 3,
			},
		],
	},
	{
		name: 'prune',
		description: 'Deletes recent messages sent by a user.',
		type: 1,
		options: [
			{
				name: 'user',
				description: 'Select the offending user.',
				type: 6,
				required: true,
			},
			{
				name: 'prune_amount',
				description: 'Amount of messages to delete sent by a user.',
				type: 10,
				min_value: 1,
				max_value: 100,
				required: true,
			},
			{
				name: 'offending_channel',
				description: 'Select a channel. [Optional - No channel = Server-wide]',
				type: 7,
				channel_types: [0, 11, 12],
			},
		],
	},
	{
		name: 'move',
		description: 'Moves a message from one channel to another.',
		type: 1,
		options: [
			{
				name: 'message_link',
				description: 'Please provide the message link to move.',
				type: 3,
				required: true,
			},
			{
				name: 'move_reason',
				description: 'Reason for moving this message',
				type: 3,
				required: true,
			},
			{
				name: 'new_channel',
				description: 'Select the Channel to move this message to.',
				type: 7,
				channel_types: [0, 11, 12],
				required: true,
			},
		],
	},
	{
		name: 'edit',
		description: 'Edits a message sent by the bot.',
		type: 1,
		options: [
			{
				name: 'location',
				description: 'Select the Channel where the message is located.',
				type: 7,
				channel_types: [0, 11, 12],
				required: true,
			},
			{
				name: 'message_id',
				description: 'Give me ',
				type: 3,
				required: true,
			},
		],
	},
];

export const messagesCode = {};
