import Role from "../../src/models/Role";

describe("Test Model Role", () => {
  test("It should return name as searchable", () => {
    const searchable = new Role().getSearchables();
    expect(searchable.includes("name")).toBeTruthy();
  });
});
