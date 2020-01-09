import {drawStats} from '../drawStats.component'

export async function init() {
    if (graphsHolder) return

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
    
    
    const dataStats = []

    const graphsHolder = document.querySelectorAll('.my_dataviz')

    const reverted = []
    
    const params = {
        statHolder: graphsHolder,
        height: weekSwitch.checked ? 350 : 250,
        reverted: reverted,
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
    await Promise.all(promises).then((stats, i) => {
        stats.forEach((el,i) => {
            reverted.push(el.reverted)
            graphsHolder[i].parentElement.parentElement.querySelector('.card-header > .card-title').innerText = el.title

        if (!el) return
        if (el.stat_data == null) el.stat_data = []

        let currentWeekDay = new Date().getDay() || 7   

        let lastWeekDay

        let currentDays = []
        
        currentWeekDay - el.last_day <= 0 
        ? lastWeekDay = new Date(new Date().setDate(new Date().getDate() + (-(currentWeekDay - el.last_day))))
        : lastWeekDay = new Date(new Date().setDate(new Date().getDate() + (7 - (currentWeekDay - el.last_day))))

        if (!weekSwitch.checked) {
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
    const titleSwitch = document.getElementById('titleSwitch')
    titleSwitch.onchange = () => {
        titleSwitch.checked ? document.querySelectorAll('.stat-title').forEach(el => el.classList.add('d-hide')) : document.querySelectorAll('.stat-title').forEach(el => el.classList.remove('d-hide'))
    }
    weekSwitch.onchange = init
}