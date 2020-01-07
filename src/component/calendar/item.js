import React, { Component } from 'react'

class Item extends Component {
    state = {

    }

    constructor(props){
        super(props)

        this.state = {
            title: props.title,
            description: props.description,
            hour_begin: props.hour_begin,
            hour_end: props.hour_end,
            show_description: props.show_description === undefined ? true : props.show_description,
        }
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState({
            title: nextProps.title,
            description: nextProps.description,
            hour_begin: nextProps.hour_begin,
            hour_end: nextProps.hour_end,
            show_description: nextProps.show_description === undefined ? true : nextProps.show_description,
        })
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidUpdate(){
        
    }

    componentDidMount(){

    }

    render() {

        const { 
            title,
            description,
            hour_begin,
            hour_end,
            show_description
        } = this.state

        return (
            <div 
                className="calendar-item">
                <h3 title={ hour_begin + ' - ' + hour_end + '. ' + description }>{title}</h3>
                {
                    show_description &&
                    <p>{description}</p>
                }
            </div>
        )
    }
}

export default Item