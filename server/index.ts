import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import {Ticket} from "../client/src/api";

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

/**
 * Q 2.b added pagination mechanism which is implemented by passing
 * the page size(pageLimit parameter) and page number to the server
 * as query string parameters
 */
app.get(APIPath, (req, res) => {
  // @ts-ignore
  const page: number = parseInt(req.query.page);
  // @ts-ignore
  const pageSize: number = parseInt(req.query.PageLimit);
  if (!page){
    res.send(tempData);
  }
  else{
    const paginatedData = tempData.slice((page - 1) * pageSize, page * pageSize);
    res.send(paginatedData);
  }
});

/**
 * 2.a create a post endpoint for ticket creation
 */
app.post(APIPath, (req, res) => {
  const ticket: Ticket = req.body
  tempData.push(ticket)
  res.status(201) // HTTP status code
  res.send(ticket)
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

