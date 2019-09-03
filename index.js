const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const compression = require('compression')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const csrf = require('csurf')
const csrfProtection = csrf()

const dbCheckTables = require('./models/tables_create')
const dbConnect = require('./models/db_connect')
console.log(dbConnect())

const app = express()

const sessionStore = new MySQLStore(dbConnect())

app.use(session({
    key: 'pte-cookie',
    secret: 'this-is-the-secret-string',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'pug')
app.set('views', 'views')
app.use(helmet())
app.use(compression())

const gravitelRoute = require('./routers/gravitel')
app.use(gravitelRoute)

app.use(csrfProtection)
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})

const mainRoute = require('./routers/main')
const officeRoute = require('./routers/office')
const authRoute = require('./routers/auth')

app.use(express.static(path.join(__dirname, 'public')))

app.use(mainRoute)
app.use(authRoute)
app.use('/office', officeRoute)

app.use((req, res, next) => {
    res.status(404).render('404', { PageTitle: 'Error 404 – Page Not Found' })
})

app.listen(process.env.PORT || 3000)