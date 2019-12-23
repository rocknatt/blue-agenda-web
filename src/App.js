import React, { Component } from 'react'

import Root from './Root'

import {Provider} from 'react-redux'
import store from './store/ConfigureStore'

class App extends Component {
    state = {

    }

    constructor(props){
        super(props)

        this.state = {

        }

    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillUpdate(nextProps, nextState){

    }

    render() {

        const { is_loading, lang_loaded, is_showing_alert, alert_data } = this.state

        return (
            <Provider store={store}>
                <Root />
            </Provider>
        )
    }
}

export default App