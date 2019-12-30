import React from 'react'

//Todo : utiliser les dépendances
import ButtonEditPartial from '../btn/ButtonEditPartial'
import ButtonAddPartial from '../btn/ButtonAddPartial'
import Tooltip from '../Tooltip'

import Base from './base'

class Select extends Base {

    data_selected = {}
    data_suggest = []

    constructor(props){
        super(props)

        this.input_component =  React.createRef()
    }

    _componentWillReceiveProps(nextProps){
        let nextState = {
            tag_link_base_url: nextProps.tag_link_base_url,
        }

        this.data_suggest = nextProps.input_option

        this.setState(nextState)
    }

    _componentDidMount(){
        if (this.props.onRef !== undefined){
            this.props.onRef(this)
        }

        //state initialization for child component
        this.data_suggest = this.props.input_option

        let nextState = {
            is_select_multiple: this.props.is_select_multiple,
            tag_link_base_url: this.props.tag_link_base_url,
            view_data_suggest: this.props.input_option,
            input_value: this.get_default_input_value(this.props.input_default_value !== undefined ? this.props.input_default_value : this.props.input_value),
        }

        this.init_data_suggest(this.state.input_suggest)

        this.setState(nextState)
    }

    handle_suggest_click = (text, _data) => {

        this.setState(function(prevState, props){
            if (!prevState.is_readonly) {
                var new_value = text
                var nextState = { 'is_show_suggest': false }

                if (prevState.is_select_multiple) {
                    this.data_selected.push(_data)

                    new_value = ''
                    nextState.view_data_suggest = this.get_escaped_view_suggest()
                }else{
                    this.data_selected = _data
                }
                
                nextState.input_value = new_value
                if (this.state.onChange !== undefined) {
                    this.state.onChange(nextState.input_value, this)
                }
                                
                return nextState
            }
        })
    }

    handle_remove_item_seleted = (index) => {
        this.setState(function (prevState) {
            this.data_selected.splice(index, 1)

            if (this.state.onChange !== undefined) {
                this.state.onChange(this.data_selected, this)
            }

            return {
                view_data_suggest: this.get_escaped_view_suggest()
            }
        })
    }

    handle_input_select_click = (e) => {
        clearTimeout(this.input_blur_timeout)
        this.input_component.current.focus()
    }

    handle_input_focus = (e) => {

        clearTimeout(this.input_blur_timeout)

        if (!this.state.is_readonly && this.state.input_type === 'select') {
            this.setState(function (prevState) {
                return { 
                    is_show_suggest: true,
                    view_data_suggest: prevState.is_select_multiple ? this.get_escaped_view_suggest() : this.data_suggest,
                }
            })
        }

        if (this.state.onFocus !== undefined) {
            this.state.onFocus(this, e)
        }
    }

    input_blur_timeout
    handle_input_blur = (e) => {

        let current_input_value = e.target.value

        this.input_blur_timeout = setTimeout(() => {
            this.setState(function (prevState) {
                var nextState = { is_show_suggest: false }

                if (prevState.is_select_multiple) {

                    if (prevState.onValueInserted !== undefined && this.state.input_value.length > 0) {
                        prevState.onValueInserted(this, current_input_value)
                    }

                }
                else if (this.data_selected.value !== undefined && this.data_selected.value.length !== 0){
                    nextState.input_value = this.data_selected.label
                }
                
                nextState.is_show_required_err = false

                return nextState
            })
        }, 500)

        if (this.state.onBlur !== undefined) {
            this.state.onBlur(this, e)
        }
    }

    get_escaped_view_suggest(){
        if (this.state.is_select_multiple) {
            var result = []

            this.data_suggest.map((data) => {
                let is_inside = false

                this.data_selected.map((_data) => {
                    if (data.value === _data.value) {
                        is_inside = true
                    }
                })
                

                if (!is_inside) {
                    result.push(data)
                }
            })

            return result
        }

        return this.data_suggest
    }

    get_default_input_value(str){

        if (str === null || str === undefined) {
            str = ''
        }
        var input_value = str

        //Todo : evaluer les données par défauts
        if (this.state.is_select_multiple && Array.isArray(str)) {
            var adr = []

            if (this.state.input_option !== undefined) {
                this.state.input_option.map((option) => {
                    str.map((val, index) => {
                        if (option.value == val) {
                            adr.push(option)
                        }
                    })
                })
            }

            this.data_selected = adr
            return ''
        }else{

            this.state.input_option.map((data) => {
                if ((typeof str === 'string' && data.value == str) ||
                    data.value == str.value) {
                    this.data_selected = data
                    input_value = data.label
                }
            })

            

            return input_value
        }
        return str
    }

    add_option(new_value, force_selected){
        this.setState(function (prevState) {
            this.data_suggest.push(new_value)

            var next_input_value = prevState.input_value
            if (force_selected && !prevState.is_select_multiple) {
                this.data_selected = new_value
                next_input_value = new_value.label
            }

            if (force_selected && prevState.is_select_multiple) {
                this.data_selected.push(new_value)
                next_input_value = ''
            }

            return {
                view_data_suggest: this.data_suggest,
                input_value: next_input_value,
            }
        })
    }

    init_data_suggest(uri){

        if (typeof uri === 'object') {
            this.data_suggest = uri
            this.setState({view_data_suggest : this.data_suggest})
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
            tag_link_base_url,

            can_add_partial,
            can_show_btn_edit_partial,

            required_err,
            email_valid_err,

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
                <div className={"form-control-select " + (is_readonly ? 'readonly' : '') } onClick={this.handle_input_select_click}>
                    {
                        is_select_multiple &&
                        this.data_selected.map((data, index) => (
                            <a className="selected-value" key={index} href={ tag_link_base_url === undefined ? '#' : tag_link_base_url + data.tag_name }>
                                <span>{data.label}</span>
                                {
                                    !is_readonly &&
                                    <button type="button" onClick={() => { this.handle_remove_item_seleted(index) }}><i className="fa fa-times"></i></button>
                                }
                            </a>
                        ))
                    }

                    {
                        (is_editable) &&
                        <input 
                            type='text'
                            id={input_id} 
                            name={input_name} 
                            readOnly={is_readonly}
                            className={"form-control " + input_class} 
                            onChange={this.handle_input_change} 
                            onKeyDown={this.handle_input_key_down}
                            onFocus={this.handle_input_focus}
                            onBlur={this.handle_input_blur}
                            placeholder={input_placeholder} 
                            autoComplete={'off'}
                            ref={this.input_component}
                            value={input_value} />
                    }
                </div>

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
                    (can_add_partial && !is_readonly) &&
                    <ButtonAddPartial 
                        className="absolute right bottom"
                        onClick={this.handle_button_add_click}
                        />
                }

                
            </div>
        )
    }
}

export default Select