import React from 'react'

const Spinner = (props) => (
	<div className={'tooltip-confirm ' + props.className}>
		<h1 className="title">
			{ props.title }
		</h1>

		<span>{ props.message }</span>

		<div className="btn-cmd">
			<button className={"btn btn-sm btn-ok " + props.cancel_class_name} onClick={props.onCancelClick}>
				<i className={ 'fa ' + props.icon_cancel_class_name }></i>
				{ props.cancel_label }
			</button>

			<button className={"btn btn-sm btn-cancel " + props.ok_class_name} onClick={props.onOkClick}>
				<i className={ 'fa ' + props.icon_ok_class_name }></i>
				{ props.ok_label }
			</button>
		</div>
	</div>
)

export default Spinner