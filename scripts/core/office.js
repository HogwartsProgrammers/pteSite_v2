import *  as d3 from "d3"

document.querySelectorAll('.go-back').forEach(btn => btn.onclick = () => window.history.back())

document.querySelectorAll('header a').forEach(a => {
    if (a.getAttribute('href') == window.location.pathname) {
        a.classList.remove('btn-link')
        a.classList.add('btn-error')
    }
})




const route = location.pathname.toLocaleLowerCase()

const access = document.getElementById('access').value

const format = data => {
    data += ''
    return data.length < 2 ? data.length < 1 ? '00' : '0' + data : data  
}

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
    
    // Календарь статистик
    const dhxCalendar = new dhx.Calendar('stats_calendar', {
        dateFormat:"%d.%m.%Y",
        value: new Date(),
        weekStart: "monday"
    })
    
    // Выбор поста
    const postsSelect = document.getElementById('posts')
    
    const selectPost = async () => {
        if (!postsSelect.querySelector('option')) return
        const posts = await fetch('/office/posts', {
            method: 'POST',
            body: JSON.stringify({
                find: 'byid',
                id: Number(postsSelect.value),
                _csrf: document.getElementById('csrfToken').value
            }), 
            headers:{
                "Content-Type": "application/json"
            }
        }).then(result => result.json()).then(result => result)

        if (!posts[0].stat_id) return

        let stat_id = posts[0].stat_id.split(',')
        let stats = []
        
        const select = document.querySelector('#select_stats select')
        select.innerHTML = ''
        select.classList.add('form-select', 'p-centered')
        stat_id.forEach(statId => {
            let stat = fetch('/office/stats', {
                method: 'POST',
                body: JSON.stringify({
                    find: 'byid',
                    id: statId,
                    _csrf: document.getElementById('csrfToken').value
                }), 
                headers:{
                    "Content-Type": "application/json"
                }
            }).then(result => result.json()).then(result => result)
            
            stats.push(stat)
        })

        await Promise.all(stats).then(result => result.map(dt => dt[0])).then(result => result.forEach(stat => {
            if (!stat) return
            const option = document.createElement('option')
            option.setAttribute('value', stat.id)
            option.innerText = stat.title
            select.insertAdjacentElement('beforeend', option)
        }))
        selectStat()
    }
    
    postsSelect.onchange = () => {
        localStorage.setItem('postId', postsSelect.value)
        selectPost()
    }
    if (localStorage.getItem('postId')) postsSelect.value = localStorage.getItem('postId')
    selectPost()

    const weekSwitch = document.getElementById('weekSwitch')

    // Отрисвка статистик d3 js
    const margin = {top: 40, right: 30, bottom: 50, left: 60}
    let graphWidth = 1000 - margin.left - margin.right
    const graphHeight = 400 - margin.top - margin.bottom
    const svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", graphWidth + margin.left + margin.right)
        .attr("height", graphHeight + margin.top + margin.bottom)
        
    const graph = svg.append("g")
        .attr('width', graphWidth)
        .attr('height', graphHeight)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const x = d3.scaleLinear().range([0,graphWidth])
    const y = d3.scaleLinear().range([graphHeight,0])
    
    const xAxisGroup = graph.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + graphHeight + ')')

    const yAxisGroup = graph.append('g')
        .attr('class', 'y-axis')
        
    const line = d3.line()
        .x(function(d,i,a){ return x(i + 1)})
        .y(function(d){ return y(d.value)})

    const path = graph.append('path')

    const dottedLines = graph.append('g')
        .attr('class', 'lines')
        .style('opacity', 0)

    const xDottedLine = dottedLines.append('line')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', 4)

    const yDottedLine = dottedLines.append('line')
        .attr('stroke', '#aaa')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', 4)

    const dateFromString = (date) => new Date(date.split('.')[2],date.split('.')[1] - 1,date.split('.')[0])

    const drawStats = (data) => {
        data = data.map(day => {
            return {
                date: day.date,
                value: Number(day.value)
            }
        })
        
        x.domain([1,data.length])
        y.domain([0, (d3.max(data, d => d.value) / 100 * 20)+d3.max(data, d => d.value)])

        path.data([data])
            .attr('fill', 'none')
            .attr('stroke', '#000')
            .attr('stroke-width', 2)
            .attr('d', line)

        const circles = graph.selectAll('circle')
            .data(data)

        circles.exit().remove()

        circles
            .attr('cx', (d,i) => x(i + 1))
            .attr('cy', d => y(d.value))

        circles.enter()
            .append('circle')
                .attr('r', 4)
                .attr('cx', (d,i) => x(i + 1))
                .attr('cy', d => y(d.value))
                .attr('fill', '#000')
            
        graph.selectAll('circle')
            .on('mouseover', (d,i,n) => {
                d3.select(n[i])
                    .transition().duration(100)
                        .attr('r', 8)
                        .attr('fill', '#000')
                xDottedLine
                    .attr('x1', x(i + 1))
                    .attr('x2', x(i + 1))
                    .attr('y1', graphHeight)
                    .attr('y2', y(d.value))
                yDottedLine
                    .attr('x1', 0)
                    .attr('x2', x(i + 1))
                    .attr('y1', y(d.value))
                    .attr('y2', y(d.value))

                dottedLines.style('opacity', 1)
            })
            .on('mouseleave', (d,i,n) => {
                d3.select(n[i])
                    .transition().duration(100)
                        .attr('r', 4)
                        .attr('fill', '#000')

                dottedLines.style('opacity', 0)
            })
        
        const xAxis = d3.axisBottom(x)
            .ticks(data.length)
            .tickFormat((d,i) => data.length > 7 ? data[i].date : data[i].date)

        const yAxis = d3.axisLeft(y)
            .ticks(4)
        
        xAxisGroup.call(xAxis)
        yAxisGroup.call(yAxis)

        xAxisGroup.selectAll('text')
            .attr('transform', data.length > 7 ? 'rotate(-60) translate(-25, 0)' : '')
    }

    // выбор статистики
    const statsSelect = document.getElementById('stats')

    const selectStat = async (dateWeek) => {
        let stats = await fetch('/office/stats', {
            method: 'POST',
            body: JSON.stringify({
                find: 'byid',
                id: Number(statsSelect.value),
                _csrf: document.getElementById('csrfToken').value
            }), 
            headers:{
                "Content-Type": "application/json"
            }
        }).then(result => result.json()).then(result => result[0])
        if (!stats) return
        if (stats.stat_data == null) stats.stat_data = []

        
        const statInput = document.getElementById('stats_value')
        
        statInput.value = 0
        
        let currentDay = dhxCalendar.getValue()

        let currentWeek = dateWeek

        let currentWeekDay = dhxCalendar.getValue(true).getDay() || 7   

        let lastWeekDay

        let currentWeekDays = []
        
        currentWeekDay - stats.last_day <= 0 
        ? lastWeekDay = new Date(new Date(dhxCalendar.getValue(true)).setDate(dhxCalendar.getValue(true).getDate() + (-(currentWeekDay - stats.last_day))))
        : lastWeekDay = new Date(new Date(dhxCalendar.getValue(true)).setDate(dhxCalendar.getValue(true).getDate() + (7 - (currentWeekDay - stats.last_day))))

        if (!weekSwitch.checked) {
            const currentStatValue = stats.stat_data.find(sdata => sdata.date == currentDay)
            if (currentStatValue) statInput.value = currentStatValue.value
        } else {
            const currentStatValue = stats.stat_data.find(sdata => sdata.date == currentWeek)
            if (currentStatValue) statInput.value = currentStatValue.value
        }

        if (!weekSwitch.checked) {
            if (currentDay)  statInput.classList.remove('d-hide') 
            for (let i = 0; i < 7; i++) {
                document.getElementById('stats_calendar_weeks').classList.add('d-hide')
                document.getElementById('stats_calendar').classList.remove('d-hide')
                let date = new Date(new Date(lastWeekDay).setDate(lastWeekDay.getDate() - i))
                date = `${format(date.getDate())}.${format(date.getMonth() + 1)}.${date.getFullYear()}`
                let lastWeekDayIndex = stats.stat_data.indexOf(stats.stat_data.find(stat => stat.date == date))
                currentWeekDays.push(stats.stat_data[lastWeekDayIndex] || {date,value: 0})
            }
            currentWeekDays.reverse()
            drawStats(currentWeekDays)
        }

        if (weekSwitch.checked) {
            currentWeek ? statInput.classList.remove('d-hide') : statInput.classList.add('d-hide')
            document.getElementById('stats_calendar').classList.add('d-hide')
            document.getElementById('stats_calendar_weeks').classList.remove('d-hide')
            let currentYearDays = stats.stat_data.filter(stat => stat.date.split('.')[2] == new Date().getFullYear())
            currentYearDays.filter(stat => {
                const day = new Date(stat.date.split('.')[2],stat.date.split('.')[1] - 1,stat.date.split('.')[0]).getDay()
                return (day || 7) == stats.last_day
            })

            let i = new Date(new Date().getFullYear(),0,1).getDay()

            i - stats.last_day <= 0 
            ? i = new Date(new Date(new Date().getFullYear(),0,1).setDate(new Date(new Date().getFullYear(),0,1).getDate() - (i - stats.last_day)))
            : i = new Date(new Date(new Date().getFullYear(),0,1).setDate(new Date(new Date().getFullYear(),0,1).getDate() + (7 - (i -stats.last_day))))

            const weeksHolder = document.getElementById('calendar_body')

            let everyLastDayCurrentYear = []
            let noWeek = 1
            while (i.getFullYear() == new Date().getFullYear() ) {
                let date = `${format(i.getDate())}.${format(i.getMonth() + 1)}.${i.getFullYear()}` 
                if (weeksHolder.querySelectorAll('.btn-week').length < 52) {
                    let week = document.createElement('button')
                    week.classList.add('btn-week', 'btn', 'btn-sm', 'btn-link', 'tooltip')
                    week.dataset.date = date
                    week.dataset.tooltip = date
                    week.innerText = noWeek
                    weeksHolder.insertAdjacentElement('beforeend', week)
                }
                everyLastDayCurrentYear.push(stats.stat_data.find(data => data.date == date) || {date,value:0})
                i = new Date(i.setDate(i.getDate() + 7))
                noWeek++
            }
            drawStats(everyLastDayCurrentYear)
        }
        
        dhxCalendar.events.on('Change', () => {
            currentDay = dhxCalendar.getValue()
        })

        statInput.onkeydown = event => {
            if (event.code == 'Enter') {
                event.preventDefault()
                statInput.blur()
            }
        }


        document.querySelectorAll('#calendar_body .btn-week').forEach(el => {
            el.onclick = (event) => {
                let date = event.target.dataset.date
                selectStat(date)
            }
        })

        statInput.onblur = async event => {
            if (!statInput.value) statInput.value = 0

            let data 
            weekSwitch.checked ? data = {date: currentWeek,value: statInput.value}  : data = {date: currentDay,value: statInput.value}

            let currentStat = stats.stat_data.find(sdata => weekSwitch.checked ? sdata.date == currentWeek: sdata.date == currentDay)
            if (currentStat) {
                let statIndex = stats.stat_data.indexOf(currentStat)
                stats.stat_data[statIndex] = data
            } else stats.stat_data.push(data)

            await fetch('/office/stats/update', {
                method: 'POST',
                body: JSON.stringify({
                    id: Number(statsSelect.value),
                    stat_data: stats.stat_data,
                    _csrf: document.getElementById('csrfToken').value
                }), 
                headers:{
                    "Content-Type": "application/json"
                }
            }).then(result => result.json())
            selectStat()
        }
    }

    weekSwitch.onclick = (event) => {
        weekSwitch.checked ? weekSwitch.parentElement.querySelector('span').innerText = 'Еженедельные' : weekSwitch.parentElement.querySelector('span').innerText = 'Ежедневные'
        selectStat()
    }

    dhxCalendar.events.on('Change', () => {
        selectStat()
    })

    statsSelect.onchange = () => {
        selectStat()
    }
    require('../dragscroll').reset()
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
        console.log(privilage_data)
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