const Users = require('../models/users')
const bcrypt = require('bcryptjs')
const cfg = require('./config')


exports.getSignup = (req, res, next) => {
    res.render('signup', {
        pageTitle: 'Регистрация пользователей',
        pageDescription: 'Регистрация',
        pageKeywords: 'registration',
        year: cfg.year,
        path: cfg.path()
    })
}

exports.getLogin = (req, res, next) => {
    res.render('login', {
        pageTitle: 'Авторизация в сервисе',
        pageDescription: 'Авторизация в сервисе',
        pageKeywords: 'авторизация',
        year: cfg.year,
        path: cfg.path()
    })
}

exports.getLogout = (req, res, next) => {
    console.log(req.session.user.login + ' logged out')
    req.session.destroy(err => {
        if (err) console.log(err)
        res.redirect('/login')
    })
}

exports.getRecovery = (req, res, next) => {
    res.render('recovery', {
        pageTitle: 'Восстановление пароля',
        pageDescription: 'Восстановление пароля',
        pageKeywords: 'recovery',
        year: cfg.year,
        path: cfg.path()
    })
}

exports.postLogin = (req, res, next) => {
    const login = req.body.login
    const password = req.body.password
    const User = new Users(null, login, password)
    User.findOne(login)
        .then(row => {
            const user = JSON.parse(JSON.stringify(row[0]))[0]
                // Если логин не найден
            if (!user) {
                return res.redirect('/login')
                    // если логин найден
            } else {
                bcrypt.compare(password, user.password)
                    .then(doMatch => {
                        // если 
                        if (doMatch) {
                            req.session.UserLogged = true
                            req.session.user = user
                            return req.session.save(err => {
                                if (err) console.log(err)
                                return res.redirect('/office')
                            })
                        } else {
                            console.log('---> password invalid...')
                            res.redirect('/login')
                        }
                    })
                    .catch(err => {
                        console.log('BCRYPT Error: ' + err)
                        res.redirect('/login')
                    })
            }
        })
        .catch(err => {
            console.log('MySQL DB Error: ' + err)
        })
}

exports.postSignup = (req, res, next) => {
    const login = req.body.login
    const passcheck = req.body['password-check']
    const password = req.body.password
    if (passcheck !== password) {
        return res.redirect('/signup')
    }
    const User = new Users(null, login, password)
    const ePass = new Promise((resolve, reject) => {
        User.encrypt_password(password).then(result => {
            User.password = result
            return resolve()
        })
    });
    ePass.then(result => {
            User.save()
                .then(result => {
                    req.session.UserLogged = true
                    req.session.user = User
                    console.log('New user "' + login + '" crated!')
                    res.redirect('/office')
                })
                .catch(err => {
                    if (err) console.log(err)
                        // err.errno = 1062, code: ER_DUP_ENTRY = Duplicate entry // если емайл уже существует
                    if (+err.errno === 1062) {
                        res.redirect('/signup')
                    }
                })
        })
        .catch(err => {
            console.log(err)
        })
}