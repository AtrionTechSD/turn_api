import User from "../../src/models/User";
import UserRepository from "../../src/repositories/UserRepository";
import interceptor from "../interceptor";

describe("Testing user controller", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test("It should get users", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .get("/api/users?filter=test&scopes=onlyClient")
      .set("Authorization", token);

    expect(response.body.content.count).toBeGreaterThanOrEqual(5);
  });

  test("It should catch errors", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest
      .spyOn(UserRepository.prototype, "getAll")
      .mockRejectedValue({ content: "Error from mock users" });
    const response = await interceptor
      .getServer()
      .get("/api/users")
      .set("Authorization", token);

    expect(response.status).toEqual(500);
  });

  test("It should return one user", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .get("/api/users/2")
      .set("Authorization", token);

    expect(response.body.content.id).toEqual(2);
  });

  test("It should catch error return one user", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(UserRepository.prototype, "findById").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .get("/api/users/2")
      .set("Authorization", token);

    expect(response.status).toEqual(500);
  });

  test("It should create a new user", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const fakeUser = {
      name: "Fake",
      lastname: "User",
      phone: "(809) 765-4321",
      address: "Fake street, no. 9, City",
      email: "fakeuser@example.com",
    };
    jest
      .spyOn(UserRepository.prototype, "create")
      .mockResolvedValue(new User());
    const response = await interceptor
      .getServer()
      .post("/api/users")
      .send(fakeUser)
      .set("Authorization", token);
    expect(response.status).toEqual(201);
  });

  test("It should catch error  on create a new user", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const fakeUser = {
      name: "Fake",
      lastname: "User",
      phone: "(809) 765-4321",
      address: "Fake street, no. 9, City",
      email: "fakeuser@example.com",
    };
    jest
      .spyOn(UserRepository.prototype, "create")
      .mockRejectedValue(new User());
    const response = await interceptor
      .getServer()
      .post("/api/users")
      .send(fakeUser)
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });

  test("It should update a user", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;

    const fakeUser = {
      name: "Fake",
      lastname: "User",
      phone: "(809) 765-4321",
      address: "Fake street, no. 9, City",
      email: "fakeuser@example.com",
    };

    jest
      .spyOn(UserRepository.prototype, "update")
      .mockResolvedValue(new User());
    const response = await interceptor
      .getServer()
      .put("/api/users/5")
      .send(fakeUser)
      .set("Authorization", token);
    expect(response.status).toEqual(200);
  });

  test("It should catch error on update a user", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const fakeUser = {
      name: "Fake",
      lastname: "User",
      phone: "(809) 765-4321",
      address: "Fake street, no. 9, City",
      email: "fakeuser@example.com",
    };

    jest.spyOn(UserRepository.prototype, "update").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .put("/api/users/5")
      .send(fakeUser)
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });

  test("It should catch not existing user to update", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const fakeUser = {
      name: "Fake",
      lastname: "User",
      phone: "(809) 765-4321",
      address: "Fake street, no. 9, City",
      email: "fakeuser@example.com",
    };

    const response = await interceptor
      .getServer()
      .put("/api/users/555")
      .send(fakeUser)
      .set("Authorization", token);

    expect(response.status).toEqual(404);
  });

  test("It should delete user", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest
      .spyOn(UserRepository.prototype, "delete")
      .mockResolvedValue(new User());
    const response = await interceptor
      .getServer()

      .delete("/api/users/2")
      .set("Authorization", token);

    expect(response.status).toEqual(200);
  });

  test("It should catch error 500 on delete user", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest
      .spyOn(UserRepository.prototype, "delete")
      .mockRejectedValue(new User());
    const response = await interceptor
      .getServer()
      .delete("/api/users/2")
      .set("Authorization", token);
    expect(response.status).toEqual(500);
  });

  test("It should catch not founded user to delete", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest
      .spyOn(UserRepository.prototype, "delete")
      .mockResolvedValue(new User());
    const response = await interceptor
      .getServer()
      .delete("/api/users/25")
      .set("Authorization", token);
    expect(response.status).toEqual(404);
  });
});
