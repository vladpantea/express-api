const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');

module.exports = function CommonMiddleware(app) {
    app.use(bodyParser.json({ type: 'application/json' }));    
    app.use(morgan('common'));
    app.use(cors());
    app.use(helmet());
}