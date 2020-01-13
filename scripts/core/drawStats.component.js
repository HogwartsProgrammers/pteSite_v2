import *  as d3 from "d3"

// Отрисвка статистик d3 js
// params
// const params = {
//     statHolder: []
//     height
//     reverted
// } 

export default class DrawStats {
    constructor(stat, data, params  = {
        height: 500,
        reverted: 0,
    }) {
        this.params = params
        this.stat = stat
        this.graphHeight
        this.margin = {top: 40, right: 25, bottom: 50, left: 30}
        this.graphHeight = this.params.height - this.margin.top - this.margin.bottom
        if (Math.ceil(String(d3.max(data, d => Number(d.value))).length / 3) > 1) {
            this.margin.left = (Math.ceil(String(d3.max(data, d => Number(d.value))).length / 3) * 20) + 10
        } else {
            if (String(d3.max(data, d => Number(d.value))).length > 1) {
                this.margin.left = (10 * String(d3.max(data, d => Number(d.value))).length) + 10
            }
        }
        stat.innerHTML = ''
        this.svg = d3.select(stat)
            .append("svg")
            .attr("width", stat.offsetWidth - 10)
            .attr("height", this.graphHeight + this.margin.top + this.margin.bottom)
            
        this.graph = this.svg.append("g")
            .attr('width', stat.offsetWidth - 30)
            .attr('height', this.graphHeight)
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        this.x = d3.scaleLinear().range([0,stat.offsetWidth - this.margin.left - this.margin.right])
        this.y = d3.scaleLinear().range([this.graphHeight,0])
        
        this.xAxisGroup = this.graph.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0, ' + this.graphHeight + ')')
        
        this.yAxisGroup = this.graph.append('g')
            .attr('class', 'y-axis')
        
        this.dottedLines = this.graph.append('g')
            .attr('class', 'lines')
            .style('opacity', 0)
        
        this.xDottedLine = this.dottedLines.append('line')
            .attr('stroke', '#aaa')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', 4)
        
        this.yDottedLine = this.dottedLines.append('line')
            .attr('stroke', '#aaa')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', 4)
        
        this.dottedValue = this.graph.append('g')
            .attr('class', 'value')
        
