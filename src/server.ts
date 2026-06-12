import app from "./app";
import config from "./config/env";
import initializeDB from "./db";

const main = () => {
  initializeDB();
  app.listen(config.port, () => {
    console.log(`express server running on ${config.port}`);
  });
};

main();
