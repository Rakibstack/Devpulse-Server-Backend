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

const getAllIssueIntoDB = async () => {
  const result = await pool.query(`
      SELECT * FROM issues 
      ORDER BY created_at DESC
      `);
  const issues = result.rows;

  const finalIssue = [];

  for (const issue of issues) {
    const { reporter_id, ...rest } = issue;

    const user = await pool.query(
      `     
        SELECT id,name,role FROM users
        WHERE id= $1`,
      [issue.reporter_id],
    );

    finalIssue.push({
      ...rest,
      reporter: user.rows[0],
    });
  }

  return finalIssue;
};

export const issueServer = {
  createIssueIntoDB,
  getAllIssueIntoDB,
};
