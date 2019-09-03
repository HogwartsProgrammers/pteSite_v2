const db = require('./database')

module.exports = class Calls {
    constructor(
        id,
        cmd = null,
        type = null,
        diversion = null,
        user = null,
        ext = null,
        groupRealName = null,
        phone = null,
        start = null,
        duration = null,
        callid = null,
        link = null,
        status = null,
        created = null,
        callData = null
        ) {
        this.id = id
        this.cmd = cmd
        this.type = type
        this.diversion = diversion
        this.user = user
        this.ext = ext
        this.groupRealName = groupRealName
        this.phone = phone
        this.start = start
        this.duration = duration
        this.callid = callid
        this.link = link
        this.status = status
        this.created = created
        this.callData = callData
    }
    
    save() {
        return db.execute(
            'INSERT INTO calls (type, diversion, user, ext, groupRealName, phone, start, duration, callid, link, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [this.type, this.diversion, this.user, this.ext, this.groupRealName, this.phone, this.start, this.duration, this.callid, this.link, this.status]
        )
    }
}