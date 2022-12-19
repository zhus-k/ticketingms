import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
	const ticket = Ticket.build({
		title: "test",
		price: 50,
		userId: "123",
	});
	await ticket.save();

	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);

	firstInstance!.set({ price: 10 });
	secondInstance!.set({ price: 20 });

	await firstInstance!.save();

	try {
		await secondInstance!.save();
	} catch (error) {
		return;
	}

	throw new Error("should not be reached");
});

it("increments the version number on multiple saves", async () => {
	const ticket = Ticket.build({
		title: "test",
		price: 50,
		userId: "123",
	});
	await ticket.save();
	expect(ticket.version).toEqual(0);

	await ticket.save();
	expect(ticket.version).toEqual(0);

	ticket.set({ price: 100 });
	await ticket.save();
	expect(ticket.version).toEqual(1);

	ticket.set({ price: 50 });
	await ticket.save();
	expect(ticket.version).toEqual(2);
});
