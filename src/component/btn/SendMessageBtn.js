import React from 'react'

const SendMessageBtn = (props) => (
	<a href={props.href} className={ "btn btn-default btn-send " + props.className}
		onClick={props.onClick}>
		<i className="fa fa-comment"></i> 
		{props.lang.line('std_message')}
	</a>
)

export default SendMessageBtn