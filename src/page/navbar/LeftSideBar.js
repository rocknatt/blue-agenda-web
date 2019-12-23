import React, { Component } from 'react'
import { connect } from 'react-redux'

import Utils from '../../Utils/Utils'

class Main extends Component {
    state = {

    }

    lang = null
    parent = null

    shop_owned_list = []
    shop_list = []

    current_menu_list = []

    constructor(props){
        super(props)

        this.state = {
            main_title: props.main_title,
            menu_list: props.menu_list,
            is_active: false,
        }

        this.parent = props.parent
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){

        this.setState(function(prevState, props){

            return {
                main_title: nextProps.main_title,
            };
        })
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidMount(){
        this.init_navigation_handler()
    }

    init_navigation_handler(){
        //handle_menu_change
        this.props.navigation.add_event_listner('left_menu_change', this.handle_menu_change)
    }

    handle_menu_change = (next_menu, e) => {
        this.current_menu_list = next_menu
        this.refresh()
    }

    handle_toggle_filter_menu = () => {
        this.setState(function (prevState) {
            return {
                is_active: !prevState.is_active,
            }
        })
    }

    get_view_badge(value){
        value = parseInt(value)
        if (value <= 0) {
            return ''
        }

        if (value > 10) {
            return '+9'
        }

        return value
    }

    refresh(event_type, data){
        if (event_type === 'shop_subscribed_list') {

            this.setState(function (prevState) {
                return {
                    is_getting_more_shop_subscribed: false
                }
            })
        }
        else{
            this.forceUpdate()
        }
        
    }

    render() {

        const { 
            main_title,
            is_active,
        } = this.state

        return (
            <div>
                <div className={"filtre filtre-left " + (is_active ? 'active' : '')}>

                    <button className="btn btn-black btn-opacity btn-filtre btn-filtre-left" onClick={(e) => this.handle_toggle_filter_menu(e)}>
                        <i className="fa fa-align-left"></i>
                        <span>{this.props.lang.line('std_filter')}</span>
                    </button>
                    
                    <div className="filtre-wapper">
                        <div className="filte-main-title">
                            <span>{ main_title }</span>
                        </div>

                        {
                            this.current_menu_list.map((menu, index) => (
                                <div key={index}>
                                    <div className="filte-sub-title">
                                        <span>{ this.props.lang.line(menu.title) }</span>
                                    </div>

                                    {
                                        menu.type === 'button' &&
                                        <div className={"filtre-content " + menu.className}>
                                            <ul>
                                                <li>
                                                    <a href="#" className={ menu.btn_class } onClick={menu.onClick}>
                                                        <i className={ 'fa ' + menu.btn_icon }></i> 
                                                        { this.props.lang.line(menu.btn_lang) }
                                                        { menu.btn_label }
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    }

                                    {
                                        menu.type === 'list' &&
                                        <div className={"filtre-content " + menu.className}>
                                            <ul>
                                                {
                                                    menu.menu_list.map((_menu, index) => (
                                                        <li key={index} className={_menu.className}>
                                                            <a href={Utils.site_url(_menu.href)} onClick={_menu.onClick}>
                                                                <i className={"fa " + _menu.icon}></i> 
                                                                { this.props.lang.line(_menu.lang) }
                                                                { _menu.label }
                                                            </a>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    }

                                    {
                                        menu.type === 'shop_subscribed' &&
                                        <ShopSubscribed
                                            ajax={this.props.ajax}
                                            lang={this.props.lang}
                                            hub={this.props.hub}
                                            navigation={this.props.navigation}
                                            />
                                    }

                                    
                                </div>
                            ))
                        }
                    </div>
                </div>

                {
                    is_active &&
                    <div 
                        className="filtre-mask"
                        onClick={(e) => this.handle_toggle_filter_menu(e)}></div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ajax: state.ajax,
        user: state.user,
        hub: state.hub,
        user_rip: state.user_rip,
        lang: state.lang,
        navigation: state.navigation
    }
}

export default connect(mapStateToProps)(Main)