import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Hub, Lang, DOMHelper, Ajax } from 'mzara-library'
import { Chat, UserRip } from 'mzara-controller'
import { Alert, Modal } from 'mzara-component'

import Navigation from './navigation/Navigation'
import Navbar from './page/navbar/Main'

import Spinner from './component/Spinner'

// import Login from './page/user/Login'

import Config from './config/app'
import Lang_fr from './lang/fr'

// Chargement des fichier css
import './assets/css/dropdown.css'
import './assets/css/gallery.css'
import './assets/css/style.css'


class Root extends Component {
    state = {

    }

    lang = null
    user = null
    navbar = null
    navigation = null
    hub = null

    scroll_event_list = []
    load_event_list = []

    modal_message_component = null
    main_container = null

    constructor(props){
        super(props)

        this.state = {
            lang_loaded: false,
            is_showing_alert: false,
            alert_data: {},
            is_loading: true,
            is_navigation_mounted: false,
            is_show_login: false
        }

        this.navbar = React.createRef()
        this.modal_message_component = React.createRef()
        this.main_container = React.createRef()
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidMount(){
        this.ajax = new Ajax({
            base_url: Config.base_url,
        })

        const action = { type: 'INIT_AJAX', ajax: this.ajax }
        this.props.dispatch(action)

        //init process
        this.init_lang(
            () => this.init_user(
                (user) => {
                    this.init_hub(user, 
                        () => {
                            this.init_user_rip(user)
                            // this.init_chat_controller()
                            this.handle_loading_finished()
                        }
                    )
                }
            )
        )
    }

    componentDidUpdate(){

    }

    init_lang(callback){

        this.lang = new Lang({
            ajax: this.ajax,
            url:  'lang',
            callback: (obj) => {
                // const action = { type: 'INIT_LANG', lang: obj }
                // this.props.dispatch(action)
                
                // if (callback !== undefined) {
                //     callback()
                // }
            },
        })

        //exception dev
        this.lang.set_lang(Lang_fr)
        const action = { type: 'INIT_LANG', lang: this.lang }
        this.props.dispatch(action)
        
        if (callback !== undefined) {
            callback()
        }


    }

    init_user(callback){

        // this.ajax.get_json('identity', {}, (response) => {

        //     this.user = response
        //     const action = { type: 'INIT_USER', user: response }
        //     this.props.dispatch(action)

        //     if (callback !== undefined) {
        //         callback(response)
        //     }

        //     if (this.user.id === null && Config.require_auth) {
        //         this.setState({ is_show_login: true })
        //     }
        // })

        //exception dev
        this.user = {"id":"1","user_id":"1","user_name":"superadmin","session_id":"2","session_user_id":"4","token":"CBIxhrD8k7q2peUXPLMf","is_active":"1","is_remember":"0","user_role_id":"2","user_role":"super_admin","user_role_rules":""}
        const action = { type: 'INIT_USER', user: this.user }
        this.props.dispatch(action)

        if (callback !== undefined) {
            callback(this.user)
        }
    }

    init_user_rip(user){
        let user_rip = new UserRip({ 
            hub: this.hub,
            ajax: this.ajax,
            chat_unread_nb: user.chat_unread_nb,
            notification_unread_nb: user.notification_unread_nb,
        })

        const action = { type: 'INIT_USER_RIP', user_rip: user_rip }
        this.props.dispatch(action)
    }

    init_hub(user, callback){
        var src = document.getElementById('src')
        this.hub = new Hub({ 
            user: user, 
            host: Config.websocket,
            host_boot: Config.websocket_boot,
        })

        const action = { type: 'INIT_HUB', hub: this.hub }
        this.props.dispatch(action)

        if (callback !== undefined) {
            callback()
        }
    }

    init_chat_controller(){
        this.chat_controller = new Chat({
            bubble: this,
            ajax: this.ajax,
            lang: this.lang,
            user: this.user,
            hub: this.hub,
            base_url: this.ajax.site_url('')
        })

        const action = { type: 'INIT_CHAT', chat_controller: this.chat_controller }
        this.props.dispatch(action)
    }

    handle_loading_finished = () => {
        this.setState({ is_loading: false })
    }

    handle_load = (e) => {
        this.load_event_list.map((load_event) => {
            if (typeof load_event === 'function') {
                load_event(e)
            }
        })
    }

    handle_scroll = (e) => {
        this.scroll_event_list.map((scroll_event) => {
            if (typeof scroll_event === 'function') {
                scroll_event(e)
            }
        })
    }

    handle_navigation_mounted = (navigation) => {
        this.setState(function () {
            

            this.navigation = navigation
            navigation.load(Config.url)

            return { is_navigation_mounted: true }
        })
    }

    add_load_event(func){
        this.load_event_list.push(func)
    }

    add_scroll_event(func){
        this.scroll_event_list.push(func)
    }

    remove_load_event(func){
        var index_catched = null
        this.load_event_list.map((_func, index) => {
            if (func === _func) {
                index_catched = index
            }
        })

        if (index_catched !== null) {
            this.load_event_list.splice(index_catched, 1)
        }
    }

    remove_scroll_event(func){
        var index_catched = null
        this.scroll_event_list.map((_func, index) => {
            if (func === _func) {
                index_catched = index
            }
        })

        if (index_catched !== null) {
            this.scroll_event_list.splice(index_catched, 1)
        }
    }

    set_lang_loaded(){
        this.setState({ lang_loaded: true })
    }

    is_scrollable(){
        return this.main_container.current.scrollHeight > DOMHelper.get_height(this.main_container.current)
    }

    is_scrollable_x(){
        if (DOMHelper.get_width(this.main_container.current) === 0) {
            return false
        }

        return this.main_container.current.scrollWidth > DOMHelper.get_width(this.main_container.current)
    }

    is_scrollable_y(){
        if (DOMHelper.get_height(this.main_container.current) === 0) {
            return false
        }

        return this.main_container.current.scrollHeight > DOMHelper.get_height(this.main_container.current)
    }

    scroll_to_top(){
        this.main_container.current.scrollTop = 0
    }

    open_modal_message(message, callback){
        
        this.modal_message_component.current.set_simple_message(message)

        if (callback === undefined) {
            callback = {}
        }

        if (callback.onOk !== undefined) {
            this.modal_message_component.current.set_ok_callback(callback.onOk)
        }

        if (callback.onCancel !== undefined) {
            this.modal_message_component.current.set_cancel_callback(callback.onCancel)
        }

        if (callback.onDissmiss !== undefined) {
            this.modal_message_component.current.set_dissmiss_callback(callback.onDissmiss)
        }

        this.modal_message_component.current.open()
    }

    //Message
    show_message({text, type, duration, is_dissmissable, onClick}){
        if (type === undefined) {
            type = 'default'
        }
        if (duration === undefined) {
            duration = 5000
        }
        if (is_dissmissable === undefined) {
            is_dissmissable = true
        }

        this.setState({
            is_showing_alert: true,
            alert_data: { text, type, is_dissmissable, duration, onClick }
        })

        setTimeout(() => {
            this.setState({is_showing_alert: false})
        }, duration + 1000)
    }

    load_login(message){
        this.setState({ is_show_login: true, login_message: message })
    }

    handle_login_submited = () => {
        // this.init_user(() => {
        //     this.setState({ is_show_login: false, login_message: '' })
        // })

        this.navigation.reload()
    }

    render() {

        const { 
            is_loading, 
            lang_loaded, 
            is_showing_alert,
            is_navigation_mounted,
            is_show_login,
            login_message,
            alert_data
        } = this.state

        if (is_loading) {
            return (
            <div 
                className="main-container">

                <Spinner position="center" />

            </div>
                )
        }

        return (
            <div 
                className="main-container" 
                ref={this.main_container}
                onLoad={ this.handle_load }
                onScroll={ this.handle_scroll }>

                {
                    is_navigation_mounted &&
                    <Navbar 
                        parent={this}
                        ref={this.navbar}
                        lang={this.props.lang} 
                        />
                }
                
                
                <Navigation 
                    parent={this}
                    lang={this.lang}
                    ajax={this.ajax}
                    user={this.user}
                    Config={Config}
                    onNavigationMounted={this.handle_navigation_mounted} />

                {
                    is_showing_alert &&
                    <Alert 
                        alert_type={ alert_data.type + " fixed top center rounded faInDown animated" }
                        text={ alert_data.text }
                        dismiss_timeout={ 5000 }
                        is_dissmissable={ alert_data.is_dissmissable }
                        onClick={ alert_data.onClick }
                        />
                }

                {
                    /*is_show_login &&
                    <Modal 
                        className="modal-md"
                        confimation_type="none"
                        is_opened_default={true}
                        is_dismissable={!Config.require_auth}
                        onDismiss={() => this.setState({ is_show_login: false })}
                        lang={this.props.lang}>

                        <Login 
                            ajax={this.ajax}
                            lang={this.lang}
                            onSubmited={this.handle_login_submited}
                            />

                    </Modal>*/
                }

                <Modal 
                    title=""
                    confimation_type="ok_cancel"
                    ref={this.modal_message_component} />
                
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ajax: state.ajax,
        user: state.user,
        lang: state.lang,
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)