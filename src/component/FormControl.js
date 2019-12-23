import React, { Component } from 'react'

import Utils from '../Utils/Utils'
import Tooltip from './Tooltip'

import ButtonEditPartial from './btn/ButtonEditPartial'
import ButtonAddPartial from './btn/ButtonAddPartial'

import Moment from "moment"

class FormControl extends Component {
    state = {

    }

    lang = null
    suggest_container = null
    input_component = null
    textarea_component = null
    rail_component = null

    data_suggest = []
    data_selected = []

    date_value = null
    prev_pointer_coord = {}

    input_date
    input_month
    input_year

    year_now
    actual_action = 'nothing'

    constructor(props){
        super(props)

        this.lang = props.lang
        var date_now = new Date()
        this.year_now = date_now.getFullYear()

        this.state = {
            is_load: false,
            label: this.get_default_value(props.label),
            input_id: this.get_default_id(props.input_id),
            input_class: this.get_default_value(props.input_class),
            input_name: this.get_default_value(props.input_name),
            input_type: this.get_default_value(props.input_type),
            input_min_value: props.input_min_value,
            input_max_value: props.input_max_value,
            input_min_year_value: props.input_min_year_value,
            input_max_year_value: props.input_max_year_value,
            input_value: this.get_default_input_value(props.input_default_value !== undefined ? props.input_default_value : props.input_value, props.input_type, props.input_option, props.is_select_multiple),
            input_placeholder: this.get_default_value(props.input_placeholder),
            input_autocomplete: this.get_default_autocomplete_value(props.input_autocomplete),

            //Todo : limiter le nombre de valeur selectionnable
            input_select_max: props.input_select_max,

            //Trackbar
            input_scale: props.input_scale,

            is_select_multiple: props.is_select_multiple,
            is_autosize: props.is_autosize,
            input_option: props.input_option,
            input_suggest: props.input_suggest,
            input_show_suggest_on_focus: props.input_show_suggest_on_focus,
            input_tooltip_info: props.input_tooltip_info,
            input_ponctual_error: '',
            is_required: props.is_required,
            is_show_required_err: props.is_show_required_err,
            required_err: this.get_required_err(props.required_err),
            is_email_valid: props.is_email_valid,
            email_valid_err: this.get_email_valid_err(props.email_valid_err),
            is_show_email_valid_err: props.is_show_email_valid_err,
            is_phone_number: props.is_phone_number,
            is_readonly: props.is_readonly,
            is_editable: props.is_editable === undefined ? true : props.is_editable,

            can_add_partial: props.can_add_partial,
            can_insert_value: props.can_insert_value,
            can_show_btn_edit_partial: props.can_show_btn_edit_partial === undefined ? true : props.can_show_btn_edit_partial,

            tag_link_base_url: props.tag_link_base_url,
            className: props.className,
            style: props.style,

            //Evenements
            onChange: props.onChange,
            onKeyDown: props.onKeyDown,
            onEdit: props.onEdit,
            onEdited: props.onEdited,
            onPaste: props.onPaste,
            onFocus: props.onFocus,
            onBlur: props.onBlur,
            onButtonAddClick: props.onButtonAddClick,
            onValueInserted: props.onValueInserted,

            //Date
            min_year: props.min_year === undefined ? this.year_now - 90 : props.min_year,
            year_length: props.year_length === undefined ? 90 : props.year_length,

            //State interne
            view_data_suggest: props.input_type === 'select' ? props.input_option : [],
            text_suggest: ''
        }

        this.suggest_container =  React.createRef()
        this.input_component =  React.createRef()
        this.textarea_component =  React.createRef()
        this.rail_component =  React.createRef()
        this.input_date =  React.createRef()
        this.input_month =  React.createRef()
        this.input_year =  React.createRef()

        if (props.input_type === 'date') {
            this.date_value = this.get_default_date_value(props.input_value)
        }

        if (props.input_type === 'time') {
            this.date_value = this.get_default_time_value(props.input_value)
        }

        if (props.input_type === 'select') {
            this.data_suggest = props.input_option
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState(function(prevState, props){

            if (prevState.input_type === 'select') {
                this.data_suggest = nextProps.input_option
            }

            return {
                label: this.get_default_value(nextProps.label),
                input_id: this.get_default_id(nextProps.input_id),
                input_class: this.get_default_value(nextProps.input_class),
                input_name: this.get_default_value(nextProps.input_name),
                input_type: this.get_default_value(nextProps.input_type),
                input_min_value: nextProps.input_min_value,
                input_max_value: nextProps.input_max_value,
                input_min_year_value: nextProps.input_min_year_value,
                input_max_year_value: nextProps.input_max_year_value,
                input_value: this.get_default_input_value(nextProps.input_value, nextProps.input_type, nextProps.input_option, nextProps.is_select_multiple),
                input_option: nextProps.input_option,

                view_data_suggest: prevState.input_type === 'select' ? this.get_escaped_view_suggest() : [],

                is_readonly: nextProps.is_readonly,
                is_editable: props.is_editable === undefined ? true : props.is_editable,
            };
        })
    }

    componentWillMount(){

    }

    componentWillUnmount(){
        if (this.props.onRef !== undefined) {
            this.props.onRef(this, true)
        }

        document.removeEventListener('mousemove', this.handle_mouse_move)
        document.removeEventListener('mouseup', this.handle_mouse_up)
    }

    componentWillUpdate(nextProps, nextState){
        
    }

    componentDidUpdate(){
        
    }

    componentDidMount(){
        //Todo : faire les recherches d'évaluation ici d'abord

        this.setState({ is_load: true })

        if (this.props.onRef !== undefined){
            this.props.onRef(this)
        }

        if (this.state.input_suggest !== undefined) {
            this.init_data_suggest(this.state.input_suggest)
        }
        
        if (this.state.input_type === 'trackbar') {
            document.addEventListener('mousemove', this.handle_mouse_move)
            document.addEventListener('mouseup', this.handle_mouse_up)
        }
    }
    //Commenté parce que cela créer un bug sur edit_readonly input
    // shouldComponentUpdate(nextProps, nextState){

        
    //     // return this.state.input_type === 'select' ||
    //     //     this.state.input_value !== nextState.input_value

    // }

    get_input_name(){
        return this.state.input_name
    }

    get_input_value(){
        if (this.state.input_type === 'select') {
            if (this.state.is_select_multiple) {
                var result = []
                this.data_selected.map((_data) => {
                    result.push(_data.value)
                })
                return result
            }

            return this.data_selected.value
        }

        if (this.state.input_type === 'date') {
            return this.date_value.year + '/' + (parseInt(this.date_value.month) + 1) + '/' + this.date_value.date
        }

        if (this.state.input_type === 'time') {
            return this.date_value.hour + ':' + this.date_value.minute + ':' + this.date_value.second
        }

        return this.state.input_value
    }

    get_default_autocomplete_value(str){
        if (str === undefined) {
            //Todo créer la méthode
            return true
        }

        return str
    }

    get_default_id(str){
        if (str === undefined) {
            //Todo créer la méthode
            return ''
            // return Utils.get_uniqid()
        }

        return str
    }

    get_default_value(str){
        if (str === undefined) {
            return ''
        }
        return str
    }

    get_default_input_value(str, input_type, input_option, is_select_multiple){

        if (input_type === 'checkbox' || input_type === 'radio') {
            if (str === undefined) {
                return []
            }
            return str
        }

        if (input_type === 'select') {
            if (str === null || str === undefined) {
                str = ''
            }
            var input_value = str

            //Todo : evaluer les données par défauts
            if (is_select_multiple && Array.isArray(str)) {
                var adr = []

                if (input_option !== undefined) {
                    input_option.map((option) => {
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

                input_option.map((data) => {
                    if ((typeof str === 'string' && data.value == str) ||
                        data.value == str.value) {
                        this.data_selected = data
                        input_value = data.label
                    }
                })

                

                return input_value
            }

            
        }

        if (input_type === 'numeric') {
            if (str === undefined) {
                return 0
            }
        }

        if (str === undefined && this.state.input_value === undefined) {
            return ''
        }

        if (str === undefined && this.state.input_value !== undefined) {
            return this.state.input_value
        }
        return str
    }

    get_required_err(str){
        if (str === undefined) {
            return this.lang.line('std_required_err')
        }

        return str
    }

    get_email_valid_err(str){
        if (str === undefined) {
            return this.lang.line('std_email_valid_err')
        }

        return str
    }

    get_check_status(value){
        if (this.state.input_type === 'radio') {
            return this.state.input_value.includes(value) ? 'dot-circle' : 'circle'
        }

        if (this.state.input_type === 'checkbox') {
            return this.state.input_value.includes(value) ? 'check-square' : 'square'
        }
    }

    get_date_suggest(){
        var data = []
        for (var i = 1; i < 32; i++) {
            data.push({ label: i.toString(), value: i.toString() })
        }

        return data
    }

    get_month_suggest(){
        var month = this.lang.line('std_month_list_')
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

    get_date_mouth_valid(){
        return [
            31,
            29,//Todo: repérer les année bisextile
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
        ]
    }

    get_default_date_value(p_value){
        if (p_value === undefined) {
            return { date: 1, month: 0, year: this.year_now }
        }

        var date_time = Moment(p_value)

        return { date: date_time.date(), month: date_time.month(), 'year': date_time.year() }
    }

    get_default_time_value(p_value){
        if (p_value === undefined) {
            return { hour: '00', minute: '00', second: '00' }
        }

        var adr = p_value.split(':')
        if (adr[0] === undefined) {
            adr[0] = '00'
        }

        if (adr[0].length === 1) {
            adr[0] = '0' + adr[0]
        }

        if (adr[1] === undefined) {
            adr[1] = '00'
        }

        if (adr[1].length === 1) {
            adr[1] = '0' + adr[1]
        }

        if (adr[2] === undefined) {
            adr[2] = '00'
        }

        if (adr[2].length === 1) {
            adr[2] = '0' + adr[2]
        }

        return { hour: adr[0], minute: adr[1], second: adr[2] }
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

    set_value(p_value){
        this.setState({ input_value: p_value })
    }

    set_max_value(p_value){
        this.setState({ input_max_value: p_value })
    }

    show_ponctual_error(_value){
        this.setState({ input_ponctual_error: _value })
    }

    hide_ponctual_error(){
        this.setState({ input_ponctual_error: '' })
    }

    init_data_suggest(uri){

        if (typeof uri === 'string') {
            Utils.ajax({
                url: uri,
                type: 'GET',
                data_type: 'json',
                success: (response) => { 
                    let result = []
                    response.map((value) => {
                        result.push({ label: value, value: value })
                    })
                    this.data_suggest = result
                 }
            })
        }

        if (typeof uri === 'object') {
            this.data_suggest = uri
            this.setState({view_data_suggest : this.data_suggest})
        }
    }

    is_valid(){
        var is_valid = true
        var nextState = { is_show_required_err: false, is_show_email_valid_err: false }

        if (this.state.is_required) {
            if (this.state.input_type === 'date') {
                return true
            }

            if (this.state.input_type === 'select') {

                if (this.state.is_select_multiple) {
                    is_valid = this.data_selected.length > 0
                }else{
                    is_valid = this.data_selected !== null
                }

                if (!is_valid) {
                    nextState.is_show_required_err = true
                }

            }

            if (this.state.input_type === 'text' || this.state.input_type === 'password' || this.state.input_type === 'textarea' ) {
                if (this.state.is_required && this.state.input_value.length === 0) {
                    is_valid = false
                    nextState.is_show_required_err = true
                }
            }
        }

        //todo : valid email
        if (!is_valid) {
            this.setState(nextState)
        }

        return is_valid
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
                //Todo : il y aurait un moment oû l'on ai besoin de faire du suggest dynamique en fonction du position du curseur, pour l'instant ce n'est pas urgent mais 
                //peut être que ce sera le case très vite
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
                    // this.write_history()
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

        if (this.state.is_readonly !== undefined && !this.state.is_readonly && e.keyCode === 13) {
            //Validation par la touche entrée
            if (this.state.input_type === 'select' && this.state.is_select_multiple) {
                this.input_component.current.blur()
            }
            else{
                this.handle_button_edit_click()
            }
            
        }

        if (this.state.onKeyDown !== undefined) {
            this.state.onKeyDown(e)
        }
    }

    handle_select_change = (selected_data, e) => {
    }

    handle_suggest_click = (text, _data) => {

        this.setState(function(prevState, props){
            if (!prevState.is_readonly) {
                var new_value = text
                var nextState = { 'is_show_suggest': false }

                if (prevState.input_type === 'select') {
                    if (prevState.is_select_multiple) {
                        this.data_selected.push(_data)

                        new_value = ''
                        nextState.view_data_suggest = this.get_escaped_view_suggest()
                    }else{
                        this.data_selected = _data
                    }
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

        if (!this.state.is_readonly && (this.state.input_type === 'select' || this.state.input_show_suggest_on_focus)) {
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

                if (prevState.input_type === 'select') {
                    if (prevState.is_select_multiple) {

                        if (prevState.onValueInserted !== undefined && this.state.input_value.length > 0) {
                            prevState.onValueInserted(this, current_input_value)
                        }

                    }
                    else if (this.data_selected.value !== undefined && this.data_selected.value.length !== 0){
                        nextState.input_value = this.data_selected.label
                    }
                    
                    nextState.is_show_required_err = false
                }
                return nextState
            })
        }, 500)

        if (this.state.onBlur !== undefined) {
            this.state.onBlur(this, e)
        }
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

    dispatch_date_change(){
        if (this.state.onChange !== undefined) {
            this.state.onChange(this.get_input_value(), this)
        }
    }

    handle_date_input_change = (value) => {
        this.date_value.date = parseInt(value)
        this.dispatch_date_change()
    }

    handle_month_input_change = (value, obj) => {
        this.date_value.month = obj.get_input_value()

        //Vérification de validité des fin de mois
        var valide_date_mouth = this.get_date_mouth_valid()
        var max_date = valide_date_mouth[this.date_value.month]
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

    handle_hour_input_change = (value) => {
        this.date_value.hour = parseInt(value)
        this.dispatch_date_change()
    }

    handle_hour_minute_change = (value) => {
        this.date_value.minute = parseInt(value)
        this.dispatch_date_change()
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

                    if (this.textarea_component.current !== null) {
                        this.textarea_component.current.focus()
                    }
                }, 200)
            }

            return {
                is_readonly: !prevState.is_readonly
            }
        })
    }

    handle_button_add_click = (e) => {
        if (this.state.onButtonAddClick !== undefined) {
            this.state.onButtonAddClick(this, e)
        }
    }

    handle_paste = (e) => {
        if (this.onPaste !== undefined) {
            this.onPaste(e, this)
        }
    }

    handle_wagon_mouse_down = (e) => {
        this.prev_pointer_coord = {pageX : e.pageX, pageY: e.pageY, value: this.state.input_value}
        this.actual_action = 'wagon_mouse_down'
    }

    handle_mouse_up = (e) => {
        this.actual_action = 'nothing'
    }

    handle_mouse_move = (e, triggerd) => {
        if (this.actual_action === 'wagon_mouse_down') {

            var mouseXDiff = e.pageX - this.prev_pointer_coord.pageX
            var rail_width = Utils.get_width(this.rail_component.current)

            //en pixel
            var prev_left_width = (this.prev_pointer_coord.value / this.state.input_max_value) * rail_width
            var next_left_width = prev_left_width + mouseXDiff

            //en valeur
            var new_value = (next_left_width / rail_width) * this.state.input_max_value
            new_value = this.get_scaled_value(new_value)
            
            if (new_value > this.state.input_max_value) {
                new_value = this.state.input_max_value
            }
            if (new_value < this.state.input_min_value) {
                new_value = this.state.input_min_value
            }

            if (this.state.onChange !== undefined) {
                this.state.onChange(new_value, this)
            }

            this.setState(function (prevState) {
                return {
                    input_value: new_value
                }
            })
        }
        
    }

    handle_wagon_key_down = (e) => {
        var rail_width = Utils.get_width(this.rail_component.current)
        var diff = null
        //gauche
        if (e.keyCode === 37) {
            diff = this.state.input_scale * -1
        }

        //droite
        if (e.keyCode === 9 || e.keyCode === 39) {
            diff = this.state.input_scale
        }

        this.setState(function (nextState) {

            var new_value = nextState.input_value + diff

            if (new_value > nextState.input_max_value) {
                new_value = nextState.input_max_value
            }
            if (new_value < nextState.input_min_value) {
                new_value = nextState.input_min_value
            }

            if (this.state.onChange !== undefined) {
                this.state.onChange(new_value, this)
            }

            return {
                input_value: new_value
            }
        })
    }

    handle_numeric_btn_cmd_click = (direction, e) => {
        this.setState(function (prevState) {
            var new_value = parseInt(prevState.input_value)

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

    get_scaled_value(value){
        var new_value = 0
        var should_continue = true
        while(should_continue){
            new_value += this.state.input_scale
            if (new_value > value) {
                should_continue = false
            }
        }
        return new_value
    }

    load_input_form(){

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

    insert_value(value){
        this.setState(function (prevState) {
            
            

            var new_value = ''

            if (this.state.input_type === 'text') {
                var str_1 = prevState.input_value.substring(0, this.input_component.current.selectionStart)
                var str_2 = prevState.input_value.substring(this.input_component.current.selectionEnd, prevState.input_value.length)

                new_value = str_1 + value + str_2
            }

            if (this.state.input_type === 'textarea') {
                var str_1 = prevState.input_value.substring(0, this.textarea_component.current.selectionStart)
                var str_2 = prevState.input_value.substring(this.textarea_component.current.selectionEnd, prevState.input_value.length)

                new_value = str_1 + value + str_2
            }

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
        if (this.state.input_type === 'input') {
            this.input_component.current.focus()
        }

        if (this.state.input_type === 'textarea') {
            this.textarea_component.current.focus()
        }

        if (this.state.input_type === 'date') {
            this.input_date.current.focus()
        }
    }

    render() {

        const { 
            is_load,
            index_suggest,
            text_suggest,
            label,
            input_id,
            input_class,
            input_type,
            input_name,
            input_value,
            input_min_value,
            input_max_value,
            input_min_year_value,
            input_max_year_value,
            input_option,
            input_placeholder,
            input_autocomplete,
            input_suggest,
            input_tooltip_info,
            input_ponctual_error,
            is_select_multiple,
            is_autosize,
            is_required,
            is_show_required_err,
            is_show_suggest,
            view_data_suggest,
            required_err,
            is_email_valid,
            is_readonly,
            is_editable,

            can_add_partial,
            can_show_btn_edit_partial,

            email_valid_err,
            is_show_email_valid_err,

            tag_link_base_url,
            className,

            onPaste,

        } = this.state

        let type = 'text'
        if (input_type === 'password') {
            type = 'password'
        }

        if (input_type === 'trackbar' ) {
            var rail_width = Utils.get_width(this.rail_component.current)
            var left_position = ((input_value / input_max_value) *  rail_width) - 5
            //Todo : step de valeur 1 par 1
            return (
                <div className={"form-control-container " + className }>
                    <div className="form-control-trackbar">
                        <span className="min-value">{input_min_value}</span>
                        <span className="max-value">{Utils.number_format(input_value, 2)}</span>
                        <div className="control-rail" ref={this.rail_component}>
                            <button 
                                className="control-wagon" 
                                style={{ left: left_position + 'px' }}
                                onKeyDown={this.handle_wagon_key_down}
                                onMouseUp={this.handle_wagon_mouse_up}
                                onMouseDown={ this.handle_wagon_mouse_down }>

                            </button>
                        </div>
                    </div>
                    
                </div>
            )
        }

        if (input_type === 'checkbox' || input_type === 'radio') {
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

        if (input_type === 'date') {

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
                                lang={this.lang}
                                input_id="form-date"
                                input_type="select"
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
                                lang={this.lang}
                                input_id="form-month"
                                input_value={month_value}
                                input_type="select"
                                input_class="form-month"
                                input_option={this.get_month_suggest()}
                                input_show_suggest_on_focus={true}
                                is_editable={is_editable}
                                ref={this.input_month}
                                onChange={this.handle_month_input_change} />

                            <FormControl 
                                lang={this.lang}
                                input_id="form-year"
                                input_type="select"
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

        if (input_type === 'time') {

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

        if (input_type === 'select') {
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
                                type={type} 
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

        if (input_type === 'textarea') {
            var text_dimension = Utils.get_text_size(input_value.length > 0 ? input_value : '|', '14px', Utils.get_width(this.textarea_component.current) + 'px')
            var textarea_style = {}
            if (is_autosize) {
                textarea_style.height = text_dimension.height + 18
            }

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
                        type={type} 
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
                    type={type} 
                    id={input_id} 
                    name={input_name} 
                    className={"form-control " + input_class} 
                    onChange={this.handle_input_change} 
                    onKeyDown={this.handle_input_key_down}
                    onFocus={this.handle_input_focus}
                    onBlur={this.handle_input_blur}
                    onPaste={ this.handle_paste }
                    onWheel={ this.handle_well_moved }
                    readOnly={is_readonly}
                    placeholder={input_placeholder} 
                    ref={this.input_component}
                    autoComplete={((input_autocomplete && input_suggest === undefined) || input_suggest.length === 0) ? '' : 'off'}
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

                
            </div>
        )
    }
}

export default FormControl