const db = require('./database')

module.exports = class Privilages {
    constructor(
        id,
        title = null,
        parent = null,
        privilage_data = null,
        ) {
        this.id = id
        this.title = title
        this.parent = parent
        this.privilage_data = privilage_data
    }

    savePrivilage() {
        return db.execute(
            'INSERT INTO privilages (title, parent, privilage_data) VALUES (?, ?, ?)', [this.title, this.parent, JSON.stringify(this.privilage_data)]
        )
    }

    updatePrivilage() {
        return db.execute(
            'UPDATE privilages SET title= ?, parent= ?, privilage_data= ? WHERE id= ? LIMIT 1', [this.title, this.parent, this.privilage_data, this.id]
        )
    }

    findById(id) {
        return db.execute('SELECT * FROM privilages WHERE id = ? LIMIT 1', [id])
    }

    findByTitle(phone) {
        return db.execute('SELECT * FROM privilages WHERE phone = ?', [title])
    }

    findByParent(parent) {
        return db.execute('SELECT * FROM privilages WHERE parent = ?', [parent])
    }

    deletePrivilage() {
        return db.execute(
            'DELETE FROM privilages WHERE id= ?', [this.id]
        )
    }

    fetchAll() {
        return db.execute('SELECT * FROM privilages')
    }
}