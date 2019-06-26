"use strict";

import express from 'express';
import http from 'http';
import cors from 'cors';

const port = process.env.PORT || 3000;
import index from "./routes/index";
const app = express();

app.use(cors());
app.use(index.router);

const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`));