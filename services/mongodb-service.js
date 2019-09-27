const MongoClient = require('mongodb').MongoClient;

module.exports = (async function () {
    let url = null;
    let client = null;
    let db = null;

    async function getUrl() {
        if(process.env.MONGODB_DB_USER && process.env.MONGODB_DB_PASS){
            return `mongodb://${process.env.MONGODB_DB_USER}:${process.env.MONGODB_DB_PASS}@${process.env.MONGODB_SERVER}:${process.env.MONGODB_SERVER_PORT}/${process.env.MONGODB_DB}`;
        }else{
            return `mongodb://${process.env.MONGODB_SERVER}:${process.env.MONGODB_SERVER_PORT}/${process.env.MONGODB_DB}`;
        }
    }

    async function getDB() {
        if (client && db) {
            return db;
        } else {
            url = await getUrl();
            let _client = new MongoClient(url);
            client = await _client.connect({ useNewUrlParser: true });
            db = await client.db(process.env.MONGODB_DB);
            return db;
        }
    }

    async function closeConnection() {
        db = null;
        return client.close();
    }

    return {
        getDB: getDB,
        closeConnection: closeConnection
    }
})();