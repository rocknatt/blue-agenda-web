import React from 'react'

const ButtonAddPartial = (props) => (
	<button 
		type="button"
		className={ "btn btn-default btn-add-partial " + props.className}
		onClick={props.onClick}>
		<i className="fa fa-plus-circle"></i>
	</button>
)

export default ButtonAddPartial