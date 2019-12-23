import React from 'react';

import { expect } from 'chai'
import { shallow } from 'enzyme'

import App from './App';
import Root from './Root';

describe('<App />', () => {
	it('renders without crashing', () => {
		const wrapper = new shallow(<App />)

		expect(wrapper).to.contain(<Root />)
	})
})


// it('demoes', () => {
//   expect({ name: 'Joe'}).toEqual({ name: 'Jane'})
// })