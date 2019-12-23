import React from 'react'

import ButtonSpinner from './ButtonSpinner'

const ButtonSubmit = (props) => (
	<button className={"btn btn-primary btn-block mb-15 " + (props.is_submiting ? 'disabled' : '') + ' ' + props.className} type="submit">
        {
        	props.text === undefined ? props.lang.line('std_submit') : props.text
        }
        {
            props.is_submiting ?
            <ButtonSpinner /> :
            <i className="fa fa-save ml-10"></i>
        }
    </button>
)

export default ButtonSubmit