        this.lines = this.graph.append('g')
            .attr('class', 'lines2')
    }
    drawStat(data) {
        if (!data.find(el => el.value != 0)) return
        data = data.map(day => {
            return {
                date: day.date,
                value: Number(day.value)
            }
        })
        
        this.x.domain([1,data.length])
        this.y.domain(this.params.reverted == 0 ? [d3.min(data, d => d.value), (d3.max(data, d => d.value) / 100 * 20)+d3.max(data, d => d.value)] : [(d3.max(data, d => d.value) / 100 * 20)+d3.max(data, d => d.value), d3.min(data, d => d.value) ])

        const line2 = this.lines.selectAll('line')
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
                    return this.x(0)
                } else {
                    if (data[i].value == 0) return this.x(0)
                    else return this.x(i + 1)
                }
            })
            .attr('y1', (d,i) => {
                if (!data[i + 1] || !data.find((el, it) => {
                    if (it <= i) return false
                    else {
                        return el.value != 0
                    }
                })) {
                    return this.y(0)
                } else {
                    if (data[i].value == 0) return this.y(0)
                    else return this.y(d.value)
                }
            })
            .attr('x2', (d,i) => {
                if (!data[i + 1] || !data.find((el, it) => {
                    if (it <= i) return false
                    else {
                        return el.value != 0
                    }
                })) {
                    return this.x(0)
                } else
                    if (data[i].value == 0) return this.x(0)
                    else {
                        return this.x((i + 2) + (data.indexOf(data.find((el, it) => {
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
                    return this.y(0)
                } else {
                    if (data[i].value == 0) return this.y(0)
                    else {
                        return this.y(data.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.value != 0
                            }
                        }).value)
                    }
                }
            })
            .attr('stroke', (d,i) => {
                if (this.params.reverted == 0) {
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
                } else {
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
                    }).value < d.value ? '#000' : 'red'
                }
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
                        return this.x(0)
                    } else {
                        if (data[i].value == 0) return this.x(0)
                        else return this.x(i + 1)
                    }
                })
                .attr('y1', (d,i) => {
                    if (!data[i + 1] || !data.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != 0
                        }
                    })) {
                        return this.y(0)
                    } else {
                        if (data[i].value == 0) return this.y(0)
                        else return this.y(d.value)
                    }
                })
                .attr('x2', (d,i) => {
                    if (!data[i + 1] || !data.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != 0
                        }
                    })) {
                        return this.x(0)
                    } else
                        if (data[i].value == 0) return this.x(0)
                        else {
                            return this.x((i + 2) + (data.indexOf(data.find((el, it) => {
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
                        return this.y(0)
                    } else {
                        if (data[i].value == 0) return this.y(0)
                        else {
                            return this.y(data.find((el, it) => {
                                if (it <= i) return false
                                else {
                                    return el.value != 0
                                }
                            }).value)
                        }
                    }
                })
                .attr('stroke', (d,i) => {
                    if (this.params.reverted == 0) {
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
                    } else {
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
                        }).value < d.value ? '#000' : 'red'
                    }
                })
                .attr('stroke-linecap','round')
                .attr('stroke-width', (d,i) => {
                    if (!data[i + 1] || !data.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != 0
                        }
                    })) {
                        return 0
                    } else {
                        if (data[i].value == 0) return 0
                        else {
                            return 3
                        }
                    }
                })
    
        const text = this.dottedValue.selectAll('text')
            .data(data)
    
        text.exit().remove()
        
        text
            .attr('x', (d,i) => this.x(i + 1))
            .attr('y', d => this.y(d.value))
            .text((d) => d.value)
    
        text.enter()
            .append('text')
                .attr('x', (d,i) => this.x(i + 1))
                .attr('y', d => this.y(d.value))
                .attr('fill', 'currentColor')
                // .attr('transform', d => !d.value + 1 ? 'translate(0, -300)' : '')    
                .style('opacity', '0')
                .text(d => d.value)
    
        this.dottedValue.selectAll('text')
            .attr('transform', (d, i) => !data[i + 1] ? 'translate(-70, -13)' : 'rotate(0) translate(0, -13)' )
    
    
        const circles = this.graph.selectAll('circle')
            .data(data)
    
        circles.exit().remove()
    
        circles
            .attr('cx', (d,i) => this.x(i + 1))
            .attr('cy', d => this.y(d.value))
    
        circles.enter()
            .append('circle')
                .attr('r', d => d.value == 0 ? 0 : 3)
                .attr('cx', (d,i) => this.x(i + 1))
                .attr('cy', d => this.y(d.value))
                .attr('fill', '#000')
    
        this.svg
            .on('mouseover', () => {
                this.svg.selectAll('circle')  
                    .attr('r', d => d.value == 0 ? 0 : 4)
            })
            .on('mouseleave', () => {
                d3.selectAll('circle')  
                    .attr('r', d => d.value == 0 ? 0 : 3)
            })
            
        this.graph.selectAll('circle')
            .on('mouseover', (d,i,n) => {
                this.dottedValue.selectAll('text')._groups[0][i].style.opacity = 1
    
                d3.select(n[i])
                    .transition().duration(100)
                        .attr('r', 8)
                        .attr('fill', '#000')
                this.xDottedLine
                    .attr('x1', this.x(i + 1))
                    .attr('x2', this.x(i + 1))
                    .attr('y1', this.graphHeight)
                    .attr('y2', this.y(d.value))
                this.yDottedLine
                    .attr('x1', 0)
                    .attr('x2', this.x(i + 1))
                    .attr('y1', this.y(d.value))
                    .attr('y2', this.y(d.value))
    
                this.dottedLines.style('opacity', 1)
            })
            .on('mouseleave', (d,i,n) => {
                this.dottedValue.selectAll('text')._groups[0][i].style.opacity = 0
                d3.select(n[i])
                    .transition().duration(100)
                        .attr('r', 4)
                        .attr('fill', '#000')
    
                this.dottedLines.style('opacity', 0)
            })
        
        const xAxis = d3.axisBottom(this.x)
            .ticks(data.length)
            .tickSize(10)
            .tickFormat((d,i) => data.length > 7 ? data[i].date.substr(0, 5) : data[i].date.substr(0, 5))
    
        const yAxis = d3.axisLeft(this.y)
            .tickSize(10)
            .ticks(4)
        
        this.xAxisGroup.call(xAxis)
        this.yAxisGroup.call(yAxis)
        this.xAxisGroup.selectAll('text')
            .attr('transform', data.length > 7 ? 'rotate(-90) translate(-25, -17)' : this.stat.offsetWidth >= 500 ? '':'rotate(-90) translate(-25, -17)')
    }
}

