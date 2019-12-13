const bcrypt = require('bcryptjs')
const db = require('./database')

module.exports = class Stats {
    constructor(id, title = null, description = null, reverted = 0, active = 1, stat_data = null, last_day = 5, sort = null) {
        this.id = id
        this.title = title
        this.description = description
        this.reverted = reverted
        this.active = active
        this.stat_data = JSON.stringify(stat_data)
        this.last_day = last_day
        this.sort = sort
    }
    save() {
        return db.execute(
            'INSERT INTO stats (title, description, reverted, active, stat_data, last_day, sort) VALUES (?, ?, ?, ?, ?, ?, ?)', [this.title, this.description, this.reverted, this.active, this.stat_data, this.last_day, this.sort]
        )
    }

    update() {
        return db.execute(
            'UPDATE stats SET title= ?, description= ?, reverted= ?, active= ?, stat_data= ?, last_day= ?, sort= ? WHERE id= ? LIMIT 1', [this.title, this.description, this.reverted, this.active, this.stat_data, this.last_day, this.sort, this.id]
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
