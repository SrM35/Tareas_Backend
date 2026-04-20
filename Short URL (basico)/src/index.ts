import "reflect-metadata";
import express from "express";
import Users from "./user/Users";
import Urls from "./user/Urls";
import { AppDataSource } from "./data-source";

const app = express();
app.use(express.json());

const PORT = 3000;

app.use("/users", Users);
app.use("/url", Urls);

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`The server is running baby!!`);
    });
  })
  .catch((error) => console.log(error));
