import DrawStats from '../drawStats.component'

export async function init() {
    // функция по форматированию дат
    const format = data => {
        data += ''
        return data.length < 2 ? data.length < 1 ? '00' : '0' + data : data  
    }

    const titleSwitch = document.getElementById('titleSwitch')
    titleSwitch.onchange = () => {
        if (titleSwitch.checked){
            document.querySelectorAll('.stat-title').forEach(el => el.classList.add('d-hide'))
            document.querySelectorAll('.x-axis').forEach(el => el.classList.add('d-hide'))
            document.querySelectorAll('.y-axis').forEach(el => el.classList.add('d-hide'))
            document.querySelectorAll('.linesDot').forEach(el => el.classList.add('d-hide'))
        } else {
            document.querySelectorAll('.stat-title').forEach(el => el.classList.remove('d-hide'))
            document.querySelectorAll('.x-axis').forEach(el => el.classList.remove('d-hide'))
            document.querySelectorAll('.y-axis').forEach(el => el.classList.remove('d-hide'))
            document.querySelectorAll('.linesDot').forEach(el => el.classList.remove('d-hide'))
        }
    }

    window.onscroll = () => {
        if (pageYOffset > 70) {
            document.getElementById('weeks_calendar').style.position = 'fixed'
            document.querySelector('#weeks_calendar > .week-body').classList.add('calendar-fixed')
        } else {
            document.getElementById('weeks_calendar').style.position = 'unset'
            document.querySelector('#weeks_calendar > .week-body').classList.remove('calendar-fixed')
        }
    }
    
    const periods = document.querySelectorAll('#periods > .chip')

    periods.forEach((el,i,a) => el.onclick = () => {
        a.forEach(el => el.classList.remove('active'))
        el.classList.add('active')
        drawStats()
    })

    let startY = new Date().getFullYear()
    let startW 

    const statsHolders = document.querySelectorAll('.my_dataviz')
    const weeksCalendar = document.getElementById('weeks_calendar')
    const params = {
        statHeight: 100
    }
    
    const promises = []
    statsHolders.forEach(el => {
        promises.push(fetch('/office/stats', {
            method: 'POST',
            body: JSON.stringify({
                find: 'byid',
                id: Number(el.dataset.sid),
                _csrf: document.getElementById('csrfToken').value
            }),
            headers:{
                "Content-Type": "application/json"
            }
        }).then(result => result.json()).then(result => result[0]))
    })
    
    const stats = await Promise.all(promises).then(result => result)

    const drawStats = () => {
        let period
    
        periods.forEach(el => {
            if (el.classList.contains('active')) period = el.dataset.name
        })
        
        if (period !== 'Y' && Number(period) < 24) {
            if (Number(period) == 2) {
                document.querySelectorAll('section .column').forEach(el => {
                    el.classList.remove('col-12') || el.classList.remove('col-2', 'col-xxl-3') || el.classList.remove('col-6')
                    el.classList.add('col-4')
                })
            } else {
                    if (Number(period) < 12) {
                        document.querySelectorAll('section .column').forEach(el => {
                            el.classList.remove('col-12') || el.classList.remove('col-6') || el.classList.remove('col-4')
                            el.classList.add('col-2', 'col-xxl-3')
                        })
                    } else {
                        document.querySelectorAll('section .column').forEach(el => {
                            el.classList.remove('col-12') || el.classList.remove('col-2', 'col-xxl-3') || el.classList.remove('col-4')
                            el.classList.add('col-6')
                        })
                    }
            }
        } else {
            document.querySelectorAll('section .column').forEach(el => {
                el.classList.remove('col-2', 'col-xxl-3') || el.classList.remove('col-6') || el.classList.remove('col-4')
                el.classList.add('col-12')
            })
        }
        
        period >= 12 || period === 'Y' ? params.statHeight = 500 : params.statHeight = 250

        let lastWeekDay
        let currentWeekDay = new Date().getDay() || 7
        stats.forEach((stat, i) => {

            currentWeekDay - stat.last_day <= 0 
            ? lastWeekDay = new Date(new Date().setDate(new Date().getDate() + (-(currentWeekDay - stat.last_day))))
            : lastWeekDay = new Date(new Date().setDate(new Date().getDate() + (7 - (currentWeekDay - stat.last_day))))

            // календарь недель
            weeksCalendar.querySelector('.week-header').innerHTML = startY
            if (weeksCalendar.querySelectorAll('.weeks > button').length <= 0) {
                let i = new Date(startY,0,1)
                let j = 1

                while (i.getFullYear() == startY) {
                    let date = `${format(i.getDate())}.${format(i.getMonth() + 1)}.${i.getFullYear()}`
                    const d = date.split('.')
                    let da = new Date(new Date(i).setDate(i.getDate() - 6))
                    if (i.getDay() == stat.last_day) {
                        da = `${format(da.getDate())}.${format(da.getMonth() + 1)}.${da.getFullYear()}`
                        const btn = document.createElement('button')
                        btn.dataset.date = date
                        btn.dataset.tooltip = 'с ' + da
                        btn.innerText = j
                        btn.classList.add('btn', 'btn-sm', 'btn-link', 'tooltip', 'tooltip-top')
                        weeksCalendar.querySelector('.weeks').insertAdjacentElement('beforeend', btn)
                        if (Number(d[2]) == new Date().getFullYear() && Number(d[1]) == Number(format((new Date().getMonth() + 1))) && (Number(d[0]) - Number(format((new Date().getDate()))) >= 0 && Number(d[0]) - Number(format((new Date().getDate()))) < 7)) {
                            let currentWeekBtn = (Array.from(weeksCalendar.querySelectorAll('.weeks > button')).find(el => el.dataset.date == date))
                            currentWeekBtn.classList.remove('btn-link')
                            currentWeekBtn.classList.add('btn-error')
                        }
                        j++
                    }
                    i = new Date(i.setDate(i.getDate() + 1))
                }
            }
            weeksCalendar.querySelectorAll('.weeks > button').forEach((el, i, arr) => el.onclick = e => {
                arr.forEach(btn => {
                    if (btn.classList.contains('btn-error')) {
                        btn.classList.remove('btn-error')
                        btn.classList.add ('btn-link')
                    }
                })
                el.classList.remove('btn-link')
                el.classList.add('btn-error')
                let date = el.dataset.date.split('.')
                lastWeekDay = new Date(date[2],date[1] - 1,date[0],new Date().getHours(),new Date().getMinutes(),new Date().getSeconds())
                startW = new Date(new Date(lastWeekDay).setDate(lastWeekDay.getDate() - 6))
                drawStats()
            })
            if (!startW) startW = new Date(new Date(lastWeekDay).setDate(lastWeekDay.getDate() - 6))
            statsHolders[i].parentElement.parentElement.querySelector('.card-header > .card-title').innerText = stat.title
            new DrawStats(statsHolders[i].id, stat.stat_data, stat.reverted, stat.last_day, startY, period, startW, params).drawStat()
        })
    }
    drawStats()
    
    const calendarSwitch = document.getElementById('calendarSwitch')
            
    calendarSwitch.onchange = () => {
        calendarSwitch.checked ? document.getElementById('weeks_calendar').classList.remove('d-hide') : document.getElementById('weeks_calendar').classList.add('d-hide')
    }

    document.getElementById('year_left').onclick = () => {
        weeksCalendar.querySelector('.week-body .weeks').innerHTML = ''
        startY--
        drawStats()
    }

    document.getElementById('year_right').onclick = () => {
        weeksCalendar.querySelector('.week-body .weeks').innerHTML = ''
        startY++
        drawStats()
    }
    
    window.onresize = drawStats
}