const express = require('express')

const router = express.Router()

const ctrl = require('../controllers/main')

router.get('/', ctrl.getFirstPage)
// router.get('/thanks', ctrl.getThanksPage)
// router.get('/poly', ctrl.getPolyPage)
// router.get('/sklady', ctrl.getskladyPage)

router.post('/lids', ctrl.postLids)

module.exports = router