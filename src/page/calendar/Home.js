import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dropdown, Modal, ModalForm } from 'mzara-component'
import { DateHelper } from 'mzara-library'

import SkyCalendar from '../../component/calendar/index'
import BookingController from '../../controller/booking'

import Read from './Read'

class Home extends Component {
    state = {

    }

    year_creation = 2019

    lang = null
    navigation = null

    constructor(props){
        super(props)

        //Todo : save date selected by user and save it inside session

        this.state = {
            // is_add_new_booking: false
        }

        this.init_controller()
        this.controller.add_event_listner('list_change', this.handle_list_change)
    }

    componentWillReceiveProps(nextProps){

    }

    componentWillMount(){

    }

    componentWillUnmount(){
        this.controller.remove_event_listner('list_change', this.handle_list_change)
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidMount(){
        
    }

    init_controller(){
        this.controller = new BookingController({
            ajax: this.props.ajax,
            lang: this.props.lang,
            hub: this.props.hub,
        })
    }

    handle_list_change = () => {
        this.refresh()
    }

    get_form(data){
        let form_data = this.controller.get_form(data)
        form_data.onSubmit = this.handle_create_form_submit
        form_data.onSubmited = () => this.dismiss_modal_form()
        form_data.onCancel = () => this.dismiss_modal_form()

        return form_data
    }

    handle_calendar_cell_menu_click = (label, data) => {
        switch(label){
            case 'new_booking':
                this.setState({ is_show_modal_form: true, data_modal_form: this.get_form({ date: data.compiled_date, hour: data.compiled_hour }) })
                break;
        }
    }

    handle_item_click = (data, e) => {
        this.setState({ is_show_item: true, item_data: data })
    }

    handle_create_form_submit = (data, success, error) => {
        this.controller.create(data, () => {
            success()
        }, error)
    }

    handle_on_delete_click = (data) => {
        this.controller.delete(data.id, 
        () => {
            //success
            this.setState({ is_show_item: false })
            // this.props.navigation.load('role')
        }, 
        () => this.setState({ error_message: this.props.lang.line('std_cant_be_deleted') }) )
    }

    dismiss_modal_form(){
        this.setState({ is_show_modal_form: false })
    }

    handle_drop = (data) => {
        this.controller.update(data, () => this.refresh())
    }

    get_cell_menu_list(){
        return [
            { icon: 'fa-plus', label: 'new_booking', text: 'New booking', lang: 'std_new_booking' },
        ]
    }

    refresh(){
        this.forceUpdate()
    }

    render() {

        const { 
            date,
            hour,
            is_show_item,
            item_data, 
            is_show_modal_form,
            data_modal_form,
        } = this.state

        const date_item_list = this.controller.get_item_list()
        
        return (
            <div className="">
                <SkyCalendar 
                    cell_menu_list={this.get_cell_menu_list()}
                    item_list={date_item_list}
                    lang={this.props.lang}
                    onItemClick={this.handle_item_click}
                    onCellMenuClick={this.handle_calendar_cell_menu_click}
                    onDrop={this.handle_drop}
                    />

                {
                    is_show_modal_form &&
                    <ModalForm
                        ajax={this.props.ajax}
                        lang={this.props.lang}
                        data={data_modal_form}
                        />
                }

                {
                    is_show_item &&
                    <Modal 
                        className=""
                        confimation_type="none"
                        is_opened_default={true}
                        is_dismissable={true}
                        onDismiss={() => this.setState({ is_show_item: false })}
                        lang={this.props.lang}>

                        <Read
                            ajax={this.props.ajax}
                            lang={this.props.lang}
                            data={item_data}
                            controller={this.controller}
                            onDelete={this.handle_on_delete_click}
                            />

                    </Modal>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ajax: state.ajax,
        lang: state.lang,
        hub: state.hub,
        navigation: state.navigation
    }
}

export default connect(mapStateToProps)(Home)