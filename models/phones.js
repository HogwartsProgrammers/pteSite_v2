const db = require('./database')

module.exports = class Phones {
    constructor(
        id,
        phone = null,
        parent = null,
        ) {
        this.id = id
        this.phone = phone
        this.parent = parent
    }

    savePhone() {
        return db.execute(
            'INSERT INTO phones (phone, parent) VALUES (?, ?)', [this.phone, this.parent]
        )
    }

    updatePhone() {
        return db.execute(
            'UPDATE phones SET phone= ?, parent= ? WHERE id= ? LIMIT 1', [this.phone, this.parent, this.id]
        )
    }

    findById(id) {
        return db.execute('SELECT * FROM phones WHERE id = ? LIMIT 1', [id])
    }

    findByPhone(phone) {
        return db.execute('SELECT * FROM phones WHERE phone = ?', [phone])
    }

    findByParent(parent) {
        return db.execute('SELECT * FROM phones WHERE parent = ?', [parent])
    }

    deletePhone() {
        return db.execute(
            'DELETE FROM phones WHERE id= ?', [this.id]
        )
    }

    fetchAll() {
        return db.execute('SELECT * FROM phones')
    }
}