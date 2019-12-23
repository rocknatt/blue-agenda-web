import Adapter from 'enzyme-adapter-react-16'
import { configure as configure_enzyme } from 'enzyme'
import chai from 'chai'
import create_chai_enzyme from 'chai-enzyme'
import dirty_chai from 'dirty-chai'
import create_chai_jest_diff from 'chai-jest-diff'

chai.use(dirty_chai)
	.use(create_chai_jest_diff())
	.use(create_chai_enzyme())

configure_enzyme({ adapter: new Adapter() })