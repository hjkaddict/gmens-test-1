require('dotenv').config()
const express = require('express')
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3-transform')
const path = require('path')
const ejs = require('ejs')
const Jimp = require('jimp')
const sharp = require('sharp')


aws.config.update({
    secretAccessKey: process.env.AWSSecretKey,
    accessKeyId: process.env.AWSAccessKeyId,
    region: 'us-east-2'
})

const s3 = new aws.S3()

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'gmens-test-1',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        limits: { fileSize: 5000000 },

        //* add a function 'Please upload .jpg .jpeg .png' here

        fileFilter: function (req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Only image files are allowed!'));
            }
            cb(null, true);
        },

        shouldTransform: function (req, file, cb) {
            cb(null, /^image/i.test(file.mimetype))
        },
        transforms: [{
            id: 'manipulated',
            key: function (req, file, cb) {
                let fileSplit = file.originalname.split('.')

                let filename = fileSplit.slice(0, fileSplit.length - 1)
                filename.push(Date.now())
                filename = filename.join('_') + '.' + fileSplit[fileSplit.length - 1]

                cb(null, filename)
            },
            transform: function (req, file, cb) {
                cb(null, sharp().jpeg({
                    quality: 10,
                    chromaSubsampling: '4:4:4'
                })                  
                    .modulate({ hue: 120 }))
            }
        }]
    })
})


// Init app

const app = express()
app.set('view engine', 'ejs')

// Public folder
app.use(express.static('./public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/upload', upload.single('myImage'), (req, res, next) => {


    if (!req.file) {
        res.render('index', {
            msg: 'Error: No File Selected!'
        })
    } else {
        res.render('index', {
            msg: 'File Uploaded!',
            imgUrl: req.file.transforms[0].location
        })
    }

})


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server started on ' + port)
})
