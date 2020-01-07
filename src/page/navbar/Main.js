import React, { Component } from 'react'
import { connect } from 'react-redux'

import Utils from '../../Utils/Utils'

import { Dropdown } from 'mzara-component'

// import NotificationPartial from '../notification/Partial'
// import ChatPartial from '../chat/widget/MenuPartial'

// import LeftSideBar from './LeftSideBar'
// import RightSideBar from './RightSideBar'

class Main extends Component {
    state = {

    }

    lang = null
    parent = null

    constructor(props){
        super(props)

        this.state = {
            home_badge: 12,
            shop_badge: 9,
            product_badge: 320,
            chat_badge: 0,
            event_badge: 4,
            notification_badge: 23,
            user: props.user,
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
                user: nextProps.user,
            };
        })
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidMount(){
        this.props.user_rip.add_event_listner(this.handle_user_rip_change)

        this.setState({ 
            chat_badge: this.props.user_rip.chat_unread_nb,
            notification_badge: this.props.user_rip.notification_unread_nb,
        })
    }

    handle_user_rip_change = ({ chat_unread_nb, notification_unread_nb }) => {
        this.setState({ 
            chat_badge: chat_unread_nb,
            notification_badge: notification_unread_nb,
        })
    }

    handle_user_change(user_identity){
        this.setState(function (prevState) {
            if (user_identity.id === null) {
                user_identity.id = 0
            }
            return {
                user: user_identity
            }
        })
    }

    handle_chat_click = (e) => {
        this.props.user_rip.reset_chat_rip()
    }

    handle_notification_click = (e) => {
        this.props.user_rip.reset_notification_rip()
    }

    handle_toggle_filter_menu = () => {
        this.setState(function (prevState) {
            return {
                is_active: !prevState.is_active,
            }
        })
    }

    set_chat_badge(value){
        this.setState({ chat_badge: value })
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

    refresh(){
        this.forceUpdate()
    }

    render() {

        const { 
            home_badge, 
            shop_badge,
            product_badge, 
            event_badge, 
            chat_badge, 
            notification_badge, 
            user,
            is_active,
        } = this.state

        return (
            <div>
                <nav className="navbar navbar-expand-sm navbar-main navbar-fixed-top">
                    <a className="navbar-brand d-none d-sm-block text-default" href={Utils.site_url('')}>
                        <img src={Utils.site_url('assets/img/logo-inv.png')} />
                    </a>

                    <div className="container">

                        <ul className="navbar-nav mr-auto d-flex d-lg-none">
                            <li className="nav-item">
                                <a className="nav-link" href="#" onClick={this.handle_toggle_filter_menu}>
                                    <i className="fa fa-bars"></i>
                                    <span className="ml-10">{ this.props.lang.line('std_menu') }</span>
                                </a>
                            </li>
                        </ul>

                        <ul className="navbar-nav mr-auto d-none d-lg-flex">
                            <li className="nav-item">
                                <a className="nav-link" href={Utils.site_url('post')}>
                                    { this.props.lang.line('std_home') }
                                    <span className="badge">{ this.get_view_badge(home_badge) }</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href={Utils.site_url('shop')}>
                                    { this.props.lang.line('std_shop') }
                                    <span className="badge">{ this.get_view_badge(shop_badge) }</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href={Utils.site_url('produit')}>
                                    { this.props.lang.line('std_product') }
                                    <span className="badge">{ this.get_view_badge(product_badge) }</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href={Utils.site_url('map')}>
                                    { this.props.lang.line('std_map') }
                                </a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href={Utils.site_url('event')}>
                                    { this.props.lang.line('std_event') }
                                    <span className="badge">{ this.get_view_badge(event_badge) }</span>
                                </a>
                            </li>
                        </ul>

                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="">
                                    <i className="fa fa-search"></i>
                                </a>
                            </li>
                            {
                                user.id !== 0 &&
                                <li className="chat-menu">
                                    <Dropdown
                                    position="top right"
                                    close_on_click={false}
                                    dropdown_btn={( 
                                        <a className="nav-link dropdown-toggle noAjax" href="#" id="navbardrop" data-toggle="dropdown" onClick={this.handle_chat_click}>
                                            <i className="fa fa-comments"></i>
                                            <span className="badge badge-float badge-danger">{ this.get_view_badge(chat_badge) }</span>
                                        </a>  
                                    )}
                                    dropdown_element={
                                        (
                                            <div className="dropdown-menu show animated fadeInUp animated-x-fast">
                                                
                                            </div>
                                        )
                                    }
                                    />
                                </li>
                            }
                            
                            {
                                user.id !== 0 &&
                                <li className="notification-menu">
                                    <Dropdown
                                        position="top right"
                                        close_on_click={false}
                                        dropdown_btn={( 
                                            <a className="nav-link dropdown-toggle noAjax" href="#" id="navbardrop" data-toggle="dropdown" onClick={this.handle_notification_click}>
                                                <i className="fa fa-bell"></i>
                                                <span className="badge badge-float badge-danger">{ this.get_view_badge(notification_badge) }</span>
                                            </a>  
                                        )}
                                        dropdown_element={
                                            (
                                                <div className="dropdown-menu show  animated fadeInUp animated-x-fast">
                                                    
                                                </div>
                                            )
                                        }
                                        />
                                </li>
                            }
                            
                            <li>
                                {
                                    user.id === 0 &&
                                    <a className="nav-link" href={Utils.site_url('user/login')}>
                                        <img className="img-rounded img-profil" src={Utils.site_url('user/image_profil/' + user.id)} />
                                        { this.props.lang.line('std_login') }
                                    </a> 
                                }
                                {
                                    user.id !== 0 &&
                                    <Dropdown
                                        position="top right"
                                        dropdown_btn={( 
                                            <a className="nav-link dropdown-toggle noAjax" href="#" id="navbardrop" data-toggle="dropdown">
                                                <img className="img-rounded img-profil" src={Utils.site_url('user/image_profil/' + user.id)} />
                                                <span className="d-none d-sm-inline">{ user.nom }</span>
                                            </a>  
                                        )}
                                        dropdown_element={
                                            (
                                                <div className="dropdown-menu show animated fadeInUp animated-x-fast">
                                                    <a className="dropdown-item" href={ Utils.site_url('user/profil/' + user.user_name) }> { this.props.lang.line('std_profil') }</a>
                                                    <a className="dropdown-item" href={ Utils.site_url('user/setting') }> { this.props.lang.line('std_setting') }</a>
                                                    <a className="dropdown-item" href={ Utils.site_url('home/term_condition') }> { this.props.lang.line('std_term_condition') }</a>
                                                    <a className="dropdown-item" href={ Utils.site_url('user/logout') }> { this.props.lang.line('std_logout') }</a>
                                                </div>
                                            )
                                        }
                                        />
                                }
                                
                            </li>
                            {
                                user.id === 0 &&
                                <li>
                                    <a className="nav-link" href={Utils.site_url('user/sign_up')}>
                                        { this.props.lang.line('std_signup') }
                                    </a> 
                                </li>
                            }
                        </ul>
                    </div>
                </nav>

                <div className={"filtre filtre-menu filtre-left " + (is_active ? 'active' : '')}>
                    
                    <div className="filtre-wapper">

                        <div className={"filtre-content "}>
                            <ul>
                                {
                                    /*<li className="logo-menu">
                                        <a className="" href={Utils.site_url('')}>
                                            <img src={Utils.site_url('assets/img/logo.png')} />
                                        </a>
                                    </li>*/
                                }
                                <li className="main-menu mb-30">
                                    <a href={Utils.site_url('user/profil/' + user.user_name)} className="">
                                        <img className="profile-picture profile-picture-lg" src={Utils.site_url('user/image_profil/' + user.id)} />
                                        <h3>{ user.nom }</h3>
                                    </a>
                                </li>
                                {
                                    menu_list.map((menu, index) => (
                                        <li key={index}>
                                            <a href={Utils.site_url(menu.href)} className={ menu.className }>
                                                <i className={"fa " + menu.icon}></i> 
                                                { this.props.lang.line(menu.lang) }
                                            </a>
                                        </li>
                                    ))
                                }
                                
                            </ul>
                        </div>
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

const menu_list = [
    { href: 'home', className: '', icon: 'fa-home', lang: 'std_home' },
    { href: 'crystal/init', className: '', icon: 'fa-gem', lang: 'std_crystal' },
]

const mapStateToProps = (state) => {
    return {
        ajax: state.ajax,
        user: state.user,
        user_rip: state.user_rip,
        lang: state.lang,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: (action) => { dispatch(action) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)