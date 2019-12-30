import React, { Component } from 'react'

import Input from './input'
import Textarea from './textarea'
import Select from './select'
import DateInput from './date'
import TimeInput from './time'
import Checkbox from './checkbox'

class FormControl extends Component {
    state = {

    }

    constructor(props){
        super(props)

        this.state = {
            input_type: props.input_type,
        }
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState(function(prevState, props){
            return {

            };
        })
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidUpdate(){

    }

    componentDidMount(){

    }

    render() {

        const { 
        	input_type
        } = this.state

        if (input_type === 'checkbox' || input_type === 'radio') {
            console.log('index', this.props.input_value)
            return (
                <Checkbox
                    lang={this.props.lang}
                    label={this.props.label}
                    className={this.props.className}
                    input_id={this.props.input_id}
                    input_name={this.props.input_name}
                    input_class={this.props.input_class}
                    input_type={this.props.input_type}
                    input_value={this.props.input_value}
                    input_placeholder={this.props.input_placeholder}
                    input_ponctual_error={this.props.input_ponctual_error}
                    input_tooltip_info={this.props.input_tooltip_info}
                    input_option={this.props.input_option}
                    
                    tag_link_base_url={this.props.tag_link_base_url}

                    can_add_partial={this.props.can_add_partial}

                    required_err={this.props.required_err}
                    email_valid_err={this.props.email_valid_err}

                    is_select_multiple={this.props.is_select_multiple}
                    is_required={this.props.is_required}
                    is_readonly={this.props.is_readonly}
                    is_editable={this.props.is_editable}
                    can_show_btn_edit_partial={this.props.can_show_btn_edit_partial}
                    />
            )
        }

        if (input_type === 'time') {
            return (
                <TimeInput
                    lang={this.props.lang}
                    label={this.props.label}
                    className={this.props.className}
                    input_id={this.props.input_id}
                    input_name={this.props.input_name}
                    input_class={this.props.input_class}
                    input_type={this.props.input_type}
                    input_value={this.props.input_value}
                    input_placeholder={this.props.input_placeholder}
                    input_ponctual_error={this.props.input_ponctual_error}
                    input_tooltip_info={this.props.input_tooltip_info}

                    can_add_partial={this.props.can_add_partial}

                    required_err={this.props.required_err}

                    is_required={this.props.is_required}
                    is_readonly={this.props.is_readonly}
                    is_editable={this.props.is_editable}
                    can_show_btn_edit_partial={this.props.can_show_btn_edit_partial}
                    />
            )
        }

        if (input_type === 'date') {
            return (
                <DateInput
                    lang={this.props.lang}
                    label={this.props.label}
                    className={this.props.className}
                    input_id={this.props.input_id}
                    input_name={this.props.input_name}
                    input_class={this.props.input_class}
                    input_type={this.props.input_type}
                    input_value={this.props.input_value}
                    input_placeholder={this.props.input_placeholder}
                    input_ponctual_error={this.props.input_ponctual_error}
                    input_tooltip_info={this.props.input_tooltip_info}

                    min_year={this.props.min_year}
                    year_length={this.props.year_length}
                    input_min_year_value={this.props.input_min_year_value}
                    input_max_year_value={this.props.input_max_year_value}

                    can_add_partial={this.props.can_add_partial}

                    required_err={this.props.required_err}

                    is_required={this.props.is_required}
                    is_readonly={this.props.is_readonly}
                    is_editable={this.props.is_editable}
                    can_show_btn_edit_partial={this.props.can_show_btn_edit_partial}
                    />
            )
        }

        if (input_type === 'select') {
            return (
                <Select
                    lang={this.props.lang}
                    label={this.props.label}
                    className={this.props.className}
                    input_id={this.props.input_id}
                    input_name={this.props.input_name}
                    input_class={this.props.input_class}
                    input_type={this.props.input_type}
                    input_value={this.props.input_value}
                    input_placeholder={this.props.input_placeholder}
                    input_ponctual_error={this.props.input_ponctual_error}
                    input_tooltip_info={this.props.input_tooltip_info}
                    input_option={this.props.input_option}
                    
                    tag_link_base_url={this.props.tag_link_base_url}

                    can_add_partial={this.props.can_add_partial}

                    required_err={this.props.required_err}
                    email_valid_err={this.props.email_valid_err}

                    is_select_multiple={this.props.is_select_multiple}
                    is_required={this.props.is_required}
                    is_readonly={this.props.is_readonly}
                    is_editable={this.props.is_editable}
                    can_show_btn_edit_partial={this.props.can_show_btn_edit_partial}
                    />
            )
        }

        if (input_type === 'textarea') {
            return (
                <Textarea
                    lang={this.props.lang}
                    label={this.props.label}
                    className={this.props.className}
                    input_id={this.props.input_id}
                    input_name={this.props.input_name}
                    input_class={this.props.input_class}
                    input_type={this.props.input_type}
                    input_value={this.props.input_value}
                    input_placeholder={this.props.input_placeholder}
                    input_ponctual_error={this.props.input_ponctual_error}
                    input_tooltip_info={this.props.input_tooltip_info}
                    is_autosize={this.props.is_autosize}

                    can_add_partial={this.props.can_add_partial}

                    required_err={this.props.required_err}
                    email_valid_err={this.props.email_valid_err}

                    is_required={this.props.is_required}
                    is_readonly={this.props.is_readonly}
                    is_editable={this.props.is_editable}
                    can_show_btn_edit_partial={this.props.can_show_btn_edit_partial}
                    />
            )
        }

        //input
        return (
            <Input
                lang={this.props.lang}
                label={this.props.label}
                className={this.props.className}
                input_id={this.props.input_id}
                input_name={this.props.input_name}
                input_class={this.props.input_class}
                input_type={this.props.input_type}
                input_value={this.props.input_value}
                input_placeholder={this.props.input_placeholder}
                input_show_suggest_on_focus={this.props.input_show_suggest_on_focus}
                input_autocomplete={this.props.input_autocomplete}
                input_min_value={this.props.input_min_value}
                input_max_value={this.props.input_max_value}
                input_ponctual_error={this.props.input_ponctual_error}
                input_tooltip_info={this.props.input_tooltip_info}

                can_add_partial={this.props.can_add_partial}

                required_err={this.props.required_err}
                email_valid_err={this.props.email_valid_err}

                is_email_valid={this.props.is_email_valid}
                is_required={this.props.is_required}
                is_readonly={this.props.is_readonly}
                is_editable={this.props.is_editable}
                can_show_btn_edit_partial={this.props.can_show_btn_edit_partial}

                onChange={this.props.onChange}
                onKeyDown={this.props.onKeyDown}
                onEdit={this.props.onEdit}
                onEdited={this.props.onEdited}
                onPaste={this.props.onPaste}
                onFocus={this.props.onFocus}
                onBlur={this.props.onBlur}
                onButtonAddClick={this.props.onButtonAddClick}
                />
        )
    }

    static serialize_form(form_list){
        var result = {}
        var should_submit = true

        form_list.map((form) => {
            if (form !== undefined) {
                if (form.is_valid()) {
                    var val = form.get_input_value()
                    if (val !== undefined) {
                        result[form.get_input_name()] = val
                    }
                }else{
                    should_submit = false
                }
            }
        })

        return {
            should_submit,
            result
        }
    }
}

export default FormControl