import { createRequire } from "module";
    const require = createRequire(import.meta.url);
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/config/env.ts
import dotenv from "dotenv";
import path from "path";
var config, env_default;
var init_env = __esm({
  "src/config/env.ts"() {
    "use strict";
    dotenv.config({
      path: path.join(process.cwd(), ".env")
    });
    config = {
      port: process.env.PORT,
      jwtSecret: process.env.JWT_SECRET,
      connecting_string: process.env.CONNECTING_STRING
    };
    env_default = config;
  }
});

// src/db/index.ts
import { Pool } from "pg";
var pool, initializeDB, db_default;
var init_db = __esm({
  "src/db/index.ts"() {
    "use strict";
    init_env();
    pool = new Pool({
      connectionString: env_default.connecting_string
    });
    initializeDB = async () => {
      try {
        await pool.query(`
         CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'contributor',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
        await pool.query(`
        CREATE TABLE IF NOT EXISTS issues (
          id SERIAL PRIMARY KEY,
          title VARCHAR(150) NOT NULL,
          description TEXT NOT NULL,
          type VARCHAR(20) NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'open',
          reporter_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `);
        console.log("Database initialized successfully");
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };
    db_default = initializeDB;
  }
});

// src/modules/user/user.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
var createUserIntoDB, loginUserIntoDB, userService;
var init_user_service = __esm({
  "src/modules/user/user.service.ts"() {
    "use strict";
    init_env();
    init_db();
    createUserIntoDB = async (payload) => {
      const { name, email, password, role } = payload;
      const hashPass = await bcrypt.hash(password, 12);
      const result = await pool.query(
        `
       INSERT INTO users(name,email,password,role)
       VALUES($1,$2,$3,COALESCE($4,'contributor'))
       RETURNING * 
        `,
        [name, email, hashPass, role]
      );
      const user = result.rows[0];
      delete user.password;
      return user;
    };
    loginUserIntoDB = async (payload) => {
      const { email, password } = payload;
      const checkUser = await pool.query(
        `
       SELECT * FROM users WHERE email= $1 
        `,
        [email]
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
        role: user.role
      };
      const accessToken = jwt.sign(jwtpayload, env_default.jwtSecret, {
        expiresIn: "1d"
      });
      return { accessToken };
    };
    userService = {
      createUserIntoDB,
      loginUserIntoDB
    };
  }
});

// src/utility/response.ts
var sendResponse;
var init_response = __esm({
  "src/utility/response.ts"() {
    "use strict";
    sendResponse = (res, statusCode, message, data) => {
      const response = {
        success: true,
        message
      };
      if (data !== void 0) {
        response.data = data;
      }
      return res.status(statusCode).json(response);
    };
  }
});

// src/utility/errorResponse.ts
var sendErrorResponse;
var init_errorResponse = __esm({
  "src/utility/errorResponse.ts"() {
    "use strict";
    sendErrorResponse = (res, statusCode, message, error) => {
      return res.status(statusCode).json({
        success: false,
        message,
        error: error ?? null
      });
    };
  }
});

// src/modules/user/user.controller.ts
var createUser, loginUser, userController;
var init_user_controller = __esm({
  "src/modules/user/user.controller.ts"() {
    "use strict";
    init_user_service();
    init_response();
    init_errorResponse();
    createUser = async (req, res) => {
      try {
        const result = await userService.createUserIntoDB(req.body);
        sendResponse(res, 201, "User Created Successfully", result);
      } catch (error) {
        sendErrorResponse(res, 500, error.message, error);
      }
    };
    loginUser = async (req, res) => {
      try {
        const result = await userService.loginUserIntoDB(req.body);
        sendResponse(res, 200, "User Login Successfully.", result);
      } catch (error) {
        sendErrorResponse(res, 500, error.message, error);
      }
    };
    userController = {
      createUser,
      loginUser
    };
  }
});

// src/modules/user/user.route.ts
import { Router } from "express";
var route, userRoute;
var init_user_route = __esm({
  "src/modules/user/user.route.ts"() {
    "use strict";
    init_user_controller();
    route = Router();
    route.post("/signup", userController.createUser);
    route.post("/login", userController.loginUser);
    userRoute = route;
  }
});

// src/modules/issues/issue.service.ts
var createIssueIntoDB, getAllIssueIntoDB, getSingleIssueFromDB, updateSingleIssueFromDB, deleteSingleUserFromDB, issueServer;
var init_issue_service = __esm({
  "src/modules/issues/issue.service.ts"() {
    "use strict";
    init_db();
    createIssueIntoDB = async (payload, id) => {
      const { title, description, type, status } = payload;
      if (description.length < 20) {
        throw new Error("Description must be minimum 20 Characters Or More");
      }
      const result = await pool.query(
        `
    INSERT INTO issues(title,description,type,status,reporter_id)  
    VALUES($1,$2,$3,COALESCE($4,'open'),$5) RETURNING * 
    `,
        [title, description, type, status, id]
      );
      return result.rows[0];
    };
    getAllIssueIntoDB = async () => {
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
          [issue.reporter_id]
        );
        finalIssue.push({
          ...rest,
          reporter: user.rows[0]
        });
      }
      return finalIssue;
    };
    getSingleIssueFromDB = async (id) => {
      const issue = await pool.query(
        `
      SELECT * FROM issues
      WHERE id = $1
      `,
        [id]
      );
      if (issue.rows.length === 0) {
        throw new Error("Issue Not Found!");
      }
      const { reporter_id, ...rest } = issue.rows[0];
      const user = await pool.query(
        `
        
        SELECT id,name,role FROM users
        WHERE id= $1`,
        [reporter_id]
      );
      return {
        ...rest,
        reporter: user.rows[0]
      };
    };
    updateSingleIssueFromDB = async (id, payload, user) => {
      const issueReselt = await pool.query(
        `
    SELECT * FROM issues 
    WHERE id = $1
    `,
        [id]
      );
      if (issueReselt.rows.length === 0) {
        throw new Error("Issue Not Found");
      }
      const issue = issueReselt.rows[0];
      if (user.role === "contributor") {
        if (issue.reporter_id !== user.id) {
          throw new Error("Forbidden Access!");
        }
        if (issue.status !== "open") {
          throw new Error("Cannot update resolved issue");
        }
      }
      const { title, description, type, status } = payload;
      let finalStatus = issue.status;
      if (user.role === "maintainer" && status) {
        finalStatus = status;
      }
      const updateIssue = await pool.query(
        `
      
      UPDATE issues
      SET title=$1,description = $2, type= $3,
      status = $4,
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
      `,
        [title, description, type, finalStatus, id]
      );
      return updateIssue.rows[0];
    };
    deleteSingleUserFromDB = async (id) => {
      const result = await pool.query(`
    
    DELETE FROM issues 
    WHERE id = $1
    `, [id]);
      return result.rows[0];
    };
    issueServer = {
      createIssueIntoDB,
      getAllIssueIntoDB,
      getSingleIssueFromDB,
      updateSingleIssueFromDB,
      deleteSingleUserFromDB
    };
  }
});

// src/modules/issues/issue.controller.ts
var createIssue, getAllIssue, getSingleIssue, updateSingleIssue, deleteSingleUser, issuesController;
var init_issue_controller = __esm({
  "src/modules/issues/issue.controller.ts"() {
    "use strict";
    init_issue_service();
    init_response();
    init_errorResponse();
    createIssue = async (req, res) => {
      try {
        const result = await issueServer.createIssueIntoDB(req.body, req.user.id);
        sendResponse(res, 201, "Issue Created  Successfull", result);
      } catch (error) {
        sendErrorResponse(res, 500, error.messag, error);
      }
    };
    getAllIssue = async (req, res) => {
      try {
        const result = await issueServer.getAllIssueIntoDB();
        sendResponse(res, 200, "Issues retrived  Successfull", result);
      } catch (error) {
        sendErrorResponse(res, 500, error.message, error);
      }
    };
    getSingleIssue = async (req, res) => {
      const { id } = req.params;
      try {
        const result = await issueServer.getSingleIssueFromDB(id);
        sendResponse(res, 200, "Issues retrived  Successfull", result);
      } catch (error) {
        sendErrorResponse(res, 500, error.message, error);
      }
    };
    updateSingleIssue = async (req, res) => {
      try {
        const result = await issueServer.updateSingleIssueFromDB(
          req.params.id,
          req.body,
          req.user
        );
        sendResponse(res, 200, "Issue Update Successfull", result);
      } catch (error) {
        sendErrorResponse(res, 500, error.message, error);
      }
    };
    deleteSingleUser = async (req, res) => {
      try {
        const result = await issueServer.deleteSingleUserFromDB(
          req.params.id
        );
        sendResponse(res, 200, "Issue Delete Successfull", result);
      } catch (error) {
        sendErrorResponse(res, 500, error.message, error);
      }
    };
    issuesController = {
      createIssue,
      getAllIssue,
      getSingleIssue,
      updateSingleIssue,
      deleteSingleUser
    };
  }
});

// src/middleware/auth.ts
import jwt2 from "jsonwebtoken";
var authMiddleware, auth_default;
var init_auth = __esm({
  "src/middleware/auth.ts"() {
    "use strict";
    init_env();
    init_db();
    authMiddleware = (...roles) => {
      return async (req, res, next) => {
        try {
          const token = req.headers.authorization;
          if (!token) {
            res.status(401).json({
              success: false,
              message: "unauthorized access!"
            });
            return;
          }
          const decoded = jwt2.verify(token, env_default.jwtSecret);
          const userExist = await pool.query(
            `
        SELECT * FROM users WHERE email= $1  
        `,
            [decoded.email]
          );
          if (userExist.rows.length === 0) {
            res.status(404).json({
              success: false,
              message: "User Not Found!"
            });
            return;
          }
          const user = userExist.rows[0];
          if (roles.length && !roles.includes(user.role)) {
            res.status(403).json({
              success: false,
              message: "Forbidden Access!"
            });
            return;
          }
          req.user = decoded;
          next();
        } catch (error) {
          next(error);
        }
      };
    };
    auth_default = authMiddleware;
  }
});

// src/modules/issues/issue.route.ts
import { Router as Router2 } from "express";
var route2, issuesRoute;
var init_issue_route = __esm({
  "src/modules/issues/issue.route.ts"() {
    "use strict";
    init_issue_controller();
    init_auth();
    route2 = Router2();
    route2.post("/", auth_default(), issuesController.createIssue);
    route2.get("/", issuesController.getAllIssue);
    route2.get("/:id", issuesController.getSingleIssue);
    route2.patch("/:id", auth_default(), issuesController.updateSingleIssue);
    route2.delete("/:id", auth_default("maintainer"), issuesController.deleteSingleUser);
    issuesRoute = route2;
  }
});

// src/middleware/globalErrorHandler.ts
var globalErrorHandler, globalErrorHandler_default;
var init_globalErrorHandler = __esm({
  "src/middleware/globalErrorHandler.ts"() {
    "use strict";
    globalErrorHandler = (err, req, res, next) => {
      res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error"
      });
    };
    globalErrorHandler_default = globalErrorHandler;
  }
});

// src/app.ts
import express from "express";
import cors from "cors";
var app, app_default;
var init_app = __esm({
  "src/app.ts"() {
    "use strict";
    init_user_route();
    init_issue_route();
    init_globalErrorHandler();
    app = express();
    app.use(express.json());
    app.use(cors({ origin: "localhost:3000" }));
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.use("/api/auth", userRoute);
    app.use("/api/issues", issuesRoute);
    app.use(globalErrorHandler_default);
    app_default = app;
  }
});

// src/server.ts
var require_server = __commonJS({
  "src/server.ts"() {
    init_app();
    init_env();
    init_db();
    var main = () => {
      db_default();
      app_default.listen(env_default.port, () => {
        console.log(`express server running on ${env_default.port}`);
      });
    };
    main();
  }
});
export default require_server();
//# sourceMappingURL=server.mjs.map