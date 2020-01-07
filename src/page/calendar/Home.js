import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dropdown, Modal } from 'mzara-component'
import { DateHelper } from 'mzara-library'

import SkyCalendar from '../../component/calendar/index'

import BookingCreateForm from './widget/BookingCreateForm'

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
            is_add_new_booking: false
        }
    }

    componentWillReceiveProps(nextProps){

    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidMount(){
        
    }

    handle_calendar_cell_menu_click = (label, data) => {
        switch(label){
            case 'new_booking':

                this.setState({ is_add_new_booking: true, date: data.compiled_date, hour: data.compiled_hour })
                break;
        }
    }

    get_cell_menu_list(){
        return [
            { icon: 'fa-plus', label: 'new_booking', text: 'New booking', lang: 'std_new_booking' },
        ]
    }

    render() {

        const { 
            date,
            hour,
            is_add_new_booking, 
        } = this.state

        const date_item_list = [
            { title: 'New booking 1', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod', date: '2020/01/08', hour_begin: '09:30', hour_end: '10:15' },
            { title: 'New booking 2', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod', date: '2020/01/10', hour_begin: '09:30', hour_end: '10:15' },
            { title: 'New booking 3', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod', date: '2020/01/13', hour_begin: '09:30', hour_end: '10:15' },
            { title: 'New booking 4', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod', date: '2020/01/13', hour_begin: '09:30', hour_end: '10:15' },
        ]
        
        return (
            <div className="">
                <SkyCalendar 
                    cell_menu_list={this.get_cell_menu_list()}
                    item_list={date_item_list}
                    lang={this.props.lang}
                    onCellMenuClick={this.handle_calendar_cell_menu_click}
                    />

                {
                    is_add_new_booking &&
                    <Modal 
                        className=""
                        confimation_type="none"
                        is_opened_default={true}
                        is_dismissable={true}
                        onDismiss={() => this.setState({ is_add_new_booking: false })}
                        lang={this.props.lang}>

                        <BookingCreateForm
                            lang={this.props.lang}
                            date={date}
                            hour={hour}
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