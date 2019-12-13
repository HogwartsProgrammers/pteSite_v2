import *  as d3 from "d3"

export function init() {
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
            el.classList.add('col-2','col-xl-3','col-lg-4','col-md-6','col-sm-12','col-xxl-3','mb-2')
        })
    } else {
        weekSwitch.parentElement.querySelector('span').innerText = 'Еженедельные'
        document.querySelectorAll('section .column').forEach(el => {
            el.classList.remove('col-2','col-xl-3','col-lg-4','col-md-6','col-sm-12','col-xxl-3','mb-2')
            el.classList.add('col-12')
        })
    }

    // Отрисвка статистик d3 js
    
    const dateFromString = (date) => new Date(date.split('.')[2],date.split('.')[1] - 1,date.split('.')[0])

    const margin = {top: 40, right: 30, bottom: 50, left: 60}
    const graphWidth = 560 - margin.left - margin.right
    const graphHeight = 250 - margin.top - margin.bottom
    const graphsHolder = document.querySelectorAll('.my_dataviz')
    const graphs = Array.from(graphsHolder).map((el,i,a) => {
        el.innerHTML = ''
        const svg = d3.select(el)
            .append("svg")
            .attr("width", el.offsetWidth - 15)
            .attr("height", graphHeight + margin.top + margin.bottom)
            
        const graph = svg.append("g")
            .attr('width', el.offsetWidth - 30)
            .attr('height', graphHeight)
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

        const x = d3.scaleLinear().range([0,el.offsetWidth - 100])
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

        return {
            svg,graph,x,y,xAxisGroup,yAxisGroup,line,path,dottedLines,xDottedLine,yDottedLine, sid: el.dataset.sid
        }
    })


    graphs.forEach(async (el,i) => {
        let stats = await fetch('/office/stats', {
            method: 'POST',
            body: JSON.stringify({
                find: 'byid',
                id: Number(el.sid),
                _csrf: document.getElementById('csrfToken').value
            }), 
            headers:{
                "Content-Type": "application/json"
            }
        }).then(result => result.json()).then(result => result[0])
        graphsHolder[i].parentElement.parentElement.querySelector('.card-header > .card-title').innerText = stats.title

        if (!stats) return
        if (stats.stat_data == null) stats.stat_data = []

        let currentWeekDay = new Date().getDay() || 7   

        let lastWeekDay

        let currentDays = []
        
        currentWeekDay - stats.last_day <= 0 
        ? lastWeekDay = new Date(new Date().setDate(new Date().getDate() + (-(currentWeekDay - stats.last_day))))
        : lastWeekDay = new Date(new Date().setDate(new Date().getDate() + (7 - (currentWeekDay - stats.last_day))))

        if (!weekSwitch.checked) {
            for (let i = 0; i < 7; i++) {
                let date = new Date(new Date(lastWeekDay).setDate(lastWeekDay.getDate() - i))
                date = `${format(date.getDate())}.${format(date.getMonth() + 1)}.${date.getFullYear()}`
                let lastWeekDayIndex = stats.stat_data.indexOf(stats.stat_data.find(stat => stat.date == date))
                currentDays.push(stats.stat_data[lastWeekDayIndex] || {date,value: 0})
            }
            currentDays.reverse()
        } else {
            // let currentYearDays = stats.stat_data.filter(stat => stat.date.split('.')[2] == new Date().getFullYear())
            // currentYearDays.filter(stat => {
            //     const day = new Date(stat.date.split('.')[2],stat.date.split('.')[1] - 1,stat.date.split('.')[0]).getDay()
            //     return (day || 7) == stats.last_day
            // })

            let i = new Date(new Date().getFullYear(),0,1).getDay()

            i - stats.last_day <= 0 
            ? i = new Date(new Date(new Date().getFullYear(),0,1).setDate(new Date(new Date().getFullYear(),0,1).getDate() - (i - stats.last_day)))
            : i = new Date(new Date(new Date().getFullYear(),0,1).setDate(new Date(new Date().getFullYear(),0,1).getDate() + (7 - (i -stats.last_day))))

            while (i.getFullYear() == new Date().getFullYear() ) {
                let date = `${format(i.getDate())}.${format(i.getMonth() + 1)}.${i.getFullYear()}`
                currentDays.push(stats.stat_data.find(data => data.date == date) || {date,value:0})
                i = new Date(i.setDate(i.getDate() + 7))
            }
        }

        require('../../dragscroll').reset()

        drawStats(currentDays,el)
    })

    const drawStats = (data,svg) => {
        if (!data.find(el => el.value != 0)) return
        data = data.map(day => {
            return {
                date: day.date,
                value: Number(day.value)
            }
        })
        
        svg.x.domain([1,data.length])
        svg.y.domain([d3.min(data, d => d.value), (d3.max(data, d => d.value) / 100 * 20)+d3.max(data, d => d.value)])

        svg.path.data([data])
            .attr('fill', 'none')
            .attr('stroke', '#000')
            .attr('stroke-width', 3)
            .attr('d', svg.line)

        const circles = svg.graph.selectAll('circle')
            .data(data)

        circles.exit().remove()

        circles
            .attr('cx', (d,i) => svg.x(i + 1))
            .attr('cy', d => svg.y(d.value))

        circles.enter()
            .append('circle')
                .attr('r', 4)
                .attr('cx', (d,i) => svg.x(i + 1))
                .attr('cy', d => svg.y(d.value))
                .attr('fill', '#000')
            
        svg.graph.selectAll('circle')
            .on('mouseover', (d,i,n) => {
                d3.select(n[i])
                    .transition().duration(100)
                        .attr('r', 8)
                        .attr('fill', '#000')
                svg.xDottedLine
                    .attr('x1', svg.x(i + 1))
                    .attr('x2', svg.x(i + 1))
                    .attr('y1', graphHeight)
                    .attr('y2', svg.y(d.value))
                svg.yDottedLine
                    .attr('x1', 0)
                    .attr('x2', svg.x(i + 1))
                    .attr('y1', svg.y(d.value))
                    .attr('y2', svg.y(d.value))

                svg.dottedLines.style('opacity', 1)
            })
            .on('mouseleave', (d,i,n) => {
                d3.select(n[i])
                    .transition().duration(100)
                        .attr('r', 4)
                        .attr('fill', '#000')

                svg.dottedLines.style('opacity', 0)
            })
        
        const xAxis = d3.axisBottom(svg.x)
            .ticks(data.length)
            .tickFormat((d,i) => data.length > 7 ? data[i].date : data[i].date.substr(0, 5))

        const yAxis = d3.axisLeft(svg.y)
            .ticks(4)
        
        svg.xAxisGroup.call(xAxis)
        svg.yAxisGroup.call(yAxis)

        svg.xAxisGroup.selectAll('text')
            .attr('transform', data.length > 7 ? 'rotate(-60) translate(-25, 0)' : 'rotate(-90) translate(-22, -13)')
    }
    const titleSwitch = document.getElementById('titleSwitch')
    titleSwitch.onchange = () => {
        titleSwitch.checked ? document.querySelectorAll('.stat-title').forEach(el => el.classList.add('d-hide')) : document.querySelectorAll('.stat-title').forEach(el => el.classList.remove('d-hide'))
    }
    weekSwitch.onchange = init
}