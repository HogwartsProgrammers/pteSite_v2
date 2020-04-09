const Users = require('../models/users')
const Lids = require('../models/lids')
const bcrypt = require('bcryptjs')
const cfg = require('./config')
const Steps = require('../models/steps')
const Chanels = require('../models/chanels')
const Phones = require('../models/phones')
const Contacts = require('../models/contacts')

exports.getFirstPage = (req, res, next) => {
    res.redirect('/login')
    // res.render('main', {
    //     pageTitle: 'Инжиниринговая компания полного цикла ProfTechEngineering',
    //     pageDescription: 'Мы реализуем любые проекты с момента зарождения вашей идеи через все стадии от проектирования до сдачи объекта под ключ',
    //     pageKeywords: 'Инжиниринговая компания, проектирование',
    //     cta: {
    //         discription1: {
    //             content: 'ПОЛУЧИТЕ НАИЛУЧШЕЕ ПРЕДЛОЖЕНИЕ ОТ НАШИХ СПЕЦИАЛИСТОВ',
    //             btn: 'ПОЛУЧИТЬ',
    //             btnTitle: 'ОБРАТНЫЙ ЗВОНОК'
    //         },
    //         discription2: {
    //             content: 'ПОЛУЧИТЕ НАИЛУЧШЕЕ ПРЕДЛОЖЕНИЕ ОТ НАШИХ СПЕЦИАЛИСТОВ',
    //             btn: 'ПОЛУЧИТЬ',
    //             btnTitle: 'ОБРАТНЫЙ ЗВОНОК'
    //         },
    //         discription3: {
    //             content: 'ПОЛУЧИТЕ НАИЛУЧШЕЕ ПРЕДЛОЖЕНИЕ ОТ НАШИХ СПЕЦИАЛИСТОВ',
    //             btn: 'ПОЛУЧИТЬ',
    //             btnTitle: 'ОБРАТНЫЙ ЗВОНОК'
    //         }
    //     },
    //     year: cfg.year,
    //     path: cfg.path()
    // })
}

exports.getThanksPage = (req, res, next) => {
    res.render('thanks', {
        pageTitle: 'Спасибо за обращение в компанию ProfTechEngineering',
        pageDescription: 'Мы реализуем любые проекты с момента зарождения вашей идеи через все стадии от проектирования до сдачи объекта под ключ',
        pageKeywords: '',
        year: cfg.year,
        path: cfg.path()
    })
}

exports.getPolyPage = (req, res, next) => {
    res.render('poly', {
        pageTitle: 'Инжиниринговая компания полного цикла ProfTechEngineering',
        pageDescription: 'Мы реализуем любые проекты с момента зарождения вашей идеи через все стадии от проектирования до сдачи объекта под ключ',
        pageKeywords: 'Инжиниринговая компания, проектирование',
        cta: {
            discription1: {
                content: 'КАКИЕ ПАРАМЕТРЫ ПРОМЫШЛЕННОГО ПОЛА ВАЖНЫ ДЛЯ ВАС',
                btn: 'УКАЗАТЬ',
                btnTitle: 'lorem1'
            },
            discription2: {
                content: 'КАКИЕ ПАРАМЕТРЫ ПРОМЫШЛЕННОГО ПОЛА ВАЖНЫ ДЛЯ ВАС',
                btn: 'УКАЗАТЬ',
                btnTitle: 'lorem2'
            },
            discription3: {
                content: 'КАКИЕ ПАРАМЕТРЫ ПРОМЫШЛЕННОГО ПОЛА ВАЖНЫ ДЛЯ ВАС',
                btn: 'УКАЗАТЬ',
                btnTitle: 'lorem3'
            }
        },
        year: cfg.year,
        path: cfg.path()
    })
}

exports.getskladyPage = (req, res, next) => {
    res.render('sklady', {
        pageTitle: 'Инжиниринговая компания полного цикла ProfTechEngineering',
        pageDescription: 'Мы реализуем любые проекты с момента зарождения вашей идеи через все стадии от проектирования до сдачи объекта под ключ',
        pageKeywords: 'Инжиниринговая компания, проектирование',
        cta: {
            discription1: {
                content: 'ПАРАМЕТРЫ СКЛАДСКОГО ПОМЕЩЕНИЯ',
                btn: 'РАССЧИТАТЬ',
                btnTitle: 'lorem1'
            },
            discription2: {
                content: 'ПАРАМЕТРЫ СКЛАДСКОГО ПОМЕЩЕНИЯ',
                btn: 'РАССЧИТАТЬ',
                btnTitle: 'lorem2'
            },
            discription3: {
                content: 'ПАРАМЕТРЫ СКЛАДСКОГО ПОМЕЩЕНИЯ',
                btn: 'РАССЧИТАТЬ',
                btnTitle: 'lorem3'
            }
        },
        year: cfg.year,
        path: cfg.path()
    })
}

exports.postLids = (req, res, next) => {
    let lid = JSON.parse(JSON.stringify(req.body))

    new Phones().findByPhone(lid.phoneRaw).then(phone => {
        const contact = {data: {}}
        if (!phone[0][0]) {
            new Contacts(null, null, 'person').saveContact().then(data => {
                new Phones(null, lid.phoneRaw, data[0].insertId).savePhone()
                contact.data.id = data[0].insertId
                createLid()
            })
        } else {
            new Contacts().findById(phone[0][0].parent).then(data => {
                contact.data = data[0][0]
                createLid()
            })
        }
        const createLid = () => {
            new Chanels().findByAbbr(lid.lid_data.source ? lid.lid_data.source : 'pure').then(result => {
                if (result[0].length)
                new Steps().findById(result[0][0].step).then(stepData => {
                    if (lid.lid_data) lid.lid_data.history = [
                            {
                                type: 'create',
                                when: new Date().toISOString(),
                                author: null,
                                from: 'website',
                            }
                        ]
                    else lid.lid_data = {
                        history: [
                            {
                                type: 'create',
                                when: new Date().toISOString(),
                                author: null,
                                from: 'website',
                            }
                        ]
                    }

                    lid.lid_data.comment = lid.lid_data.comment

                    const Lid = new Lids(
                        null,
                        lid.phoneRaw,
                        null, null, null, null,
                        JSON.stringify(lid.lid_data),
                        null,
                        result[0][0].step,
                        stepData[0][0].pipe_id,
                        null,
                        null,
                        null,
                        null,
                        null,
                        contact.data.id,
                        null,
                        null,
                        1
                    )
        
                    Lid.savePhone()
                    .then(result => {
                        // res.redirect('/thanks')
                    })
                    .catch(err => console.log(err))
                })
                else {
                    const Lid = new Lids(
                        null,
                        lid.phoneRaw,
                        null,null, null, null,
                        JSON.stringify({
                            history: [
                                {
                                    type: 'create',
                                    when: new Date().toISOString(),
                                    author: null,
                                    from: 'website',
                                }
                            ],
                            commnet: lid.lid_data.comment
                        }),
                        null, 1, 1,
                        null,
                        null,
                        null,
                        null,
                        null,
                        contact.data.id,
                        null,
                        null,
                        1
                    )
                    Lid.savePhone()
                    .then(result => {
                        // res.redirect('/thanks')
                    })
                    .catch(err => console.log(err))
                }
            })
        }
    })
}