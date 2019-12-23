import React, { Component } from 'react'
import { connect } from 'react-redux'

import Utils from '../../Utils/Utils'

class Image extends Component {
    state = {

    }

    navigation = null
    file_to_upload_list = []
    file_uploaded_error_list = []

    image_base64 = ''

    animation_intervale = null

    constructor(props){
        super(props)

        this.state = {
            src: props.src,
            title: props.title,
            className: props.className,
            onClick: props.onClick,
        }

        this.navigation = props.navigation

        this.input_image_file = React.createRef()
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState(function(prevState, props){

            if (nextProps.src !== prevState.src) {
                this.load_image(nextProps.src)
            }

            return {
                src: props.src,
                title: props.title,
                className: props.className,
            };
        })
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidUpdate(){

    }

    componentDidMount(){
        this.load_image(this.state.src)
    }

    refresh = () => {
        if (this.base64 === null) {
            this.load_image(this.state.src)
        }
        else{
            this.forceUpdate()
        }
    }

    load_image(src){
        this.base64 = this.props.ajax.get_image_base_64(src, this.refresh)

        if (this.base64 !== null) {
            this.refresh()
        }
    }

    render() {

        const { 
            src,
            title,
            className,
            onClick,
        } = this.state

        var style = { backgroundImage: 'url('+ this.base64 + ')' }

        return (
            <div 
                className={'image ' + className} 
                style={style}
                title={ title }
                onClick={onClick}>
                {this.props.children}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        ajax: state.ajax,
    }
}

export default connect(mapStateToProps)(Image)