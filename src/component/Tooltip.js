import React, { Component } from 'react'

class Notify extends Component {
    state = {

    }

    constructor(props){
        super(props)

        this.state = {
            is_showed: false,
            is_dissmissable: props.is_dissmissable,
            auto_hide: props.auto_hide,
            text: props.text,
            position: this.get_default_position(props.position),
            tooltip_type: 'primary',
            on_dispose: props.on_dispose,
            on_disposed: props.on_disposed,
        }
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState(function(prevState, props){
            return {
                is_dissmissable: props.is_dissmissable,
                auto_hide: props.auto_hide,
                text: props.text,
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

    get_default_position(str){
        if (str === undefined) {
            return 'top'
        }
        return str
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

    show(){
        this.setState({ is_showed: true })
    }

    dismiss(){
        this.setState({ is_showed: false })
    }

    dismiss_timeout;
    handle_mouse_over = () => {
        this.show()

        clearTimeout(this.dismiss_timeout)
    }

    handle_mouse_leave = () => {

        if (this.state.auto_hide === undefined || this.state.auto_hide === true) {
            this.dismiss_timeout = setTimeout(() => {
                this.dismiss()
            }, 500)
        }
    }

    render() {

        const { text, alert_type, position, is_showed, is_dissmissable } = this.state

        return (
            <div 
                className="tooltip-container"
                onMouseOver={this.handle_mouse_over}
                onMouseLeave={this.handle_mouse_leave}
                >
                {
                    is_showed &&
                    <div className={ "tooltip-text tooltip-text-" + position }>
                        <span>
                            { text }
                        </span>

                        <div className="tooltip-indicator"></div>
                    </div>
                }
                { this.props.children }
            </div>
        )
    }
}

export default Notify