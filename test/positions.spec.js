const chai = require('chai')
const expect = chai.expect
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer
const mongod = new MongoMemoryServer({ debug: false })
const chalk = require('chalk')

let app = null
let request = null
let port = null
let dbName = null
let env = null
const MONGODB_SERVER = '127.0.0.1'
let position_id = null


describe('API TESTS', function () {
    before(async function () {
        this.timeout(10000);
        env = Object.assign({}, process.env)
        process.env.NODE_ENV = 'test'
        process.env.MONGODB_SERVER = MONGODB_SERVER
        process.env.MONGODB_DB_USER = ''
        process.env.MONGODB_DB_PASS = ''

        uri = await mongod.getConnectionString({ useNewUrlParser: true })
        port = await mongod.getPort()
        dbPath = await mongod.getDbPath()
        dbName = await mongod.getDbName()
        instanceInfo = await mongod.getInstanceInfo()

        process.env.MONGODB_SERVER_PORT = port
        process.env.MONGODB_DB = dbName

        app = require('../server').app
        ctrl = require('../server').positionsCtrl
        request = require('supertest')
    })

    after(function (done) {
        this.timeout(10000)
        process.env = env

        if (mongod) {
            mongod.stop().then(() => {
                ctrl.connClose().then(() => {
                    console.log(chalk.blue('Database connection closed'))
                    done()
                })
            })
        } else {
            done();
        }
    })

    describe('Positions Api Tests', () => {
        before(function (done) {
            this.timeout(10000);
            const toPass = {
                "type": "fulltime",
                "company": "accesa",
                "address": "Cluj-Napoca",
                "email": "accesahr@accesa.eu",
                "benefits": ["salary", "fresh fruits"],
                "description": "Fullstack developer wanted!",
                "requirements": {
                    "level": "senior",
                    "language": "node.js"
                },
                "candidates": []
            }

            request(app)
                .post('/api/positions')
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(toPass))
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null
                    position_id = res.body._id
                    done()
                })
        })

        it('expect GET /api/positions returns list of subscriptions', async () => {
            request(app)
                .get('/api/positions')
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.body.length).to.equal(1);
                })
        }).timeout(2000)

        //must have 24 chars length
        it('expect GET /api/positions/:id return 400 with validation message', async () => {
            request(app)
                .get(`/api/positions/5d76408900d06b204f99894`)
                .expect(400)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.error.message).to.equal('cannot GET /api/positions/5d76408900d06b204f99894 (400)');
                })
        }).timeout(2000)

        it('expect GET /api/positions/:id return 200 with object', async () => {
            request(app)
                .get(`/api/positions/${position_id}`)
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.body._id).to.equal(position_id);
                })
        }).timeout(2000)

        it('expect GET /api/positions/:id return 200 with empty object', async () => {
            request(app)
                .get('/api/positions/5d76408900d06b204f998999')
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(Object.keys(res.body).length).to.equal(0);
                })
        }).timeout(2000)

        it('expect POST /api/positions return 200 with created object', async () => {
            const toPass = {
                "type": "fulltime",
                "company": "accesa",
                "address": "Cluj-Napoca",
                "email": "accesahr@accesa.eu",
                "benefits": ["salary", "fresh fruits"],
                "description": "Senior frontend developer wanted!",
                "requirements": {
                    "level": "senior",
                    "language": "Angularjs"
                },
                "candidates": []
            }

            request(app)
                .post('/api/positions')
                .send(JSON.stringify(toPass))
                .set('Content-Type', 'application/json')
                .expect(200)
                .end((err, res) => {
                    expect(err).to.be.null;                  
                })
        }).timeout(2000)

        it('expect POST /api/positions return 400 with validation error', async () => {
            const toPass = {                
                "company": "accesa",
                "address": "Cluj-Napoca",
                "email": "accesahr@accesa.eu",
                "benefits": ["salary", "fresh fruits"],
                "description": "Senior frontend developer wanted!",
                "requirements": {
                    "level": "senior",
                    "language": "Angularjs"
                },
                "candidates": []
            }

            request(app)
                .post('/api/positions')
                .send(JSON.stringify(toPass))
                .set('Content-Type', 'application/json')
                .expect(400)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.error.message).to.equal("cannot POST /api/positions (400)");
                })
        }).timeout(2000)

        it('expect DELETE /api/positions/:id return 204', async () => {

            request(app)
                .delete(`/api/positions/${position_id}`)
                .expect(204)
                .end((err, res) => {
                    expect(err).to.be.null;
                })
        }).timeout(2000)

        it('expect DELETE /api/positions/:id return 400', async () => {

            request(app)
                .delete('/api/positions/5d7221107a4812a1ac9e223')
                .expect(400)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res.error.message).to.equal("cannot DELETE /api/positions/5d7221107a4812a1ac9e223 (400)");
                })
        }).timeout(2000)
    })
});