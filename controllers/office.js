const bcrypt = require('bcryptjs')
const cfg = require('./config')
const Chanels = require('../models/chanels')
const Contacts = require('../models/contacts')
const Email = require('../models/email')
const Lids = require('../models/lids')
const Users = require('../models/users')
const Pipes = require('../models/pipes')
const Phones = require('../models/phones')
const Privilages = require('../models/privilages')
const Posts = require('../models/posts')
const Steps = require('../models/steps')
const Stats = require('../models/stats')

const getTasksAmount = userId => {
    return new Lids().fetchAll().then(data => {
        const lids = Array.from(data[0])

        let amount = 0

        lids.forEach(lid => {
            if (!!lid.lid_data && !!lid.lid_data.tasks)
            lid.lid_data.tasks.forEach(task => {
                const date = {
                    day: Number(task.date.split('/')[0]),
                    month: Number(task.date.split('/')[1]),
                    year: Number(task.date.split('/')[2]),
                    hours: Number(task.time.split(':')[0]),
                    minutes: Number(task.time.split(':')[1]),
                }

                const taskDate = new Date(Number('20' + date.year), date.month - 1, date.day, date.hours, date.minutes)

                const now = new Date().getDate() == date.day && new Date().getMonth()+1 == date.month && Number(String(new Date().getFullYear()).slice(2,4)) == date.year && new Date().getHours() <= date.hours

                if (Number(task.author) == userId && taskDate <= new Date() || now) amount++
            })
        })

        return amount
    })
}

// Страница по роуту office
exports.getOffice = (req, res, next) => {
    if (!req.session.user) res.redirect('/login')
    if (req.session.user.role != 0)
    new Privilages().findById(req.session.user.role).then(privData => {
        if (req.session.UserLogged) {
            if (privData[0][0].privilage_data.main != 'none')
            getTasksAmount(req.session.user.id).then(a => {
                Posts.fetchAll().then(posts => {
                    res.render('office', {
                        pageTitle: 'Панель администрирования',
                        year: cfg.year,
                        path: cfg.path(),
                        access: privData[0][0].privilage_data.main,
                        posts: posts[0].filter(post => post.users.split(',').find(uid => uid == req.session.user.id)),
                        tasks: a
                    })
                })
            })
            else 
            res.render('noAccess', {
                pageTitle: 'Панель администрирования',
                year: cfg.year,
                path: cfg.path()
            })
        } else {
            res.redirect('/login')
        }
    }) 
    else res.render('noProfile', {
        pageTitle: 'Панель администрирования',
        year: cfg.year,
        path: cfg.path()
    })
}

// Страница по роуту lids
exports.getLids = (req, res, next) => {
    if (!req.session.user) res.redirect('/login')
    if (req.session.user.role != 0)
    new Privilages().findById(req.session.user.role).then(privData => {
        if (req.session.UserLogged) {
            if (privData[0][0].privilage_data.lids != 'none')
            Promise.all([
                new Lids().fetchAll(),
                new Contacts().fetchAll(),
                new Phones().fetchAll(),
                new Steps().fetchAll()
            ]).then(result => {
                getTasksAmount(req.session.user.id).then(a => {
                    res.render('lids', {
                        pageTitle: 'Панель администрирования',
                        year: cfg.year,
                        path: cfg.path(),
                        lids: result[0][0],
                        contacts: result[1][0],
                        phones: result[2][0],
                        access: privData[0][0].privilage_data.lids,
                        steps: result[3][0],
                        tasks: a
                    })
                })
            })
            else  
            res.render('noAccess', {
                pageTitle: 'Панель администрирования',
                year: cfg.year,
                path: cfg.path()
            })
        } else {
            res.redirect('/login')
        }
    })
    else res.render('noProfile', { pageTitle: 'Панель администрирования',  year: cfg.year, path: cfg.path() })
}

exports.getCabinet = (req, res, next) => {
    if (req.session.UserLogged) {
        Promise.all([
            Users.findById(req.session.user.id),
            new Privilages().fetchAll(),
        ])
        .then(result => {
            getTasksAmount(req.session.user.id).then(a => {
                Stats.fetchAll().then(stats => {
                    Posts.fetchAll().then(posts => {
                        res.render('cabinet', {
                            pageTitle: 'Панель администрирования',
                            year: cfg.year,
                            path: cfg.path(),
                            mail: result[0][0][0].login,
                            fio: result[0][0][0].fio,
                            id: result[0][0][0].id,
                            created: result[0][0][0].created,
                            privilage: result[1][0].find(el => el.id == result[0][0][0].role ? true : false),
                            stats: stats[0],
                            posts: posts[0].filter(post => post.users.split(',').find(uid => uid == req.session.user.id)),
                            tasks: a
                        })
                    })
                })
            })
        })
    } else {
        res.redirect('/login')
    }
}

