import React from 'react'

const FollowBtn = (props) => (
	<a href={props.href} className={ "btn btn-default " + props.className}
		onClick={props.onClick}>
		<i className="fa fa-rss"></i> 
		{props.lang.line('std_follow')}
	</a>
)

export default FollowBtn