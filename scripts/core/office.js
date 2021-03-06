import EditStats from './editStats.component'

document.querySelectorAll('.go-back').forEach(btn => btn.onclick = () => window.history.back())

document.querySelectorAll('header a').forEach((a,i,arr) => {
    if (a.getAttribute('href') == window.location.pathname) {
        if (i == 0) a.setAttribute('style', 'color:red !important')
        else {
            a.classList.remove('btn-link')
            a.classList.add('btn-error')
        }
    }
})

const route = location.pathname.toLocaleLowerCase()

const access = document.getElementById('access').value

// Закрытие всех модалов при нажатии на элемент с .modal-close классом
document.querySelectorAll('.modal-close').forEach(el => {
    el.addEventListener('click', event => document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active')))
})

try {
    document.getElementById('closeLowAccessWarn').onclick = event => {
        closeWarn(event.target.parentElement)
    }

    const flash = setInterval(() => {
        document.querySelector('.low-access').classList.remove('slideInRight')
        document.querySelector('.low-access').classList.add('flash')
    }, 3000)

    setTimeout(() => {
        document.querySelectorAll('.low-access').forEach(el => {
            closeWarn(el)
        })
    }, 6000)

    const closeWarn = el => {
        clearInterval(flash)
        el.classList.remove('slideInRight')
        el.classList.add('fadeOutRight')
        setTimeout(() => {
            el.remove()
        }, 1000)
    }
} catch(err) {console.info('Full access on this page')}

try {
    const ru = {
        monthShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июнь", 
                     "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        month: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
                "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        weekdaysShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        weekdays: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", 
                    "Пятница", "Суббота"]
    };

    dhx.i18n.setLocale("calendar", ru)

} catch(err) { console.warn('no dxh installed') }

// Pipes route
if (route === '/office/pipes' || route === '/office/pipes/') {
    require('./officeScripts/pipesRouteScript.js').pipesRouteScript()
}

if (route === '/office/lids' || route === '/office/lids/') {
    require('./officeScripts/manualLidCration.js').init()
}

// Pipe route
if (route.split('/')[2] === 'pipes' && !isNaN(+route.split('/')[3]) && +route.split('/')[3] != 0) {
    require('../dragscroll')
    require('./officeScripts/pipeEditing.js').pipeEditing()
    require('./officeScripts/stepsScript').stepsScript()
    require('./officeScripts/visScript').visScript()
    const kanbanScriptClass = require('./officeScripts/kanbanScript').KanbanScript
    new kanbanScriptClass().init()
    if (access != 'full') setInterval(() => {document.querySelectorAll('.lid-menu input, .lid-menu button, .lid-menu textarea').forEach(el => el.disabled = true)}, 1000)
}

