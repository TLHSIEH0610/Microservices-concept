import request from "supertest";
import { app } from "../../app";

it("return a 201 on successful signup", async () => {
  return request(app)
    .post("/api/user/signup")
    .send({
      email: "hello@hello.com",
      password: "password",
    })
    .expect(201);
});
