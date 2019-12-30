import React from 'react'

//Todo : utiliser les dépendances
import ButtonEditPartial from '../btn/ButtonEditPartial'
import ButtonAddPartial from '../btn/ButtonAddPartial'
import Tooltip from '../Tooltip'

import DateHelper from '../../helper/date_helper'

import FormControl from './index'

import Base from './base'

import Moment from "moment"

class DateInput extends Base {

    date_value = {}

    constructor(props){
        super(props)

        this.input_component =  React.createRef()
    }

    _componentWillReceiveProps(nextProps){
        this.date_value = this.get_default_date_value(this.props.input_value)
    }

    _componentDidMount(){
        if (this.props.onRef !== undefined){
            this.props.onRef(this)
        }

        var date_now = new Date()
        this.year_now = date_now.getFullYear()

        let nextState = {
            input_min_year_value: this.props.input_min_year_value,
            input_max_year_value: this.props.input_max_year_value,

            min_year: this.props.min_year === undefined ? this.year_now - 90 : this.props.min_year,
            year_length: this.props.year_length === undefined ? 90 : this.props.year_length,
        }

        this.date_value = this.get_default_date_value(this.props.input_value)

        this.setState(nextState)
    }

    dispatch_date_change(){
        if (this.state.onChange !== undefined) {
            this.state.onChange(this.get_input_value(), this)
        }
    }

    get_default_date_value(p_value){
        if (p_value === undefined) {
            return { date: 1, month: 0, year: this.year_now }
        }

        var date_time = Moment(p_value)

        return { date: date_time.date(), month: date_time.month(), 'year': date_time.year() }
    }

    get_date_suggest(){
        var data = []
        for (var i = 1; i < 32; i++) {
            data.push({ label: i.toString(), value: i.toString() })
        }

        return data
    }

    get_month_suggest(){
        var month = this.props.lang.line('std_month_list_')
        var adr = month.split(',')
        var data = []

        for (var i = 0; i < adr.length; i++) {
            data.push({ label: adr[i], value: i.toString() })
        }

        return data
    }

    get_year_suggest(){
        
        var data = []
        for (var i = this.state.min_year; i < (this.state.min_year + this.state.year_length); i++) {
            data.push({ label: i.toString(), value: i.toString() })
        }

        return data
    }

    handle_date_input_change = (value) => {
        this.date_value.date = parseInt(value)
        this.dispatch_date_change()
    }

    handle_month_input_change = (value, obj) => {
        this.date_value.month = obj.get_input_value()

        //Vérification de validité des fin de mois
        var valide_date_mouth = this.get_date_mouth_valid()
        var max_date = DateHelper.get_days_in_mounth(this.date_value.month, this.date_value.year)
        if (this.date_value.date > max_date) {
            this.date_value.date = max_date
            this.input_date.current.set_value(this.date_value.date)
        }

        this.input_date.current.set_max_value(max_date)
        this.dispatch_date_change()
    }

    handle_year_input_change = (value) => {
        this.date_value.year = parseInt(value)
        this.dispatch_date_change()
    }

    is_valid(){
        return true
    }

    render() {

        const { 
            label,
            className,
            text_suggest,
            input_id,
            input_name,
            input_value,
            input_placeholder,
            input_class,
            input_autocomplete,
            input_type,
            input_ponctual_error,
            input_tooltip_info,
            input_min_year_value,
            input_max_year_value,

            can_add_partial,
            can_show_btn_edit_partial,

            required_err,
            email_valid_err,

            is_required,
            is_readonly,
            is_editable,

            is_show_required_err,
            is_show_suggest,

            index_suggest,
            view_data_suggest
        } = this.state

        var month_value = this.get_month_suggest()[this.date_value.month]
        if (month_value === undefined) {
            month_value = this.get_month_suggest()[0]
        }

        return (
            <div className={"form-control-container " + className }>
                <label>
                    {label} 
                    {
                        is_required &&
                        <span className="text-danger" style={{ marginLeft: '5px' }}>*</span>
                    }

                    {
                        (is_readonly !== undefined && is_editable && can_show_btn_edit_partial) &&
                        <ButtonEditPartial 
                            is_edited={is_readonly}
                            onClick={this.handle_button_edit_click}
                            />
                    }
                </label>

                {
                    !is_readonly &&
                    <div className="form-control-date">
                        <FormControl 
                            lang={this.props.lang}
                            input_id="form-date"
                            input_type="checkbox"
                            input_min_value={1}
                            input_max_value={31}
                            input_value={this.date_value.date}
                            input_class="form-date"
                            input_option={this.get_date_suggest()}
                            input_show_suggest_on_focus={true}
                            is_editable={is_editable}
                            ref={this.input_date}
                            onChange={this.handle_date_input_change} />

                        <FormControl 
                            lang={this.props.lang}
                            input_id="form-month"
                            input_value={month_value.label}
                            input_type="select"
                            input_class="form-month"
                            input_option={this.get_month_suggest()}
                            input_show_suggest_on_focus={true}
                            is_editable={is_editable}
                            ref={this.input_month}
                            onChange={this.handle_month_input_change} />

                        <FormControl 
                            lang={this.props.lang}
                            input_id="form-year"
                            input_type="radio"
                            input_min_value={input_min_year_value}
                            input_max_value={input_max_year_value}
                            input_value={this.date_value.year}
                            input_class="form-year"
                            input_option={this.get_year_suggest()}
                            input_show_suggest_on_focus={true}
                            is_editable={is_editable}
                            ref={this.input_year}
                            onChange={this.handle_year_input_change} />


                    </div>
                }

                {
                    (is_readonly !== undefined && is_editable && label.length === 0 && can_show_btn_edit_partial) &&
                    <ButtonEditPartial 
                        className="absolute right"
                        is_edited={is_readonly}
                        onClick={this.handle_button_edit_click}
                        />
                }
                

                {
                    is_readonly &&
                    <input 
                        className="form-control"
                        readOnly={is_readonly}
                        value={ this.get_input_value() }
                        />
                }

                {
                    (is_required && is_show_required_err) && 
                    <span className="text-danger text-message">{required_err}</span>
                }

                {
                    (input_ponctual_error.length > 0) && 
                    <span className="text-danger text-message">{input_ponctual_error}</span>
                }
            </div>
        )
    }
}

export default DateInput