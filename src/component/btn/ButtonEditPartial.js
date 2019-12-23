import React from 'react'

const ButtonEditPartial = (props) => (
	<button 
		type="button"
		className={ "btn btn-default btn-edit-partial " + props.className}
		onClick={props.onClick}>
		{
			props.is_edited ?
			<i className="fa fa-edit"></i> :
			<i className="fa fa-check"></i>
		}
	</button>
)

export default ButtonEditPartial