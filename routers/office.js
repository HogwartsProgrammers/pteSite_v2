const express = require('express')

const router = express.Router()

const ctrl = require('../controllers/office')

router.get('/', ctrl.getOffice)
router.get('/lids', ctrl.getLids)
router.get('/pipes', ctrl.getPipes)
router.get('/pipes/:id', ctrl.getPipe)
router.get('/chanels', ctrl.getChanels)
router.get('/cabinet', ctrl.getCabinet)
router.get('/privilages', ctrl.getPrivilagesPage)
router.get('/tasks', ctrl.getTasksPage)
router.get('/contacts', ctrl.getContactsPage)
router.get('/users', ctrl.getUsersPage)
router.get('/posts', ctrl.getPostsPage)
router.get('/stats', ctrl.getStatsPage)
router.get('/cic', ctrl.getCicPage)

router.post('/lids/getList', ctrl.getLidsList)
router.post('/lids/getListByStep', ctrl.getLidsListByStep)
router.post('/lids/update', ctrl.postLidUpdate)
router.post('/lids/getHolder', ctrl.getHolder)
router.post('/lids/create', ctrl.createLid)
router.post('/pipes', ctrl.postPipes)
router.post('/steps', ctrl.postSteps)
router.post('/pipes/clearKanbans', ctrl.clearKanbans)
router.post('/pipes/:id', ctrl.postPipe)
router.post('/getPipes', ctrl.getPipesList)
router.post('/steps/edit', ctrl.postStep)
router.post('/steps/getAll', ctrl.getAllSteps)
router.post('/chanels/getData', ctrl.getChanelsData)
router.post('/chanels/update', ctrl.postChanel)
router.post('/users', ctrl.getUsersList)
router.post('/users/update', ctrl.updateUser)
router.post('/posts', ctrl.getPostsList)
router.post('/posts/update', ctrl.updatePosts)
router.post('/stats/update', ctrl.updateStats)
router.post('/stats', ctrl.getStatsList)
router.post('/cic', ctrl.getCicList)

router.post('/phones', ctrl.getPhones)
router.post('/phones/update', ctrl.updatePhone)

router.post('/email', ctrl.getEmail)
router.post('/email/update', ctrl.updateEmail)

router.post('/contacts', ctrl.getContacts)
router.post('/contacts/update', ctrl.updateContact)

router.post('/privilages', ctrl.getPrivilages)
router.post('/privilages/update', ctrl.updatePrivilages)

router.delete('/pipes/delete', ctrl.deletePipe)
router.delete('/steps/delete', ctrl.deleteStep)
router.delete('/chanels/delete', ctrl.deleteChanel)

module.exports = router