// export function drawStats(data,params) {
//     let graphHeight
//     const graphs = Array.from(params.statHolder).map((stat,i,a) => {
//         const margin = {top: 40, right: 15, bottom: 50, left: 30}
//         graphHeight = params.height - margin.top - margin.bottom
//         if (Math.ceil(String(d3.max(data[i], d => Number(d.value))).length / 3) > 1) {
//             margin.left = (Math.ceil(String(d3.max(data[i], d => Number(d.value))).length / 3) * 20) + 10
//         } else {
//             if (String(d3.max(data[i], d => Number(d.value))).length > 1) {
//                 margin.left = (10 * String(d3.max(data[i], d => Number(d.value))).length) + 10
//             }
//         }
//         stat.innerHTML = ''
//         const svg = d3.select(stat)
//             .append("svg")
//             .attr("width", stat.offsetWidth - 10)
//             .attr("height", graphHeight + margin.top + margin.bottom)
            
//         const graph = svg.append("g")
//         .attr('width', stat.offsetWidth - 30)
//         .attr('height', graphHeight)
//         .attr('transform', `translate(${margin.left}, ${margin.top})`)
//         const x = d3.scaleLinear().range([0,stat.offsetWidth - margin.left - margin.right])
//         const y = d3.scaleLinear().range([graphHeight,0])
        
//         const xAxisGroup = graph.append('g')
//         .attr('class', 'x-axis')
//         .attr('transform', 'translate(0, ' + graphHeight + ')')
        
//         const yAxisGroup = graph.append('g')
//             .attr('class', 'y-axis')
        
//         const dottedLines = graph.append('g')
//             .attr('class', 'lines')
//             .style('opacity', 0)
        
//         const xDottedLine = dottedLines.append('line')
//             .attr('stroke', '#aaa')
//             .attr('stroke-width', 1)
//             .attr('stroke-dasharray', 4)
        
//         const yDottedLine = dottedLines.append('line')
//             .attr('stroke', '#aaa')
//             .attr('stroke-width', 1)
//             .attr('stroke-dasharray', 4)
        
//         const dottedValue = graph.append('g')
//             .attr('class', 'value')
        
//         const lines = graph.append('g')
//             .attr('class', 'lines2')

//         return {
//             svg,graph,x,y,xAxisGroup,yAxisGroup,dottedLines,xDottedLine,yDottedLine,dottedValue,lines, stat, sid: stat.dataset.sid
//         }
//     })
    
//     const drawStat = (data, svg, iteration) => {
//         if (!data.find(el => el.value != 0)) return
//         data = data.map(day => {
//             return {
//                 date: day.date,
//                 value: Number(day.value)
//             }
//         })
        
//         svg.x.domain([1,data.length])
//         svg.y.domain(params.reverted[iteration] == 0 ? [d3.min(data, d => d.value), (d3.max(data, d => d.value) / 100 * 20)+d3.max(data, d => d.value)] : [(d3.max(data, d => d.value) / 100 * 20)+d3.max(data, d => d.value), d3.min(data, d => d.value) ])

//         const line2 = svg.lines.selectAll('line')
//             .data(data)
    
//         line2.exit().remove()
    
