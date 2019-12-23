import React, { Component } from 'react'

class Alert extends Component {
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

    componentWillReceiveProps(nextProps){

    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidUpdate(){

    }

    componentDidMount(){

    }

    get_col_class(){
        var str = ''

        str += (this.props.xl !== undefined && this.props.xl > 0) ? (' col-xl-' + this.props.xl) : (' d-xl-none ')
        str += (this.props.lg !== undefined && this.props.lg > 0) ? (' col-lg-' + this.props.lg) : (' d-lg-none ' + (!str.includes('d-xl-none') ? 'd-xl-block' : ''))
        str += (this.props.md !== undefined && this.props.md > 0) ? (' col-md-' + this.props.md) : (' d-md-none ' + (!str.includes('d-lg-none') ? 'd-lg-block' : ''))
        str += (this.props.sm !== undefined && this.props.sm > 0) ? (' col-sm-' + this.props.sm) : (' d-sm-none ' + (!str.includes('d-md-none') ? 'd-md-block' : ''))
        str += (this.props.xs !== undefined && this.props.xs > 0) ? (' col-' + this.props.xs) : (' d-none ' + (!str.includes('d-sm-none') ? 'd-sm-block' : ''))

        return str
    }

    render() {

        const {  } = this.state

        return (
            <div className={this.get_col_class()}>
                { this.props.children }
            </div>
        )
    }
}

export default Alert