require('dotenv').config()
const express = require('express')
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const path = require('path')
const ejs = require('ejs')


aws.config.update({
    secretAccessKey: process.env.AWSSecretKey,
    accessKeyId: process.env.AWSAccessKeyId,
    region: 'us-east-2'
})


const s3 = new aws.S3()

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// // Init Upload
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1000000 },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return cb(new Error('Please upload .jpg, .jpeg, .png'))
//         }

//         cb(undefined, true)
//     }
// }).single('myImage')


const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'gmens-test-1',
      acl: 'public-read',
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
    }), 
    limits: { fileSize: 1000000 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload .jpg, .jpeg, .png'))
        }

        cb(undefined, true)
    }
  }).single('myImage')


// Init app

const app = express()
app.set('view engine', 'ejs')

// Public folder
app.use(express.static('./public'))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            })
        } else {
            if (!req.file) {
                res.render('index', {
                    msg: 'Error: No File Selected!'
                })
            } else {
                res.render('index', {
                    msg: 'File Uploaded!'
                    //file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server started on ' + port)
})
