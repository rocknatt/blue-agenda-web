import { createStore } from 'redux'
import initGlobal from './reducer/GlobalReducer'

export default createStore(initGlobal)