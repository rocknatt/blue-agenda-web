import React, { Component } from 'react'

//Todo : utiliser les dépendances
import ButtonEditPartial from '../btn/ButtonEditPartial'
import ButtonAddPartial from '../btn/ButtonAddPartial'
import Tooltip from '../Tooltip'

class Base extends Component {
    state = {

    }

    constructor(props){
        super(props)

        this.state = {
            label: this.get_default_value(props.label),
            className: this.get_default_value(props.className),
            input_id: this.get_default_value(props.input_id),
            input_name: this.get_default_value(props.input_name),
            input_class: this.get_default_value(props.input_class),
            input_type: this.get_default_value(props.input_type),
            input_value: this.get_default_value(props.input_value),
            input_placeholder: this.get_default_value(props.input_placeholder),
            input_show_suggest_on_focus: props.input_show_suggest_on_focus,
            input_autocomplete: props.input_autocomplete === undefined ? false : props.input_autocomplete,
            input_min_value: props.input_min_value,
            input_max_value: props.input_max_value,
            input_ponctual_error: '',
            input_tooltip_info: props.input_tooltip_info,
            input_option: props.input_option,

            can_add_partial: props.can_add_partial,

            required_err: this.get_required_err(props.required_err),
            email_valid_err: this.get_email_valid_err(props.email_valid_err),

            is_show_required_err: false,

            is_email_valid: props.is_email_valid,
            is_required: props.is_required,
            is_readonly: props.is_readonly,
            is_editable: props.is_editable === undefined ? true : props.is_editable,
            can_show_btn_edit_partial: props.can_show_btn_edit_partial === undefined ? true : props.can_show_btn_edit_partial,

            index_suggest: -1,
            is_show_suggest: false,
            view_data_suggest: [],

            text_suggest: '',

            //Evenements
            onChange: props.onChange,
            onKeyDown: props.onKeyDown,
            onEdit: props.onEdit,
            onEdited: props.onEdited,
            onPaste: props.onPaste,
            onFocus: props.onFocus,
            onBlur: props.onBlur,
            onButtonAddClick: props.onButtonAddClick,
        }

        this.data_suggest = props.input_suggest
        this.input_component =  React.createRef()
    }

    componentWillMount(){
        if (this._componentWillMount) {
            this._componentWillMount()
        }
    }

    componentWillUnmount(){
        if (this._componentWillUnmount) {
            this._componentWillUnmount()
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            label: this.get_default_value(nextProps.label),
            className: this.get_default_value(nextProps.className),
            input_class: this.get_default_value(nextProps.input_class),
            input_value: this.get_default_value(nextProps.input_value),
            input_placeholder: this.get_default_value(nextProps.input_placeholder),
            input_min_value: nextProps.input_min_value,
            input_max_value: nextProps.input_max_value,
            input_ponctual_error: '',
            input_option: nextProps.input_option,

            is_required: nextProps.is_required,
            is_readonly: nextProps.is_readonly,
            is_editable: nextProps.is_editable === undefined ? true : nextProps.is_editable,
            can_show_btn_edit_partial: nextProps.can_show_btn_edit_partial === undefined ? true : nextProps.can_show_btn_edit_partial,
        })

        this.data_suggest = nextProps.input_suggest

