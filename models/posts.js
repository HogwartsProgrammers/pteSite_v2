const bcrypt = require('bcryptjs')
const db = require('./database')

module.exports = class Posts {
    constructor(id, parent = null, active = 1, title = null, users = '', stat_id = '') {
        this.id = id
        this.parent = parent
        this.title = title
        this.active = active
        this.users = users
        this.stat_id = stat_id
    }

    save() {
        return db.execute(
            'INSERT INTO posts (parent, title, active, users, stat_id) VALUES (?, ?, ?, ?, ?)', [this.parent, this.title, this.active, this.users, this.stat_id]
        )
    }

    update() {
        console.log(this)
        return db.execute(
            'UPDATE posts SET parent= ?, title= ?, active= ?, users= ?, stat_id= ? WHERE id= ? LIMIT 1', [this.parent, this.title, this.active, this.users, this.stat_id, this.id]
        )
    }

    static fetchAll() {
        return db.execute('SELECT * FROM posts')
    }

    findById(id) {
        return db.execute('SELECT * FROM posts WHERE id = ? LIMIT 1', [id])
    }
}