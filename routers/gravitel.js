const express = require('express')
const Calls = require('../models/calls')
const Chanels = require('../models/chanels')
const Lids = require('../models/lids')
const Steps = require('../models/steps')
const Phones = require('../models/phones')
const Contacts = require('../models/contacts')

const fetch = require('node-fetch')

const router = express.Router()

const decode = s => decodeURIComponent(escape(s))

router.post('/gravitel', (req, res, next) => {
    let gd = JSON.parse(JSON.stringify(req.body))
    const call = new Calls(
        null,
        gd.cmd            ? gd.cmd                      : null,
        gd.type           ? gd.type                     : null,
        gd.diversion      ? gd.diversion.substring(1)   : null,
        gd.user           ? gd.user                     : null,
        gd.ext            ? gd.ext                      : null,
        gd.groupRealName  ? gd.groupRealName            : null,
        gd.phone          ? gd.phone.substring(1)       : null,
        gd.start          ? gd.start                    : null,
        gd.duration       ? gd.duration                 : null,
        gd.callid         ? gd.callid                   : null,
        gd.link           ? gd.link                     : null,
        gd.status         ? gd.status                   : null,
        gd.created        ? gd.created                  : null,
        gd.callData       ? gd.callData                 : null
    )
    
    fetch(`https://alarmerbot.ru/?key=94f657-6a1d61-7a5381&message=${decode('\xF0\x9F\x92\xB0')} Лид по звонку:\n\n${decode('\xF0\x9F\x86\x94')} ${gd.callid}\n${decode('\xE2\x98\x8E')} ${gd.diversion}\n${decode('\xF0\x9F\x93\xBC')} ${gd.link || 'Записи нет*'}`, {
        method: 'GET',
        headers:{ "Content-Type": "application/json" }
    })

    if (gd.cmd == 'history') call.save().then(() => {
        new Phones().findByPhone(gd.phone.substring(1)).then(phone => {
            const contact = {data: {}}
            if (!phone[0][0]) {
                new Contacts(null, null, 'person').saveContact().then(data => {
                    new Phones(null, gd.phone.substring(1), data[0].insertId).savePhone()
                    contact.data.id = data[0].insertId
                    createLid()
                })
            } else {
                new Contacts().findById(phone[0][0].parent).then(data => {
                    contact.data = data[0][0]
                    new Lids().findByHolder(contact.data.id).then(lids => {
                        if (!lids[0].length || !lids[0].find(lid => !!lid.active ? true : false)) createLid()
                        else {
                            lids[0].forEach(lid => {
                                new Lids().findById(lid.id).then(oldData => {
                                    oldData[0][0].lid_data.history.push({
                                        type: gd.type == 'in' ? 'callIn' : gd.type == 'out' ? 'callOut' : 'callMissed',
                                        when: new Date(),
                                        author: gd.user,
                                        callid: gd.callid,
                                        link: gd.link,
                                        duration: gd.duration,
                                        status: gd.status,
                                    })

                                    new Lids(
                                        contact.data.id,
                                        null, null, null, null, null,
                                        JSON.stringify(oldData[0][0].lid_data),
                                    ).updateLidData()
                                    .then(() => res.status(200).json('done'))
                                    .catch(err => console.error(err))
                                })
                            })
                        }
                    })
                })
            }

            const createLid = () => {
                new Chanels().findByAbbr(gd.diversion.substring(1)).then(result => {
                    new Steps().findById(result[0][0].step).then(step => {
                        if (result[0]) {
                            new Lids(
                                null,
                                gd.phone.substring(1),
                                null, null, null, null,
                                JSON.stringify({
                                    history: [
                                        {
                                            type: 'create',
                                            when: new Date(),
                                            author: gd.user,
                                            from: 'phonecall',
                                            phone: gd.phone,
                                            diversion: gd.diversion,
                                        },
                                        {
                                            type: gd.type == 'in' ? 'callIn' : gd.type == 'out' ? 'callOut' : 'callMissed',
                                            when: new Date(),
                                            author: gd.user,
                                            callid: gd.callid,
                                            link: gd.link,
                                            duration: gd.duration,
                                            status: gd.status,
                                        }
                                    ]
                                }),
                                null,
                                result[0][0].step,
                                step[0][0].pipe_id,
                                null,
                                null,
                                null,
                                null,
                                null,
                                contact.data.id
                            ).savePhone()
                            .then(result => {
                                res.status(201).json('created')
                            })
                            .catch(err => {
                                res.json('There is error in this action')
                                console.log(err)
                            })
                        }
                    })
                })
            }
        })
    })
    .catch(err => {
        res.json('There is error in this action')
        console.log(err)
    })
})

module.exports = router