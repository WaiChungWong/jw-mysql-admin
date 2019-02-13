"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _helmet = require("helmet");

var _helmet2 = _interopRequireDefault(_helmet);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _api = require("./api");

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.use((0, _helmet2.default)());
router.use((0, _cookieParser2.default)());
router.use(_bodyParser2.default.json());
router.use(_bodyParser2.default.urlencoded({ extended: true }));

router.use("/api", _api2.default);
router.use(_express2.default.static(__dirname + "/client"));
router.get("*", (req, res) => {
  res.sendFile(__dirname + "client/index.html");
});

exports.default = connection => {
  _api2.default.presetConnection = connection;
  return router;
};