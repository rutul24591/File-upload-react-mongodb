let express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    uuidv4 = require('uuid/v4');
    
let router = express.Router();

//User model
let User = require('../models/User');

const DIR = './public/';
 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
 
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/svg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});
 
router.post('/user-profile', upload.single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    console.log("url:::", url, req.file)
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        image: url + '/public/' + req.file.filename
    });

    console.log("user::::", user)
    user.save().then(result => {
        res.status(201).json({
            message: "User registered successfully!",
            userCreated: {
                _id: result._id,
                image: result.image
            }
        })
    }).catch(err => {
        console.log(err),
        res.status(500).json({
        error: err
    });
    })
})
 
module.exports = router;