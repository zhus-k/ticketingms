import { faker } from "@faker-js/faker";
import { generateEvent } from "../../test/helpers";
import { Event } from "../event";

it("implements optimistic concurrency control", async () => {
	const randEvent = generateEvent();
	const event = new Event(randEvent);
	await event.save();

	const firstInstance = await Event.findById(event.id);
	const secondInstance = await Event.findById(event.id);

	firstInstance!.set({ name: faker.lorem.sentence(1) });
	secondInstance!.set({ name: faker.lorem.sentence(1) });

	await firstInstance!.save();

	try {
		await secondInstance!.save();
	} catch (error) {
		return;
	}

	throw new Error("should not be reached");
});

it("increments the version number on multiple saves", async () => {
	const randEvent = generateEvent();
	const event = new Event(randEvent);

	await event.save();
	expect(event.version).toEqual(0);

	await event.save();
	expect(event.version).toEqual(0);

	event.set({ description: faker.lorem.paragraphs(1) });
	await event.save();
	expect(event.version).toEqual(1);

	event.set({ description: faker.lorem.paragraphs(1) });
	await event.save();
	expect(event.version).toEqual(2);
});