exports.getPrivilagesPage = (req, res, next) => {
    if (!req.session.user) res.redirect('/login')
    if (req.session.user.role != 0)
    new Privilages().findById(req.session.user.role).then(privData => {
        if (req.session.UserLogged) {
            if (privData[0][0].privilage_data.privilage != 'none')
            Promise.all([
                Users.fetchAll(),
                new Privilages().fetchAll()
            ])
            .then(result => {
                for (let key in result[0][0]) delete result[0][0][key].password
                getTasksAmount(req.session.user.id).then(a => {
                    res.render('privilages', {
                        pageTitle: 'Панель администрирования',
                        year: cfg.year,
                        path: cfg.path(),
                        res: result[0][0],
                        privs: result[1][0],
                        access: privData[0][0].privilage_data.privilage,
                        tasks: a
                    })
                })
            })
            else  
            res.render('noAccess', {
                pageTitle: 'Панель администрирования',
                year: cfg.year,
                path: cfg.path()
            })
        } else {
            res.redirect('/login')
        }
    })
    else res.render('noProfile', {pageTitle: 'Панель администрирования',year: cfg.year,path: cfg.path()})
}

exports.getCicPage = (req, res, next) => {
    if (!req.session.user) res.redirect('/login')
    if (req.session.user.role != 0)
    new Privilages().findById(req.session.user.role).then(privData => {
        if (req.session.UserLogged) {
            if (privData[0][0].privilage_data.stats != 'none')
            Stats.fetchAll().then(result => {
                getTasksAmount(req.session.user.id).then(a => {
                    Users.fetchAll().then(users => {
                        res.render('cic', {
                            pageTitle: 'Панель администрирования',
                            year: cfg.year,
                            path: cfg.path(),
                            stats: result[0],
                            tasks: a,
                        })
                    })
                })
            })
        }
    })
}

// Отправка всех данных о лидах
exports.getLidsList = (req, res, next) => {
    new Lids().fetchAll().then(result => res.status(201).json(result[0]))
}

exports.getLidsListByStep = (req, res, next) => {
    const data = JSON.parse(JSON.stringify(req.body))
    new Lids().fetchAllByStepId(data.id).then(result => {
        res.status(201).json(result[0].filter(dt => !!dt.active))
    })
}

exports.postLidUpdate = (req, res, next) => {
    const data = JSON.parse(JSON.stringify(req.body))

    new Lids().findById(data.id).then(oldData => {
        new Lids(
            data.id ? data.id : oldData[0][0].id,
            data.phone ? data.phone : oldData[0][0].phone,
            data.title ? data.title : oldData[0][0].title,
            data.req_data ? data.req_data : oldData[0][0].req_data,
            null, 
            data.state ? data.state : oldData[0][0].state,
            data.lid_data ? data.lid_data : oldData[0][0].lid_data,
            data.manager_id ? data.manager_id : oldData[0][0].manager_id,
            data.step_id ? data.step_id : oldData[0][0].step_id,
            data.tunnel_id ? data.tunnel_id : oldData[0][0].tunnel_id,
            data.stage ? data.stage : oldData[0][0].stage,
            data.gi ? data.gi : oldData[0][0].gi,
            data.cgi ? data.cgi : oldData[0][0].cgi,
            data.prepayment ? data.prepayment : oldData[0][0].prepayment,
            data.restpayment ? data.restpayment : oldData[0][0].restpayment,
            data.holder == 'none' ? null : data.holder ? data.holder : oldData[0][0].holder,
            data.sub_holders == 'none' ? null : data.sub_holders ? data.sub_holders : oldData[0][0].sub_holders,
            data.responsible ? data.responsible : oldData[0][0].responsible,
            data.active != null && data.active != undefined ? data.active : oldData[0][0].active,
        ).updateLid()
        .then(result => res.status(200).json('done'))
    })
}

exports.createLid = (req, res, next) => {
    const data = JSON.parse(JSON.stringify(req.body))
    const lid = new Lids(
        null,
        data.phone ? data.phone : null,
        data.title ? data.title : null,
        data.req_data ? data.req_data : null,
        null, 
        data.state ? Number(data.state) : 0,
        data.lid_data ? JSON.stringify(data.lid_data) : null,
        data.manager_id ? Number(data.manager_id) : 0,
        data.step_id ? Number(data.step_id) : 0,
        data.tunnel_id ? Number(data.tunnel_id) : 0,
        data.stage ? Number(data.stage) : 0,
        data.gi ? Number(data.gi) : 0,
        data.cgi ? Number(data.cgi) : 0,
        data.prepayment ? Number(data.prepayment) : 0,
        data.restpayment ? Number(data.restpayment) : null,
        data.holder ? Number(data.holder) : null
    )
    lid.saveLid()
    .then(result => res.status(200).json(result[0]))
}

