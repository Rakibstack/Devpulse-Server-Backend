import app from "./app";
import config from "./config/env";

const main = () => {

  app.listen(config.port, () => {
    console.log(`express server running on ${config.port}`);
  });
};

main();
