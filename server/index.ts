import express from 'express';
import bodyParser = require('body-parser');
import { tempData, cachedData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import {findTicketIndex, searchTerm, uniqueID} from './utils'
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
 * Q2.b added pagination mechanism which is implemented by passing
 * the page size(pageLimit parameter) and page number to the server
 * as query string parameters
 */
app.get(APIPath, (req, res) => {
  // @ts-ignore
  const page: number = parseInt(req.query.page);
  // @ts-ignore
  const pageSize: number = parseInt(req.query.PageLimit);
  // @ts-ignore
  const searchParam: string = req.query.superSearch;

  // 2.d search mechanism implementation
  if (searchParam){
    if (cachedData.searchVal !== searchParam){ // cache search results for near future use
      const tickets = searchTerm(searchParam);
      cachedData.searchVal = searchParam;
      cachedData.tickets = tickets;
    }
    if (!page){
      res.send(cachedData.tickets);
    }
    else{ // return requested search data
      const paginatedData = cachedData.tickets.slice((page - 1) * pageSize, page * pageSize);
      res.send(paginatedData);
    }
  }
  else if (!page){ // return all available ticket data
    res.send(tempData);
  }
  else{ // return requested page
    const paginatedData = tempData.slice((page - 1) * pageSize, page * pageSize);
    res.send(paginatedData);
  }
});

/**
 * Q2.a Post endpoint for ticket creation. Generates an ID
 * for the received ticket and upon confirming that this ID
 * is available for use, will add ticket to DB. Otherwise,
 * the function will keep generating ID until an available
 * one is generated.
 */
app.post(APIPath, (req, res) => {
  let newTicket = req.body
  newTicket.creationTime = (new Date()).getTime()
  while (true){
    let uuid = uniqueID()
    const duplicateID = tempData.some(ticket => // generated id already exists?
        ticket.id === uuid)
    if (!duplicateID){
      newTicket = {...newTicket, id: uuid}
      tempData.unshift(newTicket);
      break;
    }
  }
  res.status(201) // HTTP created status code
  res.send(newTicket)
});

/**
 * Q3 put endpoint used to edit an existing ticket
 * (current usage- add ticket comments)
 */
app.put(APIPath, (req, res) => {
  const editedTicket = req.body;
  const index = findTicketIndex(editedTicket.id)
  tempData[index] = {...editedTicket}

  res.status(200) // HTTP OK status code
  res.send(editedTicket);
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

