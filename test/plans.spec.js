const chai = require('chai')
const expect = chai.expect
const app = require('../server')
const request = require('supertest')

describe('API TESTS', () => {
    describe('Plans API tests', () => {

        it('expect GET /api/plans returns list of plans', async () => {
            request(app)
            .get('/api/plans')
            .expect(200)
            .end((err,res) => {
                expect(err).to.be.null;
                expect(res.body.length).to.equal(22);
            })
        }).timeout(2000)
    
        it('expect GET /api/plans/:id return 400 with validation message', async () => {
            request(app)
            .get('/api/plans/5d7221107a4812a1ac9e223')        
            .expect(400)
            .end((err,res) => {
                expect(err).to.be.null;
                expect(res.error.message).to.equal('cannot GET /api/plans/5d7221107a4812a1ac9e223 (400)');
            })
        }).timeout(2000)
    
        it('expect GET /api/plans/:id return 200 with object', async () => {
            request(app)
            .get('/api/plans/5d7221107a4812a1ac9e2236')        
            .expect(200)
            .end((err,res) => {
                expect(err).to.be.null;
                expect(res.body._id).to.equal('5d7221107a4812a1ac9e2236');
            })
        }).timeout(2000)
    
        it('expect GET /api/plans/:id return 200 with empty object', async () => {
            request(app)
            .get('/api/plans/5d7221107a4812a1ac9e2999')        
            .expect(200)
            .end((err,res) => {
                expect(err).to.be.null;
                expect(Object.keys(res.body).length).to.equal(0);
            })
        }).timeout(2000)
    
        it('expect POST /api/plans return 200 with created object', async () => {
            const toPass = {
                "name": "John Doe",
                "price": 99,
                "type": "monthly",
                "userId": 16
            };
    
            request(app)
            .post('/api/plans')
            .send(JSON.stringify(toPass))
            .set('Content-Type', 'application/json')
            .expect(200)
            .end((err,res) => {
                expect(err).to.be.null;
                expect(res.body._id).to.equal("5d7221107a4812a1ac9e2888");
            })
        }).timeout(2000)
    
        it('expect POST /api/plans return 400 with validation error', async () => {
            const toPass = {
                "name": "John Doe",
                "price": 99,
                "type": "monthly"
            };
    
            request(app)
            .post('/api/plans')
            .send(JSON.stringify(toPass))
            .set('Content-Type', 'application/json')
            .expect(400)
            .end((err,res) => {
                expect(err).to.be.null;
                expect(res.error.message).to.equal("cannot POST /api/plans (400)");
            })
        }).timeout(2000)
    
        it('expect POST /api/plans return 400 when wrong unsupported content type', async () => {
            const toPass = "name=John Doe&price=99&type=monthly&userId=16";
    
            request(app)
            .post('/api/plans')
            .send(toPass)
            .set('Content-Type', 'application/x-www-form-urlencoded') 
            .expect(400)       
            .end((err,res) => {
                expect(err).to.be.null;
                expect(res.error.message).to.equal("cannot POST /api/plans (400)");
            })
        }).timeout(2000)
    
        it('expect DELETE /api/plans/:id return 204', async () => {
            
            request(app)
            .delete('/api/plans/5d7221107a4812a1ac9e2236')        
            .expect(204)
            .end((err,res) => {
                expect(err).to.be.null;            
            })
        }).timeout(2000)
    
        it('expect DELETE /api/plans/:id return 400', async () => {
            
            request(app)
            .delete('/api/plans/5d7221107a4812a1ac9e2239')
            .expect(400)
            .end((err,res) => {
                expect(err).to.be.null;
                expect(res.error.message).to.equal("cannot DELETE /api/plans/5d7221107a4812a1ac9e2239 (400)");
            })
        }).timeout(2000)
    });
});
