import React, { Component } from 'react'

import { FormControl, Dropdown, Alert, Beabcrumb, ModalForm, ProfilePictureControl, Spinner } from 'mzara-component'
import { DOMHelper } from 'mzara-library'
import { UserRole as UserRoleController } from 'mzara-controller'

import ButtonTooltip from '../../component/btn/ButtonTooltip'
import ButtonBlock from '../../component/btn/ButtonBlock'
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

        this.init_controller()
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
        this.controller = new UserRoleController({
            ajax: this.props.ajax,
            lang: this.props.lang,
            hub: this.props.hub,

            refresh_callback: (e, data) => this.refresh(e, data),
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
            label: this.props.lang.line('std_account'),
            href: this.props.ajax.site_url('account'),
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

    handle_on_delete_click = (data) => {
        this.controller.delete(data.id, 
            () => {
                this.props.navigation.load('role')
            }, 
            () => this.setState({ error_message: this.props.lang.line('std_cant_be_deleted') }) )
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
                    <div className="col-12 col-md-4 col-lg-3">
                        <div className="box box-white mb-20 account-metadata form-container">
                            {/*profil picture, metadata*/}

                            <h3><i className="fa fa-info-circle"></i> {this.props.lang.line('std_about')}</h3>

                            {
                                error_message.length > 0 &&
                                <Alert 
                                    is_dissmissable={true}
                                    alert_type="danger"
                                    text={error_message}
                                    />
                            }

                            <FormControl 
                                lang={this.props.lang}
                                input_type="hidden"
                                input_name="id"
                                input_id="id"
                                input_value={data.id}
                                onRef={ (ref, unmount) => this.get_form_ref(ref, unmount) }
                                />

                            <div className="metadata">
                                <FormControl 
                                    lang={this.props.lang}
                                    label={this.props.lang.line('std_designation')}
                                    input_type="text"
                                    input_name="designation"
                                    input_id="designation"
                                    input_value={data.designation}
                                    input_placeholder={this.props.lang.line('std_designation')}
                                    is_readonly={true}
                                    is_editable={data.is_editable}
                                    onEdited={this.handle_on_input_edited}
                                    onRef={ (ref, unmount) => this.get_form_ref(ref, unmount) }
                                    />
                            </div>

                            <div className="metadata">
                                <FormControl 
                                    lang={this.props.lang}
                                    label={this.props.lang.line('std_commentaire')}
                                    input_type="textarea"
                                    input_name="commentaire"
                                    input_id="commentaire"
                                    input_value={data.commentaire}
                                    input_placeholder={this.props.lang.line('std_commentaire')}
                                    is_readonly={true}
                                    is_editable={data.is_editable}
                                    is_autosize={true}
                                    onEdited={this.handle_on_input_edited}
                                    onRef={ (ref, unmount) => this.get_form_ref(ref, unmount) }
                                    />
                            </div>

                            {
                                data.is_deletable &&
                                <div className="metadata">
                                    <ButtonTooltip 
                                        className="btn-danger btn-block"
                                        icon_class_name="fa fa-trash"
                                        text={this.props.lang.line('std_delete')}
                                        title={this.props.lang.line('std_confirmation')}
                                        message={this.props.lang.line('std_realy_delete_role_q')}
                                        onOkClick={() => this.handle_on_delete_click(data)}
                                         />
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-12 col-md-8 col-lg-9">
                        <div className="box box-white mb-20 form-container">
                            {/* user metadata */}
                            <h3><i className="fa fa-cog"></i> {this.props.lang.line('std_param')}</h3>

                            <div className="row">
                                {
                                    data.argument_list.map((argument, index) => (

                                        <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={index}>
                                            <FormControl 
                                                lang={this.props.lang}
                                                label={this.props.lang.line(argument.label)}
                                                input_type="checkbox"
                                                input_name={argument.value}
                                                input_id={argument.value}
                                                input_option={argument.data_list}
                                                input_value={this.get_role_view_value(argument.value, data)}
                                                is_editable={data.is_editable}
                                                onChange={this.handle_checkbox_change}
                                                onRef={ (ref, unmount) => this.get_form_ref(ref, unmount) }
                                                />
                                        </div>
                                    ))
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ListItem