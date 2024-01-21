import ImageRepository from "../../src/repositories/ImageRepository";
import UserRepository from "../../src/repositories/UserRepository";
import { IUser } from "../../src/utils/Interfaces";
import interceptor from "../interceptor";

describe("Testing profile functions", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("It should create profile", async () => {
    const token = `Bearer ${interceptor.getAuthenticated(true, {
      id: 16,
      email: "member95@test.org",
      session_id: null,
    })}`;
    const fakeProfile: IUser = {
      name: "Fake",
      lastname: "Profile",
      email: "member95@test.org",
      phone: "(809) 765-4321",
      address: "123, Main Street",
      institute_id: 3,
      career_id: 1,
    };
    const response = await interceptor
      .getServer()
      .post("/api/profile")
      .set("Authorization", token)
      .send(fakeProfile);

    expect(response.status).toEqual(201);
  });

  test("It should update profile", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const fakeProfile: IUser = {
      name: "Fake Updated",
      lastname: "Profile",
      email: "admin@atriontechsd.com",
      phone: "(809) 765-4321",
      address: "123, Main Street",
      institute_id: 3,
      career_id: 1,
    };
    const response = await interceptor
      .getServer()
      .put("/api/profile")
      .set("Authorization", token)
      .send(fakeProfile);

    expect(response.status).toEqual(201);
  });

  test("It should catch error 500 on create/update profile", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const fakeProfile: IUser = {
      name: "Fake",
      lastname: "Profile",
      email: "fakeuser@example.com",
      phone: "(809) 765-4321",
      address: "123, Main Street",
      institute_id: 3,
      career_id: 1,
    };
    jest.spyOn(UserRepository.prototype, "createProfile").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .post("/api/profile")
      .set("Authorization", token)
      .send(fakeProfile);
    expect(response.status).toEqual(500);
  });

  test("It should find a profile", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .get("/api/profile")
      .set("Authorization", token);

    expect(response.status).toEqual(200);
    expect(response.body.content.auth_id).toEqual(1);
  });

  test("It should catch server error on find a profile", async () => {
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(UserRepository.prototype, "find").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .get("/api/profile")
      .set("Authorization", token);

    expect(response.status).toEqual(500);
  });
  let imageId: number | null = null;
  test("It should set profile image", async () => {
    const image = {
      url: "https://placehold.co/600x400",
      caption: "Placeholder image",
    };
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .post("/api/profile/image")
      .send(image)
      .set("Authorization", token);

    expect(response.status).toEqual(200);
    expect(response.body.content.url).toEqual(image.url);
    imageId = response.body.content.id;
  });

  test("It should update existign profile image", async () => {
    const image = {
      url: "https://placehold.co/600x400",
      caption: "Placeholder image",
    };
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    const response = await interceptor
      .getServer()
      .post("/api/profile/image")
      .send(image)
      .set("Authorization", token);
    expect(response.status).toEqual(200);
    expect(response.body.content.id).toEqual(imageId);
  });

  test("It should catch error 500 on set profile image", async () => {
    const image = {
      url: "https://placehold.co/600x400",
      caption: "Placeholder image",
    };
    const token = `Bearer ${interceptor.getAuthenticated()}`;
    jest.spyOn(ImageRepository.prototype, "asignToUser").mockRejectedValue({});
    const response = await interceptor
      .getServer()
      .post("/api/profile/image")
      .send(image)
      .set("Authorization", token);

    expect(response.status).toEqual(500);
  });
});