exports.getHolder = (req, res, next) => {
    const data = JSON.parse(JSON.stringify(req.body))

    Promise.all([
        new Contacts().findById(data.id),
        new Companies().findById(data.id),
    ]).then(result => {
        const contact = result[0][0]
        const company = result[1][0]

        res.status(200).json(contact.length ? contact : company.length ? company : null)
    })
}

// Страница по роуту office/pipes
exports.getPipes = (req, res, next) => {
    if (!req.session.user) res.redirect('/login')
    if (req.session.user.role != 0)
    new Privilages().findById(req.session.user.role).then(privData => {
        if (req.session.UserLogged) {
            if (privData[0][0].privilage_data.pipes != 'none')
            Pipes.fetchAll().then(result => {
                getTasksAmount(req.session.user.id).then(a => {
                    res.render('pipes', {
                        pageTitle: 'Панель администрирования',
                        year: cfg.year,
                        path: cfg.path(),
                        pipes: result[0],
                        access: privData[0][0].privilage_data.pipes,
                        tasks: a
                    })
                })
            })
            else  
            res.render('noAccess', {
                pageTitle: 'Панель администрирования',
                year: cfg.year,
                path: cfg.path()
            })
        } else {
            res.redirect('/login')
        }
    })
    else res.render('noProfile', {pageTitle: 'Панель администрирования', year: cfg.year, path: cfg.path()})
}

// Отображение страницы users
exports.getUsersPage = (req, res, next) => {
    if (!req.session.user) res.redirect('/login')
    if (req.session.user.role != 0)
    new Privilages().findById(req.session.user.role).then(privData => {
        if (req.session.UserLogged) {
            if (privData[0][0].privilage_data.users != 'none')
            Users.fetchAll().then(result => {
                getTasksAmount(req.session.user.id).then(a => {
                    res.render('users', {
                        pageTitle: 'Панель администрирования',
                        year: cfg.year,
                        path: cfg.path(),
                        users: result[0],
                        tasks: a,
                    })
                })
            })
            else  
            res.render('noAccess', {
                pageTitle: 'Панель администрирования',
                year: cfg.year,
                path: cfg.path()
            })
        } else {
            res.redirect('/login')
        }
    })
    else res.render('noProfile', {pageTitle: 'Панель администрирования', year: cfg.year, path: cfg.path()})
}

//Отображение страницы "Статистики"
exports.getStatsPage = (req, res, next) => {
    if (!req.session.user) res.redirect('/login')
    if (req.session.user.role != 0)
    new Privilages().findById(req.session.user.role).then(privData => {
        if (req.session.UserLogged) {
            if (privData[0][0].privilage_data.stats != 'none')
            Stats.fetchAll().then(result => {
                getTasksAmount(req.session.user.id).then(a => {
                    Users.fetchAll().then(users => {
                        res.render('stats', {
                            pageTitle: 'Панель администрирования',
                            year: cfg.year,
                            path: cfg.path(),
                            stats: result[0],
                            tasks: a,
                        })
                    })
                })
            })
        }
    })
}

exports.getPostsPage = (req, res, next) => {
    if (!req.session.user) res.redirect('/login')
    if (req.session.user.role != 0)
    new Privilages().findById(req.session.user.role).then(privData => {
        if (req.session.UserLogged) {
            if (privData[0][0].privilage_data.posts != 'none')
            Posts.fetchAll().then(result => {
                getTasksAmount(req.session.user.id).then(a => {
                    Users.fetchAll().then(users => {
                        Stats.fetchAll().then(stats => {
                            res.render('posts', {
                                pageTitle: 'Панель администрирования',
                                year: cfg.year,
                                path: cfg.path(),
                                posts: result[0],
                                tasks: a,
                                users: users[0],
                                stat_id: stats[0]
                            })
                        })
                    })
                })
            })
        }
    })
}

// Создание нового pipe
exports.postPipes = (req, res, next) => {
    let pipe = JSON.parse(JSON.stringify(req.body))
    const Pipe = new Pipes(0, 0, 0, null, 'Новая воронка')

    Pipe.savePipe()
    .then(result => {
        res.status(201).json({id: result[0].insertId})
    })
    .catch(err => console.log(err))
}

