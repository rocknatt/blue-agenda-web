import React, { Component } from 'react'

// import DateHelper from '../../helper/date_helper'
import { DateHelper, Utils } from 'mzara-library'
import { Dropdown } from 'mzara-component'

import Item from './item'

class Calendar extends Component {

    constructor(props){
        super(props)

        this.state = {
            day: props.day,
            month: props.month,
            year: props.year,
            layout: props.layout === undefined ? 'month' : props.layout,
            menu_list: props.cell_menu_list,
            item_list: props.item_list,
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
            item_list: nextProps.item_list,
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

    get_simple_day_list(month, year){
        let day_list = []
        const date_nb = DateHelper.get_days_in_mounth(month, year)

        //write all dates
        for (let i = 1; i <= date_nb; i++) {
            day_list.push({ day: i, month: month, year: year })
        }

        return day_list
    }

    get_hour_list(){
        let result = []

        for (var i = 0; i < 24; i++) {
            //intervalle de 10 minutes
            for (var j = 0; j < 60; j=j+10) {
                result.push({ hour: i, minute: j })
            }
        }

        return result
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

    get_compiled_date(data){
        let str = data.year + '-' + data.month + '-' + data.day

        return str
    }

    get_compiled_date_time(data){
        let str = data.year + '-' + data.month + '-' + data.day

        if (data.hour) {
            str += ' ' + data.hour + ':' + data.minute
        }

        return str
    }

    get_compiled_hour(data){
        let str = ''
        if (data.hour) {
            str += data.hour + ':' + data.minute
        }
        return str
    }

    get_hour(str){
        let adr = str.split(':')

        return {
            hour: parseInt(adr[0]),
            minute: parseInt(adr[1]),
            second: parseInt(adr[2])
        }
    }

    get_item_list(year, month, date){
        let result = []

        this.state.item_list.map((item, index) => {
            const _date = new Date(item.date)
            if (
                _date.getFullYear() === year && 
                (month === undefined || (month !== undefined && _date.getMonth() === month)) &&
                (date === undefined || (date !== undefined && _date.getDate() === date))
                    ) {
                let _item = Utils.get_clone(item)
                _item.date_str = _item.date
                _item.date = _date.getDate()
                _item.month = _date.getMonth()
                _item.year = year
                _item._hour_begin = this.get_hour(item.hour_begin)
                _item._hour_end = this.get_hour(item.hour_end)

                result.push(_item)
            }
        })

        return result
    }

    get_view_hour(i){
        var str = i.toString()
        if (str.length === 1) {
            str = '0' + str
        }
        return str
    }

    has_date(day, month, year){
        const date_nb = DateHelper.get_days_in_mounth(month, year)

        return day <= date_nb 
    }

    handle_cell_click(data, e){

        //Todo : check if target is cell or item
        // if (e.target.TagName === 'TD') {
        //     //trigger on_cell_click props
        //     if (this.props.onCellClick !== undefined) {
        //         this.props.onCellClick(data, e)
        //     }
        // }
    }

    handle_cell_menu_click(label, data){
        if (this.props.onCellMenuClick !== undefined) {
            data.compiled_date = this.get_compiled_date(data)
            data.compiled_hour = this.get_compiled_hour(data)
            data.compiled_date_time = this.get_compiled_date_time(data)

            this.props.onCellMenuClick(label, data)
        }
    }

    handle_drag_start = (e, item) => {
        let data = {
            type: 'calendar_item',
            data: item,
        }

        e.dataTransfer.setData('text/plain', JSON.stringify(data))
    }

    handle_drop = (e, current_date) => {
        e.preventDefault()
        let data = e.dataTransfer.getData('text/plain')
        data = Utils.try_parse_json(data)

        if (data.type === 'calendar_item') {
            let _data = data.data
            _data.date = this.get_compiled_date(current_date)
            if (current_date.hour !== undefined) {
                //Todo : evaluate time duration
                // data.
            }

            this.props.onDrop(_data)
        }
    }

    handle_drag_over = (e) => {
        e.preventDefault()
    }

    is_week_end(day, month, year){
        var d = new Date(Date.UTC(year, month, day));

        return d.getDay() == 6 || d.getDay() == 0;
    }

    refresh(){
        this.forceUpdate()
    }

    render_menu_list(menu_list, text, data, with_details_item){
        return (
            <Dropdown
                position="top right"
                dropdown_btn={( 
                    <div className="menu-wrapper">
                        { text }
                    </div>
                )}
                dropdown_element={
                    (
                        <div className="dropdown-menu show  animated fadeInUp animated-x-fast">
                            {
                                menu_list.map((_menu, index) => (
                                    <a 
                                        key={index} 
                                        className={"dropdown-item "}
                                        onClick={(e) => this.handle_cell_menu_click(_menu.label, data)}
                                        href="#">
                                        <i className={"fa " + _menu.icon}></i>
                                        { (_menu.lang !== undefined && _menu.lang !== '') ? this.props.lang.line(_menu.lang) : _menu.text }
                                    </a>
                                ))
                            }

                            {
                                with_details_item &&
                                <a  
                                    className={"dropdown-item "}
                                    onClick={(e) => this.handle_cell_menu_click('details', data)}
                                    href="#">
                                    <i className={"fa fa-info"}></i>
                                    { this.props.lang.line('std_details') }
                                </a>
                            }
                            
                        </div>
                    )
                }
                />
        )
    }

    render() {

        const { 
            day,
            month,
            year,
            layout,
            menu_list,
        } = this.state

        const _date_now = new Date()
        const state_now = {
            day: _date_now.getDate(),
            month: _date_now.getMonth(),
            year: _date_now.getFullYear()
        }

        if (layout === 'month') {

            const week_list = this.get_day_list(month, year)
            const item_list = this.get_item_list(year, month)

            return (
                <div className="calendar calendar-month">
                    <div>
                        <div className="calendar-row calendar-header">
                            <div className="calendar-col">{ this.props.lang.line('std_lun') }</div>
                            <div className="calendar-col">{ this.props.lang.line('std_mar') }</div>
                            <div className="calendar-col">{ this.props.lang.line('std_mer') }</div>
                            <div className="calendar-col">{ this.props.lang.line('std_jeu') }</div>
                            <div className="calendar-col">{ this.props.lang.line('std_ven') }</div>
                            <div className="calendar-col">{ this.props.lang.line('std_sam') }</div>
                            <div className="calendar-col">{ this.props.lang.line('std_dim') }</div>
                        </div>
                        {
                            week_list.map((day_list, row_index) => (
                                <div className="calendar-row" key={row_index}>
                                    {
                                        day_list.map((_day, day_index) => (
                                            <div key={day_index} className={ 
                                                "calendar-col " +
                                                (_day.is_not_active ? '' : 'active') + ' ' + 
                                                ((_day.day === day && _day.month === month && _day.year === year) ? 'selected' : '') + ' ' +
                                                ((_day.day === state_now.day && _day.month === state_now.month && _day.year === state_now.year) ? 'now' : '') }
                                                onClick={(e) => this.handle_cell_click({ day: _day.day, month: _day.month + 1, year: _day.year }, e)}
                                                onDragOver={(e) => this.handle_drag_over(e)}
                                                onDrop={(e) => this.handle_drop(e, { day: _day.day, month: _day.month + 1, year: _day.year })}>

                                                { this.render_menu_list(menu_list, (<span className="text">{ _day.day }</span>), { day: _day.day, month: _day.month + 1, year: _day.year }, true) }
                                                
                                                {
                                                    item_list.map((item, item_index) => (
                                                        (item.date === _day.day) &&
                                                        <Item
                                                            key={item_index}
                                                            title={item.title}
                                                            description={item.description}
                                                            hour_begin={item.hour_begin}
                                                            hour_end={item.hour_end}
                                                            onClick={(e) => this.props.onItemClick(item, e) }
                                                            onDragStart={(e) => this.handle_drag_start(e, item)}
                                                            />
                                                    ))
                                                }

                                            </div>
                                        ))
                                    }
                                </div>
                            ) )
                        }
                        
                    </div>
                </div>
            )
        }

        if (layout === 'year') {

            const month_list = this.get_month_list()
            const date_list = this.get_day_list_canevas()
            const item_list = this.get_item_list(year)
            
            return (
                <div className="calendar calendar-year">
                    <div>
                        <div className="calendar-row calendar-header">
                            <div className="calendar-col calendar-date"></div>
                            {
                                month_list.map((_month, index) => (
                                    <div key={index} className="calendar-col">{ this.props.lang.line(_month) }</div>
                                ))
                            }
                        </div>
                        {
                            date_list.map((day_canevas, index) => (
                                <div key={index} className="calendar-row">
                                    <div className="calendar-col calendar-date">{ day_canevas }</div>
                                    {
                                        month_list.map((_month, month_index) => (
                                            <div 
                                                key={month_index} 
                                                className={ 
                                                'calendar-col ' +
                                                ((day_canevas === day && month_index === month) ? 'selected' : '') + ' ' +
                                                ((this.has_date(day_canevas, month_index, year)) ? '' : 'not-active') + ' ' +
                                                ((this.has_date(day_canevas, month_index, year) && this.is_week_end(day_canevas, month_index, year)) ? 'week-end' : '') + ' ' +
                                                ((day_canevas === state_now.day && month_index === state_now.month) ? 'now' : '') }
                                                onDragOver={(e) => this.handle_drag_over(e)}
                                                onDrop={(e) => this.handle_drop(e, { day: day_canevas, month: month_index + 1, year: year })}>

                                                { this.render_menu_list(menu_list, '', { day: day_canevas, month: month_index + 1, year: year }, true) }

                                                {
                                                    item_list.map((item, item_index) => (
                                                        (item.date == day_canevas && item.month == month_index) &&
                                                        <Item
                                                            key={item_index}
                                                            title={item.title}
                                                            description={item.description}
                                                            hour_begin={item.hour_begin}
                                                            hour_end={item.hour_end}
                                                            show_description={false}
                                                            onDragStart={(e) => this.handle_drag_start(e, item)}
                                                            />
                                                    ))
                                                }

                                            </div>
                                        ))
                                    }
                                </div>
                            ))
                        }
                        
                    </div>
                </div>
            )
        }

        if (layout === 'hour') {

            const day_list = this.get_simple_day_list(month, year)
            const hour_list = this.get_hour_list()
            const item_list = this.get_item_list(year, month, day)
            console.log('hour', day, item_list)

            return (
                <div className="calendar calendar-hours">
                    <div>
                        <div className="calendar-row calendar-header">
                            <div className="calendar-col calendar-date"></div>
                            {
                                day_list.map((_day, index) => (
                                    <div key={index} className="calendar-col ">{ _day.day }</div>
                                ))
                            }
                        </div>
                        {
                            hour_list.map((_hour, index) => (
                                <div key={index} className="calendar-row">
                                    <div className="calendar-col calendar-hour">{ this.get_view_hour(_hour.hour) } : { this.get_view_hour(_hour.minute) }</div>
                                    {
                                        day_list.map((_day, day_index) => (
                                            <div 
                                                key={day_index} 
                                                className="calendar-col " 
                                                onClick={(e) => this.handle_cell_click({ day: _day.day, month: _day.month, year: _day.year, hour: _hour.hour, minute: _hour.minute }, e)}
                                                onDragOver={(e) => this.handle_drag_over(e)}
                                                onDrop={(e) => this.handle_drop(e, { day: _day.day, month: _day.month, year: _day.year, hour: _hour.hour, minute: _hour.minute })}>

                                                { this.render_menu_list(menu_list, '', { day: _day.day, month: month, year: year }) }

                                                {
                                                    item_list.map((item, item_index) => (
                                                        (item._hour_begin.hour >= _hour.hour && item._hour_end.hour <= _hour.hour) &&
                                                        <Item
                                                            key={item_index}
                                                            title={item.title}
                                                            description={item.description}
                                                            hour_begin={item.hour_begin}
                                                            hour_end={item.hour_end}
                                                            show_description={false}
                                                            onClick={(e) => this.props.onItemClick(item, e) }
                                                            onDragStart={(e) => this.handle_drag_start(e, item)}
                                                            />
                                                    ))
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            ))
                        }
                        
                    </div>
                </div>
            )
        }
    }
}

export default Calendar