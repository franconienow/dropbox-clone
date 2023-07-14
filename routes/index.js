var express = require('express')
var formidable = require('formidable')
var router = express.Router()
var fs = require('fs')
var path = 

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.get('/file', (req, res) => {
  let path = req.query.path

  if (fs.existsSync(path)) {
    fs.readFile(path, (err, data) => {
      if (err) {
        res.status(400).json({
          error: err,
        })
      } else {
        res.status(200).end(data)
      }
    })
  } else {
    res.status(404).json({ error: 'File not found.' })
  }
})

router.delete('/file', (req, res) => {
  let form = new formidable.IncomingForm({
    keepExtensions: true,
    uploadDir: './upload',
  })

  form.parse(req, (err, fields, files) => {
    if (fs.existsSync(fields.path)) {
      fs.unlink(fields.path, err => {
        if (err) {
          res.status(400).json({ err })
        } else {
          res.json({
            fields: fields,
          })
        }
      })
    } else {
      res.status(404).json({ error: 'File not found.' })
    }
  })
})

router.post('/upload', (req, res) => {
  let form = new formidable.IncomingForm({
    keepExtensions: true,
    uploadDir: './upload',
  })

  form.parse(req, (err, fields, files) => {
    res.json({
      files: files,
    })
  })
})

module.exports = router
