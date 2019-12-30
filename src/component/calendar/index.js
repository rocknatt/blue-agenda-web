import React, { Component } from 'react'
import { connect } from 'react-redux'

import Calendar from './calendar'
import Dropdown from '../../component/Dropdown'

import DateHelper from '../../helper/date_helper'

import './css/calendar.css'

class Layout extends Component {
	state = {

    }

    year_creation = 2019

    constructor(props){
        super(props)

        let _date_now = new Date()
        if (props.initial_date !== undefined) {
        	_date_now = new Date(props.initial_date)
        }

        const _day = _date_now.getDate()
        const _month = _date_now.getMonth()
        const _year = _date_now.getFullYear()

        this.state = {
            day: _day,
            month: _month,
            year: _year,
            calendar_layout: 'month',
            last_calendar_layout: 'month',
            cell_menu_list: props.cell_menu_list,
        }
    }

    componentWillReceiveProps(nextProps){

    }

    componentWillMount(){
        document.addEventListener('keydown', this.handle_key_down)
    }

    componentWillUnmount(){
        document.removeEventListener('keydown', this.handle_key_down)
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidMount(){
        
    }

    handle_day_change(day){
        this.setState({ day: day })
    }

    handle_month_change(month){
        this.setState({ month: month })
    }

    handle_year_change(year){
        this.setState({ year: year })
    }

    handle_prev_month_click(){

        let _current_month = this.state.month - 1
        let _current_year = this.state.year

        if (this.state.calendar_layout === 'year') {
            _current_year -= 1
            this.setState({ year: _current_year })
            return ;
        }

        if (_current_month < 0) {
            _current_month = 11
            _current_year -= 1
        }

        this.setState({ month: _current_month, year: _current_year })
    }

    handle_next_month_click(){
        let _current_month = this.state.month + 1
        let _current_year = this.state.year

        if (this.state.calendar_layout === 'year') {
            _current_year += 1
            this.setState({ year: _current_year })
            return ;
        }

        if (_current_month >= 12) {
            _current_month = 0
            _current_year += 1
        }

        this.setState({ month: _current_month, year: _current_year })
    }

    handle_now_click(){
        const _date_now = new Date()
        const _day = _date_now.getDate()
        const _month = _date_now.getMonth()
        const _year = _date_now.getFullYear()

        this.setState({ day: _day, month: _month, year: _year })
    }

    handle_key_down = (e) => {

        let _current_day = this.state.day
        let _current_month = this.state.month
        let _current_year = this.state.year

        const days_nb = DateHelper.get_days_in_mounth(this.state.month, this.state.year)

        switch(e.keyCode){
            //gauche
            case 37:
                _current_day--
                break;

            //droite
            case 39:
                _current_day++
                break;  
            //haut
            case 38:
                _current_day -= 7
                break;
            //bas
            case 40:
                _current_day += 7
                break;
        }

        if (_current_day > days_nb) {
            _current_month += 1
            _current_day = 1
        }
        else if (_current_day <= 0){
            _current_month -=  1
            _current_day = DateHelper.get_days_in_mounth(_current_month, _current_year)
        }

        if (_current_month >= 12) {
            _current_month = 0
            _current_year += 1
        }
        else if (_current_month < 0){
            _current_month = 11
            _current_year -= 1
            _current_day = DateHelper.get_days_in_mounth(_current_month, _current_year)
        }

        this.setState({ day: _current_day, month: _current_month, year: _current_year })
    }

    handle_table_layout_month_click(){
        this.setState({ calendar_layout: 'month' })
    }

    handle_table_layout_year_click(){
        this.setState({ calendar_layout: 'year' })
    }

    handle_calendar_cell_click = (data) => {
        if (this.state.calendar_layout !== 'hour') {
            this.setState(function (prevState) {
                return {
                    calendar_layout: 'hour',
                    last_calendar_layout: prevState.calendar_layout,
                }
            })
        }

        //Todo : show dropdown inside cell and
    }

    handle_calendar_cell_menu_click = (label, data) => {
        switch(label){
            case 'details':

                this.setState(function (prevState) {
                    return {
                        calendar_layout: 'hour',
                        last_calendar_layout: prevState.calendar_layout, 
                        day: data.day, 
                        month: data.month, 
                        year: data.year

                    }
                })
                break;

            default :
            	if (this.props.onCellMenuClick !== undefined) {
            		this.props.onCellMenuClick(label, data)
            	}
            	break;
        }
    }

    handle_back_click(){
        this.setState(function (prevState) {
            return {
                calendar_layout: prevState.last_calendar_layout,
            }
        })
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

    get_day_list(month, year){
        let day_list = []
        const days_nb = DateHelper.get_days_in_mounth(month, year)

        for (var i = 1; i <= days_nb; i++) {
            day_list.push(i)
        }

        return day_list
    }

    /**
     * get year view list
     * @return array list of year from application's creation to 5 years from now
     */
    get_year_list(){
        let year_list = []
        let _current_year = DateHelper.get_current_year()

        for (var i = this.year_creation; i < _current_year + 5; i++) {
            year_list.push(i)
        }

        return year_list
    }

    

    render() {

        const { 
            day,
            month,
            year,
            calendar_layout,
            cell_menu_list,
        } = this.state

        const date_list = this.get_day_list(month, year)
        const month_list = this.get_month_list()
        const year_list = this.get_year_list()

        const height = window.innerHeight - 200
        
        return (
            <div className="sky-calendar">
                <div className="sky-calendar-header">
                    <div className="row">
                        <div className="col-12 col-md-8 col-lg-9 mb-15">
                            <div>
                                {
                                    calendar_layout === 'hour' &&
                                    <button 
                                        className={"btn btn-default " } 
                                        title={ this.props.lang.line('std_back') }
                                        onClick={() => this.handle_back_click() }><i className="fa fa-arrow-left"></i></button>
                                }
                                <button 
                                    className={"btn btn-default " + (calendar_layout === 'year' ? 'active' : '') } 
                                    title={ this.props.lang.line('std_display_list') }
                                    onClick={() => this.handle_table_layout_year_click() }><i className="fa fa-list"></i></button>
                                <button 
                                    className={"btn btn-default " + (calendar_layout === 'month' ? 'active' : '') }
                                    title={ this.props.lang.line('std_display_mosaic') }
                                    onClick={() => this.handle_table_layout_month_click() }><i className="fa fa-table"></i></button>
                            </div>
                        </div>
                        <div className="col-12 col-md-4 col-lg-3">
                            <div className="sky-calendar-cmd btn-group">
                                <button className="btn btn-default btn-block" onClick={(e) => this.handle_prev_month_click()}><i className="fa fa-chevron-left"></i></button>

                                {
                                    calendar_layout !== 'year' &&
                                    <Dropdown
                                        position="top right"
                                        dropdown_btn={( 
                                            <button className="btn btn-default btn-dropdown">{day}</button>
                                        )}
                                        dropdown_element={
                                            (
                                                <div className="dropdown-menu show  animated fadeInUp animated-x-fast">
                                                    {
                                                        date_list.map((_day, index) => (
                                                            <a 
                                                                key={index} 
                                                                className={"dropdown-item " + (day === _day ? 'active' : '')} 
                                                                onClick={(e) => this.handle_day_change(_day)}
                                                                href="#">{_day}</a>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                        />
                                }
                                
                                {
                                    calendar_layout !== 'year' &&
                                    <Dropdown
                                        position="top right"
                                        dropdown_btn={( 
                                            <button className="btn btn-default btn-block btn-dropdown">{this.props.lang.line(month_list[month])}</button>
                                        )}
                                        dropdown_element={
                                            (
                                                <div className="dropdown-menu show  animated fadeInUp animated-x-fast">
                                                    {
                                                        month_list.map((_month, index) => (
                                                            <a 
                                                                key={index} 
                                                                className={"dropdown-item " + (month === index ? 'active' : '')} 
                                                                onClick={(e) => this.handle_month_change(index)}
                                                                href="#">{this.props.lang.line(_month)}</a>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                        />
                                }
                                

                                <Dropdown
                                    position="top right"
                                    dropdown_btn={( 
                                        <button className="btn btn-default btn-block btn-dropdown">{year}</button>
                                    )}
                                    dropdown_element={
                                        (
                                            <div className="dropdown-menu show  animated fadeInUp animated-x-fast">
                                                {
                                                    year_list.map((_year, index) => (
                                                        <a 
                                                            key={index} 
                                                            className={"dropdown-item " + (year === _year ? 'active' : '')} 
                                                            onClick={(e) => this.handle_year_change(_year)}
                                                            href="#">{_year}</a>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                    />

                                <button className="btn btn-default btn-block" onClick={(e) => this.handle_next_month_click()}><i className="fa fa-chevron-right"></i></button>
                            </div>
                            <div className="sky-calendar-cmd btn-group">
                                <button className="btn btn-default btn-block" onClick={(e) => this.handle_now_click()}><i className="fa fa-clock"></i> {this.props.lang.line('std_now')}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sky-calendar-body" style={{ height: height }}>
                    <Calendar
                        lang={this.props.lang}
                        day={day}
                        month={month}
                        year={year}
                        layout={calendar_layout}
                        cell_menu_list={cell_menu_list}
                        onCellMenuClick={this.handle_calendar_cell_menu_click}
                        />
                </div>
                <div className="sky-footer">

                </div>
            </div>
            
        )
    }
}

export default Layout