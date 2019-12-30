import React from 'react'

//Todo : utiliser les dépendances
import ButtonEditPartial from '../btn/ButtonEditPartial'
import ButtonAddPartial from '../btn/ButtonAddPartial'
import Tooltip from '../Tooltip'

import FormControl from './index'

import Base from './base'

import Moment from "moment"

class Time extends Base {

    date_value = {}

    constructor(props){
        super(props)

        this.input_component =  React.createRef()
    }

    _componentWillReceiveProps(nextProps){
        this.date_value = this.get_default_time_value(this.props.input_value)
    }

    _componentDidMount(){
        if (this.props.onRef !== undefined){
            this.props.onRef(this)
        }

        let nextState = {

        }

        this.date_value = this.get_default_time_value(this.props.input_value)

        this.setState(nextState)
    }

    dispatch_date_change(){
        if (this.state.onChange !== undefined) {
            this.state.onChange(this.get_input_value(), this)
        }
    }

    handle_hour_input_change = (value) => {
        this.date_value.hour = parseInt(value)
        this.dispatch_date_change()
    }

    handle_hour_minute_change = (value) => {
        this.date_value.minute = parseInt(value)
        this.dispatch_date_change()
    }

    get_default_time_value(p_value){
        if (p_value === undefined) {
            return { hour: '00', minute: '00', second: '00' }
        }

        var adr = p_value.split(':')
        if (adr[0] === undefined || adr[0] === '') {
            adr[0] = '00'
        }

        if (adr[0].length === 1) {
            adr[0] = '0' + adr[0]
        }

        if (adr[1] === undefined || adr[1] === '') {
            adr[1] = '00'
        }

        if (adr[1].length === 1) {
            adr[1] = '0' + adr[1]
        }

        if (adr[2] === undefined) {
            adr[2] = '00'
        }

        if (adr[2].length === 1 || adr[2] === '') {
            adr[2] = '0' + adr[2]
        }

        return { hour: adr[0], minute: adr[1], second: adr[2] }
    }

    get_hour_suggest(){
        var data = []

        for (var i = 0; i < 24; i++) {
            var str = i.toString()
            if (str.length === 1) {
                str = '0' + str
            }
            data.push({ label: str, value: i.toString() })
        }

        return data
    }

    get_minute_suggest(){
        var data = []

        for (var i = 0; i < 60; i++) {
            var str = i.toString()
            if (str.length === 1) {
                str = '0' + str
            }
            data.push({ label: str, value: i.toString() })
        }

        return data
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
                            lang={this.lang}
                            input_id="form-hour"
                            input_type="select"
                            input_min_value={1}
                            input_max_value={31}
                            input_value={this.date_value.hour}
                            input_class="form-hour"
                            input_option={this.get_hour_suggest()}
                            input_show_suggest_on_focus={true}
                            is_editable={is_editable}
                            ref={this.input_hour}
                            onChange={this.handle_hour_input_change} />

                        <FormControl 
                            lang={this.lang}
                            input_id="form-minute"
                            input_value={this.date_value.minute}
                            input_type="select"
                            input_class="form-minute"
                            input_option={this.get_minute_suggest()}
                            input_show_suggest_on_focus={true}
                            is_editable={is_editable}
                            ref={this.input_minute}
                            onChange={this.handle_minute_input_change} />

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

export default Time