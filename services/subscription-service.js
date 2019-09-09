const subscriptions = require('../models/subscriptions.json');
const DeleteError = require('../errors/delete-error');
module.exports = class SubscriptionService {
    async findAll() {
        return subscriptions;
    }

    async findOne(id) {
        return subscriptions.filter(subscription => {
            return subscription._id === id
        });
    }

    async create(subscription) {
        subscriptions.push(subscription);
        let toReturn = Object.assign({},subscription);
        toReturn._id = "5d7221107a4812a1ac9e2777";
        return toReturn;
    }

    async deleteOne(id) {
        let index = null;
        subscriptions.forEach((item,idx) => {
            if(item && item._id === id){
                index = idx;
            }
        });

        if(index){
            subscriptions[index] = undefined;
            return {}
        }else{
            throw new DeleteError("Delete operation did not succeed");            
        }
    }
}