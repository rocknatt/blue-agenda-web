import React from 'react'

import ButtonSpinner from './ButtonSpinner'

const ButtonPost = (props) => (
	<button 
		type="button"
		title={props.title}
		className={ "btn btn-danger btn-order " + props.className }
		onClick={props.onClick}>

		{
            props.is_submiting &&
            <ButtonSpinner />
        }

        <i className="fa fa-shopping-basket"></i>
		{
			props.text
		}
		
	</button>
)

export default ButtonPost