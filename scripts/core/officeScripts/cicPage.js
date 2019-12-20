import *  as d3 from "d3"
// const drawStats = require('../drawStats.component')
import {drawStats} from '../drawStats.component'

export function init() {

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
    const dataStats = []

    const graphsHolder = document.querySelectorAll('.my_dataviz')

    const params = {
        statHolder: graphsHolder
    }
    const graphs = Array.from(graphsHolder)
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

            let i = new Date(new Date().getFullYear(),0,1)
            let day = {
                date: null,
                value: 0
            }

            while (i.getFullYear() == new Date().getFullYear()) {
                let date = `${format(i.getDate())}.${format(i.getMonth() + 1)}.${i.getFullYear()}`
                if (i.getDay() == stats.last_day) {
                    day.value += stats.stat_data.find(data => data.date == date) ? Number(stats.stat_data.find(data => data.date == date).value) : 0
                    day.date = date
                    currentDays.push(day)
                    day = {
                        date: null,
                        value: 0
                    }
                } else {
                    day.value += stats.stat_data.find(data => data.date == date) ? Number(stats.stat_data.find(data => data.date == date).value) : 0
                }
                i = new Date(i.setDate(i.getDate() + 1))
            }
        }
        dataStats.push(currentDays)
    })
    drawStats(dataStats,params)

    // const drawStats = (data,svg) => {
    //     if (!data.find(el => el.value != 0)) return
    //     data = data.map(day => {
    //         return {
    //             date: day.date,
    //             value: Number(day.value)
    //         }
    //     })
        
    //     console.log(d3.min(data, d => d.value))

    //     svg.x.domain([1,data.length])
    //     svg.y.domain([d3.min(data, d => d.value), (d3.max(data, d => d.value) / 100 * 20)+d3.max(data, d => d.value)])

    //     svg.path.data([data])
    //         .attr('fill', 'none')
    //         .attr('stroke', '#000')
    //         .attr('stroke-width', 2)
    //         .attr('d', svg.line)

    //     const circles = svg.graph.selectAll('circle')
    //         .data(data)

    //     circles.exit().remove()

    //     circles
    //         .attr('cx', (d,i) => svg.x(i + 1))
    //         .attr('cy', d => svg.y(d.value))

    //     circles.enter()
    //         .append('circle')
    //             .attr('r', 4)
    //             .attr('cx', (d,i) => svg.x(i + 1))
    //             .attr('cy', d => svg.y(d.value))
    //             .attr('fill', '#000')
            
    //     svg.graph.selectAll('circle')
    //         .on('mouseover', (d,i,n) => {
    //             d3.select(n[i])
    //                 .transition().duration(100)
    //                     .attr('r', 8)
    //                     .attr('fill', '#000')
    //             svg.xDottedLine
    //                 .attr('x1', svg.x(i + 1))
    //                 .attr('x2', svg.x(i + 1))
    //                 .attr('y1', graphHeight)
    //                 .attr('y2', svg.y(d.value))
    //             svg.yDottedLine
    //                 .attr('x1', 0)
    //                 .attr('x2', svg.x(i + 1))
    //                 .attr('y1', svg.y(d.value))
    //                 .attr('y2', svg.y(d.value))

    //             svg.dottedLines.style('opacity', 1)
    //         })
    //         .on('mouseleave', (d,i,n) => {
    //             d3.select(n[i])
    //                 .transition().duration(100)
    //                     .attr('r', 4)
    //                     .attr('fill', '#000')

    //             svg.dottedLines.style('opacity', 0)
    //         })
        
    //     const xAxis = d3.axisBottom(svg.x)
    //         .ticks(data.length)
    //         .tickFormat((d,i) => data.length > 7 ? data[i].date : data[i].date.substr(0, 5))
        

    //     const yAxis = d3.axisLeft(svg.y)
    //         .ticks(4)
        
    //     svg.xAxisGroup.call(xAxis)
    //     svg.yAxisGroup.call(yAxis)

    //     svg.xAxisGroup.selectAll('text')
    //         .attr('transform', data.length > 7 ? 'rotate(-60) translate(-25, 0)' : 'rotate(-90) translate(-22, -13)')
    // }
    const titleSwitch = document.getElementById('titleSwitch')
    titleSwitch.onchange = () => {
        titleSwitch.checked ? document.querySelectorAll('.stat-title').forEach(el => el.classList.add('d-hide')) : document.querySelectorAll('.stat-title').forEach(el => el.classList.remove('d-hide'))
    }
    weekSwitch.onchange = init
}