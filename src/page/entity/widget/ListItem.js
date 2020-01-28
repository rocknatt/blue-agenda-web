import React, { Component } from 'react'

import { Dropdown } from 'mzara-component'
import { DOMHelper } from 'mzara-library'

class ListItem extends Component {
    state = {

    }

    lang = null
    navigation = null
    gallery_component = null

    constructor(props){
        super(props)

        this.state = {
            is_load: !props.is_self_trigger,
            id: props.id,
            data: props.data,
            is_self_trigger: props.is_self_trigger,
            layout: props.layout,
            onClick: props.onClick,
        }

        if (props.is_self_trigger) {
            this.fiche_controller = props.fiche_controller
        }
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState({ data: nextProps.data, layout: nextProps.layout })
    }

    componentWillUpdate(nextProps, nextState){
        
    }

    componentDidUpdate(){

    }

    componentDidMount(){
        if (this.state.is_self_trigger) {
            this.fiche_controller.get_metadata((data) => {
                this.setState({ data: data, is_load: true })
            })
            // this.get_metadata(this.state.tag_link)
        }
    }

    handle_item_click = (e) => {
        e.preventDefault()

        if (!DOMHelper.hasClass(e.target, 'btn') && this.state.onClick !== undefined) {
            this.state.onClick(this.state.data, this, e)
        }
    }

    refresh(){
        this.forceUpdate()
    }

    render() {

        const { 
            is_load,
            data,
            layout,
            is_submiting,
            is_simple,
        } = this.state

        //Todo : is_load status

        return(
            <div 
                className={"fiche-item"}
                onClick={this.handle_item_click}>
                <div className="row">
                    <div className="col-12">
                        <div>  
                            <h1><a href={ 'role/'+ data.id }>{data.designation}</a></h1>
                            <p>{this.props.lang.line('std_' + data.commentaire)}</p>
                        </div>
                    </div>
                </div>

                <Dropdown
                    position="top right"
                    dropdown_btn={( 
                        <button className="btn btn-menu" type="button">
                            <i className="fa fa-ellipsis-v"></i> 
                        </button> 
                    )}
                    dropdown_element={
                        (
                            <div className="dropdown-menu show">
                                <a className="dropdown-item" href={ this.props.ajax.site_url('role/' + data.id) }> { this.props.lang.line('std_details') }</a>
                                {
                                    data.is_editable &&
                                    <a className="dropdown-item" href="#" onClick={ (e) => this.props.onMenuClick('edit', e) }> { this.props.lang.line('std_edit') }</a>
                                }
                                {
                                    data.is_deletable &&
                                    <a className="dropdown-item" href="#" onClick={ (e) => this.props.onMenuClick('delete', e) }> { this.props.lang.line('std_delete') }</a>
                                }
                            </div>
                        )
                    }
                    /> 
            </div>
        )
    }
}

export default ListItem