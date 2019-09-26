const express = require('express')
const multer = require('multer')
const path = require('path')
const ejs = require('ejs')

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
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
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server started on ' + port)
})
