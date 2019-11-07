const bcrypt = require('bcryptjs')
const db = require('./database')

module.exports = class Posts {
    constructor(id, parent = null, active = 1, title = null, users) {
        this.id = id
        this.parent = parent
        this.title = title
        this.active = active
        this.users = users
    }

    save() {
        return db.execute(
            'INSERT INTO posts (parent, title, active, users) VALUES (?, ?, ?, ?)', [this.parent, this.title, this.active, this.users]
        )
    }

    update() {
        console.log(this)
        return db.execute(
            'UPDATE posts SET parent= ?, title= ?, active= ?, users= ? WHERE id= ? LIMIT 1', [this.parent, this.title, this.active, this.users, this.id]
        )
    }

    static fetchAll() {
        return db.execute('SELECT * FROM posts')
    }

    findById(id) {
        return db.execute('SELECT * FROM posts WHERE id = ? LIMIT 1', [id])
    }
}