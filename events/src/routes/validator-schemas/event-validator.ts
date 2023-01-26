import { Schema } from "express-validator";
import { EVENT_TYPE_OPTIONS } from "../../models/event";

export const eventValidator: Schema = {
	name: {
		notEmpty: true,
		trim: true,
		isString: true,
		isLength: {
			options: { min: 2, max: 80 },
			errorMessage: "Name must have 2 to 80 characters",
		},
		errorMessage: "Name is required",
	},
	type: {
		notEmpty: true,
		trim: true,
		isString: true,
		toLowerCase: true,
		isIn: {
			options: [EVENT_TYPE_OPTIONS],
			errorMessage: "Type is not a valid option",
		},
		errorMessage: "Type is not valid",
	},
	description: {
		notEmpty: true,
		trim: true,
		isString: true,
		isLength: {
			options: {
				max: 160,
			},
			errorMessage: "Description must have up to 160 characters",
		},
		errorMessage: "Description is required",
	},
	"dates.startsAt": {
		notEmpty: true,
		trim: true,
		isISO8601: true,
		errorMessage: "Start Date is not valid Date",
	},
	"dates.endsAt": {
		notEmpty: true,
		trim: true,
		isISO8601: true,
		errorMessage: "End Date is not valid Date",
	},
	hosts: {
		isArray: true,
		optional: { options: { nullable: true } },
	},
	"hosts.*": {
		isString: true,
		isLength: {
			options: { min: 2, max: 80 },
			errorMessage: "Host's name must have 2 to 80 characters.",
		},
	},
	features: {
		isArray: true,
		optional: { options: { nullable: true } },
	},
	"features.*": {
		isString: true,
		isLength: {
			options: { min: 2, max: 80 },
			errorMessage: "Feature must have 2 to 80 characters.",
		},
	},
	organizers: {
		isArray: true,
		optional: { options: { nullable: true } },
	},
	"organizers.*": {
		isString: true,
		isLength: {
			options: { min: 2, max: 80 },
			errorMessage: "Organizers must have 2 to 80 characters.",
		},
	},
	tags: {
		isArray: true,
		optional: { options: { nullable: true } },
	},
	"tags.*": {
		isString: true,
		isLength: {
			options: { min: 2, max: 80 },
			errorMessage: "Tags must have 2 to 80 characters.",
		},
	},
	languages: {
		isArray: true,
		optional: { options: { nullable: true } },
	},
	"languages.*": {
		isString: true,
		isLength: {
			options: { min: 2, max: 80 },
			errorMessage: "Languages must have 2 to 80 characters.",
		},
	},
	address: {
		isObject: true,
		errorMessage: "Address is must not be empty.",
	},
	"address.street1": {
		notEmpty: true,
		trim: true,
		isString: true,
		isLength: {
			options: { max: 100 },
			errorMessage: "Street Address 1 must have up to 100 characters.",
		},
		errorMessage: "Street Address 1 is required.",
	},
	"address.street2": {
		optional: { options: { nullable: true } },
		isString: true,
		isLength: {
			options: { max: 100 },
			errorMessage: "Street Address 2 must have up to 100 characters.",
		},
	},
	"address.street3": {
		optional: { options: { nullable: true } },
		isString: true,
		isLength: {
			options: { max: 100 },
			errorMessage: "Street Address 3 must have up to 100 characters.",
		},
	},
	"address.country": {
		notEmpty: true,
		trim: true,
		isString: true,
		isLength: {
			options: { max: 100 },
			errorMessage: "Country must have up to 100 characters.",
		},
		errorMessage: "Country is required.",
	},
	"address.province": {
		notEmpty: true,
		trim: true,
		isString: true,
		isLength: {
			options: { max: 100 },
			errorMessage: "State/Province must have up to 100 characters.",
		},
		errorMessage: "State/Province is required.",
	},
	"address.city": {
		notEmpty: true,
		trim: true,
		isString: true,
		isLength: {
			options: { max: 100 },
			errorMessage: "City must have up to 100 characters.",
		},
		errorMessage: "City is required.",
	},
	"address.postalCode": {
		optional: { options: { nullable: true } },
		notEmpty: true,
		trim: true,
		isString: true,
		isPostalCode: { options: "any", errorMessage: "Postal Code is invalid" },
	},
	"address.LatLong": {
		optional: { options: { nullable: true } },
		isLatLong: true,
		errorMessage: "LatLong is not valid",
	},
};
