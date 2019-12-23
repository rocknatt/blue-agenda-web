import React from 'react'

const ButtonReserve = (props) => (
	<button 
		type="button"
		title={props.title}
		className={ "btn btn-share " + props.className + ' ' + (props.is_shared ? 'active' : '') }
		onClick={props.onClick}>
		<i className="fa fa-ticket-alt"></i>
		{
			<span className="text">{props.text}</span>
		}
		{
			(props.booked_nb !== undefined && props.booked_nb !== 0) &&
			<span> • {props.booked_nb}</span>
		}
	</button>
)

export default ButtonReserve