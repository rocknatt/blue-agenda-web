import React from 'react'

//Todo : utiliser les dépendances
import ButtonEditPartial from '../btn/ButtonEditPartial'
import ButtonAddPartial from '../btn/ButtonAddPartial'
import Tooltip from '../Tooltip'

import Base from './base'

class Checkbox extends Base {

    constructor(props){
        super(props)
    }

    _componentWillReceiveProps(nextProps){
        let nextState = {
            input_value: this.get_default_input_value(nextProps.input_default_value !== undefined ? nextProps.input_default_value : nextProps.input_value)
        }
        this.setState(nextState)
    }

    _componentDidMount(){
        if (this.props.onRef !== undefined){
            this.props.onRef(this)
        }

        //state initialization for child component
        let nextState = {
            input_value: this.get_default_input_value(this.props.input_default_value !== undefined ? this.props.input_default_value : this.props.input_value),
        }
        
        this.setState(nextState)
    }

    handle_input_click = (value) => {
        if (this.state.input_type === 'checkbox') {
            

            this.setState(function(prevState, props){

                var new_value = []
                var should_insert = true

                prevState.input_value.map((_value) => {
                    if (_value !== value) {
                        new_value.push(_value)
                    }else{
                        should_insert = false
                    }
                })

                if (should_insert) {
                    new_value.push(value)
                }

                if (this.state.onChange !== undefined) {
                    this.state.onChange(new_value, this)
                }
                
                return {
                    input_value: new_value,
                };
            })
        }

        if (this.state.input_type === 'radio') {
            

            this.setState(function(prevState, props){

                var new_value = []

                new_value.push(value)

                if (this.state.onChange !== undefined) {
                    this.state.onChange(new_value, this)
                }
                
                return {
                    input_value: new_value,
                };
            })
        }
    }

    get_default_input_value(str){
        if (str === undefined) {
            return []
        }

        if (!Array.isArray(str)) {
            return [str.toString()]
        }

        return str
    }

    get_check_status(value){
        if (this.state.input_type === 'radio') {
            return Array.isArray(this.state.input_value) && this.state.input_value.includes(value) ? 'dot-circle' : 'circle'
        }

        if (this.state.input_type === 'checkbox') {
            return Array.isArray(this.state.input_value) && this.state.input_value.includes(value) ? 'check-square' : 'square'
        }
    }

    is_valid(){
        var is_valid = true
        var nextState = { is_show_required_err: false }

        if (this.state.is_required) {

            if (this.state.is_select_multiple) {
                is_valid = this.data_selected.length > 0
            }else{
                is_valid = this.data_selected !== null
            }

            if (!is_valid) {
                nextState.is_show_required_err = true
            }
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
            input_option,

            can_add_partial,
            can_show_btn_edit_partial,

            required_err,

            is_required,
            is_readonly,
            is_editable,
            is_select_multiple,

            is_show_required_err,
            is_show_suggest,

            index_suggest,
            view_data_suggest
        } = this.state

         return (
            <div className={"form-control-container " + className }>
                {
                    label.length > 0 &&
                    <label>
                        {label} 
                        {
                            is_required &&
                            <span className="text-danger" style={{ marginLeft: '5px' }}>*</span>
                        }
                    </label>
                }
                <ul className="form-control-checbox">
                    {
                        input_option.map((option, index) => 
                            (
                                <li key={index} onClick={() => this.handle_input_click(option.value)}>
                                    <i className={ 'checkbox-icon fa fa-' + this.get_check_status(option.value)  }></i> 
                                    <span>{option.label}</span>
                                </li>
                            )
                        )
                        
                    }
                </ul>
                {
                    (is_required && is_show_required_err) && 
                    <span className="text-danger text-message">{required_err}</span>
                }
            </div>
        )
    }
}

export default Checkbox