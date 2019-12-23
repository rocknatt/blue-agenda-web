import React, { Component } from 'react'

import Utils from '../../Utils/Utils'

import Image from './Image'

import Alert from '../../component/Alert'

class Main extends Component {
    state = {

    }

    lang = null
    navigation = null

    file_to_upload_list = []
    file_uploaded_error_list = []

    animation_intervale = null

    constructor(props){
        super(props)

        this.state = {
            is_load: true,
            is_auto_height: props.is_auto_height,
            is_auto_slide: props.is_auto_slide,
            is_slide_on_hover: props.is_slide_on_hover,
            is_editable: props.is_editable,
            is_show_image_vertical: props.is_show_image_vertical === undefined ? true : props.is_show_image_vertical,
            is_show_command: props.is_show_command === undefined ? true : props.is_show_command,
            upload_image_url: props.upload_image_url,
            slide_interval: props.slide_interval === undefined ? 5000 : props.slide_interval,
            image_list: props.image_list,
            image_index: 0,
            animation_direction: 'right',
            onImageClick: props.onImageClick,
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
        this.setState(function(prevState, props){

            return {
                image_list: nextProps.image_list,
                upload_image_url: nextProps.upload_image_url,
                is_editable: nextProps.is_editable,
                image_index: 0,
            };
        })
    }

    componentWillUpdate(nextProps, nextState){
        if (nextState.is_uploading_file) {
            this.do_next_upload((response) => { 
                if (response !== undefined) {
                    this.push_image(response.data)
                }
                this.refresh()
            })
        }
    }

    componentDidUpdate(){

    }

    componentDidMount(){

        if (this.state.is_auto_slide) {
            this.begin_animation()
        }

        this.setState(function(prevState, props){
            return {
                is_load: true,
            };
        })
    }

    begin_animation(){
        clearInterval(this.animation_intervale)
        this.animation_intervale = setInterval(() => {
            this.handle_btn_next_click()
        }, this.state.slide_interval)
    }

    stop_animation(){
        clearInterval(this.animation_intervale)
    }

    push_image(value){
        this.setState(function (prevState) {
            var next_image_list = Utils.get_clone(prevState.image_list)
            next_image_list.push(value)
            return {
                image_list: next_image_list
            }
        })
    }

    handle_btn_next_click = () => {
        this.setState(function (prevState) {
            
            if (prevState.image_list.length - 1 === prevState.image_index) {
                return { image_index: 0, animation_direction: 'right' }
            }

            return { image_index: prevState.image_index + 1, animation_direction: 'right' }
        })
    }

    handle_btn_prev_click = () => {
        this.setState(function (prevState) {
            if (0 === prevState.image_index) {
                return { image_index: prevState.image_list.length - 1, animation_direction: 'left' }
            }

            return { image_index: prevState.image_index - 1, animation_direction: 'left' }
        })
    }

    handle_image_th_click = (image_index, e) => {
        this.setState({ image_index: image_index })
    }

    handle_image_delete_click = (image, e) => {
        e.preventDefault()
        Utils.ajax({
            url: image.delete_url,
            type: 'POST',
            data: { is_confirmed: true },
            data_type: 'json',
            success: (response) => {
                if (response.ok) {
                    this.setState(function (prevState) {
                        var image_list = Utils.get_clone(prevState.image_list)
                        var index_catched = null
                        image_list.map((_image, index) => {
                            if (image.id === _image.id) {
                                index_catched = index
                            }
                        })

                        if (index_catched !== null) {
                            image_list.splice(index_catched, 1)
                        }

                        return {
                            image_list
                        }
                    })
                }
            },
        })
    }

    handle_upload_err_message_click = (obj, e) => {
        while(this.file_uploaded_error_list.length > 0){
            this.file_to_upload_list.push(this.file_uploaded_error_list.pop())
        }
        this.setState({ is_uploading_file: true })
    }

    handle_mouse_enter = (e) => {
        if (this.state.is_slide_on_hover) {
            this.begin_animation()
        }
        else{
            this.stop_animation()
        }
    }

    handle_mouse_leave = (e) => {
        if (this.state.is_slide_on_hover) {
            this.stop_animation()
        }
        else if (this.state.is_auto_slide) {
            this.begin_animation()
        }
    }

    handle_image_click = (image_id, e) => {
        if (this.state.onImageClick !== undefined) {
            this.state.onImageClick(image_id, e)
        }
    }

    handle_file_image_change = (e) => { 

        for (var i = 0; i < this.input_image_file.current.files.length; i++) {
            this.file_to_upload_list.push(this.input_image_file.current.files[i])
        }

        this.setState({ is_uploading_file: true })
    }

    do_next_upload(callback){

        var file = this.file_to_upload_list.pop()
        if (file !== undefined) {
            var data = new FormData()
            data.append("image_id", file)

            this.props.ajax.send_request({
                type: "POST",
                url: this.state.upload_image_url,
                contentType: false,
                processData: false,
                data: data,
                dataType: "json",
                auto_retry: false,
                cache: false,
                xhr: function () { },
                before_send: () => {  },
                success: (response) => {
                    if (response.ok) {
                        if (callback !== undefined) {
                            callback(response)
                        }
                    }
                },
                error: () => { this.file_uploaded_error_list.push(file) },
                done: () => {
                    if (callback !== undefined) {
                        callback()
                    }
                }
            });
        }
        else{
            this.setState({ is_uploading_file: false })
        }
    }

    refresh(){
        this.forceUpdate()
    }

    render() {

        const { 
            is_load, 
            is_auto_height, 
            is_editable,
            is_uploading_file,
            is_show_image_vertical,
            is_show_command,
            image_list, 
            image_index, 
            animation_direction 
        } = this.state

        let active_img = {}
        if (image_list[image_index] !== undefined) {
            active_img = image_list[image_index]
        }

        var style = {}

        if (is_auto_height) {
            style.height = window.innerHeight - 60
        }

        //Todo : Gérer l'expérience sur une écran tactile
        // touche : fait apparaitre les commandes
        // glisser avec le doigt
        // Animation lors de la transition

        return (
            <div className="gallery-image" style={style}>
                <div 
                    className={"image-container" }
                    onMouseEnter={ this.handle_mouse_enter }
                    onMouseLeave={ this.handle_mouse_leave }>
                    {
                        image_list.map((image, index) => (
                            <Image
                                key={index}
                                navigation={this.navigation}
                                className={"image-content " + (active_img.id == image.id ? 'active' : '' ) + ' ' + animation_direction }
                                src={image.url}
                                onClick={(e) => this.handle_image_click(image.id, e)}
                                />
                        ))
                    }
                    {
                        is_show_command &&
                        <nav className="nav justify-content-end">
                            <a className={ "nav-link " } href={ active_img.url } target="_blank">{ this.lang.line('std_download') }</a>
                            {
                                active_img.delete_url !== undefined &&
                                <a className={ "nav-link " } href={ '#' } onClick={ () => { this.handle_image_delete_click(active_img) } }>{ this.lang.line('std_delete') }</a>
                            }
                        </nav>
                    }
                    
                    {
                        is_editable &&
                        <div>
                            <input 
                                type="file" 
                                name="fi" 
                                id="image_file" 
                                value="" 
                                autoComplete="off" 
                                form="message-form" 
                                className="d-none" 
                                accept="image/*" 
                                multiple="multiple"
                                ref={ this.input_image_file }
                                onChange={this.handle_file_image_change} />
                            <label className="btn btn-upload-image" htmlFor="image_file" title={ this.lang.line('std_send_image') }>
                                <i className="fa fa-plus"></i>
                                { this.lang.line('std_add_image') }
                            </label>

                            {
                                is_uploading_file &&
                                <Alert 
                                    alert_type="default absolute top center rounded faInDown animated"
                                    text={ (
                                        <div>
                                            <p className="text-small"><i className="fa fa-upload animated infinite tada"></i> {  Utils.sprintf(this.lang.line('std_uploading_x_file'), this.file_to_upload_list.length) }</p>
                                        </div>
                                        ) }
                                    />
                            }

                            {
                                this.file_uploaded_error_list.length > 0 &&
                                <Alert 
                                    alert_type="danger absolute top right rounded faInLeft animated cursor-pointer"
                                    is_dissmissable={ true }
                                    onClick={ this.handle_upload_err_message_click }
                                    text={ (
                                        <div>
                                            <p className="text-small"><i className="fa fa-upload animated infinite tada"></i> {  Utils.sprintf(this.lang.line('std_there_was_x_upload_error'), this.file_uploaded_error_list.length) }</p>
                                        </div>
                                        ) }
                                    />
                            }
                        </div>
                    }

                    {
                        is_show_command &&
                        <div>
                            <button type="button" className="btn btn-cmd btn-cmd-left btn-default" onClick={ this.handle_btn_prev_click }> <i className="fa fa-chevron-left"></i> </button>
                            <button type="button" className="btn btn-cmd btn-cmd-right btn-default" onClick={ this.handle_btn_next_click }> <i className="fa fa-chevron-right"></i> </button>
                        </div>
                    }
                    
                </div>
                {
                    is_show_image_vertical &&
                    <div className="image-gallery-vertical">
                        {
                            image_list.map((image, index) => (
                                <div 
                                    key={index}
                                    className={"image-item " + (image_index === index ? 'active' : '') }>
                                    <Image
                                        key={index}
                                        navigation={this.navigation}
                                        src={image.th_url}
                                        onClick={ (e) => this.handle_image_th_click(index, e) }
                                        />
                                    {
                                        image.delete_url !== undefined &&
                                        <button type="button" tabIndex="-1" className="btn btn-delete" onClick={ (e) => this.handle_image_delete_click(image, e) }><i className="fa fa-times"></i></button>
                                    }
                                </div>
                            ))
                        }
                    </div>
                }
                
            </div>
        )
    }
}

export default Main