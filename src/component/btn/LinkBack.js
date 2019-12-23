import React from 'react'

const LinkBack = (props) => (
	<a href={props.href} className={ "btn btn-default " + props.className}
		onClick={props.onClick}>
		<i className="fa fa-chevron-left mr-10"></i> 
		{props.lang.line('std_back')}
	</a>
)

export default LinkBack