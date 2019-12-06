export function init() {
    
    // Выбор поста
    const postsSelect = document.getElementById('posts')
    
    const selectPost = async () => {
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

    const weekSwitch = document.getElementById('showWeek')

    // Отрисвка статистик d3 js
    const margin = {top: 40, right: 20, bottom: 50, left: 60}
    let graphWidth = 1000 - margin.left - margin.right
    const graphHeight = 400 - margin.top - margin.bottom
    const svg = d3.select(".my_dataviz")
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
            console.log(currentWeek)
            if (!statInput.value) statInput.value = 0
            console.log(currentDay)

            let data 
            weekSwitch.checked ? data = {date: currentWeek,value: statInput.value}  : data = {date: currentDay,value: statInput.value}

            let currentStat = stats.stat_data.find(sdata => weekSwitch.checked ? sdata.date == currentWeek: sdata.date == currentDay)
            if (currentStat) {
                let statIndex = stats.stat_data.indexOf(currentStat)
                stats.stat_data[statIndex] = data
            } else stats.stat_data.push(data)
            console.log(data)

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