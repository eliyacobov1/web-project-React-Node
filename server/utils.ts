import {tempData} from './temp-data'

export const searchTerm = (searchParam: string) => {

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