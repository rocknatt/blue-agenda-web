import React, { Component } from 'react'

import Utils from '../../Utils/Utils'

import Spinner from '../../component/Spinner'
import ButtonSpinner from '../../component/btn/ButtonSpinner'
import Alert from '../../component/Alert'
import FormControl from '../../component/FormControl'

class _Home extends Component {
    state = {

    }

    lang = null
    navigation = null

    constructor(props){

        super(props)

        this.state = {
            is_load: false,
        }

        this.lang = props.lang
        this.navigation = props.navigation
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidMount(){
        //Todo : faire les recherches d'évaluation ici d'abord
        this.setState({ is_load: true })
    }




    render() {

        const { is_load, is_submiting, login_err } = this.state

        return (
            <div className="form-container form-container-float">

                {
                    !is_load &&
                    <Spinner position="center" />
                }
                {
                    is_load &&
                    <div>
                        <h1>{ this.lang.line('clt_welcome_to_mzara') }</h1>

                        <div className="navbar navbar-expand navbar-user-profil">
                            <ul className="navbar-nav mr-auto">
                                <li className={"nav-item"}>
                                    <a className="nav-link" href={ Utils.site_url('user/list') }>
                                        { this.lang.line('std_user_list') }
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default _Home