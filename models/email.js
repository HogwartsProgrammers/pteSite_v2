const db = require('./database')

module.exports = class Email {
    constructor(
        id,
        email = null,
        parent = null,
        ) {
        this.id = id
        this.email = email
        this.parent = parent
    }

    saveEmail() {
        return db.execute(
            'INSERT INTO email (email, parent) VALUES (?, ?)', [this.email, this.parent]
        )
    }

    updateEmail() {
        return db.execute(
            'UPDATE email SET email= ?, parent= ? WHERE id= ? LIMIT 1', [this.email, this.parent, this.id]
        )
    }

    findById(id) {
        return db.execute('SELECT * FROM email WHERE id = ? LIMIT 1', [id])
    }

    findByEmail(email) {
        return db.execute('SELECT * FROM email WHERE email = ?', [email])
    }

    findByParent(parent) {
        return db.execute('SELECT * FROM email WHERE parent = ?', [parent])
    }

    deleteEmail() {
        return db.execute(
            'DELETE FROM email WHERE id= ?', [this.id]
        )
    }

    fetchAll() {
        return db.execute('SELECT * FROM email')
    }
}