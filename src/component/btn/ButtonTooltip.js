import React from 'react'
import Tooltip from '../Tooltip.js'
import TooltipConfirmation from '../TooltipConfirmation.js'

const ButtonTooltip = (props) => (
	<Tooltip
		className="btn-tooltip"
		trigger="click"
		tooltip={
			<TooltipConfirmation
				title={props.title}
				message={props.message}
				cancel_class_name={props.cancel_class_name ? props.cancel_class_name : 'btn-default'}
				ok_class_name={props.ok_class_name ? props.ok_class_name : 'btn-primary'}
				cancel_label={props.cancel_label ? props.cancel_label : 'Cancel'}
				ok_label={props.ok_label ? props.ok_label : 'Ok'}
				icon_cancel_class_name={props.ok_label ? props.ok_label : 'fa-undo'}
				icon_ok_class_name={props.ok_label ? props.ok_label : 'fa-check'}
				onOkClick={props.onOkClick}
				onCancelClick={props.onCancelClick}
				/>
		}
		>
		<button 
			type="button"
			className={ "btn btn-danger btn-delete " + props.className}
			onClick={props.onClick}>
			<i className={'fa ' + props.icon_class_name}></i>
			{
				props.text
			}
		</button>
	</Tooltip>
)

export default ButtonTooltip