// Страница по роуту office/pipe/:id
exports.getPipe = (req, res, next) => {
    if (!req.session.user) res.redirect('/login')
    if (req.session.user.role != 0)
    new Privilages().findById(req.session.user.role).then(privData => { 
        if (req.session.UserLogged) {
            if (privData[0][0].privilage_data.pipes != 'none') {
                const Pipe = new Pipes(null)
                // const Steps = new Steps(null)
                let pipe = {}
                let steps = {}
                if (isNaN(+req.params.id) || +req.params.id === 0) res.redirect('/office/pipes')

                const pipePromise = Pipe.findById(req.params.id).then(result => {
                    pipe = result[0][0]
                    if (pipe === undefined) res.redirect('/office/pipes')
                    return pipe
                })

                const stepsPromise = Steps.fetchAllById(req.params.id).then(result => {
                    steps = result[0]
                    return steps
                })

                Promise.all([pipePromise, stepsPromise]).then(result => {
                    if (result) {
                        getTasksAmount(req.session.user.id).then(a => {
                            res.render('pipe', {
                                pageTitle: 'Панель администрирования',
                                year: cfg.year,
                                path: cfg.path(),
                                pipe: pipe,
                                steps: steps,
                                access: privData[0][0].privilage_data.pipes,
                                tasks: a
                            })
                        })
                    }
                })
            } else  
            res.render('noAccess', {
                pageTitle: 'Панель администрирования',
                year: cfg.year,
                path: cfg.path()
            })
        } else {
            res.redirect('/login')
        }
    })
    else res.render('noProfile', {         pageTitle: 'Панель администрирования',         year: cfg.year,         path: cfg.path()     })
}

// Обновление информации о pipe
exports.postPipe = (req, res, next) => {
    let pipe = JSON.parse(JSON.stringify(req.body))
    const data = { pipe: null, steps: null }

    Promise.all([
        new Pipes().findData(pipe.id).pipe.then(result => {
            data.pipe = result[0][0]
        }),

        new Pipes().findData(pipe.id).steps.then(result => {
            data.steps = result[0]
        })

    ]).then(result => {
        data.pipe.kanban = JSON.parse(JSON.stringify(data.pipe.kanban))
        if (!data.pipe.kanban) data.pipe.kanban = {}
        else if (pipe.delete) delete data.pipe.kanban[pipe.key]
        else if (pipe.key && !pipe.delete) data.pipe.kanban[pipe.key] = pipe.kanban
        else data.pipe.kanban[new Date().getTime()] = pipe.kanban

        const Pipe = new Pipes(pipe.id, 0, 0, JSON.parse(JSON.stringify(data.pipe.kanban)), pipe.title)
        Pipe.updatePipe()
        .then(result => {
            res.status(201).json('a')
        })
        .catch(err => console.log(err))
    })
}

// Отчистка поля kanban в pipe
exports.clearKanbans = (req, res, next) => {
    let pipe = JSON.parse(JSON.stringify(req.body))
    const Pipe = new Pipes(pipe.id)

    Pipe.updateKanban()
    .then(result => {
        res.status(201).json('c')
        return result
    })
}

// Удаление pipe
exports.deletePipe = (req, res, next) => {
    let pipe = JSON.parse(JSON.stringify(req.body)) 
    const Pipe = new Pipes(pipe.id, 0, 0, 0, null, pipe.active)
    
    Pipe.deletePipe()
    .then(result => {
        res.redirect('/office/pipes')    
    })
    .catch(err => console.log(err))
}

// Отправка информации о pipe и всех его активных шагах
exports.getPipesList = (req, res, next) => {
    let pipe = JSON.parse(JSON.stringify(req.body))
    const Pipe = new Pipes(pipe.id, 0, 0)
    const data = { pipe: null, steps: null }

    const promiseGetPipe = Pipe.findData(pipe.id).pipe.then(result => {
        data.pipe = result[0][0]
    })

    const promiseGetSteps = Pipe.findData(pipe.id).steps.then(result => {
        data.steps = result[0]
    })

    Promise.all([promiseGetPipe, promiseGetSteps]).then(result => {
        res.status(201).json(data)
    })
}

// Сохранение всех шагов
exports.postSteps = (req, res, next) => {
    let step = JSON.parse(JSON.stringify(req.body))

    const Step = new Steps(null, step.id, step.title, null, null, step.vis_data)

    Step.saveStep().then(result => {
        return result[0].insertId
    }).then(result => {
        new Steps(result).findById(result).then(r => {
            res.status(201).json(r[0][0])
        })
    })
}

// Удаление шага
exports.deleteStep = (req, res, next) => {
    let step = JSON.parse(JSON.stringify(req.body)) 
    const Step = new Steps(step.id, null, null, step.active)
    
    Step.deleteStep()
    .then(result => {
        res.status(201).json('b')
        return result 
    })
    .catch(err => console.log(err))
}

