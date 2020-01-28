import React, { Component } from 'react'

import { ModalForm, Beabcrumb, SortBar, Spinner } from 'mzara-component'

import ButtonAdd from '../../component/btn/ButtonAdd'

import List from './widget/List'
// import ProspectCreateForm from './widget/ProspectCreateForm'

class _Home extends Component {
    state = {

    }

    data_selected = null


    constructor(props){

        super(props)

        this.state = {
            is_load: false,
            is_show_create_modal: false,
            sort: 'asc',
            order_by: 'designation',
            can_create: false
        }

        this.navigation = props.navigation
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillUpdate(nextProps, nextState){

    }

    componentWillReceiveProps(nextProps){
        this.setState({ sort: 'asc', order_by: 'designation' })
    }

    componentDidMount(){
        //Todo : faire les recherches d'évaluation ici d'abord
        this.props.controller.access((response) => {
            this.setState({ can_create: response.can_create })
        })
    }

    get_beabcrumb_data(){
        let result = []

        //Home
        result.push({
            label: this.props.lang.line('std_home'),
            href: this.props.ajax.site_url(''),
        })

        //User
        result.push({
            label: this.props.lang.line('std_role'),
            href: this.props.ajax.site_url('role'),
        })

        return result
    }

    get_sort_data_list(){
        return this.props.controller.get_sort_data_list(() => this.refresh())
    }

    get_create_form(user_id){
        let form_data = this.props.controller.get_create_form(user_id)
        form_data.onSubmit = this.handle_create_form_submit
        form_data.onSubmited = () => this.dismiss_modal_form()
        form_data.onCancel = () => this.dismiss_modal_form()

        return form_data
    }

    handle_btn_add_click = () => {
        //Todo : show modal for creation form
        this.setState({ is_show_modal_form: true, data_modal_form: this.get_create_form() })
    }

    handle_create_form_submit = (data, success, error) => {
        this.props.controller.create(data, (response) => {
            this.props.navigation.load('role/' + response.id)
            success()
        }, error)
    }

    handle_on_sort_item_click = (order_by, sort) => {
        this.props.controller.clear_list()
        this.setState({ order_by, sort, is_getting_more: true })
    }

    dismiss_modal_form(){
        this.setState({ is_show_modal_form: false })
    }

    // handle_item_click = (data) => {
    //     // this.data_selected = data
    //     // this.refresh()

    //     //Todo : show item selected inside read interface
    //     this.data_selected = data.id
    //     this.refresh()
    // }

    refresh(){
        this.forceUpdate()
    }

    render_btn_cmd(){

        if (!this.state.can_create) {
            return (
                <div></div>
            )
        }

        return (
            <ButtonAdd
                text={this.props.lang.line('std_new')}
                onClick={this.handle_btn_add_click}
                />
        )
    }

    render() {

        const { 
            is_load,
            sort,
            order_by,
            is_show_create_modal,
            is_show_modal_form,
            data_modal_form,
            can_create
        } = this.state

        return (
            <div className="">

                <div className="row">
                    <div className="col-12 col-sm-9 col-md-8 col-lg-7 col-xl-6">
                        <div>

                            <div className="row">
                                <div className="col-12">
                                    <div className="page-header">
                                        <Beabcrumb
                                            data_list={this.get_beabcrumb_data()}
                                            btn_component={this.render_btn_cmd()}
                                            />
                                    </div>
                                </div>
                            </div>

                            {
                                /*
                                <div className="search-form">
                                    <form onSubmit={this.handle_login_form_submit}>
                                        <input type="text" className="form-control" placeholder={ this.lang.line('std_search_product') } defaultValue={search_query} />
                                        <button><i className="fa fa-search"></i></button>
                                    </form>
                                </div>
                                */
                            }

                            <SortBar
                                className="mt-15"
                                data_list={ this.get_sort_data_list() }
                                sort={sort}
                                data_active={order_by}
                                onItemClick={this.handle_on_sort_item_click}
                                />

                            <div className="box box-white mt-15 mb-60">
                                <List  
                                    order_by={order_by}
                                    sort={sort}
                                    controller={this.props.controller}
                                    onItemClick={this.handle_item_click}
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="d-none d-sm-block col-sm-4 col-md-4 col-lg-3 col-xl-6 mt-20">
                        
                    </div>
                </div>

                {
                    is_show_modal_form &&
                    <ModalForm
                        ajax={this.props.ajax}
                        lang={this.props.lang}
                        data={data_modal_form}
                        />
                }
            </div>
        )
    }
}

export default _Home