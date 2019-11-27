const bcrypt = require('bcryptjs')
const db = require('./database')

module.exports = class Stats {
    constructor(id, title = null, description, reverted = 0, active = 1, stat_data = null) {
        this.id = id
        this.title = title
        this.description = description
        this.reverted = reverted
        this.active = active
        this.stat_data = JSON.stringify(stat_data)
    }
    save() {
        return db.execute(
            'INSERT INTO stats (title, description, reverted, active, stat_data) VALUES (?, ?, ?, ?, ?)', [this.title, this.description, this.reverted, this.active, this.stat_data]
        )
    }

    update() {
        console.log(this)
        return db.execute(
            'UPDATE stats SET title= ?, description= ?, reverted= ?, active= ?, stat_data= ? WHERE id= ? LIMIT 1', [this.title, this.description, this.reverted, this.active, this.stat_data, this.id]
        )
    }

    static search(title) {
        return db.execute(`SELECT * FROM stats WHERE title LIKE "%${title}%"`)
    }

    static fetchAll() {
        return db.execute('SELECT * FROM stats')
    }

    findById(id) {
        return db.execute('SELECT * FROM stats WHERE id= ? LIMIT 1', [id])
    }
}
