import React from 'react'

const LinkNext = (props) => (
	<a href={props.href} className={ "btn btn-primary " + props.className}
		onClick={props.onClick}>
		{props.text}
		<i className="fa fa-chevron-right ml-10"></i> 
	</a>
)

export default LinkNext