        if (this._componentWillReceiveProps) {
            this._componentWillReceiveProps(nextProps)
        }
    }

    componentWillUpdate(nextProps, nextState){
        if (this._componentWillUpdate) {
            this._componentWillUpdate(nextProps, nextState)
        }
    }

    componentDidUpdate(){
        if (this._componentDidUpdate) {
            this._componentDidUpdate()
        }
    }

    componentDidMount(){
        if (this._componentDidMount) {
            this._componentDidMount()
        }
    }

    get_input_name(){
        return this.state.input_name
    }

    get_input_value(){
        return this.state.input_value
    }

    get_required_err(str){
        if (str === undefined) {
            return 'required'
        }

        return str
    }

    get_email_valid_err(str){
        if (str === undefined) {
            return 'email invalid'
        }

        return str
    }

    get_default_value(str){
        return str === undefined ? '' : str
    }

    handle_button_edit_click = (e) => {

        this.setState(function (prevState) {

            if (!prevState.is_readonly && this.state.onEdited !== undefined) {
                this.state.onEdited(this)
            }

            if (prevState.is_readonly && this.state.onEdit !== undefined) {
                this.state.onEdit(this)
            }

            if (prevState.is_readonly) {
                setTimeout(() => {
                    if (this.input_component.current !== null) {
                        this.input_component.current.focus()
                    }
                }, 200)
            }

            return {
                is_readonly: !prevState.is_readonly
            }
        })
    }

    handle_input_key_down = (e) => {

        if (this.state.is_show_suggest) {
            switch(e.keyCode){
                //Entrée
                case 13:
                    if (this.state.index_suggest !== -1) {
                        

                        this.setState(function(prevState, props){

                            var new_value = this.data_selected.label
                            var nextState = { 'is_show_suggest': false }

                            if (this.state.input_type === 'select') {
                                if (this.state.is_select_multiple) {
                                    this.data_selected = this.state.view_data_suggest[this.state.index_suggest]

                                    new_value = ''
                                    nextState.view_data_suggest = this.get_escaped_view_suggest()
                                }else{
                                    this.data_selected.push(this.state.view_data_suggest[this.state.index_suggest])
                                }
                                
                            }

                            nextState.input_value = new_value
                            
                            return nextState
                        })
                        e.preventDefault()
                    }else{
                        this.setState({'is_show_suggest': false})
                    }
                    break;
                //Echappe
                case 27:
                    this.setState({ is_show_suggest: false })
                    break;

                //haut
                case 33:
                case 38:
                    this.setState(function(prevState, props){
                        this.suggest_container.current.scrollTop -= 25
                        if ((prevState.index_suggest - 1) < 0) {
                            return {
                                index_suggest: 0
                            };
                        }else{
                            return {
                                index_suggest: prevState.index_suggest - 1
                            };
                        }

                        
                    })
                    e.preventDefault()
                    break;
                //bas
                case 34:
                case 40:
                    this.setState(function(prevState, props){
                        if (prevState.index_suggest > 1) {
                            this.suggest_container.current.scrollTop += 25
                        }

                        if ((prevState.index_suggest + 1) >= prevState.view_data_suggest.length) {
                            return {
                                index_suggest: prevState.view_data_suggest.length - 1
                            };
                        }else{
                            return {
                                index_suggest: prevState.index_suggest + 1
                            };
                        }
                    })
                    e.preventDefault()
                    break;
            }
        }

        if (this.state.is_readonly !== undefined && !this.state.is_readonly && e.keyCode === 13) {
            //Validation par la touche entrée
            this.handle_button_edit_click()
        }

        if (this.state.onKeyDown !== undefined) {
            this.state.onKeyDown(e)
        }
    }

    handle_input_change = (e) =>{
        var value = e.target.value

        this.setState(function (prevState) {
            if (!prevState.is_readonly) {


                if (prevState.input_type === 'numeric') {
                    value = value.replace(/\s|[A-Za-z]|=|;/g, "")

                    var int_val = parseInt(value)
                    if (prevState.input_min_value !== undefined && int_val < prevState.input_min_value) {
                        value = prevState.input_min_value.toString()
                    }

                    if (prevState.input_max_value !== undefined && int_val > prevState.input_max_value) {
                        value = prevState.input_max_value.toString()
                    }
                }

                var nextState = { 
                    input_value: value, 
                    is_show_required_err: false,
                    is_show_suggest: false, 
                    index_suggest: 0,
                    view_data_suggest: []
                }

                //Suggestion
                if (this.data_suggest !== undefined) {
                    var view_data_suggest = []
                    this.data_suggest.map((_data) => {
                        if (_data.label.toLowerCase().includes(value.toLowerCase())) {
                            nextState.is_show_suggest = true;
                            nextState.text_suggest = value;
                            view_data_suggest.push(_data)
                        }
                    })

                    nextState.view_data_suggest = view_data_suggest
                }

                

                if (value.length === 0 && prevState.is_required) {
                    nextState.is_show_required_err = true
                }

                if (this.state.onChange !== undefined) {
                    this.state.onChange(nextState.input_value, this)
                }

                return nextState
            }
            
            return {}
        })
    }

    handle_suggest_click = (text, _data) => {

        this.setState(function(prevState, props){
            if (!prevState.is_readonly) {
                var new_value = text
                var nextState = { 'is_show_suggest': false }
                
                nextState.input_value = new_value
                if (this.state.onChange !== undefined) {
                    this.state.onChange(nextState.input_value, this)
                }
                                
                return nextState
            }
        })
    }

    handle_input_focus = (e) => {

        clearTimeout(this.input_blur_timeout)

        if (!this.state.is_readonly && this.state.input_show_suggest_on_focus) {
            this.setState(function (prevState) {
                return { 
                    is_show_suggest: true,
                    view_data_suggest: this.data_suggest,
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

                return nextState
            })
        }, 500)

        if (this.state.onBlur !== undefined) {
            this.state.onBlur(this, e)
        }
    }

    handle_paste = (e) => {
        console.log(this.state.onPaste)
        if (this.state.onPaste !== undefined) {
            this.state.onPaste(e, this)
        }
    }

    handle_button_add_click = (e) => {
        if (this.state.onButtonAddClick !== undefined) {
            this.state.onButtonAddClick(this, e)
        }
    }

    show_ponctual_error(_value){
        this.setState({ input_ponctual_error: _value })
    }

    hide_ponctual_error(){
        this.setState({ input_ponctual_error: '' })
    }

}

export default Base