import {drawStats} from '../drawStats.component'

export function init() {

    window.onscroll = () => {
        if (pageYOffset > 70) {
            document.getElementById('weeks_calendar').style.position = 'fixed'
            document.querySelector('#weeks_calendar > .week-body').classList.add('calendar-fixed')
        } else {
            document.getElementById('weeks_calendar').style.position = 'unset'
            document.querySelector('#weeks_calendar > .week-body').classList.remove('calendar-fixed')
        }
    }

    window.onresize = init

    const format = data => {
        data += ''
        return data.length < 2 ? data.length < 1 ? '00' : '0' + data : data  
    }

    const weekSwitch = document.getElementById('weekSwitch')

    if (!weekSwitch.checked) {
        weekSwitch.parentElement.querySelector('span').innerText = 'Ежедневные'
        document.querySelectorAll('section .column').forEach(el => {
            el.classList.remove('col-12')
            el.classList.add('col-2','col-xl-3','col-lg-4','col-md-6','col-sm-12','col-xxl-3')
        })
    } else {
        weekSwitch.parentElement.querySelector('span').innerText = 'Еженедельные'
        document.querySelectorAll('section .column').forEach(el => {
            el.classList.remove('col-2','col-xl-3','col-lg-4','col-md-6','col-sm-12','col-xxl-3')
            el.classList.add('col-12')
        })
    }

    // Отрисвка статистик d3 js
    const s = async (n, fullYear, lastWeekDay1) => {
        const dataStats = []

        const graphsHolder = document.querySelectorAll('.my_dataviz')

        const params = {
            statHolder: graphsHolder,
            height: weekSwitch.checked ? 500 : 250,
        }

        const promises = []
        const graphs = Array.from(graphsHolder)
        graphs.forEach((el,i) => {
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
        await Promise.all(promises).then((stats) => {
            stats.forEach((el,i) => {
                graphsHolder[i].parentElement.parentElement.querySelector('.card-header > .card-title').innerText = el.title

            if (!el) return 
            if (el.stat_data == null) el.stat_data = []

            let currentWeekDay = new Date().getDay() || 7   

            let lastWeekDay = lastWeekDay1

            let currentDays = []
            if (!lastWeekDay) {
                currentWeekDay - el.last_day <= 0 
                ? lastWeekDay = new Date(new Date().setDate(new Date().getDate() + (-(currentWeekDay - el.last_day))))
                : lastWeekDay = new Date(new Date().setDate(new Date().getDate() + (7 - (currentWeekDay - el.last_day))))
            }

            if (!weekSwitch.checked) {
                const weeksCalendar = document.getElementById('weeks_calendar')
                weeksCalendar.querySelector('.week-header').innerHTML = fullYear
                if (weeksCalendar.querySelectorAll('.weeks > button').length <= 0) {
                    let i = new Date((new Date().getFullYear() + n),0,1)
                    let j = 1

                    while (i.getFullYear() == fullYear) {
                        let date = `${format(i.getDate())}.${format(i.getMonth() + 1)}.${i.getFullYear()}`
                        if (i.getDay() == el.last_day) {
                            const btn = document.createElement('button')
                            btn.dataset.date = date
                            btn.innerText = j
                            btn.classList.add('btn', 'btn-sm', 'btn-link', 'tooltip', 'tooltip-top')
                            btn.dataset.tooltip = 'по ' + date
                            weeksCalendar.querySelector('.weeks').insertAdjacentElement('beforeend', btn)
                            j++
                        }
                        i = new Date(i.setDate(i.getDate() + 1))
                    }
                } else {
                    let i = new Date((new Date().getFullYear() + n),0,1)
                    let j = 0

                    while (i.getFullYear() == fullYear) {
                        let date = `${format(i.getDate())}.${format(i.getMonth() + 1)}.${i.getFullYear()}`
                        if (i.getDay() == el.last_day) {
                            if (j > 51 && weeksCalendar.querySelectorAll('.weeks > button').length < 53) {
                                const btn = document.createElement('button')
                                btn.dataset.date = date
                                btn.innerText = j + 1
                                btn.classList.add('delete', 'btn', 'btn-sm', 'btn-link', 'tooltip', 'tooltip-top')
                                btn.dataset.tooltip = 'по ' + date
                                weeksCalendar.querySelector('.weeks').insertAdjacentElement('beforeend', btn)
                            } else {
                                const lastBtn = document.querySelector('#weeks_calendar .weeks > .delete')
                                if (lastBtn) lastBtn.parentNode.removeChild(lastBtn)
                            }
                            weeksCalendar.querySelectorAll('.weeks > button')[j].dataset.date = date
                            weeksCalendar.querySelectorAll('.weeks > button')[j].dataset.tooltip = 'по ' +date
                            j++
                        }
                        i = new Date(i.setDate(i.getDate() + 1))
                    }
                }
                
                weeksCalendar.querySelectorAll('.weeks > button').forEach(el => el.onclick = e => {
                    let date = e.target.dataset.date.split('.')
                    lastWeekDay = new Date(date[2],date[1] - 1,date[0],new Date().getHours(),new Date().getMinutes(),new Date().getSeconds())
                    s(n, fullYear, lastWeekDay)
                })

                for (let i = 0; i < 7; i++) {
                    let date = new Date(new Date(lastWeekDay).setDate(lastWeekDay.getDate() - i))
                    date = `${format(date.getDate())}.${format(date.getMonth() + 1)}.${date.getFullYear()}`
                    let lastWeekDayIndex = el.stat_data.indexOf(el.stat_data.find(stat => stat.date == date))
                    currentDays.push(el.stat_data[lastWeekDayIndex] || {date,value: 0})
                }
                currentDays.reverse()
            } else {
                let i = new Date(new Date().getFullYear(),0,1)
                let day = {
                    date: null,
                    value: 0
                }

                while (i.getFullYear() == new Date().getFullYear()) {
                    let date = `${format(i.getDate())}.${format(i.getMonth() + 1)}.${i.getFullYear()}`
                    if (i.getDay() == el.last_day) {
                        day.value += el.stat_data.find(data => data.date == date) ? Number(el.stat_data.find(data => data.date == date).value) : 0
                        day.date = date
                        currentDays.push(day)
                        day = {
                            date: null,
                            value: 0
                        }
                    } else {
                        day.value += el.stat_data.find(data => data.date == date) ? Number(el.stat_data.find(data => data.date == date).value) : 0
                    }
                    i = new Date(i.setDate(i.getDate() + 1))
                }
            }
            dataStats.push(currentDays)
            })
        })
        drawStats(dataStats,params)
    }
    let fullYear = new Date().getFullYear()
    let n = 0

    s(n,fullYear)

    const titleSwitch = document.getElementById('titleSwitch')
    const calendarSwitch = document.getElementById('calendarSwitch')

    calendarSwitch.onchange = () => {
        calendarSwitch.checked ? document.getElementById('weeks_calendar').classList.remove('d-hide') : document.getElementById('weeks_calendar').classList.add('d-hide')
    }

    titleSwitch.onchange = () => {
        titleSwitch.checked ? document.querySelectorAll('.stat-title').forEach(el => el.classList.add('d-hide')) : document.querySelectorAll('.stat-title').forEach(el => el.classList.remove('d-hide'))
    }


    document.getElementById('year_left').onclick = () => {
        fullYear--
        n--
        s(n,fullYear)
    }

    document.getElementById('year_right').onclick = () => {
        fullYear++
        n++
        s(n,fullYear)
    }
    weekSwitch.onchange = init
}