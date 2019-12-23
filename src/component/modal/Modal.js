
// import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Utils from '../../Utils/Utils'

import '../../assets/css/modal.css'

class Modal extends Component {
  	state = {
		actual_action: null,
	};

	simple_message = ''

	//Todo : Ajouter le coordonée de la dialogue dans les préférences
	constructor(props){
	    super(props)
	    this.state = {
	    	actual_action: props.is_opened_default ? 'opened' : (props.actual_action === undefined ? 'nothing' : props.actual_action),
			confimation_type: props.confimation_type, //ok, ok_cancel, none
			is_dismissable: props.is_dismissable,
			className: props.className,
			onCancel: props.onCancel,
			onDismiss: props.onDismiss,
			onOk: props.onOk,
	    }

	    this.parent = props.parent
	}

	componentDidMount(){
		document.addEventListener('click', this.handle_document_click)
	}

	componentWillMount(){

	}

	componentWillUnmount(){

	}

	handle_document_click = (e) => {

        if (Utils.hasClass(e.target, 'param-fade')) {
        	e.preventDefault()
        	if (this.state.is_dismissable) {
        		let should_dismiss = true
        		
        		if (this.state.onDismiss !== undefined) {
					should_dismiss = this.state.onDismiss()
				}
        		this.dismiss(should_dismiss)
        	}
        }
    }

	handle_ok_click = (e) => {
		let should_dismiss = true

		if (this.state.onOk !== undefined) {
			should_dismiss = this.state.onOk()
		}

		this.dismiss(should_dismiss)
	}

	handle_cancel_click = (e) => {
		let should_dismiss = true

		if (this.state.onCancel !== undefined) {
			should_dismiss = this.state.onCancel()
		}

		this.dismiss(should_dismiss)		
	}

	handle_dismiss_click = (e) => {
		let should_dismiss = true

		if (this.state.onDismiss !== undefined) {
			should_dismiss = this.state.onDismiss()
		}

		this.dismiss(should_dismiss)
	}

	// handle_input_blur = () => {
	// 	this.parent.actual_action = 'nothing'
	// }

	set_simple_message(value){
		this.simple_message = value
	}

	set_cancel_callback(value){
		this.setState({ onCancel: value })
	}

	set_ok_callback(value){
		this.setState({ onOk: value })
	}

	set_dissmiss_callback(value){
		this.setState({ onDismiss: value })
	}
	
	open(){
		this.setState(function (prevState) {
			return { 
				'actual_action' : 'opened'
			}
		})
	}

	dismiss = (should_dismiss) => {
		if (should_dismiss === undefined) {
			should_dismiss = true
		}

		if (should_dismiss) {
			this.setState({ 'actual_action' : 'nothing' })
		}
	}

	is_opened(){
		return this.actual_action === 'opened'
	}

	render() {
	    const { actual_action, confimation_type, className, title, draggable, is_dismissable } = this.state

	    return (
	    	<div>
			    {
			    	(actual_action === 'opened') &&
			    	<div className="param param-fade animated show fadeIn" >
			    		<div className={"modal-dialog modal-lg " + className}>
						  	<div className="modal-content animated zoomInUp">
						      	<div className="modal-body">
						      		{
						      			is_dismissable &&
						      			<button className="btn btn-close-modal" onClick={this.handle_dismiss_click}><i className="fa fa-times"></i></button>
						      		}
						      		
						      		{ this.props.children }

						      		{ 
						      			this.simple_message.length > 0 &&
						      			<div style={{ padding: '20px' }}>
						      				<p className="text-small">{ this.simple_message }</p>
						      			</div>
						      		}
						      	</div>
			  					{
			  					confimation_type !== 'none' &&
			  					<div className="modal-footer">
					      			{
						      			confimation_type === 'ok_cancel' &&
						      			<button className="btn btn-sm btn-default" onClick={this.handle_cancel_click}> <i className="fa fa-undo"></i> Anuller</button>
						      		}
					      			<button className="btn btn-sm btn-primary" onClick={this.handle_ok_click}><i className="fa fa-check"></i> Ok</button>
					            </div>
			  					}
						  	</div>
						</div>
					</div>
			    }
		    </div>
	    )
  	}
}

// regex.propTypes = {
// 	style: PropTypes.string.isRequired,
// 	value: PropTypes.string.isRequired,
// }

export default Modal