import React, { Component } from 'react'

import Utils from '../../Utils/Utils'

import Spinner from '../../component/Spinner'

import Dropdown from '../Dropdown'

class EmojiContainer extends Component {
    state = {

    }

    lang = null

    input_file = null

    emoji_list = []

    constructor(props){
        super(props)

        this.state = {
            is_loading_emoji: true,
            emoji_item: 'emoticone',
            className: props.className,
            style: props.style,
            onEmojiClick: props.onEmojiClick,
        }

        this.input_file =  React.createRef()

        this.lang = props.lang
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState(function(prevState, props){
            return {
                className: nextProps.className,
                style: nextProps.style,
            }
        })
    }

    componentWillUpdate(nextProps, nextState){
        
    }

    componentDidUpdate(){

    }

    componentDidMount(){

    }

    get_emoji_database(){
        Utils.ajax({
            url: Utils.site_url('chat/get_emoji_database'),
            type: 'GET',
            data_type: 'json',
            success: (response) => {
                if (response.ok) {
                    this.get_view_emoji_list(response.data_list)
                    this.setState({ is_loading_emoji: false })
                }
            },
            error: (response) => {
                //Afficher une erreur hors connexion
            }
        })
    }

    get_view_emoji_list(emoji_list){

        for(let emoji_item in emoji_list){
            this.emoji_list[emoji_item] = []
            for(let prop in emoji_list[emoji_item]){
                this.emoji_list[emoji_item].push( { prop: prop, value: emoji_list[emoji_item][prop] } ) 
            }
        }
    }

    handle_modal_on_show = () =>{
        if (this.emoji_list.length === 0) {
            this.get_emoji_database()
        }
    }

    render() {

        const { 
            className,
            is_loading_emoji,
            emoji_item,
            style,
            onEmojiClick,
        } = this.state

        let view_emoji_list = []

        if (this.emoji_list[emoji_item] !== undefined) {
            view_emoji_list = this.emoji_list[emoji_item]
        }

        return (
            <Dropdown
                    position="top left dropup btn-emoji"
                    close_on_click={false}
                    onShow={this.handle_modal_on_show}
                    dropdown_btn={( 
                        <button className="btn" type="button" title={ this.lang.line('std_emoji_list') }>
                            <i className="fa fa-smile"></i> 
                        </button> 
                    )}
                    dropdown_element={
                        (
                            <div className="emoji-container">
                                <nav className="nav">
                                    <a className={ "nav-link " + ( emoji_item === 'emoticone' ? 'active' : '' ) } href="#" onClick={ () => { this.setState({ emoji_item: 'emoticone' }) } }>😃</a>
                                    <a className={ "nav-link " + ( emoji_item === 'hand' ? 'active' : '' ) } href="#" onClick={ () => { this.setState({ emoji_item: 'hand' }) } }>✊</a>
                                    <a className={ "nav-link " + ( emoji_item === 'other' ? 'active' : '' ) } href="#" onClick={ () => { this.setState({ emoji_item: 'other' }) } }>💣</a>
                                </nav>

                                <div className="emoji-list">
                                    
                                    {
                                        is_loading_emoji &&
                                        <Spinner position="center" />
                                    }

                                    {
                                        !is_loading_emoji &&
                                        view_emoji_list.map((emoji, index) => (
                                            <button key={index} type="button" className="emoji-item " onClick={ (e) => onEmojiClick(emoji, e) } dangerouslySetInnerHTML={{ __html: emoji.value }}></button>
                                        ))
                                    }
                                </div>
                                <div className="placement-indicator"></div>
                            </div>
                        )
                    }
                    /> 
        )
    }
}

export default EmojiContainer