import React from 'react'

const ButtonComment = (props) => (
	<button 
		type="button"
		title={props.title}
		className={ "btn btn-default btn-comment " + props.className + ' ' + (props.is_commented ? 'active' : '') }
		onClick={props.onClick}>
		<i className="fa fa-comment"></i> 
		{
			props.text
		}
	</button>
)

export default ButtonComment