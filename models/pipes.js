const db = require('./database')

module.exports = class Pipes {
    constructor(
        id,
        parrent_id = 0,
        stage_id = 0,
        kanban = null,
        title = '',
        active = 1
        ) {
        this.id = id
        this.parrent_id = parrent_id
        this.stage_id = stage_id
        this.kanban = kanban
        this.title = title
        this.active = active
    }

    savePipe() {
        return db.execute(
            'INSERT INTO pipes (title) VALUES (?)', [this.title]
        )
    }

    updatePipe() {
        return db.execute(
            'UPDATE pipes SET title= ?, kanban= ? WHERE id= ? LIMIT 1', [this.title, JSON.stringify(this.kanban), this.id]
        )
    }

    deletePipe() {
        // return db.execute(
        //     'DELETE FROM pipes WHERE id= ? LIMIT 1', [this.id]
        // )
        return db.execute(
            'UPDATE pipes SET active= ? WHERE id= ? LIMIT 1', [this.active, this.id]
        )
    }

    updateKanban() {
        return db.execute(
            'UPDATE pipes SET kanban= ? WHERE id= ? LIMIT 1', [this.kanban, this.id]
        )
    }

    static fetchAll() {
        return db.execute('SELECT * FROM pipes WHERE active= 1')
    }

    // findOne(login) {
    //     return db.execute('SELECT * FROM users WHERE login = ? LIMIT 1', [login])
    // }

    findById(id) {
        return db.execute('SELECT * FROM pipes WHERE id = ? LIMIT 1', [id])
    }

    findData(id) {
        return {
            pipe: db.execute('SELECT * FROM pipes WHERE id = ? LIMIT 1', [id]),
            steps: db.execute('SELECT * FROM steps WHERE pipe_id = ? AND active = 1', [id])
        }
    }
}