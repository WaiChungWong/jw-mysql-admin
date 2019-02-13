import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import api from "./api";

const router = express.Router();

router.use(helmet());
router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use("/api", api);
router.use(express.static(__dirname + "/client"));
router.get("*", (req, res) => {
  res.sendFile(__dirname + "client/index.html");
});

export default connection => {
  api.presetConnection = connection;
  return router;
};
