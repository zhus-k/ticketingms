import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError, validateRequest } from "@zjs-tix/common";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { Password } from "../services/passwords";

const router = express.Router();

router.post(
	"/api/users/signin",
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("password")
			.trim()
			.notEmpty()
			.withMessage("You must provide a password"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (!existingUser) {
			throw new BadRequestError("Invalid credentials");
		}

		const matches = await Password.compare(existingUser.password, password);

		if (!matches) {
			throw new BadRequestError("Invalid credentials");
		}

		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
			},
			process.env.JWT_SECRET!,
		);

		req.session = {
			jwt: userJwt,
		};

		res.status(200).send(existingUser);
	},
);

export { router as signinRouter };
