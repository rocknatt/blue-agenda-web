import { DOMHelper } from 'mzara-library'

var src = document.getElementById('src')
var url = DOMHelper.attr(src, 'data-url')
var base_url = DOMHelper.attr(src, 'data-base-url')
var websocket = DOMHelper.attr(src, 'data-websocket') 
var websocket_boot = DOMHelper.attr(src, 'data-websocket-boot')
var environment = DOMHelper.attr(src, 'data-environment')
var lang = DOMHelper.attr(src, 'data-lang')

export default {
	url: url,
	base_url: base_url,
	websocket: websocket,
	websocket_boot: websocket_boot,
	environment: environment,
	lang: lang,
	require_auth: false
}