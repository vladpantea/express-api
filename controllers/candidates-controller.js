const router = require('express').Router();
const asyncWrapper = require('../utilities/async-wrapper').AsyncWrapper;
const CandidatesService = require('../services/candidate-service');
const validation = require('../middleware/validator');
const { ValidationError, FileUploadError } = require('../errors/errors');
const errorHelper = require('../utilities/error-helper');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `./${process.env.UPLOAD_FOLDER}/`);
    },
    filename: (req, file, cb) => {
        let fileName = `${file.fieldname}-${Date.now()}.pdf`;
        req.body.cv = fileName;
        cb(null, fileName);
    }
})
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        var extension = path.extname(file.originalname);
        if (extension.toLowerCase() !== '.pdf') {
            cb(new FileUploadError('Invalid file format!'));
            return;
        }

        errorHelper.validate('Candidate', req.body, '', (err) => {
            if(err){
                cb(new ValidationError(err.message));                
            }else{
                cb(null, true);             
            }
        });
    }
});

const candidatesService = new CandidatesService();

router.get('/', asyncWrapper(async (req, res) => {
    let candidates = await candidatesService.findAll();
    res.send(candidates);
}));

router.get('/:id', [validation("Candidate", "id")], asyncWrapper(async (req, res) => {
    let id = req.params['id'];
    let candidate = await candidatesService.findOne(id);
    res.send(candidate);
}));

router.post('/', upload.single('cv'), [validation("Candidate", "cv")], asyncWrapper(async (req, res) => {
    let candidate = req.body;
    let createdCandidate = await candidatesService.create(candidate);
    res.send(createdCandidate);
}));

router.delete('/:id', [validation("Candidate", "id")], asyncWrapper(async (req, res) => {
    let id = req.params['id'];
    await candidatesService.deleteOne(id);
    res.sendStatus(204);
}));

const closeConnection = () => {
    return candidatesService.mongoService.closeConnection()
}

module.exports = {
    router: router,
    connClose: closeConnection
};