// Создание нового шага
exports.postStep = (req, res, next) => {
    let step = JSON.parse(JSON.stringify(req.body))
    new Steps().findById(step.id).then(sd => {
        const Step = new Steps(step.id, null, step.title, null, step.parents ? step.parents : sd[0][0].parents, step.vis_data ? step.vis_data : sd[0][0].vis_data)
        const Pipe = new Pipes(step.pipe_id, 0, 0, step.sec)
        
        Step.updateStep()
        .then(result => {
            res.status(201).json({id: result[0].insertId})
            return result
        })
        .catch(err => console.log(err))
    }) 
}

exports.getAllSteps = (req, res, next) => {
    new Steps().fetchAll().then(result => {
        res.status(200).json(result[0])
    })
}

exports.getChanels = (req, res, next) => {
    if (!req.session.user) res.redirect('/login')
    if (req.session.user.role != 0)
    new Privilages().findById(req.session.user.role).then(privData => {
        if (privData[0][0].privilage_data.chanels != 'none')
            if (req.session.UserLogged){
                getTasksAmount(req.session.user.id).then(a => {
                    res.render('chanels', {
                        pageTitle: 'Панель администрирования',
                       year: cfg.year,
                       path: cfg.path(),
                       access: privData[0][0].privilage_data.chanels,
                       tasks: a
                   })
                })
            } else {
                res.redirect('/login')
            }
        else  
        res.render('noAccess', {
            pageTitle: 'Панель администрирования',
            year: cfg.year,
            path: cfg.path()
        })
    })
    else res.render('noProfile', {         pageTitle: 'Панель администрирования',         year: cfg.year,         path: cfg.path()     })
}

exports.getChanelsData = (req, res, next) => {
    let chanel = JSON.parse(JSON.stringify(req.body))
    new Chanels().fetchAll().then(result => {
        res.status(200).json(result[0])
    })
}

exports.postChanel = (req, res, next) => {
    let chanel = JSON.parse(JSON.stringify(req.body))
    const Chanel = new Chanels(chanel.id ? chanel.id : null, chanel.title, chanel.step ? chanel.step : null, null, chanel.abbr ? chanel.abbr : null)

    if (chanel.id) Chanel.updateChanel().then(result => {
        res.status(201).json('done')
    })
    else Chanel.saveChanel().then(result => {
        res.status(201).json('done')
    })
}

exports.deleteChanel = (req, res, next) => {
    let chanel = JSON.parse(JSON.stringify(req.body))
    const Chanel = new Chanels(chanel.id, null, null, chanel.active)

    Chanel.deleteChanel().then(result => {
        res.status(200).json('done')
    })
}

exports.getPhones = (req, res, next) => {
    const income = JSON.parse(JSON.stringify(req.body))
    switch (income.find) {
        case 'byid': 
        new Phones().findById(income.id).then(result => {
            res.status(201).json(result[0])
        })
        break
        case 'byphone': 
        new Phones().findByPhone(income.phone).then(result => {
            res.status(201).json(result[0])
        })
        break
        case 'byparent': 
        new Phones().findByParent(income.parent).then(result => {
            res.status(201).json(result[0])
        })
        break
        default :
        new Phones().fetchAll().then(result => {
            res.status(201).json(result[0])
        })
    }
}

exports.updatePhone = (req, res, next) => {
    const phones = JSON.parse(JSON.stringify(req.body))

    if (phones.cmd == 'delete') {
        new Phones(phones.id).deletePhone().then(() => res.status(201).json('deleted'))
        return
    }

    if (phones.id)
    new Phones().findById(phones.id).then(oldData => {
        new Phones(
            phones.id,
            phones.phone ? phones.phone : oldData[0][0].phone,
            phones.parent ? phones.parent : oldData[0][0].parent
        ).updatePhone().then(result => {
            res.status(201).json(result[0])
        })
    })
    
    else {
        new Phones(
            null,
            phones.phone ? phones.phone : null,
            phones.parent ? phones.parent : null
        ).savePhone().then(result => {
            res.status(201).json(result[0])
        })
    }
}

exports.getEmail = (req, res, next) => {
    const income = JSON.parse(JSON.stringify(req.body))
    switch (income.find) {
        case 'byid': 
        new Email().findById(income.id).then(result => {
            res.status(201).json(result[0])
        })
        break
        case 'byemail': 
        new Email().findByEmail(income.email).then(result => {
            res.status(201).json(result[0])
        })
        break
        case 'byparent': 
        new Email().findByParent(income.parent).then(result => {
            res.status(201).json(result[0])
        })
        break
        default :
        new Email().fetchAll().then(result => {
            res.status(201).json(result[0])
        })
    }
}

