import { pool } from "../../db";
import type { Issues } from "./issuesInterface";

const createIssueIntoDB = async (payload: Issues, id: string) => {

  const { title, description, type, status } = payload;

  if (description.length < 20) {
    throw new Error("Description must be minimum 20 Characters Or More");
  }
  const result = await pool.query(
    `
    INSERT INTO issues(title,description,type,status,reporter_id)  
    VALUES($1,$2,$3,COALESCE($4,'open'),$5) RETURNING * 
    `,
    [title, description, type, status, id],
  );
  return result.rows[0];
};

export const issueServer = {
  createIssueIntoDB,
};
