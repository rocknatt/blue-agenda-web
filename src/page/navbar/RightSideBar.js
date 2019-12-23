import React, { Component } from 'react'
import { connect } from 'react-redux'

import Utils from '../../Utils/Utils'

import SearchForm from '../../component/SearchForm'
import ProfilePictureControl from '../../component/mzara/ProfilePictureControl'
import ScrollComponent from '../../component/ScrollComponent'
import Spinner from '../../component/Spinner'
import Dropdown from '../../component/Dropdown'
import Image from '../../component/gallery/Image'

import ButtonSubscribe from '../../component/btn/ButtonSubscribe'

import ChatBubble from '../chat/Bubble'
import UserController from '../../base/controller/user/index'

class Main extends Component {
    state = {

    }

    lang = null
    parent = null
    storage_index = 'chat_group_list'

    chat_group_active = null
    chat_group_list = []

    constructor(props){
        super(props)

        this.state = {
            chat_badge: this.props.user_rip.chat_unread_nb,
            chat_group_active: null,
            is_bubble_active: false,
            is_header_active: false,
            is_getting_more: true,
            is_suggest_getting_more: true,
            is_active: false,
            search_value: '',
        }

        this.parent = props.parent
        this.props.chat_controller.add_event_listner('user_list_change', this.handle_user_list_change)
        this.props.chat_controller.add_event_listner('message_change', this.handle_message_change)

        document.addEventListener('click', this.handle_link_click)
        window.addEventListener('storage', this.handle_storage_change)

        this.chat_group_list = this.load_chat_group_list()
        this.scroll_user_list = React.createRef()
    }

    componentWillMount(){

    }

    componentWillUnmount(){
        this.props.chat_controller.remove_event_listner('user_list_change', this.handle_user_list_change)
        this.props.chat_controller.remove_event_listner('message_change', this.handle_message_change)
    }

