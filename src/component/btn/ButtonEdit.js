import React from 'react'

const ButtonEdit = (props) => (
	<button 
		type="button"
		className={ "btn btn-success btn-edit " + props.className}
		onClick={props.onClick}>
		<i className="fa fa-pen"></i>
		{
			props.text
		}
	</button>
)

export default ButtonEdit