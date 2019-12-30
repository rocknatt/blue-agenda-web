import React, { Component } from 'react'

import { FormControl } from 'mzara-component'

import ButtonSubmit from '../../../component/btn/ButtonSubmit'
import LinkBack from '../../../component/btn/LinkBack'

class BookingCreateForm extends Component {

    form_list = []

    constructor(props){
        super(props)

        this.state = {
            date: props.date,
            hour: props.hour,
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({ date: nextProps.date, hour: nextProps.hour })
    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    componentWillUpdate(nextProps, nextState){

    }

    componentDidMount(){
        
    }

    get_form_ref(ref, unmount){
        if (unmount) {
            var form_index = null
            this.form_list.map((data, index) => {
                if (ref.state.input_name === data.state.input_name) {
                    form_index = index
                }
            })
            
            if (form_index !== null) {
                this.form_list.splice(form_index, 1)
            }
            
        }else{
           this.form_list.push(ref) 
        }
        
    }

    set_on_submit(){
        this.setState({ is_submiting: true })
    }

    set_submited(){
        this.setState({ is_submiting: false })
    }

    submit_form(){

        var form_serialized = FormControl.serialize_form(this.form_list)
        if (form_serialized.should_submit) {

            this.set_on_submit()

            const metadata = this.parent.event_list_controller.get_metadata(this.parent.state.tag_link)
            form_serialized.result.id = metadata.id
            this.parent.event_list_controller.handle_edit_form_submit(form_serialized.result, () => {
                //Il y a eu une erreur quelque part
                this.set_submited()

                this.refresh()
            })
        }
        
    }

    render() {

        const { 
            date,
            hour,
            is_submiting
        } = this.state

        const date_now = new Date()
        const year_now = date_now.getFullYear()
        
        return (
            <div className="">
                <form onSubmit={this.handle_form_submit}>
                    <div className="form-container">
                        <FormControl 
                            lang={this.props.lang}
                            label={this.props.lang.line('std_title')}
                            input_type="numeric"
                            input_name="title"
                            input_id="title"
                            input_placeholder={this.props.lang.line('std_booking_title')}
                            is_required={true}
                            required_err={this.props.lang.line('std_required_err')}
                            onRef={ (ref, unmount) => this.get_form_ref(ref, unmount) }
                            onPaste={ () => console.log('paste') }
                            />

                        <FormControl 
                            lang={this.props.lang}
                            label={this.props.lang.line('std_description')}
                            input_value=""
                            input_name="description"
                            input_type="textarea"
                            input_placeholder={this.props.lang.line('std_description')}
                            is_autosize={true}
                            onRef={ (ref, unmount) => this.get_form_ref(ref, unmount) }
                            />

                        <FormControl 
                            lang={this.props.lang}
                            label={this.props.lang.line('std_date')}
                            input_name="date"
                            input_type="date"
                            input_value={date}
                            min_year={year_now}
                            onRef={ (ref, unmount) => this.get_form_ref(ref, unmount) }
                            />

                        <FormControl 
                            lang={this.props.lang}
                            className="heure-debut"
                            label={this.props.lang.line('std_heure_begin')}
                            input_value={hour}
                            input_name="heure_debut"
                            input_type="time"
                            is_required={true}
                            onRef={ (ref, unmount) => this.get_form_ref(ref, unmount) }
                            />

                        <FormControl 
                            lang={this.props.lang}
                            className="heure-fin"
                            label={this.props.lang.line('std_heure_end')}
                            input_value={hour}
                            input_name="heure_fin"
                            input_type="time"
                            is_required={true}
                            onRef={ (ref, unmount) => this.get_form_ref(ref, unmount) }
                            />
                    </div>
                    <div className="form-footer">
                        <span className="">
                            <LinkBack onClick={this.handle_back_click} lang={this.props.lang} />
                        </span>
                        <span className="ml-auto">
                            <ButtonSubmit className="btn-primary" is_submiting={is_submiting} text={this.props.lang.line('std_save')} />
                        </span>
                    </div>
                </form>
            </div>
            
        )
    }
}

export default BookingCreateForm