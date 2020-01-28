import React, { Component } from 'react'

class Tooltip extends Component {
    state = {

    }

    constructor(props){
        super(props)

        this.state = {
            is_showed: false,
            is_dissmissable: props.is_dissmissable,
            auto_hide: props.auto_hide,
            text: props.text,
            tooltip: props.tooltip,
            position: this.get_default_position(props.position),
            type: props.type === undefined ? 'hover' : props.type,
            trigger: props.trigger === undefined ? 'hover' : props.trigger,
            onDispose: props.onDispose,
            onDisposed: props.onDisposed,
        }
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState(function(prevState, props){
            return {
                is_dissmissable: nextProps.is_dissmissable,
                auto_hide: nextProps.auto_hide,
                text: nextProps.text,
                tooltip: nextProps.tooltip,
            };
        })
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidUpdate(){
        if (!this.state.is_showed) {
            if (this.state.onDisposed !== undefined) {
                this.state.onDisposed()
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
        if (this.state.onDispose !== undefined) {
            this.state.onDispose(this.prevent_default)
        }

        this.setState({ is_showed: false })
    }

    show(){
        this.setState({ is_showed: true })
    }

    dismiss(){
        this.setState({ is_showed: false })
    }

    handle_click = () => {
        if (this.state.trigger === 'click') {
            this.show()
        }
    }

    dismiss_timeout;
    handle_mouse_over = () => {
        if (this.state.trigger === "hover") {
            this.show()
        }
        clearTimeout(this.dismiss_timeout)
    }

    handle_mouse_leave = () => {

        if (this.state.auto_hide === undefined || this.state.auto_hide === true) {
            this.dismiss_timeout = setTimeout(() => {
                this.dismiss()
            }, 750)
        }
    }

    render() {

        const { text, tooltip, type, position, is_showed, is_dissmissable } = this.state

        return (
            <div 
                className="tooltip-container"
                onClick={this.handle_click}
                onMouseOver={this.handle_mouse_over}
                onMouseLeave={this.handle_mouse_leave}
                >
                {
                    is_showed &&
                    <div className={ "tooltip-text tooltip-text-" + position + ' tooltip-' + type }>
                        <span>
                            { text }
                        </span>

                        { tooltip }

                        <div className="tooltip-indicator"></div>
                    </div>
                }
                { this.props.children }
            </div>
        )
    }
}

export default Tooltip