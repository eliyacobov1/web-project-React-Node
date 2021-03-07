import {hashedData, tempData} from './temp-data'
// Q2.c implemented before/after-date and
// from-email search filter using regex
const BEFORE_DATE_REGEX = /^before:((0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/\-]\d{4}$)/
const AFTER_DATE_REGEX = /^after:((0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/\-]\d{4}$)/
const FROM_EMAIL_REGEX = /^from:(\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)/

/**
 * (Q2.c + 2.d) this function performs a search over the data-base
 * given a query parameter and returns the matching ticket objects.
 */
export const searchTerm = (searchParam: string) => {
    if(BEFORE_DATE_REGEX.test(searchParam)){
        const date = Number(new Date(searchParam.slice(7)));
        return tempData.filter((ticket) => {
            return ticket.creationTime < date;
        })
    }
    else if(AFTER_DATE_REGEX.test(searchParam)){
        const date = Number(new Date(searchParam.slice(6)));
        return tempData.filter((ticket) => {
            return ticket.creationTime > date;
        })
    }
    else if(FROM_EMAIL_REGEX.test(searchParam)){
        const email = searchParam.slice(5);
        return tempData.filter((ticket) => {
            return ticket.userEmail === email;
        })
    }
    else{
        // used the hashedData only in case there are multiple
        // words since it is a keyword based structure
        let keyWords = searchParam.split(' ')
        if (keyWords.length === 1){
            return tempData.filter((t) =>
                (t.title.toLowerCase() + t.content.toLowerCase()).includes(searchParam));
        }
        else{
            return tempData.filter((t) =>
                keyWords.every((word) => {
                        return typeof hashedData[word] !== 'undefined' &&
                            hashedData[word][t.id] === true;
                    }
                ))
        }
    }
}

/**
 * Q2.a UUID generator
 */
export const uniqueID = () => {
    function chr4(){
        return Math.random().toString(16).slice(-4);
    }
    return chr4() + chr4() +
        '-' + chr4() +
        '-' + chr4() +
        '-' + chr4() +
        '-' + chr4() + chr4() + chr4();
}

/**
 * find the index of the ticket with the
 * given id inside of the DataBase array
 */
export const findTicketIndex= (id: string) => {
    for(let i = 0; i < tempData.length; i += 1) {
        if(tempData[i].id === id) {
            return i;
        }
    }
    return -1;
}