// Chanels route 
if (route === '/office/chanels' || route === '/office/chanels/') {
    // Кнопка открытия модала добавления канала
    if (access == 'full') document.getElementById('openChanelAddingBtn').addEventListener('click', event => {
        document.getElementById('chanelAdding').classList.add('active')
    })

    // Валидация названия
    if (access == 'full') document.getElementById('newChanelTitle').addEventListener('input', event => {
        if ((event.target.value.trim()+'').length > 3) {
            event.target.classList.remove('is-error')
            document.getElementById('createNewChanel').disabled = false
        } else {
            event.target.classList.add('is-error')
            document.getElementById('createNewChanel').disabled = true
        }
    })

    // Создание нового канала
    if (access == 'full') document.getElementById('createNewChanel').addEventListener('click', event => {
        fetch('/office/chanels/update', {
            method: 'POST',
            body: JSON.stringify({
                title: document.getElementById('newChanelTitle').value,
                step: document.getElementById('stepsSelect').value,
                abbr: document.getElementById('newAbbrChanel').value,
                _csrf: document.getElementById('csrfToken').value
            }), 
            headers:{
                "Content-Type": "application/json"
            }
        }).then(result => {
            drawTable()
        })
    })

    // Рисуем таблицу
    const drawTable = () => {
        Promise.all([
            fetch('office/chanels/getData', {
                method: 'POST',
                body: JSON.stringify({_csrf: document.getElementById('csrfToken').value}), 
                headers:{
                    "Content-Type": "application/json"
                }
            }).then(result => {
                return result.json()
            }),
            fetch('/office/steps/getAll', {
                method: 'POST',
                body: JSON.stringify({_csrf: document.getElementById('csrfToken').value}), 
                headers:{
                    "Content-Type": "application/json"
                }
            }).then(result => result.json())
        ]).then(result => {
            const table = document.getElementById('tableBody')
            table.parentElement.classList.remove('d-hide')
            table.innerHTML = ''
            document.getElementById('openChanelAddingBtn').classList.remove('d-hide')
            if (table.parentElement.parentElement.querySelector('.loading')) table.parentElement.parentElement.querySelector('.loading').remove()
    
            result[0].forEach(chanelData => {
                let stepTitle = chanelData.step  
                result[1].forEach(step => {
                    if (step.id === chanelData.step) stepTitle = step.title
                })

                const tr = document.createElement('tr')
                const titleTd = document.createElement('td')
                titleTd.innerText = chanelData.title
                tr.insertAdjacentElement('beforeend', titleTd)
                const stepTd = document.createElement('td')
                if (chanelData.step) stepTd.innerText = stepTitle
                else {
                    stepTd.innerText = 'Шага нет'
                    stepTd.classList.add('text-gray')
                }
                tr.insertAdjacentElement('beforeend', stepTd)
                const abbrTd = document.createElement('td')
                if (chanelData.abbr) abbrTd.innerText = chanelData.abbr
                else {
                    abbrTd.innerText = 'Аббревиатуры нет'
                    abbrTd.classList.add('text-gray')
                }
                tr.insertAdjacentElement('beforeend', abbrTd)
                const editChanel = document.createElement('button')
                editChanel.classList.add('btn')
                editChanel.classList.add('btn-sm')
                editChanel.classList.add('btn-link')
                editChanel.classList.add('d-hide')
                editChanel.classList.add('p-absolute')
                editChanel.innerHTML = `<img src="images/edit.svg" alt="">`
                titleTd.insertAdjacentElement('beforeend', editChanel)

                document.getElementById('chaneEditinglTitleInput').addEventListener('input', event => 
                    (event.target.value+'').length > 3 ?
                    document.getElementById('editChanelBtn').disabled = false:
                    document.getElementById('editChanelBtn').disabled = true
                )

                if (access == 'full') editChanel.addEventListener('click', event => {
                    document.getElementById('chanelEditing').classList.add('active')
                    document.getElementById('chanelEditingTitle').innerText = document.getElementById('chaneEditinglTitleInput').value = chanelData.title
                    document.getElementById('editAbbrChanel').value = chanelData.abbr ? chanelData.abbr : ''
                    document.getElementById('stepsSelectEdit').value = chanelData.step ? chanelData.step : 0

                    document.getElementById('editChanelBtn').onclick = event => {
                        fetch('/office/chanels/update', {
                            method: 'POST',
                            body: JSON.stringify({
                                id: chanelData.id,
                                title: document.getElementById('chaneEditinglTitleInput').value,
                                step: document.getElementById('stepsSelectEdit').value,
                                abbr: document.getElementById('editAbbrChanel').value,
                                _csrf: document.getElementById('csrfToken').value
                            }), 
                            headers:{
                                "Content-Type": "application/json"
                            }
                        }).then(() => {
                            drawTable()
                        })
                    }

                    if (access == 'full') document.getElementById('deleteChanel').onclick = event => {
                        if (!confirm('Вы точно хотите удалить канал?')) return
                        fetch('/office/chanels/delete', {
                            method: 'DELETE',
                            body: JSON.stringify({
                                id: chanelData.id,
                                active: 0,
                                _csrf: document.getElementById('csrfToken').value
                            }), 
                            headers:{
                                "Content-Type": "application/json"
                            }
                        }).then(() => {
                            drawTable()
                            document.getElementById('chanelEditing').classList.remove('active')
                        })
                    }
                })

                tr.addEventListener('mouseenter', event => editChanel.classList.remove('d-hide'))
                tr.addEventListener('mouseleave', event => editChanel.classList.add('d-hide'))

                table.insertAdjacentElement('beforeend', tr)
            })

            const stepsSelect = document.getElementById('stepsSelect')
            const stepsSelectEdit = document.getElementById('stepsSelectEdit')
            stepsSelect.innerHTML = stepsSelectEdit.innerHTML = '<option value="0">Без шага</option>'

            result[1].forEach(step => {
                const option = document.createElement('option')
                if (step.title) option.innerText = step.title
                else option.innerText = 'У шага нет названия; id: ' + step.id
                option.value = step.id
                stepsSelect.insertAdjacentElement('beforeend', option)
                stepsSelectEdit.insertAdjacentHTML('beforeend', option.outerHTML)
            })
        })
    }
    drawTable()
}

