import React, { Component } from 'react'

import Utils from '../../Utils/Utils'

import DateHelper from '../../helper/date_helper'

class Table extends Component {
    state = {

    }

    lang = null
    navigation = null

    file_to_upload_list = []
    file_uploaded_error_list = []

    animation_intervale = null

    constructor(props){
        super(props)

        this.state = {
            day: props.day,
            month: props.month,
            year: props.year,
            layout: props.layout === undefined ? 'month' : props.layout,
        }

        //Todo : 
        //- generate calendar (by month & year)
        //- change layout view
        //- render item inside row
        //- return on_click item
        //- drag and drop item
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState({ 
            day: nextProps.day, 
            month: nextProps.month, 
            year: nextProps.year,
            layout: nextProps.layout,
        })
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidUpdate(){

    }

    componentDidMount(){

    }

    get_day_list(month, year){
        let i = 0
        let day_list = []
        let view_list = []
        const first_day = DateHelper.get_first_day_in_mounth(month, year)
        const date_nb = DateHelper.get_days_in_mounth(month, year)

        //write all dates
        for (i = 1; i <= date_nb; i++) {
            day_list.push({ day: i, month: month, year: year })
        }

        //write last month date
        for (i = 0; i < first_day; i++) {

            let _current_month = month - 1
            let _current_year = year

            if (_current_month < 0) {
                _current_month = 11
                _current_year -= 1
            }

            let _days_of_last_month = DateHelper.get_days_in_mounth(_current_month, _current_year)
            day_list.splice(0, 0, { 
                day: _days_of_last_month - i, 
                month: _current_month, 
                year: _current_year,
                is_not_active: true
            })
        }

        //divide day_list to view_list
        let week_nb = day_list.length / 7
        let next_month_date_diff = 1
        for (i = 0; i < week_nb; i++) {
            view_list.push([])
            for (var j = 0; j < 7; j++) {
                let adr = day_list.shift()
                if (adr !== undefined) {
                    view_list[i].push(adr)
                }
                else{
                    //write next month date
                    let _current_month = month + 1
                    let _current_year = year

                    if (_current_month >= 12) {
                        _current_month = 0
                        _current_year += 1
                    }

                    view_list[i].push({ 
                        day: next_month_date_diff, 
                        month: _current_month, 
                        year: _current_year,
                        is_not_active: true
                    })
                    next_month_date_diff++
                }
                
            }
        }

        return view_list
    }

    get_month_list() {
        return [
            "std_january",
            "std_february",
            "std_march",
            "std_april",
            "std_mai",
            "std_june",
            "std_july",
            "std_august",
            "std_september",
            "std_october",
            "std_november",
            "std_december",
        ]
    }

    /**
     * empty canevas just to make jsx loop 31 times
     * @return {array} 
     */
    get_day_list_canevas(){
        let adr = []
        for (var i = 1; i <= 31; i++) {
            adr.push(i)
        }

        return adr
    }

    has_date(day, month, year){
        const date_nb = DateHelper.get_days_in_mounth(month, year)

        return day <= date_nb 
    }

    is_week_end(day, month, year){
        var d = new Date(Date.UTC(year, month, day));

        return d.getDay() == 6 || d.getDay() == 0;
    }

    refresh(){
        this.forceUpdate()
    }

    render() {

        const { 
            day,
            month,
            year,
            layout,
        } = this.state

        const _date_now = new Date()
        const state_now = {
            day: _date_now.getDate(),
            month: _date_now.getMonth(),
            year: _date_now.getFullYear()
        }

        if (layout === 'month') {

            const week_list = this.get_day_list(month, year)

            return (
                <table className="calendar-month">
                    <tbody>
                        <tr className="calendar-header">
                            <td>{ this.props.lang.line('std_lun') }</td>
                            <td>{ this.props.lang.line('std_mar') }</td>
                            <td>{ this.props.lang.line('std_mer') }</td>
                            <td>{ this.props.lang.line('std_jeu') }</td>
                            <td>{ this.props.lang.line('std_ven') }</td>
                            <td>{ this.props.lang.line('std_sam') }</td>
                            <td>{ this.props.lang.line('std_dim') }</td>
                        </tr>
                        {
                            week_list.map((day_list, row_index) => (
                                <tr key={row_index}>
                                    {
                                        day_list.map((_day, day_index) => (
                                            <td key={day_index} className={ 
                                                (_day.is_not_active ? '' : 'active') + ' ' + 
                                                ((_day.day === day && _day.month === month && _day.year === year) ? 'selected' : '') + ' ' +
                                                ((_day.day === state_now.day && _day.month === state_now.month && _day.year === state_now.year) ? 'now' : '') }>
                                                <span className="text">{ _day.day }</span>
                                            </td>
                                        ))
                                    }
                                </tr>
                            ) )
                        }
                        
                    </tbody>
                </table>
            )
        }

        if (layout === 'year') {

            const month_list = this.get_month_list()
            const date_list = this.get_day_list_canevas()

            return (
                <table className="calendar-year">
                    <tbody>
                        <tr className="calendar-header">
                            <td className="calendar-date"></td>
                            {
                                month_list.map((_month, index) => (
                                    <td key={index}>{ this.props.lang.line(_month) }</td>
                                ))
                            }
                        </tr>
                        {
                            date_list.map((day_canevas, index) => (
                                <tr key={index}>
                                    <td className="calendar-date">{ day_canevas }</td>
                                    {
                                        month_list.map((_month, month_index) => (
                                            <td key={month_index} className={ 
                                                ((day_canevas === day && month_index === month) ? 'selected' : '') + ' ' +
                                                ((this.has_date(day_canevas, month_index, year)) ? '' : 'not-active') + ' ' +
                                                ((this.has_date(day_canevas, month_index, year) && this.is_week_end(day_canevas, month_index, year)) ? 'week-end' : '') + ' ' +
                                                ((day_canevas === state_now.day && month_index === state_now.month) ? 'now' : '') }>

                                            </td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                        
                    </tbody>
                </table>
            )
        }
    }
}

export default Table