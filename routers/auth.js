const express = require('express')

const router = express.Router()

const ctrl = require('../controllers/auth')

router.get('/signup', ctrl.getSignup)
router.get('/login', ctrl.getLogin)
router.get('/logout', ctrl.getLogout)
router.get('/recovery', ctrl.getRecovery)

router.post('/signup', ctrl.postSignup)
router.post('/login', ctrl.postLogin)

module.exports = router