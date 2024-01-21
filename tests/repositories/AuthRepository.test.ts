import { Connection } from "../../src/db/Connection";
import Auth from "../../src/models/Auth";
import { AuthRepository } from "../../src/repositories/AuthRepository";

describe("Test for auth repository", () => {
  test("It should get auths", async () => {
    const authRepo = new AuthRepository();
    const auth = await authRepo.getAll({ page: 1, perpage: 100 });
    expect(auth.count).toBeGreaterThan(0);
    expect(auth.rows.length).toBeGreaterThanOrEqual(1);
  });

  test("It can get auth by id", async () => {
    const authRepo = new AuthRepository();
    const auth = await authRepo.findById(5);
    expect(auth.id).toBeDefined();
    expect(auth.id).toEqual(5);
  });

  test("It should return null for no existing auth", async () => {
    const authRepo = new AuthRepository();
    const auth = await authRepo.findById(70);
    expect(auth).toBeNull();
  });

  test("It should get one auth", async () => {
    const authRepo = new AuthRepository();
    let auth = await authRepo.getAll({ limit: 5 });
    expect(auth.count).toBeDefined();
    expect(auth.count).toBeGreaterThan(5);
    auth = await authRepo.getAll({ limit: 1 });
    expect(auth.id).toBeDefined();
  });

  test("It should get first record", async () => {
    const authRepo = new AuthRepository();
    const firtsAuth: Auth = await authRepo.first();
    expect(firtsAuth.id).toBeDefined();
    expect(firtsAuth.id).toEqual(1);
  });

  test("It should get last record", async () => {
    const authRepo = new AuthRepository();
    const lastAuth: Auth = await authRepo.last();
    expect(lastAuth.id).toBeDefined();
    expect(lastAuth.id).toBeGreaterThan(19);
  });

  test("It should create new Auth", async () => {
    const trans = await Connection.getConnectionInstance().getTrans();
    const authRepo = new AuthRepository();
    const newAuth = {
      email: "newAuth@test.com",
      password: "Xwz7S414lPsaI",
      role_id: 2,
    };
    const result: Auth = await authRepo.create(newAuth, trans);
    expect(result.id).toBeDefined();
    expect(result.id).toEqual(24);
    let error: any;
    try {
      await authRepo.create({ ...newAuth, email: null }, trans);
    } catch (err) {
      error = err;
    }
    await trans.commit();
    expect(error).toBeDefined();
  });

  test("It should update auth", async () => {
    const trans = await Connection.getConnectionInstance().getTrans();
    const authRepo = new AuthRepository();
    const updateData = {
      email: "updatedAuth@test.com",
    };
    const updatedAuth = await authRepo.update(updateData, 24, trans);
    await trans.commit();
    expect(updatedAuth.email).toEqual("updatedAuth@test.com");
  });

  test("It should softdelete auth", async () => {
    const trans = await Connection.getConnectionInstance().getTrans();
    const authRepo = new AuthRepository();
    const deleted = await authRepo.delete(24, trans);
    await trans.commit();
    expect(deleted.deletedAt).not.toBeNull();
  });

  test("It should be restored", async () => {
    const trans = await Connection.getConnectionInstance().getTrans();
    const authRepo = new AuthRepository();
    const restored = await authRepo.restore(24, trans);
    await trans.commit();
    expect(restored.deletedAt).toBeNull();
  });
  test("It should forcedelete auth", async () => {
    const trans = await Connection.getConnectionInstance().getTrans();
    const authRepo = new AuthRepository();
    const deleted = await authRepo.forceDelete(24, trans);
    await trans.commit();
    expect(deleted.id).toEqual(24);
  });

  test("It should assign role to auth", async () => {
    const authRepo = new AuthRepository();
    const trans = await Connection.getConnectionInstance().getTrans();

    const auth = await authRepo.findById(1);
    try {
      await authRepo.assingRole(1, auth, trans);
      expect(1).toEqual(1);
    } catch (error) {
      expect(1).toEqual(2);
    }
    trans.rollback();
  });
});
