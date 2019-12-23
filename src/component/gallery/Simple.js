import React, { Component } from 'react'

import Utils from '../../Utils/Utils'

import Image from './Image'

class Simple extends Component {
    state = {

    }

    lang = null
    navigation = null

    constructor(props){
        super(props)

        this.state = {
            is_load: true,
            image_list: props.image_list,
            onClick: props.onClick,
        }

        this.lang = props.lang
        this.navigation = props.navigation

        this.input_image_file = React.createRef()
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

    refresh = () => {
        this.forceUpdate()
    }

    render() {

        const { 
            is_load,
            image_list,
            onClick,
        } = this.state

        //Image list
        let view_image_list = []
        let limit = 3
        if (image_list.length > 5) {
            limit = 5
        }
        for (var i = 0; i < limit; i++) {
            view_image_list.push({
                id: image_list[i],
                th_url: Utils.site_url('image/details/' + image_list[i] + '/ths'), 
                url: Utils.site_url('image/details/' + image_list[i]),
            })
        }

        return (
            <div className={"simple-gallery image-count-" + view_image_list.length}>
                {
                    view_image_list.map((image, index) => (
                         <Image
                            key={index}
                            navigation={this.navigation}
                            className={ "image-item image-item-" + index + " " + (index === view_image_list.length - 1 ? 'last' : '') }
                            src={image.th_url}
                            onClick={ (e) => onClick(image.id, e) }>

                            {
                                (index === view_image_list.length - 1 && view_image_list.length < image_list.length ) &&
                                <div className="image-mask">
                                    <span>
                                        { Utils.sprintf(this.lang.line('clt_x_more'), image_list.length - view_image_list.length) }
                                    </span>
                                </div>
                            }

                        </Image>
                    ))
                }
            </div>
        )
    }
}

export default Simple