require("dotenv").config();

const { createApp } = require("./app");
const { appDataSource } = require("./src/models/appDataSource");

const startServer = async () => {
  const app = createApp();
  const PORT = process.env.PORT;

  await appDataSource
    .initialize()
    .then(() => console.log("Data Source has been initialized!"));

  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};

startServer();
