const bcrypt = require('bcryptjs')
const db = require('./database')

module.exports = class User {
    constructor(id, login = null, pass, fio = '', role = 0, active = 1, posts) {
        this.id = id
        this.login = login
        this.password = pass
        this.fio = fio
        this.role = role
        this.active = active
        this.posts = posts
    }

    encrypt_password(password) {
        return bcrypt.hash(password, 12)
    }

    save() {
        return db.execute(
            'INSERT INTO users (login, password, fio, role, active, posts) VALUES (?, ?, ?, ?, ?, ?)', [this.login, this.password, this.fio, this.role, this.active, this.posts]
        )
    }

    update() {
        console.log(this)
        return db.execute(
            'UPDATE users SET login= ?, password= ?, fio= ?, role= ?, active= ?, posts=? WHERE id= ? LIMIT 1', [this.login, this.password, this.fio, this.role, this.active, this.posts, this.id]
        )
    }

    updatePass() {
        return db.execute(
            'UPDATE users SET password= ? WHERE id= ? LIMIT 1', [this.password, this.id]
        )
    }
    
    static search(fio) {
        return db.execute(`SELECT * FROM users WHERE fio LIKE "%${fio}%"`)
    }

    static fetchAll() {
        return db.execute('SELECT * FROM users')
    }

    findOne(login) {
        return db.execute('SELECT * FROM users WHERE login = ? LIMIT 1', [login])
    }

    static findById(id) {
        return db.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [id])
    }

    findByRole(role) {
        return db.execute('SELECT * FROM users WHERE role = ?', [role])
    }
}