exports.updateEmail = (req, res, next) => {
    const email = JSON.parse(JSON.stringify(req.body))

    if (email.cmd == 'delete') {
        new Email(email.id).deleteEmail().then(() => res.status(201).json('deleted'))
        return
    }

    if (email.id)
    new Email().findById(email.id).then(oldData => {
        new Email(
            email.id,
            email.email ? email.email : oldData[0][0].email,
            email.parent ? email.parent : oldData[0][0].parent
        ).updateEmail().then(result => {
            res.status(201).json(result[0])
        })
    })
    
    else {
        new Email(
            null,
            email.email ? email.email : null,
            email.parent ? email.parent : null
        ).saveEmail().then(result => {
            res.status(201).json(result[0])
        })
    }
}

exports.getContacts = (req, res, next) => {
    const income = JSON.parse(JSON.stringify(req.body))
    switch (income.find) {
        case 'byid': 
        new Contacts().findById(income.id).then(result => {
            res.status(200).json(result[0])
        })
        break
        case 'bytitle': 
        new Contacts().findByTitle(income.title).then(result => {
            res.status(200).json(result[0])
        })
        break
        case 'liketitle': 
        new Contacts().findLikeTitle(income.title).then(result => {
            if (income.only == 'person') result[0] = result[0].filter(el => el.type == income.only)
            if (income.only == 'company') result[0] = result[0].filter(el => el.type == income.only)
            res.status(200).json(result[0])
        })
        break
        case 'byparent': 
        new Contacts().findByParent(income.parent).then(result => {
            res.status(200).json(result[0])
        })
        break
        default :
        new Contacts().fetchAll().then(result => {
            res.status(200).json(result[0])
        })
    }
}

exports.updateContact = (req, res, next) => {
    const contact = JSON.parse(JSON.stringify(req.body))
    
    if (contact.id)
    new Contacts().findById(contact.id).then(oldData => {
        new Contacts(
            contact.id,
            contact.title ? contact.title : oldData[0][0].title,
            contact.type ? contact.type : oldData[0][0].type,
            contact.parent ? contact.parent : contact.parent == 0 ? null : oldData[0][0].parent,
            null
        ).updateContact().then(result => {
            res.status(201).json(result[0])
        })
    })
    
    else {
        new Contacts(
            null,
            contact.title ? contact.title : null,
            contact.type ? contact.type : null,
            contact.parent ? contact.parent : null,
            null
        ).saveContact().then(result => {
            res.status(201).json(result[0])
        })
    }
}

exports.getPrivilages = (req, res, next) => {
    const income = JSON.parse(JSON.stringify(req.body))
    switch (income.find) {
        case 'byid': 
        new Privilages().findById(income.id).then(result => {
            res.status(201).json(result[0])
        })
        break
        case 'byphone': 
        new Privilages().findByTitle(income.phone).then(result => {
            res.status(201).json(result[0])
        })
        break
        case 'byparent': 
        new Privilages().findByParent(income.parent).then(result => {
            res.status(201).json(result[0])
        })
        break
        default :
        new Privilages().fetchAll().then(result => {
            res.status(201).json(result[0])
        })
    }
}

exports.updatePrivilages = (req, res, next) => {
    const privilage = JSON.parse(JSON.stringify(req.body))

    if (privilage.cmd == 'delete') {
        new Privilages(privilage.id).deletePrivilage().then(() => res.status(201).json('deleted'))
        Users.fetchAll().then(data => data[0].forEach(user => {
            if (user.role == privilage.id)
            new Users(
                user.id,
                user.login,
                user.password,
                user.fio,
                0,
                user.posts
            ).update()
        }))
        return
    }

    if (privilage.id)
    new Privilages().findById(privilage.id).then(oldData => {
        new Privilages(
            privilage.id,
            privilage.title ? privilage.title : oldData[0][0].title,
            privilage.parent ? privilage.parent : oldData[0][0].parent,
            JSON.stringify(privilage.privilage_data ? privilage.privilage_data : oldData[0][0].privilage_data)
        ).updatePrivilage().then(result => {
            res.status(201).json(result[0])
        }).catch(err => console.log(err))
    })
    
    else {
        new Privilages(
            null,
            privilage.title ? privilage.title : null,
            privilage.parent ? privilage.parent : null,
            privilage.privilage_data ? privilage.privilage_data : null
        ).savePrivilage().then(result => {
            res.status(201).json(result[0])
        })
    }
}

