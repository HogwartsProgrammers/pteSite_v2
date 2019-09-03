const bcrypt = require('bcryptjs')
const db = require('./database')

module.exports = class User {
    constructor(id, login = null, pass, fio = '', role = 0) {
        this.id = id
        this.login = login
        this.password = pass
        this.fio = fio
        this.role = role
    }

    encrypt_password(password) {
        return bcrypt.hash(password, 12)
    }

    save() {
        return db.execute(
            'INSERT INTO users (login, password, fio, role) VALUES (?, ?, ?, ?)', [this.login, this.password, this.fio, this.role]
        )
    }

    update() {
        return db.execute(
            'UPDATE users SET login= ?, password= ?, fio= ?, role= ? WHERE id= ? LIMIT 1', [this.login, this.password, this.fio, this.role, this.id]
        )
    }

    updatePass() {
        return db.execute(
            'UPDATE users SET password= ? WHERE id= ? LIMIT 1', [this.password, this.id]
        )
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