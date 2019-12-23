import React from 'react'

const ButtonPost = (props) => (
	<button 
		type="submit"
		title={props.title}
		className={ "btn btn-post " + props.className + ' ' + (props.is_loved ? 'active' : '' ) }
		onClick={props.onClick}>
		{
			props.text
		}
		{
			props.is_submiting ?
			<i className="fa fa-bullhorn animated infinite tada"></i> :
			<i className="fa fa-bullhorn"></i>
		}
		
	</button>
)

export default ButtonPost