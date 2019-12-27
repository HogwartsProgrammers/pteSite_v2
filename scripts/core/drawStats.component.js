import *  as d3 from "d3"

// Отрисвка статистик d3 js
// params
// const params = {
//     statHolder: []
//     height
// } 

export function drawStats(data,params) {
    
    const margin = {top: 40, right: 30, bottom: 50, left: 70}
    const graphHeight = params.height - margin.top - margin.bottom
    const graphs = Array.from(params.statHolder).map((stat,i,a) => {
        stat.innerHTML = ''
        const svg = d3.select(stat)
            .append("svg")
            .attr("width", stat.offsetWidth - 10)
            .attr("height", graphHeight + margin.top + margin.bottom)
            
        const graph = svg.append("g")
        .attr('width', stat.offsetWidth - 30)
        .attr('height', graphHeight)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        
        const x = d3.scaleLinear().range([0,stat.offsetWidth - 130])
        const y = d3.scaleLinear().range([graphHeight,0])
        
        const xAxisGroup = graph.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0, ' + graphHeight + ')')
        
        const yAxisGroup = graph.append('g')
            .attr('class', 'y-axis')
        
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
        
        const dottedValue = graph.append('g')
            .attr('class', 'value')
        
        const lines = graph.append('g')
            .attr('class', 'lines2')

        return {
            svg,graph,x,y,xAxisGroup,yAxisGroup,dottedLines,xDottedLine,yDottedLine,dottedValue,lines, stat, sid: stat.dataset.sid
        }
    })
    
    const drawStat = (data, svg) => {
        if (!data.find(el => el.value != 0)) return
        data = data.map(day => {
            return {
                date: day.date,
                value: Number(day.value)
            }
        })
        
        svg.x.domain([1,data.length])
        svg.y.domain([d3.min(data, d => d.value), (d3.max(data, d => d.value) / 100 * 20)+d3.max(data, d => d.value)])

        const line2 = svg.lines.selectAll('line')
            .data(data)
    
        line2.exit().remove()
    
        line2
            .attr('x1', (d,i) => {
                if (!data[i + 1] || !data.find((el, it) => {
                    if (it <= i) return false
                    else {
                        return el.value != 0
                    }
                })) {
                    return svg.x(0)
                } else {
                    if (data[i].value == 0) return svg.x(0)
                    else return x(i + 1)
                }
            })
            .attr('y1', (d,i) => {
                if (!data[i + 1] || !data.find((el, it) => {
                    if (it <= i) return false
                    else {
                        return el.value != 0
                    }
                })) {
                    return svg.y(0)
                } else {
                    if (data[i].value == 0) return svg.y(0)
                    else return svg.y(d.value)
                }
            })
            .attr('x2', (d,i) => {
                if (!data[i + 1] || !data.find((el, it) => {
                    if (it <= i) return false
                    else {
                        return el.value != 0
                    }
                })) {
                    return svg.x(0)
                } else
                    if (data[i].value == 0) return svg.x(0)
                    else {
                        return svg.x((i + 2) + (data.indexOf(data.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.value != 0
                            }
                        })) - (i + 1)))
                    }
            })
            .attr('y2', (d,i,n) => {
                if (!data[i + 1] || !data.find((el, it) => {
                    if (it <= i) return false
                    else {
                        return el.value != 0
                    }
                })) {
                    return svg.y(0)
                } else {
                    if (data[i].value == 0) return svg.y(0)
                    else {
                        return svg.y(data.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.value != 0
                            }
                        }).value)
                    }
                }
            })
            .attr('stroke', (d,i) => {
                if (!data.find((el, it) => {
                    if (it <= i) return false
                    else {
                        return el.value != 0
                    }
                })) return '#000'
                else return data.find((el, it) => {
                    if (it <= i) return false
                    else {
                        return el.value != 0
                    }
                }).value < d.value ? 'red' : '#000'
    
            })
    
        line2.enter()
            .append('line')
                .attr('x1', (d,i) => {
                    if (!data[i + 1] || !data.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != 0
                        }
                    })) {
                        return svg.x(0)
                    } else {
                        if (data[i].value == 0) return svg.x(0)
                        else return svg.x(i + 1)
                    }
                })
                .attr('y1', (d,i) => {
                    if (!data[i + 1] || !data.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != 0
                        }
                    })) {
                        return svg.y(0)
                    } else {
                        if (data[i].value == 0) return svg.y(0)
                        else return svg.y(d.value)
                    }
                })
                .attr('x2', (d,i) => {
                    if (!data[i + 1] || !data.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != 0
                        }
                    })) {
                        return svg.x(0)
                    } else
                        if (data[i].value == 0) return svg.x(0)
                        else {
                            return svg.x((i + 2) + (data.indexOf(data.find((el, it) => {
                                if (it <= i) return false
                                else {
                                    return el.value != 0
                                }
                            })) - (i + 1)))
                        }
                })
                .attr('y2', (d,i,n) => {
                    if (!data[i + 1] || !data.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != 0
                        }
                    })) {
                        return svg.y(0)
                    } else {
                        if (data[i].value == 0) return svg.y(0)
                        else {
                            return svg.y(data.find((el, it) => {
                                if (it <= i) return false
                                else {
                                    return el.value != 0
                                }
                            }).value)
                        }
                    }
                })
                .attr('stroke', (d,i) => {
                    if (!data.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != 0
                        }
                    })) return '#000'
                    else return data.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != 0
                        }
                    }).value < d.value ? 'red' : '#000'
    
                })
                .attr('stroke-linecap','round')
                .attr('stroke-width', 3)
    
        const text = svg.dottedValue.selectAll('text')
            .data(data)
    
        text.exit().remove()
        
        text
            .attr('x', (d,i) => svg.x(i + 1))
            .attr('y', d => svg.y(d.value))
            .text((d) => d.value)
    
        text.enter()
            .append('text')
                .attr('x', (d,i) => svg.x(i + 1))
                .attr('y', d => svg.y(d.value))
                .attr('fill', 'currentColor')
                .style('opacity', '0')
                .text(d => d.value)
    
        svg.dottedValue.selectAll('text')
            .attr('transform', 'rotate(0) translate(0, -13)')
    
    
        const circles = svg.graph.selectAll('circle')
            .data(data)
    
        circles.exit().remove()
    
        circles
            .attr('cx', (d,i) => svg.x(i + 1))
            .attr('cy', d => svg.y(d.value))
    
        circles.enter()
            .append('circle')
                .attr('r', d => d.value == 0 ? 0 : 0)
                .attr('cx', (d,i) => svg.x(i + 1))
                .attr('cy', d => svg.y(d.value))
                .attr('fill', '#000')
    
        svg.svg
            .on('mouseover', () => {
                svg.svg.selectAll('circle')  
                    .attr('r', d => d.value == 0 ? 0 : 4)
            })
            .on('mouseleave', () => {
                d3.selectAll('circle')  
                    .attr('r', 0)
            })
            
        svg.graph.selectAll('circle')
            .on('mouseover', (d,i,n) => {
                svg.dottedValue.selectAll('text')._groups[0][i].style.opacity = 1
    
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
                svg.dottedValue.selectAll('text')._groups[0][i].style.opacity = 0
                d3.select(n[i])
                    .transition().duration(100)
                        .attr('r', 4)
                        .attr('fill', '#000')
    
                svg.dottedLines.style('opacity', 0)
            })
        
        const xAxis = d3.axisBottom(svg.x)
            .ticks(data.length)
            .tickSize(10)
            .tickFormat((d,i) => data.length > 7 ? data[i].date : data[i].date.substr(0, 5))
    
        const yAxis = d3.axisLeft(svg.y)
            .tickSize(10)
            .ticks(4)
        
        svg.xAxisGroup.call(xAxis)
        svg.yAxisGroup.call(yAxis)
        svg.xAxisGroup.selectAll('text')
            .attr('transform', data.length > 7 ? 'rotate(-60) translate(-25, 0)' : svg.stat.offsetWidth >= 500 ? '':'rotate(-90) translate(-25, -17)')
    }
    graphs.forEach((el, i) => drawStat(data[i], el))
}