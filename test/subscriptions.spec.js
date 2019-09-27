const chai = require('chai')
const expect = chai.expect
const app = require('../server')
const request = require('supertest')


xdescribe('Subscriptions API tests', () => {

    it('expect GET /api/subscriptions returns list of subscriptions', async () => {
        request(app)
            .get('/api/subscriptions')
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body.length).to.equal(24);
            })
    }).timeout(2000)

    it('expect GET /api/subscriptions/:id return 400 with validation message', async () => {
        request(app)
            .get('/api/subscriptions/5d76408900d06b204f99894')
            .expect(400)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.error.message).to.equal('cannot GET /api/subscriptions/5d76408900d06b204f99894 (400)');
            })
    }).timeout(2000)

    it('expect GET /api/subscriptions/:id return 200 with object', async () => {
        request(app)
            .get('/api/subscriptions/5d76408900d06b204f998948')
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body._id).to.equal('5d76408900d06b204f998948');
            })
    }).timeout(2000)

    it('expect GET /api/subscriptions/:id return 200 with empty object', async () => {
        request(app)
            .get('/api/subscriptions/5d76408900d06b204f998999')
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(Object.keys(res.body).length).to.equal(0);
            })
    }).timeout(2000)

    it('expect POST /api/subscriptions return 200 with created object', async () => {
        const toPass = {
            "coupon": 99,
            "cardNumber": "4858619830278984",
            "holderName": "John",
            "expirationDate": "2019-12-27T10:51:51 -02:00",
            "cvv": "299",
            "planId": "5d72211041ebbf483b3fe809"
        };

        request(app)
            .post('/api/subscriptions')
            .send(JSON.stringify(toPass))
            .set('Content-Type', 'application/json')
            .expect(200)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.body._id).to.equal("5d7221107a4812a1ac9e2777");
            })
    }).timeout(2000)

    it('expect POST /api/subscriptions return 400 with validation error', async () => {
        const toPass = {
            "coupon": 981,
            "cardNumber": 4858619830278984,
            "holderName": "John Doe",
            "expirationDate": "2019-12-27T10:51:51 -02:00",
            "planId": "5d72211041ebbf483b3fe809"
        };

        request(app)
            .post('/api/subscriptions')
            .send(JSON.stringify(toPass))
            .set('Content-Type', 'application/json')
            .expect(400)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.error.message).to.equal("cannot POST /api/subscriptions (400)");
            })
    }).timeout(2000)

    it('expect POST /api/subscriptions return 400 when wrong unsupported content type', async () => {
        const toPass = "coupon=981&cardNumber=4858619830278984&holderName=John&expirationDate=2019-12-27T10:51:51&planId: 5d72211041ebbf483b3fe809";

        request(app)
            .post('/api/subscriptions')
            .send(toPass)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .expect(400)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.error.message).to.equal("cannot POST /api/subscriptions (400)");
            })
    }).timeout(2000)

    it('expect DELETE /api/subscriptions/:id return 204', async () => {

        request(app)
            .delete('/api/subscriptions/5d76408900d06b204f998948')
            .expect(204)
            .end((err, res) => {
                expect(err).to.be.null;
            })
    }).timeout(2000)

    it('expect DELETE /api/subscriptions/:id return 400', async () => {

        request(app)
            .delete('/api/subscriptions/5d76408900d06b204f998999')
            .expect(400)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.error.message).to.equal("cannot DELETE /api/subscriptions/5d76408900d06b204f998999 (400)");
            })
    }).timeout(2000)
});