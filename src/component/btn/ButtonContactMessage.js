import React from 'react'

const ButtonContactMessage = (props) => (
	<button 
		type="button"
		title={props.title}
		className={ "btn btn-default btn-comment noAjax chat-bubble " + props.className + ' ' + (props.is_commented ? 'active' : '') }
        data-chat-user-id={props.user_id}
        data-chat-shop-id={props.shop_id}
		onClick={props.onClick}>
		<i className="fa fa-comments"></i> 
		{
			props.text
		}
	</button>
)

export default ButtonContactMessage