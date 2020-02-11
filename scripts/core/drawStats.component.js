import *  as d3 from "d3"

const formatNumber = num => new Intl.NumberFormat('ru-RU').format(num)

export default class DrawStats {
    constructor(stat, data, reverted, lastDay, startY, statPeriod, firstWeekDay, params = {
        accColor: 'green',
        statHeight: 250,
        quota: 0
    }) {
        firstWeekDay = new Date(firstWeekDay)
        const format = data => {
            data += ''
            return data.length < 2 ? data.length < 1 ? '00' : '0' + data : data  
        }
        
        const period = statPeriod === 'Y' ? 'Y' : Number(statPeriod) * 7

        if (data == null) data = []

        
        let currentDays = []

        if (period != 'Y' && period <= 28) {
            for (let i = 0; i < period; i++) {
                let date = new Date(new Date(firstWeekDay).setDate(firstWeekDay.getDate() + i))
                date = `${format(date.getDate())}.${format(date.getMonth() + 1)}.${date.getFullYear()}`
                let lastWeekDayIndex = data.indexOf(data.find(stat => stat.date == date))
                currentDays.push(data[lastWeekDayIndex] || {date,value: null, quota: null})
            }

        } else {
            let i = new Date(startY,0,1)
            let day = {
                date: null,
                value: null,
                quota: null
            }
            if (period > 28) {
                i = new Date(firstWeekDay)
                for (let j = 0; j < period; j++) {
                    let date = new Date(new Date(firstWeekDay).setDate(firstWeekDay.getDate() + j))
                    date = `${format(date.getDate())}.${format(date.getMonth() + 1)}.${date.getFullYear()}`
                    const dataObj = data.find(stat => stat.date == date)
                    if (i.getDay() == lastDay) {
                        if (dataObj && dataObj.value != null) day.value += Number(dataObj.value)
                        if (dataObj && dataObj.quota != null) day.quota += Number(dataObj.quota)
                        day.date = date
                        currentDays.push(day)
                        day = {
                            date: null,
                            value: null,
                            quota: null
                        }
                    } else {
                        if (dataObj && dataObj.value != null) day.value += Number(dataObj.value)
                        if (dataObj && dataObj.quota != null) day.quota += Number(dataObj.quota)
                    }
                    i = new Date(i.setDate(i.getDate() + 1))
                }
            } else
                while (i.getFullYear() == startY) {
                    let date = `${format(i.getDate())}.${format(i.getMonth() + 1)}.${i.getFullYear()}`
                    const dataObj = data.find(stat => stat.date == date)
                    if (i.getDay() == lastDay) {
                        if (dataObj && dataObj.value != null) day.value += Number(dataObj.value)
                        if (dataObj && dataObj.quota != null) day.quota += Number(dataObj.quota)
                        day.date = date
                        currentDays.push(day)
                        day = {
                            date: null,
                            value: null,
                            quota: null
                        }
                    } else {
                        if (dataObj && dataObj.value != null) day.value += Number(dataObj.value)
                        if (dataObj && dataObj.quota != null) day.quota += Number(dataObj.quota)
                    }
                    i = new Date(i.setDate(i.getDate() + 1))
                }
        }
        this.data = currentDays


        let v = 0
        this.dataAcc = currentDays.map(el => {
            return {
                date: el.date,
                value: el.value != null ? v += el.value : null
            }
        })
        let q = 0
        this.dataQuota = currentDays.map(el => {
            return {
                date: el.date,
                quota: el.quota != null ? q += el.quota : null
            }
        })

        this.params = params
        this.quota = params.quota
        this.reverted = reverted
        this.stat = document.getElementById(stat)
        this.graphHeight
        this.margin = {top: 40, right: 25, bottom: 50, left: 30}
        this.graphHeight = params.statHeight - this.margin.top - this.margin.bottom
        if (Math.ceil(String(Math.round(d3.max(this.data, d => Number(d.value)))).length / 3) > 1) {
            this.margin.left = (Math.ceil(String(Math.round(d3.max(this.data, d => Number(d.value)))).length / 3) * 20) + 10
        } else {
            if (String(Math.round(d3.max(this.data, d => Number(d.value)))).length > 1) {
                this.margin.left = (10 * String(Math.round(d3.max(this.data, d => Number(d.value)))).length) + 10
            }
        }
        this.stat.innerHTML = ''
        this.svg = d3.select(this.stat)
            .append("svg")
            .attr("width", this.stat.offsetWidth - 10)
            .attr("height", this.graphHeight + this.margin.top + this.margin.bottom)
            
        this.graph = this.svg.append("g")
            .attr('width', this.stat.offsetWidth - 30)
            .attr('height', this.graphHeight)
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
        this.x = d3.scaleLinear().range([0,this.stat.offsetWidth - this.margin.left - this.margin.right])
        this.y = d3.scaleLinear().range([this.graphHeight,0])
        
        this.xAxisGroup = this.graph.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0, ' + this.graphHeight + ')')
        