//         line2
//             .attr('x1', (d,i) => {
//                 if (!data[i + 1] || !data.find((el, it) => {
//                     if (it <= i) return false
//                     else {
//                         return el.value != 0
//                     }
//                 })) {
//                     return svg.x(0)
//                 } else {
//                     if (data[i].value == 0) return svg.x(0)
//                     else return x(i + 1)
//                 }
//             })
//             .attr('y1', (d,i) => {
//                 if (!data[i + 1] || !data.find((el, it) => {
//                     if (it <= i) return false
//                     else {
//                         return el.value != 0
//                     }
//                 })) {
//                     return svg.y(0)
//                 } else {
//                     if (data[i].value == 0) return svg.y(0)
//                     else return svg.y(d.value)
//                 }
//             })
//             .attr('x2', (d,i) => {
//                 if (!data[i + 1] || !data.find((el, it) => {
//                     if (it <= i) return false
//                     else {
//                         return el.value != 0
//                     }
//                 })) {
//                     return svg.x(0)
//                 } else
//                     if (data[i].value == 0) return svg.x(0)
//                     else {
//                         return svg.x((i + 2) + (data.indexOf(data.find((el, it) => {
//                             if (it <= i) return false
//                             else {
//                                 return el.value != 0
//                             }
//                         })) - (i + 1)))
//                     }
//             })
//             .attr('y2', (d,i,n) => {
//                 if (!data[i + 1] || !data.find((el, it) => {
//                     if (it <= i) return false
//                     else {
//                         return el.value != 0
//                     }
//                 })) {
//                     return svg.y(0)
//                 } else {
//                     if (data[i].value == 0) return svg.y(0)
//                     else {
//                         return svg.y(data.find((el, it) => {
//                             if (it <= i) return false
//                             else {
//                                 return el.value != 0
//                             }
//                         }).value)
//                     }
//                 }
//             })
//             .attr('stroke', (d,i) => {
//                 if (params.reverted[iteration] == 0) {
//                     if (!data.find((el, it) => {
//                         if (it <= i) return false
//                         else {
//                             return el.value != 0
//                         }
//                     })) return '#000'
//                     else return data.find((el, it) => {
//                         if (it <= i) return false
//                         else {
//                             return el.value != 0
//                         }
//                     }).value < d.value ? 'red' : '#000'
//                 } else {
//                     if (!data.find((el, it) => {
//                         if (it <= i) return false
//                         else {
//                             return el.value != 0
//                         }
//                     })) return '#000'
//                     else return data.find((el, it) => {
//                         if (it <= i) return false
//                         else {
//                             return el.value != 0
//                         }
//                     }).value < d.value ? '#000' : 'red'
//                 }
//             })
    
//         line2.enter()
//             .append('line')
//                 .attr('x1', (d,i) => {
//                     if (!data[i + 1] || !data.find((el, it) => {
//                         if (it <= i) return false
//                         else {
//                             return el.value != 0
//                         }
//                     })) {
//                         return svg.x(0)
//                     } else {
//                         if (data[i].value == 0) return svg.x(0)
//                         else return svg.x(i + 1)
//                     }
//                 })
//                 .attr('y1', (d,i) => {
//                     if (!data[i + 1] || !data.find((el, it) => {
//                         if (it <= i) return false
//                         else {
//                             return el.value != 0
//                         }
//                     })) {
//                         return svg.y(0)
//                     } else {
//                         if (data[i].value == 0) return svg.y(0)
//                         else return svg.y(d.value)
//                     }
//                 })
//                 .attr('x2', (d,i) => {
//                     if (!data[i + 1] || !data.find((el, it) => {
//                         if (it <= i) return false
//                         else {
//                             return el.value != 0
//                         }
//                     })) {
//                         return svg.x(0)
//                     } else
//                         if (data[i].value == 0) return svg.x(0)
//                         else {
//                             return svg.x((i + 2) + (data.indexOf(data.find((el, it) => {
//                                 if (it <= i) return false
//                                 else {
//                                     return el.value != 0
//                                 }
//                             })) - (i + 1)))
//                         }
//                 })
//                 .attr('y2', (d,i,n) => {
//                     if (!data[i + 1] || !data.find((el, it) => {
//                         if (it <= i) return false
//                         else {
//                             return el.value != 0
//                         }
//                     })) {
//                         return svg.y(0)
//                     } else {
//                         if (data[i].value == 0) return svg.y(0)
//                         else {
//                             return svg.y(data.find((el, it) => {
//                                 if (it <= i) return false
//                                 else {
//                                     return el.value != 0
//                                 }
//                             }).value)
//                         }
//                     }
//                 })
//                 .attr('stroke', (d,i) => {
//                     if (params.reverted[iteration] == 0) {
//                         if (!data.find((el, it) => {
//                             if (it <= i) return false
//                             else {
//                                 return el.value != 0
//                             }
//                         })) return '#000'
//                         else return data.find((el, it) => {
//                             if (it <= i) return false
//                             else {
//                                 return el.value != 0
//                             }
//                         }).value < d.value ? 'red' : '#000'
//                     } else {
//                         if (!data.find((el, it) => {
//                             if (it <= i) return false
//                             else {
//                                 return el.value != 0
//                             }
//                         })) return '#000'
//                         else return data.find((el, it) => {
//                             if (it <= i) return false
//                             else {
//                                 return el.value != 0
//                             }
//                         }).value < d.value ? '#000' : 'red'
//                     }
//                 })
//                 .attr('stroke-linecap','round')
//                 .attr('stroke-width', (d,i) => {
//                     if (!data[i + 1] || !data.find((el, it) => {
//                         if (it <= i) return false
//                         else {
//                             return el.value != 0
//                         }
//                     })) {
//                         return 0
//                     } else {
//                         if (data[i].value == 0) return 0
//                         else {
//                             return 3
//                         }
//                     }
//                 })
    
