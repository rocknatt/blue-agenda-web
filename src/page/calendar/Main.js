import React, { Component } from 'react'

import Spinner from '../../component/Spinner'

import Home from './Home'

class Main extends Component {
    state = {

    }

    lang = null
    navigation = null

    constructor(props){
        super(props)

        this.state = {
            method: props.method,
            param: props.param
        }
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


    load_home(){

        return (
            <Home />
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

        switch(method){

            default:
                return this.load_home()
                break;
        }

        
    }
}

export default Main