import React from 'react'

const Spinner = (props) => (
	<div className={"spinner-container spinner-container-" + props.position + " icon-x-" + props.size + ' ' + props.className } style={ props.style }>
		<i className="fa fa-spinner fa-w fa-pulse"></i>
	</div>
)

export default Spinner