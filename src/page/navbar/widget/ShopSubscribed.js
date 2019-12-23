import React, { Component } from 'react'

import Utils from '../../../Utils/Utils'

import ShopController from '../../../base/controller/shop/index'

class ShopSubscribed extends Component {
    state = {

    }

    lang = null
    parent = null

    shop_owned_list = []
    shop_list = []

    current_menu_list = []

    constructor(props){
        super(props)

        this.state = {
            is_getting_more_shop_subscribed: true
        }

        this.init_shop_controller()
        this.parent = props.parent
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

    componentDidMount(){

    }

    init_shop_controller(){
        this.shop_controller = new ShopController({
            ajax: this.props.ajax,
            lang: this.props.lang,
            hub: this.props.hub,

            refresh_callback: (e, data) => this.refresh(e, data),
        })
    }

    handle_more_shop_click = (e) => {
        this.setState({ is_getting_more_shop_subscribed: true })
    }

    refresh(event_type, data){
        if (event_type === 'shop_subscribed_list') {

            this.setState(function (prevState) {
                return {
                    is_getting_more_shop_subscribed: false
                }
            })
        }
        else{
            this.forceUpdate()
        }
        
    }

    render() {

        const { 
            is_getting_more_shop_subscribed
        } = this.state

        const subscribed_shop_list = this.shop_controller.get_shop_subscribed_list(is_getting_more_shop_subscribed, 5)
        const owned_shop_list = this.shop_controller.get_owned_shop(10)

        return (


            <div className="filtre-content">
                <ul>
                    <li>
                        <a href="#" className="btn btn-danger btn-xs btn-create mb-10" onClick={ this.handle_new_shop_click }>
                            <i className="fa fa-pencil-alt"></i> 
                            { this.props.lang.line('std_new_shop') }
                        </a>
                    </li>
                    {
                        owned_shop_list.map((shop, index) => (
                            <li className="mt-5" key={index}><a href={Utils.site_url('shop/wall/'+ shop.tag_link)}><img src={Utils.site_url('image/details/' + shop.image_id + '/thx')} /> { shop.name }</a></li>
                        ))
                    }
                    {
                        subscribed_shop_list.map((shop, index) => (
                            <li className="mt-5" key={index}><a href={Utils.site_url('shop/wall/'+ shop.tag_link)}><img src={Utils.site_url('image/details/' + shop.image_id + '/thx')} /> { shop.name }</a></li>
                        ))
                    }

                    {
                        !this.shop_controller.is_last_shop_subscribed_list &&
                        <li>
                            <a href="#" className="btn btn-default btn-xs btn-more mb-10 noAjax" onClick={ this.handle_more_shop_click }>
                                {
                                    is_getting_more_shop_subscribed ?
                                    <i className="fa fa-spinner fa-w fa-pulse"></i> :
                                    <i className="fa fa-chevron-down"></i>
                                } 
                                { this.props.lang.line('std_more') }
                            </a>
                        </li>
                    }
                    
                </ul>
            </div>
        )
    }
}

export default ShopSubscribed