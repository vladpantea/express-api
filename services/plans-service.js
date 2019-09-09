const plans = require('../models/plans.json');
const DeleteError = require('../errors/delete-error');
module.exports = class PlansService {

    async findAll(){
        return plans;
    }

    async findOne(id){
        return plans.filter(plan => {
            return plan._id === id
        });
    }

    async create(plan){
        plans.push(plan);
        let toReturn = Object.assign({},plan);
        toReturn._id = "5d7221107a4812a1ac9e2888";
        return toReturn;
    }

    async deleteOne(id){
        let index = null;
        plans.forEach((item,idx) => {
            if(item && item._id === id){
                index = idx;
            }
        });

        if(index){
            plans[index] = undefined;
            return {}
        }else{
            throw new DeleteError("Delete operation did not succeed");            
        }
    }
}