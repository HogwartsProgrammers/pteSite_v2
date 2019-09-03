const db = require('./database')

module.exports = class Chanels {
    constructor(
        id,
        title = null,
        step = null,
        active = 1,
        abbr = null
        ) {
        this.id = id
        this.title = title
        this.step = step
        this.active = active
        this.abbr = abbr
    }

    saveChanel() {
        return db.execute(
            'INSERT INTO chanels (title, step, abbr) VALUES (?, ?, ?)', [this.title, this.step, this.abbr]
        )
    }

    updateChanel() {
        return db.execute(
            'UPDATE chanels SET title= ?, step= ?, abbr= ? WHERE id= ? LIMIT 1', [this.title, this.step, this.abbr, this.id]
        )
    }

    deleteChanel() {
        return db.execute(
            'UPDATE chanels SET active= ? WHERE id= ? LIMIT 1', [this.active, this.id]
        )
    }

    findById(id) {
        return db.execute('SELECT * FROM chanels WHERE id = ? LIMIT 1', [id])
    }

    findByAbbr(abbr) {
        console.log(abbr)
        return db.execute('SELECT * FROM chanels WHERE abbr = ? LIMIT 1', [abbr])
    }

    fetchAll() {
        return db.execute('SELECT * FROM chanels WHERE active= 1')
    }
}