    componentWillReceiveProps(nextProps){

    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidMount(){
        this.props.user_rip.add_event_listner(this.handle_user_rip_change)

        this.init_user_controller()
    }

    init_user_controller(){
        this.user_controller = new UserController({
            ajax: this.props.ajax,
            lang: this.props.lang,
            hub: this.props.hub,

            refresh_callback: (e, data) => this.refresh(e, data),
        })
    }

    handle_link_click = (e) => {
        let target = e.target

        if (target.tagName !== 'A' && target.tagName !== 'BUTTON') {
            //On recherche le parent le plus proche
            target = target.parentElement
        }

        if (target === null) {
            return false
        }

        if (target.tagName === 'A' || target.tagName === 'BUTTON') {
            
            if (Utils.hasClass(target, 'chat-bubble')) {
                e.preventDefault()
                
                let chat_group_id = Utils.attr(target, 'data-chat-group-id')
                let user_id = Utils.attr(target, 'data-chat-user-id')
                let shop_id = Utils.attr(target, 'data-chat-shop-id')

                if (user_id !== undefined) {
                    this.props.chat_controller.get_user_chat_group_id(user_id, (response) => {
                        this.props.chat_controller.get_message_item(response.data.id, () => this.load_chat_group(response.data.id))
                    })
                }
                else if(shop_id !== undefined){
                    this.props.chat_controller.get_shop_chat_group_id(shop_id, (response) => {
                        this.props.chat_controller.get_message_item(response.data.id, () => this.load_chat_group(response.data.id))
                    })
                }
                else{
                    this.load_chat_group(chat_group_id)
                }
            }
            
        }
    }

    handle_message_change = (chat_group_id, is_receive_new_message) => {

        if (this.chat_group_active === null || chat_group_id !== this.chat_group_active.id) {
            this.setState({ is_header_active : true })
        }

        let message_item = this.props.chat_controller.get_message_item(chat_group_id)

        if (message_item !== undefined && (message_item.shop_id === null || message_item.shop_id === undefined)) {
            this.load_chat_group(chat_group_id, true)
        }else{
            this.props.chat_controller.get_message_item(chat_group_id, (_message_item) => {

                if (_message_item.shop_id === null || _message_item.shop_id === undefined) {
                    let should_show_bubble = this.state.is_bubble_active
                    this.load_chat_group(chat_group_id, should_show_bubble)
                }
                
            })
        }
    }

    handle_user_rip_change = ({ chat_unread_nb, notification_unread_nb }) => {
        this.setState({ 
            chat_badge: chat_unread_nb,
        })
    }

    handle_user_list_change = (e) => {

        if (this.scroll_user_list.current.is_scrollable_y() || this.props.chat_controller.is_last_user_followed_list) {
            this.setState({ is_getting_more: false })
        }
        else{
            this.refresh()
        }
    }

    handle_search_input_change = (obj, new_val) => {
        this.setState(function(prevState, props){

            //Faire la recherche ici

            return {
                search_value: new_val
            };
        })
    }

    handle_bubble_header_click = (e) => {
        this.setState(function (prevState) {
            return {
                is_bubble_active: !prevState.is_bubble_active,
                is_header_active : false,
            }
        })
    }

    handle_storage_change = (e) => {

        if (e.key == this.storage_index && e.newValue != '') {
            
            this.chat_group_list = JSON.parse(e.newValue);
            this.refresh()
        }
    }

    handle_chat_item_click = (chat_group) => {
        this.chat_group_active = chat_group

        this.props.chat_controller.reset_nb_message_unread(chat_group.id, () => this.setState({ is_bubble_active: true }))
    }

    handle_user_followed_click = (user, e) => {
        this.props.chat_controller.handle_user_followed_click(user, e, (chat_group_id) => {
            this.load_chat_group(chat_group_id)
        })
    }

    handle_remove_chat_item_click = (chat_group_id) => {
        let index_catched = null

        this.chat_group_list.map((_chat_group_id, index) => {
            if (chat_group_id == _chat_group_id) {
                index_catched = index
            }
        })

        if (index_catched !== null) {
            this.chat_group_list.splice(index_catched, 1)
            this.save_chat_group_list()
            this.refresh()
        }

        if (this.chat_group_active !== null && this.chat_group_active.id == chat_group_id) {

            this.chat_group_active = null

            this.setState(function () {
                return { is_bubble_active: false }
            })
        }
    }

    handle_on_bottom_reached = (e) => {
        if (!this.props.chat_controller.is_last_user_followed_list) {
            this.setState({ is_getting_more: true })
        }
    }

    handle_menu_click = (value, chat_group, e) => {
        switch(value){
            case 'close':
                this.chat_group_active = null
                this.setState({ is_bubble_active: false })
                break;

            case 'block':
                this.props.chat_controller.submit_block_chat_group(chat_group.id, chat_group.user_interop_id)
                break;
        }
    }

    handle_user_suggest_end_reached = (obj) => {

        this.setState(function (prevState) {
            if (!this.user_controller.is_last_user_suggest && !prevState.is_suggest_getting_more) {
                return {
                    is_suggest_getting_more: true,
                }
            }
        })
    }

    handle_toggle_filter_menu = () => {
        this.setState(function (prevState) {
            return {
                is_active: !prevState.is_active,
            }
        })
    }

    get_view_badge(value){

        if (value === null || value === undefined) {
            return ''
        }

        value = parseInt(value)
        if (value <= 0) {
            return ''
        }

        if (value > 10) {
            return '+9'
        }

        return value
    }

    get_chat_group_view_list(){
        let result = []

        this.chat_group_list.map((chat_group_id) => {
            let data = this.props.chat_controller.get_message_item(chat_group_id)
            if (data !== null) {
                result.push(data)
            }
        })

        return result
    }

    load_chat_group_list(){
        var adr = localStorage.getItem(this.storage_index);

        return adr !== null && adr !== '' ? JSON.parse(adr) : [];
    }

    load_chat_group(chat_group_id, silent_load){

        let exist = false
        this.chat_group_list.map((_chat_group_id) => {
            if (chat_group_id == _chat_group_id) {
                exist = true
            }
        })

        if (!exist) {
            this.chat_group_list.push(chat_group_id)

            this.save_chat_group_list()
        }

        if (!silent_load || (silent_load && (this.chat_group_active === null || !this.state.is_bubble_active ))) {
            let chat_group = this.props.chat_controller.get_message_item(chat_group_id)
            if (chat_group !== null) {
                this.chat_group_active = chat_group
                this.setState({ is_bubble_active: true })
            }
        }

        
    }

    save_chat_group_list(){
        //Sauvegarde dans localstorage
        localStorage.setItem(this.storage_index, JSON.stringify(this.chat_group_list));
    }

    refresh(event_type, data){
        if (event_type === 'shop_subscribed_list') {

            this.setState(function (prevState) {
                return {
                    is_getting_more_shop_subscribed: false
                }
            })
        }
        if (event_type === 'user_followed_suggest') {
            this.setState({ is_suggest_getting_more: false })
        }
        else{
            this.forceUpdate()
        }
        
    }

    render() {

        const { 
            chat_badge,
            is_bubble_active,
            is_header_active,
            is_getting_more,
            is_suggest_getting_more,
            is_active,
            search_value,
        } = this.state

        const user_list = this.props.chat_controller.get_user_followed_list(is_getting_more, search_value, 5)
        
        const chat_group_list = this.get_chat_group_view_list()
        let user_suggest_list = []
        if (this.user_controller !== undefined) {
            user_suggest_list = this.user_controller.get_user_follow_suggest(is_suggest_getting_more, 3)
        }
        

        return (
            <div>
                <div className={"filtre filtre-right " + (is_active ? 'active' : '')}>

                    <button className="btn btn-black btn-opacity btn-filtre btn-filtre-right" onClick={(e) => this.handle_toggle_filter_menu(e)}>
                        <span>{this.props.lang.line('std_chat')}</span>
                        <i className="fa fa-align-right"></i>
                    </button>

                    <div className="filtre-wrapper">
                        <div className="filte-main-title">
                            <span>{ this.props.lang.line('std_chat') }</span>
                        </div>

                        <div className="filte-sub-title">
                            <span>{ this.props.lang.line('std_suggestion') }</span>
                        </div>

                        <ScrollComponent
                            className="filtre-content filtre-user-suggest-list"
                            show_button_control={true}
                            scroll_step={100}
                            onRightReached={this.handle_user_suggest_end_reached}>

                            {
                                user_suggest_list.map((user, index) => (
                                    <div 
                                        className="user-suggest-item"
                                        key={index}>
                                        <a 
                                            href={Utils.site_url('user/profil/' + user.id)}
                                            className="">
                                            
                                            <ProfilePictureControl 
                                                lang={this.props.lang}
                                                navigation={this.navigation}
                                                className="profile-picture-sm"
                                                img_url={Utils.site_url('user/image_profil/' + user.id)}
                                                is_editable={false} />

                                            { user.view_name }
                                        </a>
                                        
                                        <ButtonSubscribe 
                                            is_subscribed={user.is_followed} 
                                            title={this.props.lang.line('std_follow')} 
                                            onClick={(e) => this.user_controller.handle_btn_follow_click(user.id)} />
                                    </div>
                                ))
                            }

                            {
                                (this.state.is_getting_more && !this.props.chat_controller.is_last_user_followed_list) &&
                                <Spinner position="center" />
                            }
                        </ScrollComponent>

                        <div className="filte-sub-title">
                            <span>{ this.props.lang.line('std_people') }</span>
                        </div>

                        <ScrollComponent
                            className="filtre-content filtre-chat-user-list"
                            style={{ position: 'unset' }}
                            onBottomReached={this.handle_on_bottom_reached}
                            ref={this.scroll_user_list}>
                            <ul>
                                {
                                    user_list.map((user, index) => (
                                        <li key={index}>
                                            <a 
                                                href="#"
                                                data-chat-user-id={user.id}
                                                className="noAjax chat-bubble" 
                                                onClick={ (e) => this.handle_user_followed_click(user, e) }>
                                                
                                                <ProfilePictureControl 
                                                    lang={this.props.lang}
                                                    navigation={this.navigation}
                                                    className="profile-picture-xs"
                                                    img_url={Utils.site_url('user/image_profil/' + user.id)}
                                                    is_active={user.is_on_activity == '1'}
                                                    date_derniere_activite={user.date_derniere_activite}
                                                    is_editable={false} />

                                                { user.view_name }
                                            </a>
                                        </li>
                                    ))
                                }

                                {
                                    (this.state.is_getting_more && !this.props.chat_controller.is_last_user_followed_list) &&
                                    <Spinner position="center" />
                                }
                                
                            </ul>
                        </ScrollComponent>

                        <SearchForm
                            className="side-bar-search side-bar-search-bottom"
                            onChange={this.handle_search_input_change}
                            lang={this.props.lang}
                            />

                    </div>

                    { /* Float bubble */ }

                    <div className="float-bubble">
                        <div className="bubble-content">
                            <div className="user-discussion-list">
                                <a className="user-discussion-item animated zoomIn animate-x-fast" href={Utils.site_url('chat')} title={this.props.lang.line('std_see_all_on_messenger')} >
                                    <img src={ Utils.site_url('assets/img/icon/post_comment.png') }  />
                                    <span className="badge badge-danger">{ this.get_view_badge(chat_badge) }</span>
                                </a>

                                {
                                    chat_group_list.map((chat_group, index) => (
                                        <div key={index} className={"user-discussion-item " + ((this.chat_group_active !== null && chat_group.id === this.chat_group_active.id) ? 'active' : '')}>
                                            <a 
                                                className="animated zoomIn animate-x-fast noAjax" 
                                                href="#"
                                                onClick={(e) => this.handle_chat_item_click(chat_group)}
                                                title={ chat_group.name }>

                                                {
                                                    (chat_group.shop_id !== null && chat_group.shop_id !== undefined) ?
                                                    <Image
                                                        navigation={this.navigation}
                                                        className={"profile-picture profile-picture-xs"}
                                                        src={Utils.site_url('shop/image/'+ chat_group.shop_id + '/ths')}
                                                        />

                                                    :

                                                    <ProfilePictureControl 
                                                        lang={this.props.lang}
                                                        navigation={this.navigation}
                                                        className="profile-picture-xs"
                                                        img_url={Utils.site_url('chat/get_image_profil/' + chat_group.id)}
                                                        is_active={chat_group.is_on_activity == '1'}
                                                        is_editable={false} />
                                                }
                                                
                                                <span className="badge badge-danger">{ this.get_view_badge(chat_group.message_not_read_nb) }</span>
                                            </a>
                                            <button onClick={(e) => this.handle_remove_chat_item_click(chat_group.id)}>
                                                <i className="fa fa-times"></i>
                                            </button>
                                        </div>
                                        
                                    ))
                                }

                                

                            </div>

                            {
                                this.chat_group_active !== null &&
                                <div className={"bubble-header " + (is_header_active ? 'active animated flash' : '')}>
                                    <div onClick={this.handle_bubble_header_click}>
                                        <h1> 

                                            {
                                                (this.chat_group_active.shop_id !== null && this.chat_group_active.shop_id !== undefined) ?
                                                <Image
                                                    navigation={this.navigation}
                                                    className={"profile-picture profile-picture-xs"}
                                                    src={Utils.site_url('shop/image/'+ this.chat_group_active.shop_id + '/ths')}
                                                    />
                                                    
                                                :

                                                <ProfilePictureControl 
                                                    lang={this.props.lang}
                                                    navigation={this.navigation}
                                                    className="profile-picture-xs"
                                                    img_url={Utils.site_url('chat/get_image_profil/' + this.chat_group_active.id)}
                                                    is_active={this.chat_group_active.is_on_activity == '1'}
                                                    is_editable={false} />
                                            }

                                            { this.chat_group_active.name }
                                        </h1>
                                    </div>

                                    <Dropdown
                                        position="top right"
                                        dropdown_btn={( 
                                            <button className="dropdown-toggle noAjax" href="#">
                                                <i className="fa fa-ellipsis-v"></i>
                                            </button>  
                                        )}
                                        dropdown_element={
                                            (
                                                <div className="dropdown-menu d-block">
                                                    <a className="dropdown-item" href={Utils.site_url('user/profil/' + this.chat_group_active.user_interop_id)}> { this.props.lang.line('std_view_profil') }</a>
                                                    <a className="dropdown-item noAjax" href="#" onClick={(e) => this.handle_menu_click('unread', this.chat_group_active, e) }> { this.props.lang.line('std_mark_as_unread') }</a>
                                                    <a className="dropdown-item noAjax" href="#" onClick={(e) => this.handle_menu_click('close', this.chat_group_active, e) }> { this.props.lang.line('std_close') }</a>
                                                    <div className="dropdown-divider"></div>
                                                    <a className="dropdown-item noAjax" href="#" onClick={(e) => this.handle_menu_click('delete', this.chat_group_active, e) }> { this.props.lang.line('std_delete_conversation') }</a>
                                                    <a className="dropdown-item noAjax" href="#" onClick={(e) => this.handle_menu_click('block', this.chat_group_active, e) }> { this.props.lang.line('std_block_conversation') }</a>
                                                </div>
                                            )
                                        }
                                        />
                                </div>
                            }
                            

                            {
                                (is_bubble_active && this.chat_group_active !== null) &&
                                <div className="bubble-body">
                                    <ChatBubble 
                                        parent={this}
                                        chat_group_id={this.chat_group_active.id}
                                        navigation={this.props.navigation}
                                        is_bubble_only={true}
                                        can_say_hi={true}
                                        lang={this.props.lang}
                                        ref={ this.bubble_component }
                                        />
                                </div>
                            }

                            <div className="bubble-footer">
                                
                            </div>
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

const mapStateToProps = (state) => {
    return {
        ajax: state.ajax,
        lang: state.lang,
        user: state.user,
        chat_controller: state.chat_controller,
        navigation: state.navigation,
        user_rip: state.user_rip,
    }
}

export default connect(mapStateToProps)(Main)