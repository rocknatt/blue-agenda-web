import React, { Component } from 'react'

class Beabcrumb extends Component {
    state = {

    }

    constructor(props){
        super(props)

        this.state = {
            data_list: props.data_list,
            data_active: props.data_active,
            sort: 'desc',
        }
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState(function(prevState, props){
            return {
                data_list: nextProps.data_list,
                data_active: nextProps.data_active,
            };
        })
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidUpdate(){
        
    }

    componentDidMount(){

    }

    get_sort_icon(sort){
        if (sort === 'asc') {
            return (
                <i className="fa fa-sort-up"></i>
            )
        }

        if (sort === 'desc') {
            return (
                <i className="fa fa-sort-down"></i>
            )
        }

        return (
            <i className="fa fa-sort"></i>
        )
    }

    handle_item_click(value, e){
        e.preventDefault()
        
        this.setState(function (prevState) {

            let sort = 'desc'
            if (prevState.data_active === value) {
                sort = prevState.sort === 'asc' ? 'desc' : 'asc'
            }

            if (this.props.onItemClick !== undefined) {
                this.props.onItemClick(value, sort)
            }

            return { data_active: value, sort: sort }
        })

        
    }

    render() {

        const { 
            data_list, 
            data_active,
            sort
        } = this.state

        return (
            <div className={"sort-bar " + this.props.className}>

                {
                    data_list.map((data, index) => (
                        <a 
                            href={data.href} 
                            className={'btn btn-xs ' + data.className + ' ' + (data_active === data.value ? 'active' : '')}
                            onClick={(e) => this.handle_item_click(data.value, e)}>
                            {data.label}
                            { this.get_sort_icon((data_active === data.value) ? sort : '') }
                        </a>
                    ))
                }
                
            </div>
        )
    }
}

export default Beabcrumb