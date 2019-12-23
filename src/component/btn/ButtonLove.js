import React from 'react'

const ButtonLove = (props) => (
	<button 
		type="button"
		title={props.title}
		className={ "btn btn-default btn-love " + props.className + ' ' + (props.is_loved ? 'active' : '' ) }
		onClick={props.onClick}>
		<i className={"fa fa-heart " + (props.is_loved ? 'animated heartBeat' : '' )}></i>
		{
			props.text
		}
	</button>
)

export default ButtonLove