exports.updateUser = (req, res, next) => {
    const user = JSON.parse(JSON.stringify(req.body))

    Users.findById(user.id).then(oldData => {
        if (user.password) {
            bcrypt.compare(user.password, oldData[0][0].password).then(result => {
                if (result) {
                    const User = new Users(user.id)

                    User.encrypt_password(user.password).then(result => {
                        User.password = result

                        User.updatePass().then(result => {
                            res.status(201).json(result[0])
                        })
                    })
                } else res.status(409).json('incorrect password')
            })
        } 
        else 
        new Users(
            user.id,
            user.login ? user.login : oldData[0][0].login,
            oldData[0][0].password,
            user.fio ? user.fio : oldData[0][0].fio,
            user.role ? user.role : oldData[0][0].role,
            user.active != undefined ? user.active : oldData[0][0].active,
            user.posts != undefined ? user.posts : oldData[0][0].posts,
        ).update().then(result => {
            res.status(201).json(result[0])
        })
    })
}

exports.updatePosts = (req, res, next) => {
    const posts = JSON.parse(JSON.stringify(req.body))

    if (posts.cmd == 'delete') {
        new Posts(posts.id).delete().then(() => res.status(201).json('deleted'))
        return
    }

    if (posts.id)
    new Posts().findById(posts.id).then(oldData => {
        new Posts(
            posts.id,
            posts.parent ? posts.parent : oldData[0][0].parent,
            posts.active != undefined ? posts.active : oldData[0][0].active,
            posts.title ? posts.title : oldData[0][0].title,
            posts.users != undefined ? posts.users : oldData[0][0].users,
            posts.stat_id != undefined ? posts.stat_id : oldData[0][0].stat_id,
        ).update().then(async result => {
            if (posts.users != undefined) {
                const postUsers = posts.users.split(',')
                const users = (await Users.fetchAll())[0]
                console.log(users)
                users.forEach(user => {
                    if (postUsers.find(uid => uid == user.id) && !user.posts.split(',').find(pid => pid == posts.id)) {
                        Users.findById(user.id).then(oldData => {
                            oldData[0][0].posts = oldData[0][0].posts.length ? oldData[0][0].posts.split(',') : []
                            oldData[0][0].posts.push(posts.id)
                            oldData[0][0].posts = oldData[0][0].posts.join(',')
                            new Users(
                                user.id,
                                oldData[0][0].login,
                                oldData[0][0].password,
                                oldData[0][0].fio,
                                oldData[0][0].role,
                                oldData[0][0].active,
                                oldData[0][0].posts
                        ).update()})
                    }
                    if (!postUsers.find(uid => uid == user.id) && user.posts.split(',').find(pid => pid == posts.id)) {
                        Users.findById(user.id).then(oldData => {
                            oldData[0][0].posts = oldData[0][0].posts.length ? oldData[0][0].posts.split(',') : []
                            const index = oldData[0][0].posts.indexOf(posts.id)
                            oldData[0][0].posts.splice(index, 1)
                            oldData[0][0].posts = oldData[0][0].posts.join(',')
                            new Users(
                                user.id,
                                oldData[0][0].login,
                                oldData[0][0].password,
                                oldData[0][0].fio,
                                oldData[0][0].role,
                                oldData[0][0].active,
                                oldData[0][0].posts
                        ).update()})
                    }
                })
            }
            console.log(result)
            res.status(201).json(result[0])
        })
    })
    
    else {
        new Posts(
            null,
            posts.parent ? posts.parent : null,
            posts.active != undefined ? posts.active : 1,
            posts.title ? posts.title : null,
            posts.users != undefined ? posts.users : '',
            posts.stat_id != undefined ? posts.stat_id : '',
        ).save().then(result => {
            res.status(201).json(result[0])
        })
    }
}


exports.updateStats = (req, res, next) => {
    const stats = JSON.parse(JSON.stringify(req.body))
    console.log(stats)

    if (stats.id)
    new Stats().findById(stats.id).then(oldData => {
        console.log(oldData[0][0])
        new Stats(
            stats.id,
            stats.title ? stats.title : oldData[0][0].title,
            stats.description ? stats.description : oldData[0][0].description,
            stats.reverted != undefined ? stats.reverted : oldData[0][0].reverted,
            stats.active != undefined ? stats.active : oldData[0][0].active,
            stats.stat_data ? stats.stat_data : oldData[0][0].stat_data,
            stats.last_day != undefined ? stats.last_day : oldData[0][0].last_day,
            stats.sort != undefined ? stats.sort : oldData[0][0].sort,
        ).update().then(result => res.status(201).json(result[0]))
    })
    else {
        new Stats(
            null,
            stats.title ? stats.title : null,
            stats.description ? stats.description : null,
            stats.reverted != undefined ? stats.reverted : 0,
            stats.active != undefined ? stats.active : 1,
            stats.stat_data ? stats.stat_data : null,
            stats.last_day != undefined ? stats.last_day : 3,
            stats.sort != undefined ? stats.sort : null,
            ).save().then(result => {
            res.status(201).json(result[0])
        })
    }
}

