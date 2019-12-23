import React from 'react'

import Utils from '../../Utils/Utils'

const ButtonTrusted = (props) => (
	<a 
		href={ Utils.site_url('home/trust') }
		title={props.title}
		className={ "btn-trusted " }
		onClick={props.onClick}>
		<i className={"fa fa-check-circle "}></i>
	</a>
)

export default ButtonTrusted