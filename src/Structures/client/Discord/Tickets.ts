import schema from '#schemas/tickets/tickets';

export default class Tickets {
	static async getData() {
		return await schema.findOne({});
	}
	static async addTicket() {}
	static async deleteTicket() {}
}
