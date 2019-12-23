import React, { Component } from 'react'

class Paragraph extends Component {
    state = {

    }

    lang = null

    constructor(props){
        super(props)

        this.state = {
            text: props.text,
            is_show_limited: props.is_show_limited === undefined ? true : props.is_show_limited,
            is_should_show_more_link: props.is_should_show_more_link === undefined ? true : props.is_should_show_more_link,
            string_limit: props.string_limit === undefined ? 250 : props.string_limit,
            see_more: false
        }

        this.lang = props.lang
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState(function(prevState, props){
            return {
                is_show_limited: true,
                text: nextProps.text,
            };
        })
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidUpdate(){

    }

    componentDidMount(){

    }

    get_limited_string(str, nb){
        if (nb === undefined) {
            nb = 75
        }

        if (str === undefined) {
            return ''
        }

        if (str.length > nb) {
            return str.substring(0, nb) + '...'
        }

        return str
    }

    handle_on_see_more = (e) => {
        e.preventDefault()
        this.setState({ is_show_limited: false })
    }

    render() {

        const { 
            text,
            string_limit,
            is_show_limited,
            is_should_show_more_link,
        } = this.state

        var view_content = text

        if (string_limit !== undefined && is_show_limited) {
            view_content = this.get_limited_string(view_content, string_limit)
        }

        let should_show_more_link = false
        if (is_show_limited) {
            should_show_more_link = view_content.substring(view_content.length - 3) === '...'
        }

        let view_content_adr = view_content.split('\n')

        return (
            <div className={this.props.className}>
                {
                    view_content_adr.map((item, index) => (
                        <p key={index}>
                            {/*Todo : search link here*/}
                            {item}
                            {
                                (is_should_show_more_link && should_show_more_link && index === view_content_adr.length - 1) &&
                                <a href="#" onClick={ this.handle_on_see_more }>{ this.lang.line('std_show_more') }</a>
                            }
                        </p>
                    ))
                }
            </div>
        )
    }
}

export default Paragraph