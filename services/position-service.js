const DBOperationError = require('../errors/db-operation-error');
const MongoService = require('./mongodb-service');
const ObjectId = require('mongodb').ObjectID;

module.exports = class PositionService {
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
            return await db.collection('positions').find({}, { batchSize: 100, limit: 500 }).toArray();
        } catch (ex) {
            throw new DBOperationError('Find all positions request did not succeed', ex);
        }
    }

    async findOne(id) {
        try {
            let db = await this.mongoService.getDB();
            return await db.collection('positions').findOne({ "_id": ObjectId(id) }, { batchSize: 1, limit: 1 });
        } catch (ex) {
            throw new DBOperationError('Find one position request did not succeed', ex);
        }
    }

    async create(subscription) {
        try {
            let db = await this.mongoService.getDB();
            let toReturn = await db.collection('positions').insertOne(subscription);
            return toReturn.ops && toReturn.ops.length > 0 ? toReturn.ops[0] : {};
        } catch (ex) {
            throw new DBOperationError('Create position request did not succeed', ex);
        }
    }

    async deleteOne(id) {
        try {
            let db = await this.mongoService.getDB();
            return await db.collection('positions').deleteOne({ "_id": ObjectId(id) });
        } catch (ex) {
            throw new DBOperationError('Delete position request did not succeed', ex);
        }
    }
}