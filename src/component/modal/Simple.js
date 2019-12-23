
// import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Utils from '../../Utils/Utils'

class Simple extends Component {
  	state = {
		actual_action: null,
	};

	table;
	data;
	select_picker= []
	regex_selected
	current_search = []
	text_case

	prev_pointer_coord = {}
	prev_dialog_coord = {}

	//Todo : Ajouter le coordonée de la dialogue dans les préférences

	constructor(props){
	    super(props)
	    this.state = {
	    	actual_action: 'nothing',
	    	className: props.className,
			title: props.title,
			confimation_type: props.confimation_type, //ok, ok_cancel, none
			draggable: props.draggable,
			position: props.position,
			onCancel: props.onCancel,
			onDismiss: props.onDismiss,
			onOk: props.onOk,
	    }

	    this.parent = props.parent
	}

	componentDidMount(){
		
	}

	componentWillMount(){
		document.addEventListener('mousemove', this.handle_simple_modal_mouse_move)
		document.addEventListener('mouseup', this.handle_simple_modal_header_mouse_up)
	}

	componentWillUnmount(){
		document.removeEventListener('mousemove', this.handle_simple_modal_mouse_move)
		document.removeEventListener('mouseup', this.handle_simple_modal_header_mouse_up)
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

	handle_simple_modal_header_mouse_down = (e) => {
		e.preventDefault()
        e.stopPropagation()

		this.prev_pointer_coord = {pageX : e.pageX, pageY: e.pageY}
		this.prev_dialog_coord = Utils.get_clone(this.state.position)

		this.setState(function (prevState) {
			return { 
				'actual_action' : 'drag'
			}
		})
	}

	handle_simple_modal_mouse_move = (e) => {
		e.preventDefault()
        e.stopPropagation()
        
		if (this.state.actual_action === 'drag') {
			var mouseXDiff = e.pageX - this.prev_pointer_coord.pageX
			var mouseYDiff = e.pageY - this.prev_pointer_coord.pageY

			this.setState(function (prevState) {
				return {  
					position: {
						top: this.prev_dialog_coord.top + mouseYDiff,
						left: this.prev_dialog_coord.left + mouseXDiff
					}
				}
			})
		}
	}

	handle_simple_modal_header_mouse_up = (e) => {
		this.setState(function (prevState) {
			return { 
				'actual_action' : prevState.actual_action === 'drag' ? 'opened' : prevState.actual_action,
			}
		})
	}

	// handle_input_blur = () => {
	// 	this.parent.actual_action = 'nothing'
	// }
	
	open({ position }){

		if (position === undefined) {
			position = {
				top: 130,
				left: window.innerWidth - 260,
			}
		}

		this.setState(function (prevState) {
			return { 
				'actual_action' : 'opened', 
				position: position 
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
	    const { actual_action, confimation_type, title, className, draggable, position } = this.state

	    return (
	    	<div>
			    {
			    	(actual_action === 'opened' || actual_action === 'drag') &&
			    	<div className={"simple-modal animated jackInTheBox " + className} style={position}>
				      	<div className={"simple-modal-header not-selectable " + (draggable ? 'draggable' : '')} onMouseDown={ draggable ? this.handle_simple_modal_header_mouse_down : undefined }>
				      		<button className="btn btn-close-modal" onClick={this.dismiss}><i className="fa fa-times"></i></button>

				      		<h3>{ title }</h3>

				      	</div>

				      	<div className="simple-modal-content">
				      		{ this.props.children }
				      	</div>
				      	{
				      		confimation_type !== 'none' &&
				      		<div className="simple-modal-footer">
					      		<p className="">
					      			{
						      			confimation_type === 'ok_cancel' &&
						      			<button className="btn btn-sm btn-default" style={{ float: 'left' }} onClick={this.handle_cancel_click}> <i className="fa fa-undo"></i> Anuller</button>
						      		}
					      			<button className="btn btn-sm btn-primary" style={{ float: 'right' }} onClick={this.handle_ok_click}><i className="fa fa-check"></i> Ok</button>
					      		</p>
					      	</div>
				      	}
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

export default Simple