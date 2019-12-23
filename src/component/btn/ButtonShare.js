import React from 'react'

const ButtonShare = (props) => (
	<button 
		type="button"
		title={props.title}
		className={ "btn btn-default btn-share " + props.className + ' ' + (props.is_shared ? 'active' : '') }
		onClick={(e) => props.navigation.share({ entity_id: props.entity_id, entity_name: props.entity_name, entity_type: props.entity_type, entity_link: props.entity_link }, props.callback)}>
		<i className="fa fa-share-alt"></i>
		{
			<span className="text">{props.text}</span>
		}
		{
			(props.shared_nb !== undefined && props.shared_nb !== 0) &&
			<span> • {props.shared_nb}</span>
		}
	</button>
)

export default ButtonShare