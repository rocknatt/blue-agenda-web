import React, { Component } from 'react'

//Todo : utiliser les dépendances
import ButtonEditPartial from '../btn/ButtonEditPartial'
import ButtonAddPartial from '../btn/ButtonAddPartial'
import Tooltip from '../Tooltip'

import Base from './base'

class Textarea extends Base {

    constructor(props){
        super(props)

        this.textarea_component =  React.createRef()
    }

    _componentWillReceiveProps(nextProps){

        //state initialization for child component
        let nextState = {
            is_autosize: nextProps.is_autosize
        }

        this.setState(nextState)
    }

    _componentDidMount(){

        if (this.props.onRef !== undefined){
            this.props.onRef(this)
        }

        //state initialization for child component
        let nextState = {
            is_autosize: this.props.is_autosize
        }

        this.setState(nextState)

    }

    insert_value(value){
        this.setState(function (prevState) {
            
            var new_value = ''

            var str_1 = prevState.input_value.substring(0, this.textarea_component.current.selectionStart)
            var str_2 = prevState.input_value.substring(this.textarea_component.current.selectionEnd, prevState.input_value.length)

            new_value = str_1 + value + str_2

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
        this.textarea_component.current.focus()
    }

    is_valid(){
        var is_valid = true
        var nextState = { is_show_required_err: false }

        if (this.state.is_required && this.state.input_value.length === 0) {
            is_valid = false
            nextState.is_show_required_err = true
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
            is_autosize,

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

        // todo : evaluate text dimension here
        // var text_dimension = Utils.get_text_size(input_value.length > 0 ? input_value : '|', '14px', Utils.get_width(this.textarea_component.current) + 'px')
        var textarea_style = {}
        // if (is_autosize) {
        //     textarea_style.height = text_dimension.height + 18
        // }

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
                <textarea 
                    id={input_id} 
                    name={input_name} 
                    className={"form-control " + input_class} 
                    onChange={this.handle_input_change} 
                    onKeyDown={this.handle_input_key_down}
                    onFocus={this.handle_input_focus}
                    onBlur={this.handle_input_blur}
                    onPaste={ this.handle_paste }
                    readOnly={is_readonly}
                    placeholder={input_placeholder} 
                    style={ textarea_style }
                    ref={this.textarea_component}
                    value={input_value} />
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
                    (is_show_suggest && view_data_suggest !== undefined) &&
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

export default Textarea