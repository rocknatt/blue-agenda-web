import React, { Component } from 'react'

class Dropdown extends Component {
  	state = { };

  	last_perso_color_selected = ''
  	parent

	constructor(props){
	    super(props)

	    this.state = {
	    	dropdown_btn: props.dropdown_btn,
	    	dropdown_element: props.dropdown_element,
	    	position: props.position !== undefined ? props.position : 'top left',
	    	show_dropdown: false,
	    	render_first: false,
	    	close_on_click: props.close_on_click !== undefined ? props.close_on_click : true,
	    	onShow: props.onShow,
	    	onClose: props.onClose,
	    }

	    this.parent = props.parent
	}

	componentWillReceiveProps(nextProps){
		this.setState(function(prevState, props){
			return {
			    dropdown_btn: nextProps.dropdown_btn,
	    		dropdown_element: nextProps.dropdown_element,
	    		position: nextProps.position !== undefined ? nextProps.position : 'top left',
			};
		})
	}

	componentDidMount(){
		document.addEventListener('click', this.handle_document_click)
	}

	componentWillUnmount(){

	}

	handle_dropdown_click = () => {
		this.show()
	}

	handle_dropdown_mask_click = (e) => {
		this.dismiss()
	}

	handle_drop_down_element_click = (e) => {
		if (this.state.close_on_click) {
			this.dismiss()
		}
	}

	show(){
		var api_result = undefined
		if (this.state.onShow !== undefined) {
			api_result = this.state.onShow()
		}

		if (api_result || api_result === undefined) {
			this.setState({ show_dropdown: true, render_first: true })
		}
	}

	dismiss(){
		var api_result = undefined
		if (this.state.onShow !== undefined) {
			api_result = this.state.onShow()
		}

		if (api_result || api_result === undefined) {
			this.setState({ show_dropdown: false })
		}
	}

	render() {

	    const { 
	    	dropdown_btn, 
	    	dropdown_element,
	    	position, 
	    	show_dropdown ,
	    	render_first,
	    } = this.state
	    
	    return (
		    <div className={ "dropdown " + position + ' ' + this.props.className }>
		    	<div 
		    		className="dropdown-trigger"
		    		onClick={this.handle_dropdown_click}
		    		>
		    		{ dropdown_btn }
		    	</div>
		    	{
		    		render_first &&
		    		<div 
		    			className={"dropdown-element " + (show_dropdown ? '' : 'd-none') }
		    			onClick={this.handle_drop_down_element_click}>
			    		{ dropdown_element }
			    	</div>
		    	}
		    	{
		    		show_dropdown &&
		    		<div 
		    			className="dropdown-mask"
		    			onClick={this.handle_dropdown_mask_click}>
			    		
			    	</div>
		    	}
		    </div>
	    )
  	}
}

// Cell.propTypes = {
// 	style: PropTypes.string.isRequired,
// 	value: PropTypes.string.isRequired,
// }

export default Dropdown