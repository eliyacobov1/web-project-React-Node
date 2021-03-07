import {Ticket} from '../client/src/api';
const PUNCTUATION_REGEX = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g
const PUNCTUATION_REGEX2 = /\s{2,}/g


const data = require('./data.json');

export const tempData = data as Ticket[];
// cachedData will contain data of the latest search
export const cachedData = {
    searchVal: '',
    tickets: []
} as {searchVal: string, tickets: Ticket[]};

/**
 * hashedData represents a Map of all the words in
 * the Database with the tickets that they appear in.
 * Each property is a word and each word property
 * contains a nested property that represents a ticket.
 */
export const hashedData = Object()

tempData.forEach((t: Ticket) => {
    let ticketData = t.title.toLowerCase() + t.content.toLowerCase();
    // strip the ticket word data of punctuation
    let dataNoPunctuation = ticketData.replace(PUNCTUATION_REGEX, '')
        .replace(PUNCTUATION_REGEX2, ' ')
    let wordArray = dataNoPunctuation.split(' ')
    wordArray.forEach((word) => {
        if (!hashedData[word])
            hashedData[word] = Object()
        hashedData[word][t.id] = true
    })
})