// Cabinet route
if (route === '/office/cabinet' || route === '/office/cabinet/') {
    const isValidMail = mail => { 
        return /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(mail)
    } 

    document.getElementById('mail').oninput = event => {
        if (isValidMail(event.target.value) && event.target.value != event.target.dataset.old)
        document.getElementById('saveInfo').disabled = false
        else  document.getElementById('saveInfo').disabled = true
    }

    document.getElementById('fio').oninput = event => {
        if (event.target.value != event.target.dataset.old)
        document.getElementById('saveInfo').disabled = false
        else  document.getElementById('saveInfo').disabled = true
    }

    document.getElementById('saveInfo').onclick = event => {
        fetch('/office/users/update', {
            method: 'POST',
            body: JSON.stringify({
                id: document.getElementById('userId').value,
                login: document.getElementById('mail').value,
                fio: document.getElementById('fio').value,
                _csrf: document.getElementById('csrfToken').value
            }), 
            headers:{
                "Content-Type": "application/json"
            }
        }).then(result => result.json()).then(() => {
            document.getElementById('fio').dataset.old = document.getElementById('fio').value
            document.getElementById('mail').dataset.old = document.getElementById('mail').value
            event.target.disabled = true
        }) 
    }

    const oldPass = document.getElementById('oldPass')
    const newPass = document.getElementById('newPass')
    const newPassRepeat = document.getElementById('newPassRepeat')
    const change = document.getElementById('change')

    const checkValid = () => {
        if (oldPass.value.length > 0 && newPass.value.length > 5 && newPassRepeat.value.length > 5 && newPass.value == newPassRepeat.value)
        change.disabled = false
        else change.disabled = true
    }

    const checkPassValid = event => {
        checkValid()
        event.target.parentElement.querySelectorAll('input:not(#oldPass)').forEach(input => {
            if (input.value.length < 6) input.classList.add('is-error')
            else input.classList.remove('is-error')
        })

        if (oldPass.value.length > 0) oldPass.classList.remove('is-error')
        else oldPass.classList.add('is-error')

        if (newPassRepeat.value != newPass.value || newPassRepeat.value.length <= 0)
        newPassRepeat.classList.add('is-error')
        else newPassRepeat.classList.remove('is-error')
    }

    oldPass.oninput = checkPassValid
    newPass.oninput = checkPassValid
    newPassRepeat.oninput = checkPassValid

    change.onclick = event => {
        event.target.disabled = true
        oldPass.disabled = true
        newPass.disabled = true
        newPassRepeat.disabled = true

        fetch('/office/users/update', {
            method: 'POST',
            body: JSON.stringify({
                id: document.getElementById('userId').value,
                password: oldPass.value,
                newPassword: newPass.value,
                _csrf: document.getElementById('csrfToken').value
            }), 
            headers:{
                "Content-Type": "application/json"
            }
        }).then(result => result.json()).then(data => {
            oldPass.value = newPass.value = newPassRepeat.value = ''
            oldPass.disabled = false
            newPass.disabled = false
            newPassRepeat.disabled = false
        })
    }
    const personData = document.getElementById('person')
    const personSwitch = document.getElementById('personSwitch')
    personSwitch.onchange = () => {
        personSwitch.checked ? personData.classList.remove('d-hide') : personData.classList.add('d-hide')
    }
    EditStats.editStat()
}   

