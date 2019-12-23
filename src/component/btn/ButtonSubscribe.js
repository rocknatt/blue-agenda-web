import React from 'react'

const ButtonSubscribe = (props) => (
	<button 
		type="button"
		title={props.title}
		className={ "btn btn-default btn-subscribe " + props.className + ' ' + (props.is_subscribed ? 'active' : '') }
		onClick={props.onClick}>
		{
			props.is_subscribed &&
			<i className={"fa fa-check " + (props.is_subscribed ? 'animated heartBeat' : '' )}></i> 
		}

		{
			!props.is_subscribed &&
			<i className={"fa fa-rss " + (props.is_subscribed ? 'animated heartBeat' : '' )}></i> 
		}
		
		{
			props.text
		}
	</button>
)

export default ButtonSubscribe