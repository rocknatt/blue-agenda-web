import React, { Component } from 'react'

class Alert extends Component {
    state = {

    }

    constructor(props){
        super(props)

        this.state = {
            search_value: '',
            placeholder: props.placeholder === undefined ? this.props.lang.line('std_search_d') : props.placeholder,
            onChange: props.onChange,
        }
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState(function(prevState, props){
            return {

            };
        })
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidUpdate(){

    }

    componentDidMount(){

    }

    handle_input_text_change = (e) => {
        const new_val = e.target.value
        this.setState(function(prevState, props){

            //Faire la recherche ici

            return {
                search_value: new_val
            };
        })

        if (this.state.onChange !== undefined) {
            this.state.onChange(this, new_val)
        }
    }

    handle_reset_search_click = (e) => {
        this.setState(function(prevState, props){
            return {
                search_value: ''
            };
        })

        if (this.state.onChange !== undefined) {
            this.state.onChange(this, '')
        }
    }

    render() {

        const { 
            search_value,
            placeholder,
            onChange,
        } = this.state

        return (
            <div className={"search-form " + this.props.className}>
                {
                    search_value !== "" &&
                    <button className="btn btn-transparent" onClick={this.handle_reset_search_click}><i className="fa fa-times"></i></button>
                }
                {
                    search_value === "" &&
                    <button className="btn btn-transparent"><i className="fa fa-search"></i></button>
                }
                <input type="text" value={search_value} onChange={this.handle_input_text_change} placeholder={placeholder} />
            </div>
        )
    }
}

export default Alert