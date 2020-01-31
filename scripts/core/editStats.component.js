import DrawStats from './drawStats.component'

export default class EditStats {
    constructor() {

    }
    static editStat() {
        const format = data => {
            data += ''
            return data.length < 2 ? data.length < 1 ? '00' : '0' + data : data  
        }
        // Календарь статистик
        const dhxCalendar = new dhx.Calendar('stats_calendar', {
            dateFormat:"%d.%m.%Y",
            value: new Date(),
            weekStart: "monday",
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

        // Отрисвка статистик d3 js
        const graphsHolder = document.querySelectorAll('.my_dataviz')

        // выбор статистики
        const statsSelect = document.getElementById('stats')

        const statInput = document.getElementById('stats_value')
        const quotaInput = document.getElementById('stats_quota')
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
            // document.getElementById('stats_calendar').innerHTML = ''
            
            dhxCalendar.config.mark = d => {
                if (stats.stat_data.find(el => el.date == `${format(d.getDate())}.${format(d.getMonth() + 1)}.${d.getFullYear()}` && el.date != currentDay && el.value != null)) return d.getDay() == stats.last_day == 7 ? 0 : stats.last_day ? 'a b' : 'a'
                if (d.getDay() == stats.last_day == 7 ? 0 : stats.last_day) return 'b'
                else return ''
            }

            stats.reverted == 0 ? revertedSwitch.checked = false : revertedSwitch.checked = true 
            
            const statRem = document.getElementById('stats_rem')
            
            statInput.value = null
            statRem.value = ''
            quotaInput.value = null
            
            let currentDay = dhxCalendar.getValue()

            let currentWeek = dateWeek

            let currentWeekDay = dhxCalendar.getValue(true).getDay() || 7   

            let lastWeekDay
            let firstWeekDay

            let currentWeekDays = []
            
            currentWeekDay - stats.last_day <= 0 
            ? lastWeekDay = new Date(new Date(dhxCalendar.getValue(true)).setDate(dhxCalendar.getValue(true).getDate() + (-(currentWeekDay - stats.last_day))))
            : lastWeekDay = new Date(new Date(dhxCalendar.getValue(true)).setDate(dhxCalendar.getValue(true).getDate() + (7 - (currentWeekDay - stats.last_day))))

            firstWeekDay = new Date(new Date(lastWeekDay).setDate(lastWeekDay.getDate() - 6))
            const params = {
                statHeight: 350,
                quota: sevenrSwitch.checked ? 1 : 0
            }
            
            new DrawStats('editStat', stats.stat_data, stats.reverted, stats.last_day, new Date().getFullYear(), 1,firstWeekDay, params).drawStat()

            graphsHolder[0].style.width = '600px'
            const currentStatValue = stats.stat_data.find(sdata => sdata.date == currentDay)
            if (currentStatValue) statInput.value = currentStatValue.value
            if (currentStatValue) statRem.value = currentStatValue.rem || ''
            if (currentStatValue) quotaInput.value = currentStatValue.quota || ''
            dhxCalendar.paint()
            
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
                if (!statInput.value) statInput.value = null

                let data = {date: currentDay,value: statInput.value === '' || statInput.value === null ? null : +statInput.value, rem: statRem.value.trim(), quota: quotaInput.value === '' || quotaInput.value === null ? null : +quotaInput.value}

                let currentStat = stats.stat_data.find(sdata => sdata.date == currentDay)
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

            statRem.onblur = async event => {
                if (!statInput.value) statInput.value = null

                let data = {date: currentDay,value: statInput.value === '' || statInput.value === null ? null : +statInput.value, rem: statRem.value.trim(), quota: quotaInput.value === '' || quotaInput.value === null ? null : +quotaInput.value}

                let currentStat = stats.stat_data.find(sdata => sdata.date == currentDay)
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

            quotaInput.onblur = async event => {
                if (!statInput.value) statInput.value = null

                let data = {date: currentDay,value: statInput.value === '' || statInput.value === null ? null : +statInput.value, rem: statRem.value.trim(), quota: quotaInput.value === '' || quotaInput.value === null ? null : +quotaInput.value}

                let currentStat = stats.stat_data.find(sdata => sdata.date == currentDay)
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
        const sevenrSwitch = document.getElementById('sevenrSwitch')

        sevenrSwitch.onchange = () => {
            selectStat()
        }

        const revertedSwitch = document.getElementById('revertedSwitch')

        revertedSwitch.onchange = () => {
            fetch('/office/stats/update', {
                method: 'POST',
                body: JSON.stringify({
                    id: Number(statsSelect.value),
                    reverted: revertedSwitch.checked ? 1 : 0,
                    _csrf: document.getElementById('csrfToken').value
                }), 
                headers:{
                    "Content-Type": "application/json"
                }
            }).then(result => result.json())
        }

        dhxCalendar.events.on('Change', () => {
            selectStat()
            statInput.focus()
        })

        statsSelect.onchange = () => {
            selectStat()
        }
        require('../dragscroll').reset()
    }
}