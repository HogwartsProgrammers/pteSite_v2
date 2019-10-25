const access = document.getElementById('access').value
const accounting = require('../../accounting.min.js')

const format = data => {
    data += ''
    return data.length < 2 ? data.length < 1 ? '00' : '0' + data : data  
}

const beautyDate = date => {
    date = date.replace(/\//g, '.')
    date = date.split('.')
    date[2] = '20' + date[2]
    return date.join('.')
}

const dhxCalendarOptions = {
    weekStart: "monday",
    mark: d => d.getDate() == new Date().getDate() && d.getMonth() == new Date().getMonth() ? 'markedDay' : ''
}

export function init() {
    const filters = document.querySelectorAll('input[name="filter-radio"]')
    const tasksBody = document.getElementById('tasks')

    const period = document.getElementById('period')

    const filterBtns = document.querySelectorAll('#filters > *')

    const showHiddenSwitch = document.getElementById('showHiddenSwitch')

    const filterDone = event => {
        document.querySelectorAll('.filter-item').forEach(el => {
            if (el.querySelector('input').checked && !showHiddenSwitch.checked) el.classList.add('d-hide') 
            else el.classList.remove('d-hide') 
            const wholeLid = el.parentElement

            let anyTaskShow = Array.from(wholeLid.querySelectorAll('.filter-item')).find(el => el.classList.contains('d-hide') ? false : true)

            if (!anyTaskShow) wholeLid.classList.add('d-hide')
            else wholeLid.classList.remove('d-hide')
        })
        let anyShow = false 

        tasksBody.querySelectorAll('.w100').forEach(el => el.classList.contains('d-hide') ? anyShow = false : anyShow = true)

        if (anyShow) tasksBody.classList.remove('emptyTasks')
        else tasksBody.classList.add('emptyTasks')
    }

    showHiddenSwitch.oninput = filterDone

    filterBtns.forEach((btn, i, arr) => {
        btn.onclick = event => {
            document.getElementById(btn.getAttribute('for')).checked = true

            let picker
            let selectedText
            const popup = new dhx.Popup()

            switch(btn.getAttribute('for')) {
                case 'today': 
                    drawTasks(new Date() , 'today')
                    arr.forEach(el => el.classList.remove('active'))
                    btn.classList.add('active')

                    period.innerText = 'Выбрана сегодняшняя дата'
                    return
                case 'day': 
                    picker = new dhx.Calendar(null, dhxCalendarOptions)
                    selectedText = 'day'
                break
                case '3days': 
                    picker = new dhx.Calendar(null, dhxCalendarOptions)
                    selectedText = '3days'
                break
                case 'week': 
                    picker = new dhx.Calendar(null, dhxCalendarOptions)
                    selectedText = 'week'
                break
                case 'mounth': 
                    picker = new dhx.Calendar(null, { view: "month", value: new Date() })
                    selectedText = 'mounth'
                break
            }

            popup.attach(picker)

            popup.show(btn)

            picker.events.on("change", date => {
                arr.forEach(el => el.classList.remove('active'))

                let future

                const getNewDate = () => new Date(date)

                switch(selectedText) {
                    case 'day': 
                        console.log(date)
                        period.innerText = 'Выбрана дата: ' + beautyDate(picker.getValue())
                    break
                    case '3days': 
                        future = new Date(getNewDate().setDate(getNewDate().getDate() + 3)).toISOString()
                        console.log(future)
                        period.innerText = 'Выбраны дни с ' + beautyDate(picker.getValue()) + ' по ' + future.slice(8,10) + '.' + future.slice(5,7) + '/' + future.slice(0,4)
                    break
                    case 'week': 
                        future = new Date(getNewDate().setDate(getNewDate().getDate() + 7)).toISOString()
                        period.innerText = 'Выбраны дни с ' + beautyDate(picker.getValue()) + ' по ' + future.slice(8,10) + '.' + future.slice(5,7) + '.' + future.slice(0,4)
                    break
                    case 'mounth': 
                        switch(date.getMonth() + 1) {
                            case 1:
                                period.innerText = 'Выбран Январь '
                            break
                            case 2:
                                period.innerText = 'Выбран Февраль '
                            break
                            case 3:
                                period.innerText = 'Выбран Март '
                            break
                            case 4:
                                period.innerText = 'Выбран Апрель '
                            break
                            case 5:
                                period.innerText = 'Выбран Май '
                            break
                            case 6:
                                period.innerText = 'Выбран Июнь '
                            break
                            case 7:
                                period.innerText = 'Выбран Июль '
                            break
                            case 8:
                                period.innerText = 'Выбран Август '
                            break
                            case 9:
                                period.innerText = 'Выбран Сентябрь '
                            break
                            case 10:
                                period.innerText = 'Выбран Октябрь '
                            break
                            case 11:
                                period.innerText = 'Выбран Ноябрь '
                            break
                            case 12:
                                period.innerText = 'Выбран Декабрь '
                            break
                        }
                    break
                }

                btn.classList.add('active')
                drawTasks(date, btn.getAttribute('for'))

                popup.hide()
            })
        }
    })

    const drawTasks = (date, type) => {
        tasksBody.innerHTML = `<div class="loading loading-lg"></div>`
        fetch('/office/lids/getList', {
            method: 'POST',
            body: JSON.stringify({ _csrf: document.getElementById('csrfToken').value }), 
            headers:{"Content-Type": "application/json"}}
        ).then(result => result.json()).then(data => {
            tasksBody.innerHTML = ''

            const lidTasks = []

            data.forEach(lid => {
                lidTasks.push({
                    lidData: lid, 
                    tasks: lid.lid_data.tasks ? lid.lid_data.tasks : null,
                })
            })

            lidTasks.forEach(lid => {
                if (!lid.tasks || lid.tasks.length <= 0) return
                const lidGroup = document.createElement('div')
                lidGroup.innerHTML = `
                    <div class="h4 emptyLidTitle">${lid.lidData.title}</div>
                    <small class="s-rounded pb-1 float-right" title="Маржа"><b class="label label-primary">${accounting.formatMoney(lid.lidData.cgi, '', 2, " ", ",")} р.</b></small>
                    <small class="">
                        Вал: <b class="label label-secondary">${accounting.formatMoney(lid.lidData.gi, '', 2, " ", ",")} р.</b>
                        Предоплата: <b class="label label-secondary">${accounting.formatMoney(lid.lidData.prepayment, '', 2, " ", ",")} р.</b>
                        Доплата: <b class="label label-secondary">${accounting.formatMoney(lid.lidData.restpayment, '', 2, " ", ",")} р.</b>
                    </small>
                `
                lidGroup.classList.add('w100')

                lid.tasks.forEach((task, i) => {
                    const selected = {
                        day: date.getDate(),
                        secondDay: new Date(new Date(date).setDate(new Date(date).getDate() + 1)).getDate(),
                        thirdDay: new Date(new Date(date).setDate(new Date(date).getDate() + 2)).getDate(),
                        month: Number(date.toISOString().slice(5,7)),
                        year: Number(date.toISOString().slice(2,4)),
                    }

                    const taskDates = {
                        day: Number(task.date.split('/')[0]),
                        month: Number(task.date.split('/')[1]),
                        year: Number(task.date.split('/')[2]),
                        hours: Number(task.time.split(':')[0]),
                        minutes: Number(task.time.split(':')[1]),
                    }

                    let overdue = false

                    const taskDate = new Date(Number('20'+taskDates.year),taskDates.month-1,taskDates.day, taskDates.hours, taskDates.minutes)

                    if (taskDate > new Date() && !task.done)
                    switch(type) {
                        case 'day' : 
                            if (
                                taskDates.day != selected.day
                                ||
                                taskDates.month != selected.month
                                ||
                                taskDates.year != selected.year
                            ) {
                                return
                            }
                        break
                        case 'today':
                            if (
                                taskDates.day != selected.day
                                ||
                                taskDates.month != selected.month
                                ||
                                taskDates.year != selected.year
                            ) {
                                return
                            }
                        break
                        case '3days': 
                            if (
                                taskDates.day != selected.day
                                &&
                                taskDates.day != selected.secondDay
                                &&
                                taskDates.day != selected.thirdDay
                                ||
                                taskDates.month != selected.month
                                ||
                                taskDates.year != selected.year
                            ) {
                                return
                            }
                        break
                        case 'week':
                            if (
                                taskDates.day != selected.day
                                &&
                                taskDates.day != new Date(getDate().setDate(getDate().getDate() + 1)).toISOString().slice(8,10)
                                &&
                                taskDates.day != new Date(getDate().setDate(getDate().getDate() + 2)).toISOString().slice(8,10)
                                &&
                                taskDates.day != new Date(getDate().setDate(getDate().getDate() + 3)).toISOString().slice(8,10)
                                &&
                                taskDates.day != new Date(getDate().setDate(getDate().getDate() + 4)).toISOString().slice(8,10)
                                &&
                                taskDates.day != new Date(getDate().setDate(getDate().getDate() + 5)).toISOString().slice(8,10)
                                &&
                                taskDates.day != new Date(getDate().setDate(getDate().getDate() + 6)).toISOString().slice(8,10)
                                ||
                                taskDates.month != selected.month
                                ||
                                taskDates.year != selected.year
                            ) {
                                return
                            }
                        break
                        case 'mounth': 
                            if (
                                taskDates.month != selected.month
                                ||
                                taskDates.year != selected.year
                            ) {
                                return
                            }
                        break
                    }
                    else {
                        overdue = true
                    }

                    const currentTask = document.createElement('div')
                    currentTask.classList.add('filter-item', 'pl-2', 'pt-2', 'form-group', 'd-flex', 'mb-1')
                    if (!showHiddenSwitch.checked && task.done) currentTask.classList.add('d-hide')
                    currentTask.innerHTML = `
                        <label class="form-checkbox wfc d-inline-block pr-1">
                            <input type="checkbox" ${task.done ? 'checked' : ''} data-i="${i}">
                            <i class="form-icon"></i>
                        </label>
                        <div class="d-block w100 mya">
                            <figure class="avatar float-right c-hand" data-initial="?" title="Никто" data-i="${i}"></figure>

                            <button class="editbt d-hide btn btn-link float-right btn-sm" name="saveTask" disabled>
                                <span class="icon icon-share"></span>
                            </button>
                            <button class="editbt d-hide btn btn-link float-right btn-sm" name="rejectTaskEdit" disabled>
                                <span class="icon icon-cross"></span>
                            </button>

                            <span class="c-hand ${overdue && !task.done ? 'text-error' : 'text-gray'}" name="dhxDate" data-i="${i}">${beautyDate(task.date)} </span>
                            <span class="c-hand ${overdue && !task.done ? 'text-error' : 'text-gray'}" name="dhxTime" data-i="${i}">${task.time} </span>
                            <div name="taskTitle" contenteditable="true" data-old="${task.title}" value="${task.title}" data-i="${i}">${task.title}</div>
                        </div>
                    `

                    if (task.author) fetch('/office/users/', {
                        method: 'POST',
                        body: JSON.stringify({ id: task.author, find: 'byid', _csrf: document.getElementById('csrfToken').value }), 
                        headers:{"Content-Type": "application/json"}}
                    ).then(result => result.json()).then(data => {
                        currentTask.querySelector('figure').dataset.initial = data[0].fio.slice(0,1)
                        if (data[0].fio.split(' ')[1]) currentTask.querySelector('figure').dataset.initial += data[0].fio.split(' ')[1].slice(0,1)
                        currentTask.querySelector('figure').title = data[0].fio
                        currentTask.querySelector('figure').dataset.id = data[0].id
                        currentTask.querySelector('figure').classList.add('loaded')
                    })
                    
                    const timePicker = new dhx.Timepicker(null, { actions: true })
                    const datePicker = new dhx.Calendar(null, { weekStart: "monday" })

                    timePicker.setValue(task.time)
                    datePicker.setValue(task.date)

                    const timeLabel = currentTask.querySelector('[name="dhxTime"]')
                    const dateLabel = currentTask.querySelector('[name="dhxDate"]')

                    var timePopup = new dhx.Popup()
                    var datePopup = new dhx.Popup()

                    if (access == 'full') {
                        timePopup.attach(timePicker)
                        datePopup.attach(datePicker)
                    }

                    if (access == 'full') timePicker.events.on("Save", () => {
                        timePopup.hide()
                        lid.lidData.lid_data.tasks[timeLabel.dataset.i].time = timePicker.getValue()
                        fetch('/office/lids/update', {
                            method: 'POST',
                            body: JSON.stringify({
                                    id: lid.lidData.id,
                                    lid_data: lid.lidData.lid_data,
                                    _csrf: document.getElementById('csrfToken').value,
                                }), 
                            headers:{"Content-Type": "application/json"}}
                        ).then(result => result.json()).then(data => {
                            drawTasks(date, type)
                        })
                    })

                    if (access == 'full') datePicker.events.on("change", () => {
                        datePopup.hide()
                        lid.lidData.lid_data.tasks[dateLabel.dataset.i].date = datePicker.getValue()
                        fetch('/office/lids/update', {
                            method: 'POST',
                            body: JSON.stringify({
                                    id: lid.lidData.id,
                                    lid_data: lid.lidData.lid_data,
                                    _csrf: document.getElementById('csrfToken').value,
                                }), 
                            headers:{"Content-Type": "application/json"}}
                        ).then(result => result.json()).then(data => {
                            drawTasks(date, type)
                        })
                    })

                    if (access == 'full') {
                        timeLabel.onclick = event => {
                            timePopup.show(timeLabel)
                            document.querySelector('.dhx_timepicker__button-close').onclick = event => timePopup.hide()
                        }

                        dateLabel.onclick = event => {
                            datePopup.show(dateLabel) 
                        }
                    }

                    const taskTitle = currentTask.querySelector('[name="taskTitle"]')
                    const saveTask = currentTask.querySelector('[name="saveTask"]')
                    const rejectTaskEdit = currentTask.querySelector('[name="rejectTaskEdit"]')

                    taskTitle.onfocus = event => {
                        taskTitle.classList.add('active')
                        saveTask.classList.remove('d-hide')
                        rejectTaskEdit.classList.remove('d-hide')
                        saveTask.disabled = false
                        rejectTaskEdit.disabled = false
                    }

                    taskTitle.onblur = event => setTimeout(() => {
                        taskTitle.classList.remove('active')
                        saveTask.classList.add('d-hide')
                        rejectTaskEdit.classList.add('d-hide')
                        saveTask.disabled = true
                        rejectTaskEdit.disabled = true
                    }, 200)

                    if (access == 'full') saveTask.onclick = event => {
                        console.log(taskTitle.innerText.trim().length)
                        if (taskTitle.innerText.trim().length != 0) {
                            taskTitle.contenteditable = false
                            saveTask.disabled = true
                            rejectTaskEdit.disabled = true

                            taskTitle.innerText = taskTitle.innerText.replace(/\r?\n/g, ' ').trim()
    
                            lid.lidData.lid_data.tasks[taskTitle.dataset.i].title = taskTitle.innerText
    
                            fetch('/office/lids/update', {
                                method: 'POST',
                                body: JSON.stringify({
                                        id: lid.lidData.id,
                                        lid_data: lid.lidData.lid_data,
                                        _csrf: document.getElementById('csrfToken').value,
                                    }), 
                                headers:{"Content-Type": "application/json"}}
                            ).then(result => result.json()).then(() => {
                                taskTitle.contenteditable = true
                                saveTask.disabled = false
                                rejectTaskEdit.disabled = false

                                taskTitle.dataset.old = taskTitle.innerText
    
                                taskTitle.blur()
                            })
                        }
                    }

                    if (access == 'full') rejectTaskEdit.onclick = event => {
                        taskTitle.innerText = taskTitle.dataset.old
                    }

                    if (access == 'full') currentTask.querySelector('input').oninput = event => {
                        lid.lidData.lid_data.tasks[event.target.dataset.i].done = event.target.checked
                        fetch('/office/lids/update', {
                            method: 'POST',
                            body: JSON.stringify({
                                    id: lid.lidData.id,
                                    lid_data: lid.lidData.lid_data,
                                    _csrf: document.getElementById('csrfToken').value,
                                }), 
                            headers:{"Content-Type": "application/json"}}
                        ).then(result => result.json())
                    }

                    const authorUser = currentTask.querySelector('figure')
                    const userSelectModal = document.getElementById('userSelectModal')
                    const rejectSelection = document.getElementById('rejectSelection')
                    const confirmUser = document.getElementById('confirmUser')

                    authorUser.onclick = event => {
                        userSelectModal.classList.add('active')
                        const usersTiles = userSelectModal.querySelectorAll('.card-body .tile')

                        const selected = Array.from(usersTiles).find(el => el.dataset.id == authorUser.dataset.id ? el : false)

                        if (selected) selected.classList.add('active') 
                        else usersTiles.forEach(el => el.classList.remove('active'))

                        usersTiles.forEach(userTile => {
                            userTile.onclick = event => {
                                usersTiles.forEach(el => el.classList.remove('active'))
                                userTile.classList.add('active')
                                
                                confirmUser.onclick = event => confirmUserSelectFunc(event, authorUser.dataset.i, userTile.dataset.id)
                            }
                        })
                    }

                    const confirmUserSelectFunc = (event, i, id) => {
                        lid.lidData.lid_data.tasks[i].author = id

                        fetch('/office/lids/update', {
                            method: 'POST',
                            body: JSON.stringify({
                                    id: lid.lidData.id,
                                    lid_data: lid.lidData.lid_data,
                                    _csrf: document.getElementById('csrfToken').value,
                                }), 
                            headers:{"Content-Type": "application/json"}}
                        ).then(result => result.json()).then(() => {
                            drawTasks(date, type)
                        })
                    }

                    lidGroup.insertAdjacentElement('beforeend', currentTask)
                })

                lidGroup.insertAdjacentHTML('beforeend', `<div class="divider"></div>`)
                if (lidGroup.querySelectorAll('.filter-item').length) tasksBody.insertAdjacentElement('beforeend', lidGroup)

                filterDone()
            })

            let anyShow = false 

            tasksBody.querySelectorAll('.w100').forEach(el => el.classList.contains('d-hide') ? anyShow = false : anyShow = true)

            if (anyShow) tasksBody.classList.remove('emptyTasks')
            else tasksBody.classList.add('emptyTasks')
        })
    }

    drawTasks(new Date(), 'today')
}