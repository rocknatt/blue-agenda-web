import React, { Component } from 'react'

import Utils from '../Utils/Utils'
import { connect } from 'react-redux'

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
        'calendar/',
    ]

    love_event_list = []
    image_cached_list = []
    request_cache_list = []

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

        const action = { type: 'INIT_NAVIGATION', navigation: this }
        this.props.dispatch(action)

        var src = document.getElementById('src')
        var default_url = Utils.attr(src, 'sp-current-url')

        this.load(default_url)

        document.addEventListener('click', this.handle_link_click)
        window.addEventListener('focus', this.handle_window_focus)
        window.addEventListener('blur', this.handle_window_blur)

        //callback
        if (this.props.onNavigationMounted !== undefined) {
            this.props.onNavigationMounted()
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
        var str_1 = str.replace(Utils.base_url(), '')

        var adr = str_1.split('?')
        var query_string = adr[0]
        var get = adr[1]

        var adr = query_string.split('/')
        var adr_1 = Utils.get_clone(adr)
        adr_1.splice(0, 2)

        return {
            page: adr[0] === undefined ? '' : adr[0],
            method: adr[1] === undefined ? '' : adr[1],
            param: adr_1,
            uri: str,
            query_string: str_1,
            get: get,
        }
    }

    get_user_identity(){
        return this.parent.user.get_user_identity()
    }

    load(uri){
        var uri_param = this.get_uri_param(uri)
        
        if (this.render_first_list.includes(uri_param.page + '/' + uri_param.method)) {
            uri_param.remote_response = { id: uri_param.param[0] }
            this.setState(uri_param)
            return true
        }

        this.props.ajax.send_request({
            url: uri,
            type: 'GET',
            success: (response) => {
                if (response.redirect) {
                    this.load(response.redirect_url)
                }
                else{
                    this.set_document_title(response.title)
                    uri_param.remote_response = response
                    this.setState(uri_param)
                }

                if (uri.includes('logout')) {
                    this.parent.init_user()
                }
            },
            error: (response) => {
                //Afficher une erreur hors connexion
            }
        })
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
            
            var uri = Utils.attr(target, 'href')
            var _target = Utils.attr(target, 'target')

            if (uri !== undefined && _target === undefined && !Utils.hasClass(target, 'noAjax')) {
                e.preventDefault()
                this.load(uri)
            }
            
        }
    }

//Rip live
    set_chat_count(str) {
        if (str.length == 0 || str === ' ' ) {
            this.parent.navbar.current.set_chat_badge(0)
        }else{
            this.parent.navbar.current.set_chat_badge(str)
        }
    }

    reset_chat_count() {
        this.set_chat_count('')

        Utils.ajax({
            url: Utils.site_url('hub/reset_chat_rip'),
            type: 'GET',
            data_type: 'json',
            success: (response) => {
                if (response.ok) {

                }
            }
        })
    }
   
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