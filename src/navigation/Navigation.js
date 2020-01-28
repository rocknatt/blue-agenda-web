import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DOMHelper, Utils } from 'mzara-library'

import Home from '../page/home/Main'
import Calendar from '../page/calendar/Main'
import Spinner from '../component/Spinner'

class Navigation extends Component {
    state = {

    }

    lang = null
    parent = null

    ajax = null

    current_url = ''
    hub = null

    is_document_focus = null
    animation_interval = null

    render_first_list = [
        'calendar',
        'calendar/',
    ]

    left_menu_change_callback_list = []

    last_title = ''

    constructor(props){
        super(props)

        this.state = {
            page: 'patience',
        }

        this.parent = props.parent
        this.lang = props.lang

        this.is_document_focus = document.hasFocus()
        this.hub = this.parent.hub
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidMount(){
        document.addEventListener('click', this.handle_link_click)
        window.addEventListener('focus', this.handle_window_focus)
        window.addEventListener('blur', this.handle_window_blur)
        window.addEventListener('popstate', this.handle_pop_state_change)

        const action = { type: 'INIT_NAVIGATION', navigation: this }
        this.props.dispatch(action)

        //callback
        if (this.props.onNavigationMounted !== undefined) {
            this.props.onNavigationMounted(this)
        }
        
    }

    update_left_menu(menu_list){
        this.dispatch_left_menu_change_change(menu_list)
    }

//event
    add_event_listner(event_name, _function){
        if (event_name === undefined) {
            return false
        }

        switch(event_name){

            case 'left_menu_change':
                this.left_menu_change_callback_list.push(_function);
                break;
        }
    }

    remove_event_listner = (event_name, _function) => {

        if (event_name === undefined) {
            return false
        }

        var index_catched = null

        switch(event_name){

            case 'left_menu_change':
                this.left_menu_change_callback_list.map((event, index) => {
                    if (event === _function) {
                        index_catched = index
                    }
                })

                if (index_catched === null){
                    return false
                }

                this.group_user_list_change_callback_list.splice(index_catched, 1)
                break;
        }
    }

    dispatch_left_menu_change_change(param){
        this.left_menu_change_callback_list.map((event) => {
            if (typeof event === 'function') {
                event(param)
            }
        })
    }

    set_document_title(str) {
        if (str !== undefined) {
            document.title = str
        }
    }

    get_uri_param(str){
        var str_1 = str.replace(this.props.ajax.base_url, '')

        var adr = str_1.split('?')
        var query_string = adr[0]
        var get = adr[1]

        var adr = query_string.split('/')
        var adr_1 = Utils.get_clone(adr)
        adr_1.splice(0, 2)

        return {
            page: adr[0],
            method: adr[1],
            param: adr_1,
            uri: str,
            query_string: str_1,
            get: get,
        }
    }

    load(uri, callback){
        var uri_param = this.get_uri_param(uri)

        if (this.render_first_list.includes(uri_param.page) ||
            this.render_first_list.includes(uri_param.page + '/' + uri_param.method)) {
            
            this.save_history(uri)
            uri_param.remote_response = { id: uri_param.param[0] }
            this.setState(uri_param)
            return true
        }

        this.props.ajax.send_request({
            url: uri,
            type: 'GET',
            success: (response) => {

                if (response === null) {
                    return false;
                }

                if (response.redirect) {
                    this.load(response.redirect_url)
                }
                else{
                    this.save_history(uri)
                    this.set_document_title(response.title)
                    uri_param.remote_response = response
                    this.setState(uri_param)
                }

                // if (uri.includes('logout')) {
                //     this.parent.init_user()
                // }
            },
            error: (response) => {
                //Afficher une erreur hors connexion
            },
        })
    }

    save_history(uri){
        if (this.props.Config.environment === 'production') {
            window.history.pushState("", "", uri)
        }
    }

    reload(){
        window.location.reload()
    }

    handle_link_click = (e) => {
        let target = e.target
        if (target.tagName !== 'A') {
            //On recherche le parent le plus proche
            target = target.parentElement
        }

        if (target === null) {
            return false
        }

        if (target.tagName === 'A') {
            
            var uri = DOMHelper.attr(target, 'href')
            var _target = DOMHelper.attr(target, 'target')

            if (uri !== undefined && _target === undefined && !DOMHelper.hasClass(target, 'noAjax')) {
                e.preventDefault()
                this.load(uri)
            }
            
        }
    }

    handle_pop_state_change = (e) => {
        e.preventDefault()
        this.load(window.location.href)
    }

//Rip live
   
    title_animation(message) {
        this.last_title = document.title

        document.title = message

        setTimeout(() => {
            document.title = this.last_title
        }, 3000);
    }

    stop_title_animation() {
        clearInterval(this.animation_interval)
        document.title = this.last_title
    }

    begin_title_animation = (message) => {
        this.stop_title_animation();
        var str = message
        this.animation_interval = setInterval(this.title_animation, 6000, str)
    }

    show_external_notif(titre, message, icon, url, tag) {
        if (typeof Notification === undefined) {
            return false;
        }

        var options={
            "lang": "FR", 
            "icon": icon, 
            "tag": tag, 
            "body": message,
            '_url': url,
            'html': true,
        };

        /* Tester si la permission a déjà été donnée */
        if (Notification.permission=="granted") {
            this.show_notif(titre, options);
        } else {
            Notification.requestPermission((result) => {
                if (result=="granted") {
                    this.show_notif(titre, options);
                }
            });
        }
    }

    show_notif(titre, options) {
        var notif = new Notification(titre, options);

        notif.onclick = (event) => {
            event.preventDefault();
            window.open(options._url, "_blank");
        }
    }

    init_rip(){
        Utils.ajax({
            url: Utils.site_url('hub/get_user_rip'),
            type: 'GET',
            data_type: 'json',
            success: (response) => {
                if (response.ok) {
                    this.set_chat_count(response.data.chat_unread_nb)
                }
            }
        })
    }

    handle_window_focus = (e) => {
        this.is_document_focus = true
        if (this.animation_interval !== null) {
           this.stop_title_animation() 
        }
    }

    handle_window_blur = (e) => {
        this.is_document_focus = true
    }

    share(obj){
        this.parent.share_component.current.show_modal(obj)
    }

    render() {

        const { is_load, page, method, remote_response } = this.state

        switch(page){

            case 'calendar':
                return (
                    <Calendar 
                        navigation={this}
                        method={method}
                        param={remote_response}
                        lang={this.lang}
                        />
                )
                break;

            case 'home':
            case '':
                return (
                    <Home 
                        navigation={this}
                        method={method}
                        param={remote_response}
                        lang={this.lang}
                        />
                )
                break;

            default:
                return (
                    <Spinner position="center" />
                )
                break;
        }
    }
}

const mapStateToProps = (state) => {
    return {
        ajax: state.ajax,
        user: state.user,
        lang: state.lang,
        hub: state.hub,
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => { dispatch(action) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)