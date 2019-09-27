const DBOperationError = require('../errors/db-operation-error');
const MongoService = require('./mongodb-service');
const ObjectId = require('mongodb').ObjectID;

module.exports = class CandidateService {
    mongoService = null
    db = null

    constructor() {
        MongoService.then(ms => {
            this.mongoService = ms;
        });
    }

    async findAll() {
        try {
            let db = await this.mongoService.getDB();
            return await db.collection('candidates').find({}, { batchSize: 100, limit: 500 }).toArray();
        } catch (ex) {
            throw new DBOperationError("Find all candidates request did not succeed", ex);
        }
    }

    async findOne(id) {
        try {
            let db = await this.mongoService.getDB();
            return await db.collection('candidates').findOne({ "_id": ObjectId(id) }, { batchSize: 1, limit: 1 });
        } catch (ex) {
            throw new DBOperationError("Find candidate request did not succeed", ex);
        }
    }

    async create(candidate) {
        try {
            let db = await this.mongoService.getDB();
            let toReturn = await db.collection('candidates').insertOne(candidate);
            return toReturn.ops && toReturn.ops.length > 0 ? toReturn.ops[0] : {};
        } catch (ex) {
            throw new DBOperationError("Create candidate request did not succeed", ex);
        }
    }

    async deleteOne(id) {
        try {
            let db = await this.mongoService.getDB();
            return await db.collection('candidates').deleteOne({ "_id": ObjectId(id) });
        } catch (ex) {
            throw new DBOperationError("Delete candidate request did not succeed", ex);
        }
    }
}