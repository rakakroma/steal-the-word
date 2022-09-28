import { db } from "../../Background/database";

export const getDataInTableFromIndexedDB = async (tableName, sort) => {
    let result;
    if (sort === 'descending') {
        await db[tableName].reverse().toArray().then(words => result = words)
    } else {
        await db[tableName].toArray().then(words => result = words)
    }
    return result
}