import React from 'react'

import ButtonSpinner from './ButtonSpinner'

const ButtonSubmitNext = (props) => (
	<button href={props.href} className={ "btn btn-primary " + (props.is_submiting ? 'disabled' : '') + ' ' + props.className} 
		type="submit"
		onClick={props.onClick}>
		{props.text}
		{
            props.is_submiting ?
            <ButtonSpinner /> :
            <i className="fa fa-chevron-right ml-10"></i> 
        }
		
	</button>
)

export default ButtonSubmitNext