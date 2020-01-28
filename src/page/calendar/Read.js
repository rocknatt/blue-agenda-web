import React, { Component } from 'react'

import { FormControl, Dropdown, Alert, Beabcrumb, ModalForm, ProfilePictureControl, Spinner } from 'mzara-component'
import { DOMHelper } from 'mzara-library'
// import { UserRole as UserRoleController } from 'mzara-controller'

import BookingController from '../../controller/booking'
import ButtonTooltip from '../../component/btn/ButtonTooltip'
import ButtonEdit from '../../component/btn/ButtonEdit'

class ListItem extends Component {
    state = {

    }

    form_list = []

    constructor(props){
        super(props)

        this.state = {
            is_load: !props.is_self_trigger,
            id: props.id,
            data: props.data,
            is_self_trigger: props.is_self_trigger,
            is_show_modal_form: false,
            error_message: ''
        }

        if (props.controller !== undefined) {
            this.controller = props.controller
        }else{
            this.init_controller()
        }
        
    }

    componentWillMount(){

    }

    componentWillUnmount(){
        this.controller.remove_event_listner('data_change', this.handle_data_change)
    }

    componentWillReceiveProps(nextProps){
        this.init_controller()
        this.setState({ data: nextProps.data, layout: nextProps.layout })

    }

    componentWillUpdate(nextProps, nextState){
        
    }

    componentDidUpdate(){

    }

    componentDidMount(){

    }

    init_controller(){
        this.controller = new BookingController({
            ajax: this.props.ajax,
            lang: this.props.lang,
            hub: this.props.hub,
        })

        this.controller.add_event_listner('data_change', this.handle_data_change)
    }

    get_form_ref(ref, unmount){
        if (unmount) {
            var form_index = null
            this.form_list.map((data, index) => {
                if (ref.state.input_name === data.state.input_name) {
                    form_index = index
                }
            })
            
            if (form_index !== null) {
                this.form_list.splice(form_index, 1)
            }
            
        }else{
           this.form_list.push(ref) 
        }
        
    }

    get_beabcrumb_data(data){
        let result = []

        //Home
        result.push({
            label: this.props.lang.line('std_home'),
            href: this.props.ajax.site_url(''),
        })

        //Account
        result.push({
            label: this.props.lang.line('std_booking'),
            href: this.props.ajax.site_url('booking'),
        })

        if (data !== undefined) {
            //Nom actuelle
            result.push({
                label: data.designation,
            })
        }

        return result
    }

    get_role_view_value(value, data){
        if (data.rules === null) {
            return []
        }
        return data.rules[value]
    }

    handle_data_change = (data) => {
        if (this.state.is_self_trigger) {
            this.setState({ is_load: true })
        }else{
            this.setState({ data: data })
        }
        
    }

    checkbox_change_timeout
    handle_checkbox_change = () => {
        clearTimeout(this.checkbox_change_timeout)

        this.checkbox_change_timeout = setTimeout(() => {
            this.handle_on_input_edited()
        }, 750)
    }

    handle_on_input_edited = (e) => {
        // e.preventDefault()
        if (!this.state.is_submiting) {
            var form_serialized = FormControl.serialize_form(this.form_list)
            
            if (form_serialized.should_submit) {

                this.controller.update(form_serialized.result, () => { }, (error_message) => this.setState({ error_message: error_message }) )
                
            }
        }
    }

    refresh(){
        this.forceUpdate()
    }

    render() {

        const { 
            is_load,
            is_self_trigger,
            is_show_modal_form,
            data_modal_form,
            error_message,
        } = this.state

        let data = this.state.data

        if (is_self_trigger) {
            data = this.controller.read(this.state.id)
        }

        if (!is_load) {
            return (
                <div className="">
                    <Spinner position="center" />
                </div>
            )
        }

        const form = this.controller.get_form(data)

        return(

            <div className="account-profil">

                <div className="row">
                    <div className="col-12">
                        <div className="page-header">
                            <Beabcrumb
                                data_list={this.get_beabcrumb_data(data)}
                                />
                        </div>
                    </div>
                </div>

                <div className="row mt-30">
                    <div className="col-12">
                        <div className=" form-container">

                            <h3><i className="fa fa-info-circle"></i> {this.props.lang.line('std_about')}</h3>

                            {
                                error_message.length > 0 &&
                                <Alert 
                                    is_dissmissable={true}
                                    alert_type="danger"
                                    text={error_message}
                                    />
                            }

                            {
                                form.data_list.map((data, index) => (

                                    <div key={index} className="metadata">
                                        <FormControl 
                                            lang={this.props.lang}
                                            label={data.label}
                                            input_type={data.type}
                                            input_name={data.name}
                                            input_id={data.id}
                                            input_placeholder={data.placeholder}
                                            input_option={data.option}
                                            input_value={data.value}
                                            min_year={data.min_year}
                                            input_min_year_value={data.input_min_year_value}
                                            input_max_year_value={data.input_max_year_value}
                                            year_length={data.year_length}
                                            is_required={data.is_required}
                                            is_readonly={true}
                                            onEdited={this.handle_on_input_edited}
                                            required_err={data.required_err}
                                            can_add_partial={data.can_add_partial}
                                            onButtonAddClick={() => this.handle_btn_add_partial_click(data)}
                                            onRef={ (ref, unmount) => this.get_form_ref(ref, unmount) }
                                            />
                                    </div>

                                ))
                            }

                            {
                                data.is_deletable &&
                                <div className="metadata">
                                    <ButtonTooltip 
                                        className="btn-danger btn-block"
                                        icon_class_name="fa fa-trash"
                                        text={this.props.lang.line('std_delete')}
                                        title={this.props.lang.line('std_confirmation')}
                                        message={this.props.lang.line('std_realy_delete_booking_q')}
                                        onOkClick={() => this.props.onDelete(data)}
                                         />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListItem