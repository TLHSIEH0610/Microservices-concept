import express from "express";
import jwt from "jsonwebtoken";
import { currentUser } from "../middlewares/current-user";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }

  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
