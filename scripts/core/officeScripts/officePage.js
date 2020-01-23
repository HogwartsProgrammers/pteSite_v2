import DrawStats from '../drawStats.component'

export  function init() {
    const statsHolders = document.querySelectorAll('.my_dataviz')
    if (!statsHolders) return
    
    const titleSwitch = document.getElementById('titleSwitch')
    titleSwitch.onchange = () => {
        if (titleSwitch.checked){
            document.querySelectorAll('.stat-title').forEach(el => el.classList.add('d-hide'))
            document.querySelectorAll('.x-axis').forEach(el => el.classList.add('d-hide'))
            document.querySelectorAll('.y-axis').forEach(el => el.classList.add('d-hide'))
            document.querySelectorAll('.lines').forEach(el => el.classList.add('d-hide'))
        } else {
            document.querySelectorAll('.stat-title').forEach(el => el.classList.remove('d-hide'))
            document.querySelectorAll('.x-axis').forEach(el => el.classList.remove('d-hide'))
            document.querySelectorAll('.y-axis').forEach(el => el.classList.remove('d-hide'))
            document.querySelectorAll('.lines').forEach(el => el.classList.remove('d-hide'))
        }
    }
    
    const periods = document.querySelectorAll('#periods > .chip')

    periods.forEach((el,i,a) => el.onclick = () => {
        a.forEach(el => el.classList.remove('active'))
        el.classList.add('active')
        drawStats()
    })

    let startY = new Date().getFullYear()

    const params = {
        statHeight: null
    }
    
    const drawStats = async () => {
        let period
        const promises = []
    
        periods.forEach(el => {
            if (el.classList.contains('active')) period = el.dataset.name
        })
        
        if (period !== 'Y' && Number(period) < 24) {
            if (Number(period) < 2) {
                document.querySelectorAll('section .column').forEach(el => {
                    el.classList.remove('col-12') || el.classList.remove('col-4')
                    el.classList.add('col-2', 'col-xxl-3')
                })
            } else {
                document.querySelectorAll('section .column').forEach(el => {
                    el.classList.remove('col-12') || el.classList.remove('col-2', 'col-xxl-3')
                    el.classList.add('col-4')
                })
            }
        } else {
            document.querySelectorAll('section .column').forEach(el => {
                el.classList.remove('col-2', 'col-xxl-3') || el.classList.remove('col-6') || el.classList.remove('col-4')
                el.classList.add('col-12')
            })
        }
        
        period >= 12 || period === 'Y' ? params.statHeight = 500 : params.statHeight = 250

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
        await Promise.all(promises).then(stats => stats.forEach((stat, i) => {

            let currentWeekDay = new Date().getDay() || 7

            let lastWeekDay
            let firstWeekDay
            currentWeekDay - stat.last_day <= 0 
            ? lastWeekDay = new Date(new Date().setDate(new Date().getDate() + (-(currentWeekDay - stat.last_day))))
            : lastWeekDay = new Date(new Date().setDate(new Date().getDate() + (7 - (currentWeekDay - stat.last_day))))

            firstWeekDay = new Date(new Date(lastWeekDay).setDate(lastWeekDay.getDate() - 6))
            
            statsHolders[i].parentElement.parentElement.querySelector('.card-header > .card-title').innerText = stat.title
            new DrawStats(statsHolders[i].id, stat.stat_data, stat.reverted, stat.last_day, startY, period, firstWeekDay, params).drawStat()
        }))
        
        if (titleSwitch.checked){
            document.querySelectorAll('.stat-title').forEach(el => el.classList.add('d-hide'))
            document.querySelectorAll('.x-axis').forEach(el => el.classList.add('d-hide'))
            document.querySelectorAll('.y-axis').forEach(el => el.classList.add('d-hide'))
            document.querySelectorAll('.lines').forEach(el => el.classList.add('d-hide'))
        } else {
            document.querySelectorAll('.stat-title').forEach(el => el.classList.remove('d-hide'))
            document.querySelectorAll('.x-axis').forEach(el => el.classList.remove('d-hide'))
            document.querySelectorAll('.y-axis').forEach(el => el.classList.remove('d-hide'))
            document.querySelectorAll('.lines').forEach(el => el.classList.remove('d-hide'))
        }
    }
    drawStats()
    window.onresize = init
}