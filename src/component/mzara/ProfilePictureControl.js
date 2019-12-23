import React, { Component } from 'react'

import Utils from '../../Utils/Utils'

import Spinner from '../Spinner'
import DateTimeIndicator from './DateTimeIndicator'

import Image from '../../component/gallery/Image'

class ProfilePictureControl extends Component {
    state = {

    }

    lang = null
    navigation = null

    input_file = null

    constructor(props){
        super(props)

        this.state = {
            className: props.className,
            img_url: props.img_url,
            redirect_url: props.redirect_url,
            is_editable: props.is_editable,
            is_uploading: false,
            is_active: props.is_active,
            date_derniere_activite: props.date_derniere_activite,
            style: props.style,
        }

        this.input_file =  React.createRef()

        this.lang = props.lang
        this.navigation = props.navigation
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillReceiveProps(nextProps){
        this.setState(function(prevState, props){
            return {
                className: nextProps.className,
                img_url: nextProps.img_url,
                redirect_url: nextProps.redirect_url,
                is_editable: nextProps.is_editable,
                is_active: nextProps.is_active,
                date_derniere_activite: nextProps.date_derniere_activite,
                style: nextProps.style,
            }
        })
    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidUpdate(){

    }

    componentDidMount(){

    }

    set_uploading(){
        this.setState({ is_uploading: true })
    }

    set_not_uploading(){
        this.setState({ is_uploading: false })
    }

    handle_file_change = (e) => {
        var file_list = this.input_file.current.files;
        if (file_list.length > 0) {
            if (window.FormData !== undefined) {

                var data = new FormData();

                for (var x = 0; x < file_list.length; x++) {
                    var data = new FormData();
                    data.append("image_id", file_list[x]);
                }

                Utils.ajax({
                    type: "POST",
                    url: Utils.site_url('user/upload_profil_picture') ,
                    contentType: false,
                    processData: false,
                    data: data,
                    dataType: "json",
                    cache: false,
                    xhr: function () { },
                    beforeSend: () => { this.set_uploading() },
                    success: (response) => {
                        if (response.ok) {
                            this.setState({ img_url: response.img_url })
                        }
                    },
                    error: () => {} ,//La gérer dans navigation.js
                });
                
            } else {
                alert("This browser doesn't support HTML5 file uploads!");
            }
        }

        
    }

    render() {

        const { 
            className,
            img_url,
            redirect_url,
            is_editable,
            is_uploading,
            is_active,
            date_derniere_activite,
            style,
        } = this.state

        return (
            <Image
                navigation={this.navigation}
                className={"profile-picture " + className + ( is_editable ? ' overflow-hidden' : '' )}
                src={img_url}
                >
                {
                    is_editable &&
                    <label className="btn btn-default" htmlFor="profile-picture-file">
                        <i className="fa fa-camera"></i>
                        <input type="file" style={{ display: 'none' }} id="profile-picture-file" ref={this.input_file} onChange={this.handle_file_change} />
                    </label>
                }

                {
                    is_uploading &&
                    <Spinner position="center" />
                }

                {
                    is_active &&
                    <div className="notify setpos setpos-notification user-actif-indicator" title=""> 
                        <span className="heartbit"></span> <span className="point"></span> 
                    </div>
                }
                {
                    (!is_active && date_derniere_activite !== undefined) &&
                    <DateTimeIndicator 
                        lang={this.lang} 
                        date_time_value={date_derniere_activite}
                        is_date_span={true}
                        is_simple_date_span={true}
                        />
                }
            </Image>
        )
    }
}

export default ProfilePictureControl