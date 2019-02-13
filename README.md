# jw-mysql-admin

A basic MySQL client middleware for node with express.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/jw-mysql-admin.svg
[npm-url]: http://npmjs.org/package/jw-mysql-admin
[travis-image]: https://img.shields.io/travis/WaiChungWong/jw-mysql-admin.svg
[travis-url]: https://travis-ci.org/WaiChungWong/jw-mysql-admin
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/jw-mysql-admin.svg
[download-url]: https://npmjs.org/package/jw-mysql-admin

## Install

[![NPM](https://nodei.co/npm/jw-mysql-admin.png)](https://nodei.co/npm/jw-mysql-admin)

## Methods

| Method   | Parameters                                                                                                             | Description                                                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `<main>` | `presetCredentials` (optional) : {<p> `host`:string <br> `port`:string <br> `user`:string <br> `password`:string <br>} | the preset connection information which will be passed into `client` as configuration programmatically when connecting to a MySQL database. |

## Usage

```javascript
import express from "express";
import mysqlAdmin from "jw-mysql-admin";

const app = express();
const port = process.env.PORT || 3000;

app.use("/mysql-admin", mysqlAdmin());

app.listen(port);
```

## Using mysql admin client

The react client is located on whatever path the middleware is set.
For example from above - it is located at `http://localhost:3000/mysql-admin`.
It uses the database connection information as an authentication, and will prompt for any required information which is not provided in the preset credentials until a successful connection is made.
