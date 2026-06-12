import { pool } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcryptjs";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const hashPass = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `
       INSERT INTO users(name,email,password,role)
       VALUES($1,$2,$3,COALESCE($4,'contributor'))
       RETURNING * 
        `,
    [name, email, hashPass, role],
  );

  const user = result.rows[0];
  delete user.password;
  return user;
};

export const userService = {
  createUserIntoDB,
};
