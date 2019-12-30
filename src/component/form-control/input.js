import React from 'react'

//Todo : utiliser les dépendances
import ButtonEditPartial from '../btn/ButtonEditPartial'
import ButtonAddPartial from '../btn/ButtonAddPartial'
import Tooltip from '../Tooltip'

import Base from './base'

class Input extends Base {

    constructor(props){
        super(props)

        this.input_component =  React.createRef()
    }

    _componentWillReceiveProps(nextProps){

    }

    _componentDidMount(){
        if (this.props.onRef !== undefined){
            this.props.onRef(this)
        }
    }

    handle_numeric_btn_cmd_click = (direction, e) => {
        this.setState(function (prevState) {
            var new_value = parseInt(prevState.input_value)
            if (prevState.input_value === undefined || prevState.input_value === '') {
                new_value = 0
            }

            if (direction === 'up') {
                new_value = new_value + 1
            }

            if (direction === 'down') {
                new_value = new_value - 1
            }

            if (this.state.onChange !== undefined) {
                this.state.onChange(new_value, this)
            }

            return {
                input_value: new_value
            }
        })
    }

    handle_well_moved = (e) => {
        if (this.state.input_type === 'numeric') {
            var variation = parseInt(e.deltaY)

            if (variation > 0) {
                this.handle_numeric_btn_cmd_click('down')
            }

            if (variation < 0) {
                this.handle_numeric_btn_cmd_click('up')
            }
        }
    }

    _handle_input_key_down = (e) => {
        if (this.state.input_type === 'numeric') {
            //haut
            if (e.keyCode === 33 || e.keyCode === 38) {
                this.handle_numeric_btn_cmd_click('up')
            }
            //bas
            if (e.keyCode === 34 || e.keyCode === 40) {
                this.handle_numeric_btn_cmd_click('down')
            }
        }
    }

    set_value(p_value){
        this.setState({ input_value: p_value })
    }

    set_max_value(p_value){
        this.setState({ input_max_value: p_value })
    }

    insert_value(value){
        this.setState(function (prevState) {
            
            var new_value = ''

            var str_1 = prevState.input_value.substring(0, this.input_component.current.selectionStart)
            var str_2 = prevState.input_value.substring(this.input_component.current.selectionEnd, prevState.input_value.length)

            new_value = str_1 + value + str_2

            if (this.state.onChange !== undefined) {
                this.state.onChange(new_value, this)
            }

            this.focus()

            return {
                input_value: new_value
            }

        })
    }

    focus(){
        this.input_component.current.focus()
    }

    is_valid(){
        var is_valid = true
        var nextState = { is_show_required_err: false, is_show_email_valid_err: false }

        if (this.state.is_required && this.state.input_value.length === 0) {
            is_valid = false
            nextState.is_show_required_err = true
        }

        //todo : valid email
        if (!is_valid) {
            this.setState(nextState)
        }

        return is_valid
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
                {
                    label.length > 0 &&
                    <label htmlFor={input_id}>
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
                }
                <input 
                    type="text"
                    id={input_id} 
                    name={input_name} 
                    className={"form-control " + input_class} 
                    onChange={this.handle_input_change} 
                    onKeyDown={ (e) => { 
                        this.handle_input_key_down(e)
                        this._handle_input_key_down(e)
                    }}
                    onFocus={this.handle_input_focus}
                    onBlur={this.handle_input_blur}
                    onPaste={ this.handle_paste }
                    onWheel={ this.handle_well_moved }
                    readOnly={is_readonly}
                    placeholder={input_placeholder} 
                    ref={this.input_component}
                    autoComplete={(input_autocomplete) ? '' : 'off'}
                    value={input_value} />

                {
                    input_type === 'numeric' &&
                    <div>
                        <button type="button" onMouseDown={ (e) => this.handle_numeric_btn_cmd_click('up', e) } className="btn-cmd btn-cmd-up"><i className="fa fa-chevron-up"></i></button>
                        <button type="button" onMouseDown={ (e) => this.handle_numeric_btn_cmd_click('down', e) } className="btn-cmd btn-cmd-down"><i className="fa fa-chevron-down"></i></button>
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
                    (is_required && is_show_required_err) && 
                    <span className="text-danger text-message">{required_err}</span>
                }

                {
                    (input_ponctual_error.length > 0) && 
                    <span className="text-danger text-message">{input_ponctual_error}</span>
                }

                {
                    input_tooltip_info &&
                    <Tooltip text={input_tooltip_info}>
                        <button><i className="fa fa-info-circle"></i></button>
                    </Tooltip>
                }

                {
                    (!is_readonly && is_show_suggest && view_data_suggest !== undefined) &&
                    <ul className="form-suggest" ref={this.suggest_container}>
                        {
                            view_data_suggest.map((data, index) => (
                                data.label.toLowerCase().includes(text_suggest.toLowerCase()) &&
                                <li key={index}>
                                    <a className={ index == index_suggest ? 'active' : '' } onClick={() => this.handle_suggest_click(data.label, data)} > { data.label }</a>
                                </li>
                            ))
                        }
                    </ul>
                }

                {
                    can_add_partial &&
                    <ButtonAddPartial 
                        className="absolute right"
                        onClick={this.handle_button_add_click}
                        />
                }

                {
                    (!is_readonly && is_show_suggest && view_data_suggest !== undefined) &&
                    <ul className="form-suggest" ref={this.suggest_container}>
                        {
                            view_data_suggest.map((data, index) => (
                                data.label.toLowerCase().includes(text_suggest.toLowerCase()) &&
                                <li key={index}>
                                    <a className={ index == index_suggest ? 'active' : '' } onClick={() => this.handle_suggest_click(data.label, data)} > { data.label }</a>
                                </li>
                            ))
                        }
                    </ul>
                }

                
            </div>
        )
    }
}

export default Input