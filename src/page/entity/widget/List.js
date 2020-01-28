import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Paragraph, Modal, ScrollComponent, Dropdown, Spinner } from 'mzara-component'
import { UserRole as UserRoleController } from 'mzara-controller'

import ButtonMore from '../../../component/btn/ButtonMore'

import ListItem from './ListItem'

class List extends Component {
    state = {

    }
    description_limit_string = 500
    scroll_tolerence = 300

    controller = null

    constructor(props){
        super(props)

        this.state = {
            is_load: false,
            key: props.key === undefined ? '' : props.key,
            order_by: props.order_by,
            sort: props.sort,
            layout: props.layout,
            is_getting_more: true,
            is_show_btn_more: props.is_show_btn_more,
        }

        this.form_list = []

        if (props.controller !== undefined) {
            this.controller = props.controller
        }
        else{
            this.init_controller()    
        }

        this.scroll_component = React.createRef()
    }

    componentWillMount(){

    }

    componentWillUnmount(){
        this.controller.remove_event_listner('list_change', this.handle_list_updated)
    }

    componentWillReceiveProps(nextProps){
        this.setState(function (prevState) {

            this.controller.clear_list()
            return {
                key: nextProps.key === undefined ? '' : nextProps.key,
                order_by: nextProps.order_by,
                sort: nextProps.sort,
                layout: nextProps.layout,
                is_getting_more: true,
                is_show_btn_more: nextProps.is_show_btn_more
            }
        })
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidUpdate(){

    }

    componentDidMount(){
        this.controller.add_event_listner('list_change', this.handle_list_updated)
    }

    init_controller(){
        this.controller = new UserRoleController({
            ajax: this.props.ajax,
            lang: this.props.lang,
            hub: this.props.hub,

            refresh_callback: (e, data) => this.refresh(e, data),
        })
    }

    handle_bottom_reached = () => {
        this.setState(function (prevState) {
            if (!this.controller.is_last && !prevState.is_getting_more) {
                return {
                    is_getting_more: true,
                }
            }
            
        })
    }

    handle_list_item_click = (tag_link) => {
        // this.navigation.load(Utils.site_url('prospect/fiche/'+ tag_link))
    }

    handle_list_updated = () => {

        if (!this.controller.is_last && !this.scroll_component.current.is_scrollable_y()) {
            return this.forceUpdate()
        }

        this.setState(function (prevState) {
            return {
                is_getting_more: false
            }
        })
    }

    refresh(event_type, data){
        if (event_type === 'list') {

            
        }
        else{
            this.forceUpdate()
        }
    }

    render() {

        const { 
            is_load,
            key,
            order_by,
            sort,
            layout,
            is_getting_more,
            is_show_btn_more,
        } = this.state

        const data_list = this.controller.get_list({
            key,
            order_by,
            sort,
        }, is_getting_more)

        return (
            <ScrollComponent
                className={"fiche-list " + (layout === 'mosaic' ? ' mosaic' : '') + ' ' + this.props.className}
                show_button_control={this.props.show_button_control}
                scroll_step={this.props.scroll_step}
                is_main_scroll={!is_show_btn_more}
                navigation={this.props.navigation}
                ref={this.scroll_component}>
                
                {
                    data_list.map((data) => (
                        data.id != 2 &&
                        <ListItem
                            key={data.id}
                            data={data}
                            lang={this.props.lang}
                            ajax={this.props.ajax}
                            onClick={this.props.onItemClick}
                            />
                    ))
                }

                {
                    is_show_btn_more &&
                    <ButtonMore
                        text={this.props.lang.line('std_more')}
                        is_submiting={is_getting_more}
                        />
                }

                {
                    (this.controller.is_last) &&
                    <div className="post-placeholder">
                        <h4 className="text-gray">{ this.props.lang.line('std_no_more') }</h4>
                    </div>
                }
                
                {
                    (this.state.is_getting_more && !this.controller.is_last) &&
                    <Spinner position="center" />
                }
            </ScrollComponent>
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

export default connect(mapStateToProps)(List)