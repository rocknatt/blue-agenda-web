import React, { Component } from 'react'

class Beabcrumb extends Component {
    state = {

    }

    constructor(props){
        super(props)

        this.state = {
            data_list: props.data_list,
        }
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState(function(prevState, props){
            return {
                data_list: nextProps.data_list
            };
        })
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidUpdate(){
        
    }

    componentDidMount(){

    }

    handle_item_hover = (data, index, e) => {
        if (data.sub_item_list !== undefined) {
            this.setState({ sub_item_index: index })
        }
    }

    handle_beabcrumb_mouse_leave = (e) => {
        this.setState({ sub_item_index: undefined })
    }

    render() {

        const { 
            data_list, 
            sub_item_index,
        } = this.state

        return (
            <div onMouseLeave={this.handle_beabcrumb_mouse_leave}>
                <ol className={"breadcrumb " + this.props.className}>
                    {
                        data_list.map((data, index) => (
                            <li className={"breadcrumb-item " + data.className} key={index}>
                                {
                                    data.href !== undefined ?
                                    <a href={data.href} onMouseOver={(e) => this.handle_item_hover(data, index, e)}> {data.label}</a> :
                                    data.label
                                }
                            </li>
                        ))
                    }
                </ol>
                {
                    sub_item_index !== undefined &&
                    <div className="animated fadeInUp animated-x-fast breadcrumb-sub">
                        <ul>
                            {
                                data_list[sub_item_index].sub_item_list.map((sub_item, index) => (
                                    <li className={"beabcrumb-sub-item " + sub_item.className} key={index}><a href={sub_item.href}> {sub_item.label}</a></li>
                                ))
                            }
                        </ul>
                    </div>
                }
                
            </div>
        )
    }
}

export default Beabcrumb