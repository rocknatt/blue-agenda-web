import React from 'react'

const ButtonInterest = (props) => (
	<button 
		type="button"
		title={props.title}
		className={ "btn btn-default btn-interested " + props.className + ' ' + (props.is_interested ? 'active' : '') }
		onClick={props.onClick}>
		{
			props.is_interested &&
			<i className={"fa fa-check " + (props.is_interested ? 'animated heartBeat' : '' )}></i> 
		}

		{
			!props.is_interested &&
			<i className={"fa fa-star " + (props.is_interested ? 'animated heartBeat' : '' )}></i> 
		}
		
		{
			<span className="text">{props.text}</span>
		}
		{
			(props.interested_nb !== undefined && props.interested_nb !== 0) &&
			<span> • {props.interested_nb}</span>
		}
	</button>
)

export default ButtonInterest