// Privilages route
if (route === '/office/privilages' || route === '/office/privilages/') {
    const privilagesModal = document.getElementById('privilagesModal')
    const privilagesOpenModal = document.getElementById('privilagesOpenModal')
    
    privilagesOpenModal.onclick = () =>  privilagesModal.classList.add('active')

    const privilagesSelect = document.getElementById('privilagesOption')

    // Название и родитель
    const privilageTitle = document.getElementById('privilageTitle')
    const parentPrivilage = document.getElementById('parentPrivilage')

    // Валидация названия
    const validateTitle = event => {
        if (event.target.value.trim().length > 5) event.target.classList.remove('is-error') 
        else event.target.classList.add('is-error')
    }

    privilageTitle.oninput = validateTitle
    privilageTitle.onfocus = validateTitle

    privilageTitle.onblur = event => {
        event.target.classList.remove('is-error')
    }

    // Доступы
    const mainPageAccess = document.getElementById('mainPageAccess')
    const lidsAccess = document.getElementById('lidsAccess')
    const pipesAccess = document.getElementById('pipesAccess')
    const chanelsAccess = document.getElementById('chanelsAccess')
    const privilagesAccess = document.getElementById('privilagesAccess')
    const tasksAccess = document.getElementById('tasksAccess')
    const usersAccess = document.getElementById('usersAccess')
    const postsAccess = document.getElementById('postsAccess')
    const statsAccess = document.getElementById('statsAccess')

    // privilage_data
    const createPrivilageData = () => {
        const getRadioSelect = el => {
            let ans
            el.querySelectorAll('input').forEach(input => {
                if (input.checked) ans = input.dataset.access
            })
            return ans
        }

        return {
            main: getRadioSelect(mainPageAccess),
            lids: getRadioSelect(lidsAccess),
            pipes: getRadioSelect(pipesAccess),
            chanels: getRadioSelect(chanelsAccess),
            privilage: getRadioSelect(privilagesAccess),
            tasks: getRadioSelect(tasksAccess),
            users: getRadioSelect(usersAccess),
            posts: getRadioSelect(postsAccess),
            stats: getRadioSelect(statsAccess),
        }
    }

    // Расставить в зависимости от privilage_data
    const setPrivilages = privilage_data => {
        const setAccess = (el, access) => {
            el.querySelector('input[data-access="'+access+'"]').checked = true
        }

        for (let key in privilage_data) {
            switch(key) {
                case 'main': setAccess(mainPageAccess, privilage_data[key])
                break
                case 'lids': setAccess(lidsAccess, privilage_data[key])
                break
                case 'pipes': setAccess(pipesAccess, privilage_data[key])
                break
                case 'chanels': setAccess(chanelsAccess, privilage_data[key])
                break
                case 'privilage': setAccess(privilagesAccess, privilage_data[key])
                break
                case 'tasks': setAccess(tasksAccess, privilage_data[key])
                break
                case 'users': setAccess(usersAccess, privilage_data[key])
                break
                case 'posts': setAccess(postsAccess, privilage_data[key])
                break
                case 'stats': setAccess(statsAccess, privilage_data[key])
            }
        }
    }

    // Отключить доступы, недоступные родителю
    const disablePrivilages = privilage_data => {
        privilagesModal.querySelectorAll('input[data-access="full"]').forEach(radio => radio.disabled = true)   
        const disable = (el, access) => {
            el.querySelector('input[data-access="full"]').disabled = access == 'full' ? false : true
            el.querySelector('input[data-access="watch"]').disabled = access == 'full' || access == 'watch' ? false : true
        }

        for (let key in privilage_data) {
            switch(key) {
                case 'main': disable(mainPageAccess, privilage_data[key])
                break
                case 'lids': disable(lidsAccess, privilage_data[key])
                break
                case 'pipes': disable(pipesAccess, privilage_data[key])
                break
                case 'chanels': disable(chanelsAccess, privilage_data[key])
                break
                case 'privilage': disable(privilagesAccess, privilage_data[key])
                break
                case 'tasks': disable(tasksAccess, privilage_data[key])
                break
                case 'users': disable(usersAccess, privilage_data[key])
                break
                case 'posts': disable(postsAccess, privilage_data[key])
                break
                case 'stats': disable(statsAccess, privilage_data[key])
            }
        }
    }

    // Сохранить и удалить профиль
    const savePrivilage = document.getElementById('savePrivilage')
    const deletePrivilage = document.getElementById('deletePrivilage')

    // Задаём нужные скрипты
    const initPrivilagesEdit = id => {
        privilagesModal.querySelectorAll('input, select, button').forEach(input => input.disabled = true)
        privilagesModal.querySelectorAll('input[data-access="full"]').forEach(radio => radio.checked = true)   
        parentPrivilage.querySelectorAll('option').forEach(opt => opt.classList.remove('d-hide'))
        savePrivilage.onclick = null
        parentPrivilage.value = '0'

        fetch('/office/privilages/', {
            method: 'POST',
            body: JSON.stringify({ _csrf: document.getElementById('csrfToken').value }), 
            headers:{"Content-Type": "application/json"}
        }).then(result => result.json()).then(data => {
            privilagesModal.querySelectorAll('input, select, button').forEach(input => input.disabled = false)

            // Если не новый профиль
            if (id != 'new') {
                const currnet = data.find(el => el.id == id ? true : false)
                const parent = currnet.parent ? data.find(el => el.id == currnet.parent ? true : false) : null
                const childs = []
                data.forEach(priv => {
                    if (priv.parent == id) {
                        childs.push(priv)
                        parentPrivilage.querySelector('option[value="'+priv.id+'"]').classList.add('d-hide')
                    } 
                })
                privilageTitle.value = currnet.title

                setPrivilages(currnet.privilage_data)

                if (parent) {
                    parentPrivilage.value = parent.id
                    disablePrivilages(parent.privilage_data)
                }

                parentPrivilage.querySelector('option[value="'+id+'"]').classList.add('d-hide')
                deletePrivilage.classList.remove('d-hide')

                savePrivilage.onclick = event => {
                    if (privilageTitle.value.trim().length > 2) {
                        privilagesModal.querySelectorAll('input, select, button').forEach(input => input.disabled = true)
                        if (access == 'full') fetch('/office/privilages/update', {
                            method: 'POST',
                            body: JSON.stringify({
                                id: id,
                                title: privilageTitle.value,
                                parent: parentPrivilage.value,
                                privilage_data: createPrivilageData(),
                                _csrf: document.getElementById('csrfToken').value
                            }), 
                            headers:{"Content-Type": "application/json"}
                        }).then(result => result.json()).then(() => {
                            privilagesModal.querySelectorAll('input, select, button').forEach(input => input.disabled = false)
                            if (parent) disablePrivilages(parent)
                        })
                    }
                    else {
                        privilageTitle.scrollIntoView({ behavior: 'smooth', block: 'end'})
                        privilageTitle.classList.add('is-error')
                    }
                }

                deletePrivilage.onclick = event => {
                    if (confirm('Вы точно хотите удалить?')){
                        privilagesModal.querySelectorAll('input, select, button').forEach(input => input.disabled = true)
                        if (access == 'full') fetch('/office/privilages/update', {
                            method: 'POST',
                            body: JSON.stringify({
                                id: id,
                                cmd: 'delete',
                                _csrf: document.getElementById('csrfToken').value
                            }), 
                            headers:{"Content-Type": "application/json"}
                        }).then(result => result.json()).then(() => {
                            privilagesModal.querySelectorAll('input, select, button').forEach(input => input.disabled = false)

                            initPrivilagesEdit('new')
                            privilagesSelect.value = 'new'
                            privilagesSelect.querySelector('option[value="'+id+'"]').remove()
                            parentPrivilage.querySelector('option[value="'+id+'"]').remove()
                        })
                    }
                }
            // Создание нового профиля
            } else {
                parentPrivilage.oninput = event => {
                    if (event.target.value != '0') {
                        const currnet = data[event.target.value-1]

                        setPrivilages(currnet.privilage_data)
                        disablePrivilages(currnet.privilage_data)
                    } else {
                        privilagesModal.querySelectorAll('.access input[type="radio"]').forEach(input => input.disabled = false)
                        privilagesModal.querySelectorAll('input[data-access="full"]').forEach(radio => radio.checked = true)   
                    }
                }

                savePrivilage.onclick = event => {
                    if (privilageTitle.value.trim().length > 5) {
                        privilagesModal.querySelectorAll('input, select, button').forEach(input => input.disabled = true)
                        if (access == 'full') fetch('/office/privilages/update', {
                            method: 'POST',
                            body: JSON.stringify({
                                title: privilageTitle.value,
                                parent: parentPrivilage.value,
                                privilage_data: createPrivilageData(),
                                _csrf: document.getElementById('csrfToken').value
                            }), 
                            headers:{"Content-Type": "application/json"}
                        }).then(result => result.json()).then(data => {
                            privilagesModal.querySelectorAll('input, select, button').forEach(input => input.disabled = false)

                            privilagesSelect.insertAdjacentHTML('afterbegin', `
                                <option value="${data.insertId}">${privilageTitle.value}</option>
                            `)
                            privilagesSelect.value = data.insertId
                            parentPrivilage.insertAdjacentHTML('afterbegin', `
                                <option value="${data.insertId}">${privilageTitle.value}</option>
                            `)

                            initPrivilagesEdit(data.insertId)
                        })
                    }
                    else {
                        privilageTitle.scrollIntoView({ behavior: 'smooth', block: 'end'})
                        privilageTitle.classList.add('is-error')
                    }
                }

                privilageTitle.value = ''
                deletePrivilage.classList.add('d-hide')
            }
        })
    }

    privilagesSelect.oninput = event => initPrivilagesEdit(event.target.value)

    initPrivilagesEdit('new')

    // Все строки таблици аккаунтов
    const trs = document.querySelectorAll('#users tbody tr')

    // tr с редактирование user`a
    const editingUser = `
        <tr class="t-edit">
            <td colspan="4">
                <div class="btn btn-clear float-right close-editUser"></div>
                <div class="d-flex">
                    <div class="col-4">
                        <label>login</label>
                        <input class="form-input mb-2 newLogin" placeholder="pochta@email.ru" disabled>
                        <label>ФИО</label>
                        <input class="form-input mb-2 newFio" placeholder="Иванов Иван Иванович" disabled>
                        <label>Профиль</label>
                        <select class="form-select mb-2 newProfile" disabled>
                            <option value="0">Без профиля</option>
                        </select>
                        <button class="btn btn-sm btn-primary mla d-block mt-2 save" disabled>Сохранить</button>
                    </div>      
                </div>
            </td>
        </tr>
    `

    const initEditingUsers = () => {
        trs.forEach(tr => {
            tr.onclick = event => {
                if (!event.target.classList.contains('t-edit')) {
                    document.querySelectorAll('.t-edit').forEach(edit => edit.remove())

                    tr.insertAdjacentHTML('afterend', editingUser)

                    // Закрытие редактирования
                    const closeEditUser = document.querySelectorAll('.close-editUser')
                    closeEditUser.forEach(close => {
                        close.onclick = event => document.querySelectorAll('.t-edit').forEach(edit => edit.remove())
                    })

                    if (access == 'full') fetch('/office/privilages/', {
                        method: 'POST',
                        body: JSON.stringify({ _csrf: document.getElementById('csrfToken').value }), 
                        headers:{"Content-Type": "application/json"}
                    }).then(result => result.json()).then(data => {
                        const edit = document.querySelector('.t-edit')

                        const target = event.path[1]
                        const targetData = JSON.parse(target.dataset.data)

                        const newLogin = edit.querySelector('.newLogin')
                        const newFio = edit.querySelector('.newFio')
                        const newProfile = edit.querySelector('.newProfile')

                        newLogin.value = targetData.login
                        newFio.value = targetData.fio

                        data.forEach(data => newProfile.insertAdjacentHTML('beforeend', `<option value="${data.id}">${data.title}</option>`))

                        newProfile.value = targetData.role

                        const save = edit.querySelector('.save')
                        save.onclick = event => {
                            fetch('/office/users/update', {
                                method: 'POST',
                                body: JSON.stringify({
                                    id: targetData.id,
                                    login: newLogin.value,
                                    fio: newFio.value,
                                    role: newProfile.value,
                                    _csrf: document.getElementById('csrfToken').value
                                }), 
                                headers:{"Content-Type": "application/json"}
                            }).then(result => result.json()).then(data => {
                                targetData.login = newLogin.value
                                targetData.fio = newFio.value
                                targetData.role = newProfile.value

                                target.querySelector('.login').innerText = newLogin.value
                                target.querySelector('.fio').innerText = newFio.value
                                target.querySelector('.priv').innerText = newProfile.value != '0' ? newProfile.querySelector('option[value="'+newProfile.value+'"]').innerText : ''

                                event.path[1].dataset.data = JSON.stringify(targetData)

                                document.querySelectorAll('.t-edit').forEach(edit => edit.remove())
                            })
                        }

                        edit.querySelectorAll('input, select, button').forEach(input => input.disabled = false)
                    })
                }
                disableAll()
            }
        })
    }

    initEditingUsers()

    if (access != 'full') {
        setInterval(() => {
            disableAll()
        }, 300)
    }

    
    const disableAll = () => {
        document.querySelectorAll('.access input, #savePrivilage, #deletePrivilage, .save, .newLogin, .newFio, .newProfile').forEach(el => {
            el.disabled = true
        })
    }
}

if (route === '/office/tasks' || route === '/office/tasks/') {
    require('./officeScripts/tasksPage.js').init()
}

if (route === '/office/contacts' || route === '/office/contacts/') {
    require('./officeScripts/contactsPage.js').init()
}

// Страница "Сотрудники"
if (route === '/office/users' || route === '/office/users/') {
    require('./officeScripts/usersPage.js').init()
}

// Страница "Посты"
if (route === '/office/posts' || route === '/office/posts/') {
    require('./officeScripts/postsPage.js').init()
}

// Страница "Статистики"
if (route === '/office/stats' || route === '/office/stats/') {
    require('./officeScripts/statsPage.js').init()
}

// Страница "Офис"
if (route === '/office' || route === '/office/') {
    require('./officeScripts/officePage.js').init()
}

// Страница "ИЦО"
if (route === '/office/cic' || route === '/office/cic/') {
    require('./officeScripts/cicPage.js').init()
}