exports.postSortStats = (req, res) => {
    const stats = JSON.parse(JSON.stringify(req.body))
    console.log(stats)
    stats.id.forEach((el, i) => {
        new Stats().findById(el).then(oldData => {
            new Stats(
                el,
                oldData[0][0].title,
                oldData[0][0].description,
                oldData[0][0].reverted,
                oldData[0][0].active,
                oldData[0][0].stat_data,
                oldData[0][0].last_day,
                i,
            ).update()
        })
    })
    res.end()
}

exports.getUsersList = (req, res, next) => {
    const income = JSON.parse(JSON.stringify(req.body))
    switch (income.find) {
        case 'byid': 
        Users.findById(income.id).then(result => {
            res.status(201).json(result[0])
        })
        break
        case 'bylogin': 
        new Users().findOne(income.login).then(result => {
            res.status(201).json(result[0])
        })
        break
        case 'byrole': 
        new Users().find(income.role).then(result => {
            res.status(201).json(result[0])
        })
        break
        case 'search': 
        Users.search(income.fio).then(result => {
            res.status(201).json(result[0])
        })
        break
        default :
        Users.fetchAll().then(result => {
            res.status(201).json(result[0])
        })
    }
}

exports.getPostsList = (req, res, next) => {
    const income = JSON.parse(JSON.stringify(req.body))
    switch (income.find) {
        case 'byid': 
        new Posts().findById(income.id).then(result => {
            res.status(201).json(result[0])
        })
        break
        case 'search': 
        Posts.search(income.title).then(result => {
            res.status(201).json(result[0])
        })
        break
        default :
        Posts.fetchAll().then(result => {
            res.status(201).json(result[0])
        })
    }
}

exports.getStatsList = (req, res, next) => {
    const income = JSON.parse(JSON.stringify(req.body))
    switch (income.find) {
        case 'byid': 
        new Stats().findById(income.id).then(result => {
            res.status(201).json(result[0])
        })
        break
        case 'search': 
        Stats.search(income.title).then(result => {
            res.status(201).json(result[0])
        })
        break
        default :
        Stats.fetchAll().then(result => {
            res.status(201).json(result[0])
        })
    }
}


exports.getTasksPage = (req, res, next) => {
    if (!req.session.user) res.redirect('/login')
    if (req.session.user.role != 0)
    new Privilages().findById(req.session.user.role).then(privData => {
        if (req.session.UserLogged) {
            if (privData[0][0].privilage_data.tasks != 'none')
            Users.fetchAll().then(data => {
                getTasksAmount(req.session.user.id).then(a => {
                    res.render('tasks', {
                        pageTitle: 'Панель администрирования',
                        year: cfg.year,
                        path: cfg.path(),
                        access: privData[0][0].privilage_data.tasks,
                        users: data[0],
                        tasks: a
                    })
                })
            })
            else 
            res.render('noAccess', {
                pageTitle: 'Панель администрирования',
                year: cfg.year,
                path: cfg.path()
            })
        } else {
            res.redirect('/login')
        }
    }) 
    else res.render('noProfile', {
        pageTitle: 'Панель администрирования',
        year: cfg.year,
        path: cfg.path()
    })
}

exports.getContactsPage = (req, res, next) => {
    if (!req.session.user) res.redirect('/login')
    if (req.session.user.role != 0)
    new Privilages().findById(req.session.user.role).then(privData => {
        if (req.session.UserLogged) {
            if (privData[0][0].privilage_data.tasks != 'none')
            Promise.all([
                new Contacts().fetchAll(),
                new Phones().fetchAll(),
                new Email().fetchAll(),
            ]).then(data => {
                getTasksAmount(req.session.user.id).then(a => {
                    res.render('contacts', {
                        pageTitle: 'Панель администрирования',
                        year: cfg.year,
                        path: cfg.path(),
                        access: privData[0][0].privilage_data.tasks,
                        contacts: data[0][0],
                        phones: data[1][0],
                        email: data[2][0],
                        tasks: a
                    })
                })
            })
            else 
            res.render('noAccess', {
                pageTitle: 'Панель администрирования',
                year: cfg.year,
                path: cfg.path()
            })
        } else {
            res.redirect('/login')
        }
    }) 
    else res.render('noProfile', {
        pageTitle: 'Панель администрирования',
        year: cfg.year,
        path: cfg.path()
    })
}