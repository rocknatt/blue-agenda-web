import React from 'react';

import { expect } from 'chai'
import { shallow } from 'enzyme'

import App from '../App';
import Navigation from '../navigation/Navigation';

import Bubble from '../page/post/Bubble';
import Modal from '../component/modal/Modal';

const default_post_data = {"id":"145","user_id":"7","shop_id":null,"event_id":"3","date_ajout":"2019-08-01 05:07:11","contenu":"Je viendrai","galerie_id":null,"is_published":"1","is_deleted":"0","post_privacy_id":"1","user_name":"nantenaina.fahendrena","user_view_name":"Nantenaina Fahendrena","shop_name":null,"shop_tag_link":null,"shop_tag_name":null,"shop_is_trusted":null,"shop_image_id":null,"image_list":"213,214","love_nb":"0","comment_nb":"0","is_editable":true,"is_deletable":true,"is_loved":false}

describe('<Bubble />', () => {
	it('renders without crashing', () => {

		const wrapper = new shallow(<App />)

		console.log(wrapper.find('Navigation'))


		// expect(wrapper).to.contain(<Modal />)
	})

	it('click on image', () => {

		const onClick = jest.fn()
		const wrapper = new shallow(<Bubble
			data={default_post_data}
		 />)

		console.log(wrapper)
		// wrapper.find('ButtonLove').simulate('onClick')

		expect(wrapper.find('Modal')).to.have.length(1)
	})
})


// it('demoes', () => {
//   expect({ name: 'Joe'}).toEqual({ name: 'Jane'})
// })