import React, { Component } from 'react'

import Utils from '../Utils/Utils'

class ScrollComponent extends Component {
    state = {

    }

    lang = null
    navigation = null
    main_container = null

    form_list = []
    
    constructor(props){
        super(props)

        this.state = {
            max_width: props.max_width === undefined ? 'unset' : props.max_width,
            max_height: props.max_height === undefined ? 'unset' : props.max_height,
            is_main_scroll: props.is_main_scroll,
            show_button_control: props.show_button_control,
            scroll_step: props.scroll_step === undefined ? 30 : props.scroll_step,
            onBottomReached: props.onBottomReached,
            onTopReached: props.onTopReached,
            onLeftReached: props.onLeftReached,
            onRightReached: props.onRightReached,
            onLoad: props.onLoad,
            scroll_tolerence: props.scroll_tolerence === undefined ? 0 : props.scroll_tolerence,
            className: props.className,
        }

        this.navigation = props.navigation

        this.main_container = React.createRef()
    }

    componentWillMount(){

    }

    componentWillUnmount(){
        if (this.state.is_main_scroll) {
            this.navigation.parent.remove_scroll_event(this.handle_main_container_scroll)
            this.navigation.parent.remove_load_event(this.handle_onload)
        }
    }

    componentWillReceiveProps(nextProps){

    }

    componentWillUpdate(nextProps, nextState){
        
    }

    main_container_load_timeout
    componentDidUpdate(){
        // clearTimeout(this.main_container_load_timeout)

        // this.main_container_load_timeout = setTimeout(() => {
        //     if (this.state.onLoad !== undefined) {
        //         this.state.onLoad(this)
        //     }
        // }, 100)
    }

    componentDidMount(){
        if (this.state.is_main_scroll) {
            this.navigation.parent.add_scroll_event(this.handle_main_container_scroll)
            this.navigation.parent.add_load_event(this.handle_onload)
        }
    }

    is_scrollable(){
        if (this.state.is_main_scroll) {
            return this.navigation.parent.is_scrollable()
        }

        if (this.main_container.current === null) {
            return false
        }
        if (Utils.get_height(this.main_container.current) === 0 || Utils.get_width(this.main_container.current) === 0) {
            return false
        }

        return this.main_container.current.scrollHeight > Utils.get_height(this.main_container.current) || 
            this.main_container.current.scrollWidth > Utils.get_width(this.main_container.current)
    }

    is_scrollable_x(){
        if (this.state.is_main_scroll) {
            return this.navigation.parent.is_scrollable_x()
        }

        if (this.main_container.current === null) {
            return false
        }

        if (Utils.get_width(this.main_container.current) === 0) {
            return false
        }

        return this.main_container.current.scrollWidth > Utils.get_width(this.main_container.current)
    }

    is_scrollable_y(){
        if (this.state.is_main_scroll) {
            return this.navigation.parent.is_scrollable_y()
        }

        if (this.main_container.current === null) {
            return false
        }
        
        if (Utils.get_height(this.main_container.current) === 0) {
            return false
        }

        return this.main_container.current.scrollHeight > Utils.get_height(this.main_container.current)
    }

    handle_onload = () => {
        if (this.state.onLoad !== undefined) {
            this.state.onLoad(this)
        }
    }

    handle_main_container_scroll = (e) => {
        

        if (e.target.scrollTop  < 0 + this.state.scroll_tolerence) {
            if (this.state.onTopReached !== undefined) {
                this.state.onTopReached(e)
            }
        }

        if (e.target.scrollLeft  < 0 + this.state.scroll_tolerence) {
            if (this.state.onLeftReached !== undefined) {
                this.state.onLeftReached(e)
            }
        }

        if (e.target.scrollTop !== 0 && e.target.scrollTop + (e.target.offsetHeight) >= e.target.scrollHeight - this.state.scroll_tolerence) {
            if (this.state.onBottomReached !== undefined) {
                this.state.onBottomReached(e)
            }
        }

        if (e.target.scrollLeft !== 0 && e.target.scrollLeft + (e.target.offsetWidth) >= e.target.scrollWidth - this.state.scroll_tolerence) {
            if (this.state.onRightReached !== undefined) {
                this.state.onRightReached(e)
            }
        }
    }

    
    handle_main_container_load = (e) => {
        

    }

    handle_btn_right_click = () => {
        this.main_container.current.scrollLeft += this.state.scroll_step
    }

    handle_btn_left_click = () => {
        this.main_container.current.scrollLeft -= this.state.scroll_step
    }

    refresh(){
        this.forceUpdate()
    }

    render() {

        const { 
            className,
            max_height,
            max_width,
            show_button_control,
        } = this.state

        if (this.state.is_main_scroll) {
            return (
                <div className={className}>
                    { this.props.children }
                </div>
            )
        }

        return (
            <div className={'scroll-component '} style={this.props.style}>
                <div 
                    className={className}
                    style={{ maxHeight: max_height, maxWidth: max_width, overflow: 'auto' }}
                    onScroll={ this.handle_main_container_scroll }
                    onLoad={this.handle_onload}
                    ref={this.main_container}>

                    

                    { this.props.children }
                </div>
                {
                    show_button_control &&
                    <button className="btn btn-black btn-black-opacity btn-cmd-left" onClick={this.handle_btn_left_click}><i className="fa fa-chevron-left"></i></button>
                }

                {
                    show_button_control &&
                    <button className="btn btn-black btn-black-opacity btn-cmd-right" onClick={this.handle_btn_right_click}><i className="fa fa-chevron-right"></i></button>
                }
            </div>
        )
    }
}

export default ScrollComponent