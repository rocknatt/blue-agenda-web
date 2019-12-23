import React, { Component } from 'react'

class Alert extends Component {
    state = {

    }

    constructor(props){
        super(props)

        this.state = {
            is_showed: true,
            is_dissmissable: props.is_dissmissable,
            text: props.text,
            alert_type: props.alert_type,
            dismiss_timeout: props.dismiss_timeout,
            on_dispose: props.on_dispose,
            on_disposed: props.on_disposed,
            onClick: props.onClick,
        }
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState(function(prevState, props){
            return {
                is_showed: true,
                text: nextProps.text,
                alert_type: nextProps.alert_type,
            };
        })
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidUpdate(){
        if (!this.state.is_showed) {
            if (this.state.on_disposed !== undefined) {
                this.state.on_disposed()
            }
        }
    }

    componentDidMount(){

    }

    prevent_default(){
        this.setState({ is_showed: true })
    }

    handle_btn_dispose_click = () => {
        if (this.state.on_dispose !== undefined) {
            this.state.on_dispose(this.prevent_default)
        }

        this.setState({ is_showed: false })
    }

    render() {

        const { 
            text, 
            alert_type, 
            dismiss_timeout,
            is_showed, 
            is_dissmissable,
            onClick 
        } = this.state

        return (
            <div>
                {
                    is_showed &&
                    <div className={"alert alert-dismissible alert-" + alert_type + ' ' + this.props.className} onClick={ (e) => onClick(this, e) }>
                        {
                            is_dissmissable &&
                            <button className="close" onClick={ this.handle_btn_dispose_click }><i className="fa fa-times"></i></button>
                        }
                        
                        { text }
                    </div>
                }
                {
                    !is_showed &&
                    <span></span>
                }
            </div>
        )
    }
}

export default Alert