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

        
        const periods = document.querySelectorAll('#periods > .chip')

        periods.forEach((el,i,a) => el.onclick = () => {
            a.forEach(el => el.classList.remove('active'))
            el.classList.add('active')
            selectStat()
        })

        const statInput = document.getElementById('stats_value')
        const quotaInput = document.getElementById('stats_quota')
        const quotaPeriodInput = document.getElementById('period_quota_input')
        const quotaDaysInput = document.getElementById('days_quota')
        const quotaBtn = document.getElementById('quota_btn')
        
        const params = {
            statHeight: 350,
            quota: 0
        }

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

            dhxCalendar.config.mark = d => {
                if (stats.stat_data.find(el => el.date == `${format(d.getDate())}.${format(d.getMonth() + 1)}.${d.getFullYear()}` && el.date != currentDay && el.value != null)) return d.getDay() == 3 ? 'a b' : 'a'
                if (d.getDay() == 3) return 'b'
                else return ''
            }
            let period

            periods.forEach(el => {
                if (el.classList.contains('active')) period = el.dataset.name
            })
            
            if (period !== 'Y' && Number(period) < 24) {
                if (Number(period) == 2) {
                    document.querySelectorAll('#stat').forEach(el => {
                        el.classList.remove('col-10') || el.classList.remove('col-6') || el.classList.remove('col-8')
                        el.classList.add('col-6')
                    })
                } else {
                        if (Number(period) < 12) {
                            document.querySelectorAll('#stat').forEach(el => {
                                el.classList.remove('col-10') || el.classList.remove('col-8') || el.classList.remove('col-6')
                                el.classList.add('col-6')
                            })
                        } else {
                            document.querySelectorAll('#stat').forEach(el => {
                                el.classList.remove('col-10') || el.classList.remove('col-6') || el.classList.remove('col-6')
                                el.classList.add('col-8')
                            })
                        }
                }
            } else {
                document.querySelectorAll('#stat').forEach(el => {
                    el.classList.remove('col-6') || el.classList.remove('col-8') || el.classList.remove('col-6')
                    el.classList.add('col-10')
                })
            }
            
            period >= 12 || period === 'Y' ? params.statHeight = 500 : params.statHeight = 500
            params.quota = sevenrSwitch.checked ? 1 : 0

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
            
            new DrawStats('editStat', stats.stat_data, stats.reverted, stats.last_day, new Date().getFullYear(), period, firstWeekDay, params).drawStat()

            // graphsHolder[0].style.width = '600px'
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
            quotaInput.onkeydown = event => {
                if (event.code == 'Enter') {
                    event.preventDefault()
                    quotaInput.blur()
                }
            }

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
            
            quotaBtn.onclick = () => {
                if (Number(quotaPeriodInput.value) && Number(quotaDaysInput.value)) {
                    const q = Number(quotaPeriodInput.value) / Number(quotaDaysInput.value)
                    const quotaFetch = []
                    let date = dhxCalendar.getValue(true)
                    for (let i = 0; i <= Number(quotaDaysInput.value); i++) {
                        let data
                        if (i == 0) {
                            if (!statInput.value) statInput.value = null
                            data = {date: `${format(date.getDate())}.${format(date.getMonth() + 1)}.${date.getFullYear()}`,value: statInput.value === '' || statInput.value === null ? null : +statInput.value, rem: statRem.value.trim(), quota: q}
                        } else {
                            data = {date: `${format(date.getDate())}.${format(date.getMonth() + 1)}.${date.getFullYear()}`,value: null, rem: '', quota: q}
                        }
            
                        let currentStat = stats.stat_data.find(sdata => sdata.date == `${format(date.getDate())}.${format(date.getMonth() + 1)}.${date.getFullYear()}`)
                        if (currentStat) {
                            let statIndex = stats.stat_data.indexOf(currentStat)
                            if (i == 0) {
                                stats.stat_data[statIndex] = data
                            } else {
                                stats.stat_data[statIndex].quota = q 
                            }
                        } else stats.stat_data.push(data)
                        
                        quotaFetch.push(fetch('/office/stats/update', {
                            method: 'POST',
                            body: JSON.stringify({
                                id: Number(statsSelect.value),
                                stat_data: stats.stat_data,
                                _csrf: document.getElementById('csrfToken').value
                            }), 
                            headers:{
                                "Content-Type": "application/json"
                            }
                        }).then(result => result.json()))
                        
                        date = new Date(date.setDate(date.getDate() + 1))
                        
                    }
                    Promise.all(quotaFetch).then(selectStat())
                }
            }
        }
        const quotaSwitch = document.getElementById('quotaSwitch')
        const periodQuota = document.getElementById('period_quota')

        quotaSwitch.onchange = () => {
            quotaSwitch.checked ? periodQuota.classList.remove('d-hide') : periodQuota.classList.add('d-hide')
        }

        const sevenrSwitch = document.getElementById('sevenrSwitch')

        sevenrSwitch.onchange = () => {
            if (sevenrSwitch.checked) {
                sevenrSwitch.disabled = false
                revertedSwitch.disabled = true
            } else revertedSwitch.disabled = false
            selectStat()
        }

        const revertedSwitch = document.getElementById('revertedSwitch')

        revertedSwitch.onchange = async () => {
            if (revertedSwitch.checked) {
                revertedSwitch.disabled = false
                sevenrSwitch.disabled = true
            } else sevenrSwitch.disabled = false
            await fetch('/office/stats/update', {
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
            selectStat()
        }

        dhxCalendar.events.on('Change', () => {
            selectStat()
            statInput.focus()
        })

        statsSelect.onchange = () => {
            selectStat()
        }
        require('../dragscroll').reset()
        window.onresize = selectStat
    }
}