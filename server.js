const express = require('express')
const bodyParser= require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect("mongodb+srv://Chase:123@cluster0-o2g0q.mongodb.net/test?retryWrites=true&w=majority", (err, client) => {
  if (err) return console.log(err)
  db = client.db('Cluster0') // whatever your database name is
  
  app.listen(3000, () => {
    console.log('listening on 3000')
  })

  /*
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
    // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
    // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
  })
*/

  app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

/*
app.get('/', (req, res) => {
    var cursor = db.collection('quotes').find()
  })
  

  db.collection('quotes').find().toArray(function(err, results) {
    console.log(results)
    // send HTML file populated with quotes here
  })
*/

  app.get('/', (req, res) => {
    db.collection('quotes').find().toArray((err, result) => {
      if (err) return console.log(err)
      // renders index.ejs
      res.render('index.ejs', {quotes: result})
    })
  })

  app.put('/quotes', (req, res) => {
    db.collection('quotes')
    .findOneAndUpdate({name: 'Yoda'}, {
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    }, {
      sort: {_id: -1},
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })

  app.delete('/quotes', (req, res) => {
    db.collection('quotes').findOneAndDelete({name: req.body.name},
    (err, result) => {
      if (err) return res.send(500, err)
      res.send({message: 'A darth vadar quote got deleted'})
    })
  })
  
})
