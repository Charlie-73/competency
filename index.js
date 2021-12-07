const http = require('http')
const express = require('express')
const path = require('path')
const session = require('express-session')
const flash = require('express-flash')

const app = express()
const hbs = require('hbs')

const dbConnection = require('./connection/db')

app.use(flash())

// user session 
app.use(
    session({
        cookie: {
                 //hour * minute * second * millisecond
            maxAge: 2 * 60 * 60 * 1000,
            secure: false,
            httpOnly: true
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'
    })
) 

app.use(express.static('express'))
app.use(express.urlencoded({ extended: false }))
app.use('/static', express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

hbs.registerPartials(path.join(__dirname, 'views/partials'))

const authRoute = require('./routes/auth')

app.use((req, res, next) => {
    res.locals.message = req.session.message 
    delete req.session.message
    next()
})

app.get('/', function(req, res) {
    res.render('index', {title: 'Homepage'})
})

//render database
app.get('/', function(req, res) {
    const query = 'SELECT * FROM todo ORDER BY user_id DESC'

    dbConnection.getConnection((err, conn) => {
        console.log('database error: ', err)

        conn.query(query, (err, results) => {
            console.log('query error: ', err)

            let todo =[]

            if(todo.length == 0) {
                todo = false
            }
            //console.log(req.session)
            res.render('/', {title: 'collection'})
        })
        conn.release()
    })
})

app.use('/', authRoute)

const server = http.createServer(app)
const port = 1000
server.listen(port)
console.log('server listening ', port);