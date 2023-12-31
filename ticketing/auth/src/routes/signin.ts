import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "@arnietickets/common";
import { User } from "../models/user";
import { BadRequestError } from "@arnietickets/common";
import { Password } from "../services/passwrod";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    //generate JWT token
    const token = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWWT_KEY!
    );

    //store into session
    req.session = {
      jwt: token,
    };

    res.status(201).send(existingUser);
  }
);

export { router as signinRouter };
