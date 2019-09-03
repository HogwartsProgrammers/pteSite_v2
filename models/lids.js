const db = require('./database')

module.exports = class Lids {
    constructor(
        id,
        phone = null,
        title = '',
        req_data = {},
        created,
        state = 0,
        lid_data = {},
        manager_id = 0,
        step_id = 0,
        tunnel_id = 0,
        stage = 0,
        gi = 0,
        cgi = 0, 
        prepayment = 0,
        restpayment = 0,
        holder = null,
        sub_holders = null,
        responsible = null,
        active = 1) {
        this.id = id
        this.phone = phone
        this.title = title
        this.req_data = req_data
        this.created = created
        this.state = state
        this.lid_data = lid_data
        this.manager_id = manager_id
        this.step_id = step_id
        this.tunnel_id = tunnel_id
        this.stage = stage
        this.gi = gi
        this.cgi = cgi
        this.prepayment = prepayment
        this.restpayment = restpayment   
        this.holder = holder   
        this.sub_holders = sub_holders   
        this.responsible = responsible   
        this.active = active   
    }

    savePhone() {
        return db.execute(
            'INSERT INTO lids (phone, lid_data, step_id, tunnel_id, holder) VALUES (?, ?, ?, ?, ?)', [this.phone, this.lid_data, this.step_id, this.tunnel_id, this.holder]
        )
    }

    saveLid() {
        return db.execute(
            'INSERT INTO lids (phone, title, manager_id, lid_data, step_id, tunnel_id, holder, sub_holders, gi, cgi, prepayment, restpayment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [this.phone, this.title, this.manager_id, this.lid_data, this.step_id, this.tunnel_id, this.holder, this.sub_holders, this.gi, this.cgi, this.prepayment, this.restpayment]
        )
    }

    fetchAll() {
        return db.execute('SELECT * FROM lids')
    }

    findById(id) {
        return db.execute('SELECT * FROM lids WHERE id = ? LIMIT 1', [id])
    }

    findByHolder(holder) {
        return db.execute('SELECT * FROM lids WHERE holder = ?', [holder])
    }

    fetchAllByStepId(id) {
        return db.execute('SELECT * FROM lids WHERE step_id= ?', [id])
    }

    updateLid() {
        return db.execute(
                'UPDATE lids SET phone= ?, title= ?, req_data= ?, state= ?, step_id= ?, tunnel_id= ?, stage= ?, lid_data= ?, manager_id= ?, gi= ?, cgi= ?, prepayment= ?, restpayment= ?, sub_holders= ?, responsible= ?, holder= ?, active= ? WHERE id= ? LIMIT 1',
                [this.phone, this.title, this.req_data, this.state, this.step_id, this.tunnel_id, this.stage, JSON.stringify(this.lid_data), this.manager_id, this.gi, this.cgi, this.prepayment, this.restpayment, this.sub_holders, this.responsible, this.holder, this.active, this.id]
            )
    }

    updateLidData() {
        return db.execute('UPDATE lids SET lid_data= ? WHERE id= ? LIMIT 1', [this.lid_data, this.id])
    }
}