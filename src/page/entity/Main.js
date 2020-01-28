import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Spinner } from 'mzara-component'
import { UserRole as UserRoleController } from 'mzara-controller'

import Home from './Home'
import Read from './Read'

// import './css/style.css'

class Main extends Component {
    state = {

    }

    navigation = null

    constructor(props){
        super(props)

        this.state = {
            method: props.method,
            param: props.param
        }

        this.navigation = props.navigation

        this.init_controller()
    }

    componentWillReceiveProps(nextProps){
        this.setState(function(prevState, props){
            return {
                method: nextProps.method,
                param: nextProps.param
            };
        })
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidMount(){
        
    }

    init_controller(){
        this.controller = new UserRoleController({
            ajax: this.props.ajax,
            lang: this.props.lang,
            hub: this.props.hub,

            refresh_callback: (e, data) => this.refresh(e, data),
        })
    }


    load_home(){

        return (
            <Home 
                hub={this.props.hub}
                lang={this.props.lang}
                ajax={this.props.ajax}
                navigation={this.props.navigation}
                controller={this.controller}
                />
        )
    }

    load_read(id){

        return (
            <Read 
                hub={this.props.hub}
                lang={this.props.lang}
                ajax={this.props.ajax}
                navigation={this.props.navigation}
                id={id}
                is_self_trigger={true}
                controller={this.controller}
                />
        )
    }

    render_default(){
        return (
            <div className="main-container">
                <Spinner position="center" />
            </div>
        )
    }

    render() {

        const { method, param } = this.state

        if (method !== undefined) {
            return this.load_read(method)
        }else{
            return this.load_home()
        }

    }
}

const mapStateToProps = (state) => {
    return {
        ajax: state.ajax,
        lang: state.lang,
        hub: state.hub
    }
}

export default connect(mapStateToProps)(Main)