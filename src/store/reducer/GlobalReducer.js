const initialState = { ajax: null, lang: null, user: null, user_rip: null, hub: null, chat_user_message: null, chat_controller: null, navigation: null }

function GlobalReducer(state = initialState, action){
	let nextState
	// console.log('initAjax', action)
	switch(action.type){
		case 'INIT_AJAX':
			nextState = {
	        	...state,
	        	ajax: action.ajax
	        }
			return nextState
			break;

		case 'INIT_LANG':
			nextState = {
	        	...state,
	        	lang: action.lang
	        }
			return nextState
			break;

		case 'INIT_USER':
			nextState = {
	        	...state,
	        	user: action.user
	        }
			return nextState
			break;

		case 'INIT_HUB':
			nextState = {
	        	...state,
	        	hub: action.hub
	        }
			return nextState
			break;

		case 'INIT_NAVIGATION':
			nextState = {
	        	...state,
	        	navigation: action.navigation
	        }
			return nextState
			break;

		case 'INIT_USER_RIP':
			nextState = {
	        	...state,
	        	user_rip: action.user_rip
	        }
			return nextState
			break;

		case 'INIT_CHAT_USER_MESSAGE':
			nextState = {
	        	...state,
	        	chat_user_message: action.chat_user_message
	        }
			return nextState
			break;

		case 'INIT_CHAT':
			nextState = {
	        	...state,
	        	chat_controller: action.chat_controller
	        }
			return nextState
			break;
		
		default: 

			return state
			break
	}
}

export default GlobalReducer