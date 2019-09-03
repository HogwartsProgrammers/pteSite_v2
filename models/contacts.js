const db = require('./database')

module.exports = class Contacts {
    constructor(
        id,
        title = null,
        type = null,
        parent = null,
        created,
        ) {
        this.id = id
        this.title = title
        this.type = type
        this.parent = parent
        this.created = created
    }

    saveContact() {
        return db.execute(
            'INSERT INTO contacts (title, type, parent) VALUES (?, ?, ?)', [this.title, this.type, this.parent]
        )
    }

    updateContact() {
        return db.execute(
            'UPDATE contacts SET title= ?, type= ?, parent= ? WHERE id= ? LIMIT 1', [this.title, this.type, this.parent, this.id]
        )
    }

    findById(id) {
        return db.execute('SELECT * FROM contacts WHERE id = ? LIMIT 1', [id])
    }

    findByTitle(title) {
        return db.execute('SELECT * FROM contacts WHERE title = ?', [title])
    }

    findLikeTitle(title) {
        return db.execute('SELECT * FROM contacts WHERE title LIKE "%' + title.replace(/\"/g,'') + '%"', [title])
    }

    findByParent(parent) {
        return db.execute('SELECT * FROM contacts WHERE parent = ?', [parent])
    }

    fetchAll() {
        return db.execute('SELECT * FROM contacts')
    }
}