        this.yAxisGroup = this.graph.append('g')
            .attr('class', 'y-axis')
        
        this.dottedLines = this.graph.append('g')
            .attr('class', 'linesDot')
            .style('opacity', 0)
        
        this.xDottedLine = this.dottedLines.append('line')
            .attr('stroke', '#aaa')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', 4)
        
        this.yDottedLine = this.dottedLines.append('line')
            .attr('stroke', '#aaa')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', 4)

        this.lines = this.graph.append('g')
            .attr('class', 'lines')
        
        this.lines2 = this.graph.append('g')
            .attr('class', 'linesAcc')
            
        this.lines3 = this.graph.append('g')
            .attr('class', 'linesQuota')
        
            .attr('class', 'valueQuota')

        this.dots = this.graph.append('g')
            .attr('class', 'dots')

        this.dotsAcc = this.graph.append('g')
            .attr('class', 'dotsAcc')

        this.dotsQuota = this.graph.append('g')
            .attr('class', 'dotsQuota')

        this.dottedValue = this.graph.append('g')
            .attr('class', 'value')

        this.dottedValue2 = this.graph.append('g')
            .attr('class', 'valueAcc')

        this.dottedValue3 = this.graph.append('g')
        
    }
    drawStat() {
        if (!this.data.find(el => el.value != null)) return
        let data = this.data.map(day => {
            return {
                date: day.date,
                value: day.value == null ? null : Number(day.value),
                // quota: day.quota == null ? null : Number(day.quota)
            }
        })
        this.x.domain([1,data.length])
        
        if (this.quota) {
            if (d3.max(data, d => Number(d.value)) >= d3.max(this.dataQuota, d => Number(d.quota)) && d3.max(data, d => Number(d.value)) >= d3.max(this.dataAcc, d => Number(d.value))) {
                this.y.domain(this.reverted == 0 ? [d3.min(data, d => Number(d.value)), (d3.max(data, d => Number(d.value)) / 100 * 20)+d3.max(data, d => Number(d.value))] : [(d3.max(data, d => Number(d.value)) / 100 * 20)+d3.max(data, d => Number(d.value)), d3.min(data, d => Number(d.value))])
            }
            if (d3.max(this.dataAcc, d => Number(d.value)) >= d3.max(data, d => Number(d.value)) && d3.max(this.dataAcc, d => Number(d.value)) >= d3.max(this.dataQuota, d => Number(d.quota))) {
                this.y.domain([d3.min(data, d => Number(d.value)), (d3.max(this.dataAcc, d => Number(d.value)) / 100 * 20)+d3.max(this.dataAcc, d => Number(d.value))])
            }
            if (d3.max(this.dataQuota, d => Number(d.quota)) >= d3.max(data, d => Number(d.value)) && d3.max(this.dataQuota, d => Number(d.quota)) >= d3.max(this.dataAcc, d => Number(d.value))) {
                this.y.domain([d3.min(data, d => Number(d.value)), (d3.max(this.dataQuota, d => Number(d.quota)) / 100 * 20)+d3.max(this.dataQuota, d => Number(d.quota))])
            }
        } else {
            this.y.domain(this.reverted == 0 ? [d3.min(data, d => Number(d.value)), (d3.max(data, d => Number(d.value)) / 100 * 20)+d3.max(data, d => Number(d.value))] : [(d3.max(data, d => Number(d.value)) / 100 * 20)+d3.max(data, d => Number(d.value)), d3.min(data, d => Number(d.value))])
        }

        // Линия обычного графика
        
        const line2 = this.lines.selectAll('line')
            .data(data)
    
        line2.exit().remove()
    
        line2
            .attr('x1', (d,i) => {
                if (!data[i + 1] || !data.find((el, it) => {
                    if (it <= i) return false
                    else {
                        return el.value != null
                    }
                })) {
                    return this.x(0)
                } else {
                    if (data[i].value == null) return this.x(0)
                    else return this.x(i + 1)
                }
            })
            .attr('y1', (d,i) => {
                if (!data[i + 1] || !data.find((el, it) => {
                    if (it <= i) return false
                    else {
                        return el.value != null
                    }
                })) {
                    return this.y(0)
                } else {
                    if (data[i].value == null) return this.y(0)
                    else return this.y(d.value)
                }
            })
            .attr('x2', (d,i) => {
                if (!data[i + 1] || !data.find((el, it) => {
                    if (it <= i) return false
                    else {
                        return el.value != null
                    }
                })) {
                    return this.x(0)
                } else
                    if (data[i].value == null) return this.x(0)
                    else {
                        if (data[i + 1].value == null) return this.x(i + 1)
                        else return this.x(i + 2)
                    }
            })
            .attr('y2', (d,i,n) => {
                if (!data[i + 1] || !data.find((el, it) => {
                    if (it <= i) return false
                    else {
                        return el.value != null
                    }
                })) {
                    return this.y(0)
                } else {
                    if (data[i].value == null) return this.y(0)
                    else {
                        if (data[i + 1].value == null) return this.y(d.value)
                        else return this.y(data[i + 1].value)
                    }
                }
            })
    
        line2.enter()
            .append('line')
                .attr('x1', (d,i) => {
                    if (!data[i + 1] || !data.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != null
                        }
                    })) {
                        return this.x(0)
                    } else {
                        if (data[i].value == null) return this.x(0)
                        else return this.x(i + 1)
                    }
                })
                .attr('y1', (d,i) => this.y(0))
                .attr('x2', (d,i) => {
                    if (!data[i + 1] || !data.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != null
                        }
                    })) {
                        return this.x(0)
                    } else
                        if (data[i].value == null) return this.x(0)
                        else {
                            if (data[i + 1].value == null) return this.x(i + 1)
                            else return this.x(i + 2)
                        }
                })
                .attr('y2', (d,i,n) => this.y(0))
                .attr('stroke', (d,i) => {
                    if (this.reverted == 0) {
                        if (!data.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.value != null
                            }
                        })) return '#000'
                        else return data.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.value != null
                            }
                        }).value < d.value ? 'red' : '#000'
                    } else {
                        if (!data.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.value != null
                            }
                        })) return '#000'
                        else return data.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.value != null
                            }
                        }).value < d.value ? '#000' : 'red'
                    }
                })
                .attr('stroke-linecap','round')
                .attr('stroke-width', (d,i) => {
                    if (!data[i + 1] || !data.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != null
                        }
                    })) {
                        return 0
                    } else {
                        if (data[i].value == null) return 0
                        else {
                            return 3
                        }
                    }
                })
                .transition().duration(500)
                    .attr('y1', (d,i) => {
                        if (!data[i + 1] || !data.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.value != null
                            }
                        })) {
                            return this.y(0)
                        } else {
                            if (data[i].value == null) return this.y(0)
                            else return this.y(d.value)
                        }
                    })
                    .attr('y2', (d,i,n) => {
                        if (!data[i + 1] || !data.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.value != null
                            }
                        })) {
                            return this.y(0)
                        } else {
                            if (data[i].value == null) return this.y(0)
                            else {
                                if (data[i + 1].value == null) return this.y(d.value)
                                else return this.y(data[i + 1].value)
                            }
                        }
                    })
        if (this.quota) {
        // Накопительная линия
            const lineAcc = this.lines2.selectAll('line')
                .data(this.dataAcc)
        
            lineAcc.exit().remove()
        
            lineAcc
                .attr('x1', (d,i) => {
                    if (!this.dataAcc[i + 1] || !this.dataAcc.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != null
                        }
                    })) {
                        return this.x(0)
                    } else {
                        if (this.dataAcc[i].value == null) return this.x(0)
                        else return this.x(i + 1)
                    }
                })
                .attr('y1', (d,i) => {
                    if (!this.dataAcc[i + 1] || !this.dataAcc.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != null
                        }
                    })) {
                        return this.y(0)
                    } else {
                        if (this.dataAcc[i].value == null) return this.y(0)
                        else return this.y(d.value)
                    }
                })
                .attr('x2', (d,i) => {
                    if (!this.dataAcc[i + 1] || !this.dataAcc.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != null
                        }
                    })) {
                        return this.x(0)
                    } else
                        if (this.dataAcc[i].value == null) return this.x(0)
                        else {
                            if (this.dataAcc[i + 1].value == null) return this.x(i + 1)
                            else return this.x(i + 2)
                        }
                })
                .attr('y2', (d,i,n) => {
                    if (!this.dataAcc[i + 1] || !this.dataAcc.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.value != null
                        }
                    })) {
                        return this.y(0)
                    } else {
                        if (this.dataAcc[i].value == null) return this.y(0)
                        else {
                            if (this.dataAcc[i + 1].value == null) return this.y(d.value)
                            else return this.y(this.dataAcc[i + 1].value)
                        }
                    }
                })
            lineAcc.enter()
                .append('line')
                    .attr('x1', (d,i) => {
                        if (!this.dataAcc[i + 1] || !this.dataAcc.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.value != null
                            }
                        })) {
                            return this.x(0)
                        } else {
                            if (this.dataAcc[i].value == null) return this.x(0)
                            else return this.x(i + 1)
                        }
                    })
                    .attr('y1', (d,i) => {
                        if (!this.dataAcc[i + 1] || !this.dataAcc.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.value != null
                            }
                        })) {
                            return this.y(0)
                        } else {
                            if (this.dataAcc[i].value == null) return this.y(0)
                            else return this.y(d.value)
                        }
                    })
                    .attr('x2', (d,i) => {
                        if (!this.dataAcc[i + 1] || !this.dataAcc.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.value != null
                            }
                        })) {
                            return this.x(0)
                        } else
                            if (this.dataAcc[i].value == null) return this.x(0)
                            else {
                                if (this.dataAcc[i + 1].value == null) return this.x(i + 1)
                                else return this.x(i + 2)
                            }
                    })
                    .attr('y2', (d,i,n) => {
                        if (!this.dataAcc[i + 1] || !this.dataAcc.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.value != null
                            }
                        })) {
                            return this.y(0)
                        } else {
                            if (this.dataAcc[i].value == null) return this.y(0)
                            else {
                                if (this.dataAcc[i + 1].value == null) return this.y(d.value)
                                else return this.y(this.dataAcc[i + 1].value)
                            }
                        }
                    })
                    .attr('stroke', (d,i) => {
                        if (this.reverted == 0) {
                            if (!this.dataAcc.find((el, it) => {
                                if (it <= i) return false
                                else {
                                    return el.value != null
                                }
                            })) return 
                            else return this.dataAcc.find((el, it) => {
                                if (it <= i) return false
                                else {
                                    return el.value != null
                                }
                            }).value < d.value ? 'red' : this.params.accColor || 'green'
                        } else {
                            if (!this.dataAcc.find((el, it) => {
                                if (it <= i) return false
                                else {
                                    return el.value != null
                                }
                            })) return this.params.accColor || 'green'
                            else return this.dataAcc.find((el, it) => {
                                if (it <= i) return false
                                else {
                                    return el.value != null
                                }
                            }).value < d.value ? this.params.accColor || 'green' : 'red' 
                        }
                    })
                    .attr('stroke-linecap','round')
                    .attr('stroke-width', (d,i) => {
                        if (!this.dataAcc[i + 1] || !this.dataAcc.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.value != null
                            }
                        })) {
                            return 0
                        } else {
                            if (this.dataAcc[i].value == null) return 0
                            else {
                                return 3
                            }
                        }
                    })

            const lineQuota = this.lines3.selectAll('line')
                .data(this.dataQuota)

            lineQuota.exit().remove()

            lineQuota
                .attr('x1', (d,i) => {
                    if (!this.dataQuota[i + 1] || !this.dataQuota.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.quota != null
                        }
                    })) {
                        return this.x(0)
                    } else {
                        if (this.dataQuota[i].quota == null) return this.x(0)
                        else return x(i + 1)
                    }
                })
                .attr('y1', (d,i) => {
                    if (!this.dataQuota[i + 1] || !this.dataQuota.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.quota != null
                        }
                    })) {
                        return this.y(0)
                    } else {
                        if (this.dataQuota[i].quota == null) return this.y(0)
                        else return this.y(d.quota)
                    }
                })
                .attr('x2', (d,i) => {
                    if (!this.dataQuota[i + 1] || !this.dataQuota.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.quota != null
                        }
                    })) {
                        return this.x(0)
                    } else
                        if (this.dataQuota[i].quota == null) return this.x(0)
                        else {
                            return this.x((i + 2) + (this.dataQuota.indexOf(this.dataQuota.find((el, it) => {
                                if (it <= i) return false
                                else {
                                    return el.quota != null
                                }
                            })) - (i + 1)))
                        }
                })
                .attr('y2', (d,i,n) => {
                    if (!this.dataQuota[i + 1] || !this.dataQuota.find((el, it) => {
                        if (it <= i) return false
                        else {
                            return el.quota != null
                        }
                    })) {
                        return this.y(0)
                    } else {
                        if (this.dataQuota[i].quota == null) return this.y(0)
                        else {
                            return this.y(this.dataQuota.find((el, it) => {
                                if (it <= i) return false
                                else {
                                    return el.quota != null
                                }
                            }).quota)
                        }
                    }
                })

            lineQuota.enter()
                .append('line')
                    .attr('x1', (d,i) => {
                        if (!this.dataQuota[i + 1] || !this.dataQuota.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.quota != null
                            }
                        })) {
                            return this.x(0)
                        } else {
                            if (this.dataQuota[i].quota == null) return this.x(0)
                            else return this.x(i + 1)
                        }
                    })
                    .attr('y1', (d,i) => {
                        if (!this.dataQuota[i + 1] || !this.dataQuota.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.quota != null
                            }
                        })) {
                            return this.y(0)
                        } else {
                            if (this.dataQuota[i].quota == null) return this.y(0)
                            else return this.y(d.quota)
                        }
                    })
                    .attr('x2', (d,i) => {
                        if (!this.dataQuota[i + 1] || !this.dataQuota.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.quota != null
                            }
                        })) {
                            return this.x(0)
                        } else
                            if (this.dataQuota[i].quota == null) return this.x(0)
                            else {
                                return this.x((i + 2) + (this.dataQuota.indexOf(this.dataQuota.find((el, it) => {
                                    if (it <= i) return false
                                    else {
                                        return el.quota != null
                                    }
                                })) - (i + 1)))
                            }
                    })
                    .attr('y2', (d,i,n) => {
                        if (!this.dataQuota[i + 1] || !this.dataQuota.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.quota != null
                            }
                        })) {
                            return this.y(0)
                        } else {
                            if (this.dataQuota[i].quota == null) return this.y(0)
                            else {
                                return this.y(this.dataQuota.find((el, it) => {
                                    if (it <= i) return false
                                    else {
                                        return el.quota != null
                                    }
                                }).quota)
                            }
                        }
                    })
                    .attr('stroke', (d,i) => {
                        if (this.reverted == 0) {
                            if (!this.dataQuota.find((el, it) => {
                                if (it <= i) return false
                                else {
                                    return el.quota != null
                                }
                            })) return 'gray'
                            else return 'gray'
                        }
                    })
                    .attr('stroke-linecap','round')
                    .attr('stroke-dasharray', 11)
                    .attr('stroke-width', (d,i) => {
                        if (!this.dataQuota[i + 1] || !this.dataQuota.find((el, it) => {
                            if (it <= i) return false
                            else {
                                return el.quota != null
                            }
                        })) {
                            return 0
                        } else {
                            if (this.dataQuota[i].quota == null) return 0
                            else {
                                return 2
                            }
                        }
                    })
                    
            const text2 = this.dottedValue2.selectAll('text')
                .data(this.dataAcc)
        
            text2.exit().remove()
            
            text2
                .attr('x', (d,i) => this.x(i + 1))
                .attr('y', d => this.y(d.value))
                .text((d) => formatNumber(Math.round(d.value)))
                .style('font-family', 'arial condensed', 'important')
        
            text2.enter()
                .append('text')
                    .attr('x', (d,i) => this.x(i + 1))
                    .attr('y', d => this.y(d.value))
                    .attr('fill', 'currentColor')
                    .style('opacity', '0')
                    .text(d => formatNumber(Math.round(d.value)))
                    .style('font-family', 'arial condensed', 'important')
        
            this.dottedValue2.selectAll('text')
                .attr('transform', (d, i) => !this.dataAcc[i + 1] ? 'translate(-70, -13)' : 'rotate(0) translate(0, -13)' )
                
            const text3 = this.dottedValue3.selectAll('text')
                .data(this.dataQuota)
        
            text3.exit().remove()
            
            text3
                .attr('x', (d,i) => this.x(i + 1))
                .attr('y', d => this.y(d.quota))
                .text((d) => formatNumber(Math.round(d.quota)))
                .style('font-family', 'arial condensed', 'important')
        
            text3.enter()
                .append('text')
                    .attr('x', (d,i) => this.x(i + 1))
                    .attr('y', d => this.y(d.quota))
                    .attr('fill', 'currentColor')
                    .style('opacity', '0')
                    .text(d => formatNumber(Math.round(d.quota)))
                    .style('font-family', 'arial condensed', 'important')
        
            this.dottedValue3.selectAll('text')
                .attr('transform', (d, i) => !this.dataQuota[i + 1] ? 'translate(-70, -13)' : 'rotate(0) translate(-40, -13)' )
                
            const circlesAcc = this.dotsAcc.selectAll('circle')
                .data(this.dataAcc)
        
            circlesAcc.exit().remove()
        
            circlesAcc
                .attr('cx', (d,i) => this.x(i + 1))
                .attr('cy', d => this.y(d.value))
        
            circlesAcc.enter()
                .append('circle')
                    .attr('r', d => d.value == null ? 0 : 3)
                    .attr('cx', (d,i) => this.x(i + 1))
                    .attr('cy', d => this.y(d.value))
                    .attr('fill', '#000')
                
            this.dotsAcc.selectAll('circle')
                .on('mouseover', (d,i,n) => {
                    this.dottedValue2.selectAll('text')._groups[0][i].style.opacity = 1
        
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
                    this.dottedValue2.selectAll('text')._groups[0][i].style.opacity = 0
                    d3.select(n[i])
                        .transition().duration(100)
                            .attr('r', 4)
                            .attr('fill', '#000')
        
                    this.dottedLines.style('opacity', 0)
                })

            const circlesQuota = this.dotsQuota.selectAll('circle')
                .data(this.dataQuota)
        
            circlesQuota.exit().remove()
        
            circlesQuota
                .attr('cx', (d,i) => this.x(i + 1))
                .attr('cy', d => this.y(d.quota))
        
            circlesQuota.enter()
                .append('circle')
                    .attr('r', d => d.quota == null ? 0 : 3)
                    .attr('cx', (d,i) => this.x(i + 1))
                    .attr('cy', d => this.y(d.quota))
                    .attr('fill', '#000')
                
            this.dotsQuota.selectAll('circle')
                .on('mouseover', (d,i,n) => {
                    this.dottedValue3.selectAll('text')._groups[0][i].style.opacity = 1
        
                    d3.select(n[i])
                        .transition().duration(100)
                            .attr('r', 8)
                            .attr('fill', '#000')
                    this.xDottedLine
                        .attr('x1', this.x(i + 1))
                        .attr('x2', this.x(i + 1))
                        .attr('y1', this.graphHeight)
                        .attr('y2', this.y(d.quota))
                    this.yDottedLine
                        .attr('x1', 0)
                        .attr('x2', this.x(i + 1))
                        .attr('y1', this.y(d.quota))
                        .attr('y2', this.y(d.quota))
        
                    this.dottedLines.style('opacity', 1)
                })
                .on('mouseleave', (d,i,n) => {
                    this.dottedValue3.selectAll('text')._groups[0][i].style.opacity = 0
                    d3.select(n[i])
                        .transition().duration(100)
                            .attr('r', 4)
                            .attr('fill', '#000')
        
                    this.dottedLines.style('opacity', 0)
                })
        }
    // значения при наведении на точку
        const text = this.dottedValue.selectAll('text')
            .data(data)
    
        text.exit().remove()
        
        text
            .attr('x', (d,i) => this.x(i + 1))
            .attr('y', d => this.y(d.value))
            .text((d) => formatNumber(Math.round(d.value)))
            .style('font-family', 'arial condensed', 'important')
    
        text.enter()
            .append('text')
                .attr('x', (d,i) => this.x(i + 1))
                .attr('y', d => this.y(d.value))
                .attr('fill', 'currentColor')
                .style('opacity', '0')
                .text(d => formatNumber(Math.round(d.value)))
                .style('font-family', 'arial condensed', 'important')
    
        this.dottedValue.selectAll('text')
            .attr('transform', (d, i) => !data[i + 1] ? 'translate(-70, -13)' : 'rotate(0) translate(0, -13)' )
    // точки обычного графика
        const circles = this.dots.selectAll('circle')
            .data(data)
        circles.exit().remove()
    
        circles
            .attr('cx', (d,i) => this.x(i + 1))
            .attr('cy', d => this.y(d.value))
    
        circles.enter()
            .append('circle')
                .attr('r', d => d.value == null ? 0 : 3)
                .attr('cx', (d,i) => this.x(i + 1))
                .attr('cy', d => this.y(0))
                .attr('fill', '#000')
                .transition().duration(500)
                    .attr('cy', d => this.y(d.value))
    
        this.svg
            .on('mouseover', () => {
                this.svg.selectAll('circle')  
                    .attr('r', d => {
                         return d.value == null && d.quota == null ? 0 : 4
                    })
            })
            .on('mouseleave', () => {
                this.svg.selectAll('circle')  
                    .attr('r', d => {
                         return d.value == null && d.quota == null ? 0 : 3
                    })
            })
            
        this.dots.selectAll('circle')
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
        this.yAxisGroup.call(yAxis).selectAll('text')
            .style('font-family', 'arial condensed', 'important')
        this.xAxisGroup.selectAll('text')
            .style('font-family', 'arial condensed', 'important')
            .attr('transform', data.length > 7 ? 'rotate(-90) translate(-25, -17)' : this.stat.offsetWidth >= 500 ? '':'rotate(-90) translate(-25, -17)')
    }
}