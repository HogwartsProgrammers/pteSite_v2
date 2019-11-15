const bcrypt = require('bcryptjs')
const db = require('./database')

module.exports = class Stats {
    constructor(id, title = null, description, reverted = 0, active = 1) {
        this.id = id
        this.title = title
        this.description = description
        this.reverted = reverted
        this.active = active
    }
    save() {
        db.execute(
            'INSERT INTO stats (title, description, reverted, active) VALUES (?, ?, ?, ?)', [this.title, this.description, this.reverted, this.active]
        )
    }

    update() {
        console.log(this)
        db.execute(
            'UPDATE stats SET title= ?, description= ?, reverted= ?, active= ? WHERE id= ? LIMIT 1', [this.title, this.description, this.reverted, this.active, this.id]
        )
    }

    static fetchAll() {
        return db.execute('SELECT * FROM stats')
    }

    findById(id) {
        return db.execute('SELECT * FROM stats WHERE id= ? LIMIT 1', [id])
    }
}
