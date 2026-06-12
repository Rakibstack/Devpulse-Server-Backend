import config from "../../config/env";
import { pool } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const checkUser = await pool.query(
    `
       SELECT * FROM users WHERE email= $1 
        `,
    [email],
  );

  if (checkUser.rows.length === 0) {
    throw new Error("User Not Found");
  }

  const user = checkUser.rows[0];

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("invalid credentials");
  }

  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const accessToken = jwt.sign(jwtpayload, config.jwtSecret as string, {
    expiresIn: "1d",
  });

  return {accessToken}
};

export const userService = {
  createUserIntoDB,
  loginUserIntoDB,
};