//         const text = svg.dottedValue.selectAll('text')
//             .data(data)
    
//         text.exit().remove()
        
//         text
//             .attr('x', (d,i) => svg.x(i + 1))
//             .attr('y', d => svg.y(d.value))
//             .text((d) => d.value)
    
//         text.enter()
//             .append('text')
//                 .attr('x', (d,i) => svg.x(i + 1))
//                 .attr('y', d => svg.y(d.value))
//                 .attr('fill', 'currentColor')
//                 .style('opacity', '0')
//                 .text(d => d.value)
    
//         svg.dottedValue.selectAll('text')
//             .attr('transform', 'rotate(0) translate(0, -13)')
    
    
//         const circles = svg.graph.selectAll('circle')
//             .data(data)
    
//         circles.exit().remove()
    
//         circles
//             .attr('cx', (d,i) => svg.x(i + 1))
//             .attr('cy', d => svg.y(d.value))
    
//         circles.enter()
//             .append('circle')
//                 .attr('r', d => d.value == 0 ? 0 : 3)
//                 .attr('cx', (d,i) => svg.x(i + 1))
//                 .attr('cy', d => svg.y(d.value))
//                 .attr('fill', '#000')
    
//         svg.svg
//             .on('mouseover', () => {
//                 svg.svg.selectAll('circle')  
//                     .attr('r', d => d.value == 0 ? 0 : 4)
//             })
//             .on('mouseleave', () => {
//                 d3.selectAll('circle')  
//                     .attr('r', d => d.value == 0 ? 0 : 3)
//             })
            
//         svg.graph.selectAll('circle')
//             .on('mouseover', (d,i,n) => {
//                 svg.dottedValue.selectAll('text')._groups[0][i].style.opacity = 1
    
//                 d3.select(n[i])
//                     .transition().duration(100)
//                         .attr('r', 8)
//                         .attr('fill', '#000')
//                 svg.xDottedLine
//                     .attr('x1', svg.x(i + 1))
//                     .attr('x2', svg.x(i + 1))
//                     .attr('y1', graphHeight)
//                     .attr('y2', svg.y(d.value))
//                 svg.yDottedLine
//                     .attr('x1', 0)
//                     .attr('x2', svg.x(i + 1))
//                     .attr('y1', svg.y(d.value))
//                     .attr('y2', svg.y(d.value))
    
//                 svg.dottedLines.style('opacity', 1)
//             })
//             .on('mouseleave', (d,i,n) => {
//                 svg.dottedValue.selectAll('text')._groups[0][i].style.opacity = 0
//                 d3.select(n[i])
//                     .transition().duration(100)
//                         .attr('r', 4)
//                         .attr('fill', '#000')
    
//                 svg.dottedLines.style('opacity', 0)
//             })
        
//         const xAxis = d3.axisBottom(svg.x)
//             .ticks(data.length)
//             .tickSize(10)
//             .tickFormat((d,i) => data.length > 7 ? data[i].date.substr(0, 5) : data[i].date.substr(0, 5))
    
//         const yAxis = d3.axisLeft(svg.y)
//             .tickSize(10)
//             .ticks(4)
        
//         svg.xAxisGroup.call(xAxis)
//         svg.yAxisGroup.call(yAxis)
//         svg.xAxisGroup.selectAll('text')
//             .attr('transform', data.length > 7 ? 'rotate(-90) translate(-25, -17)' : svg.stat.offsetWidth >= 500 ? '':'rotate(-90) translate(-25, -17)')
    // }
//     graphs.forEach((el, i) => drawStat(data[i], el, i))
// }