

class Booking {
    ajax = null

    list = []
    metadata_list = {}
    metadata = null
    index = 0
    nb = 10
    is_last = false
    list_change_callback_list = []
    table_column_list_change_callback_list = []
    sort_list = null
    time_error_marge = 0.25 //percent

    data = null



    constructor(props){
        this.ajax = props.ajax
        this.lang = props.lang

        this.refresh_callback = props.refresh_callback

        this.props = props

        // this.props.hub.add_event_listner(this.handle_hub_change)
        //todo : hub event listener for list_change, data_change

        this.list = [
            { id: 1, title: 'New booking 1', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod', date: '2020/01/08', hour_begin: '09:30', hour_end: '10:15', is_deletable: true },
            { id: 2, title: 'New booking 2', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod', date: '2020/01/10', hour_begin: '09:30', hour_end: '10:15', is_deletable: true },
            { id: 3, title: 'New booking 3', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod', date: '2020/01/13', hour_begin: '09:30', hour_end: '10:15', is_deletable: true },
            { id: 4, title: 'New booking 4', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod', date: '2020/01/13', hour_begin: '09:30', hour_end: '10:15', is_deletable: true },
        ]
    }

    get_item_list(data_begin, date_end){
        //for now, just ripped data

        return this.list
    }

    create(data, success, error){

        this.list.push({
            id: parseInt(Math.random() * 100),
            title: data.title,
            description: data.description,
            date: data.date,
            hour_begin: data.hour_begin,
            hour_end: data.hour_end
        })

        success()
        //todo : push to remote

        // this.props.ajax.send_request({
        //     url: 'account',
        //     type: 'POST',
        //     data: data,
        //     content_type: 'json',
        //     data_type: 'json',
        //     done: (xhr, response) => {

        //         if (xhr.status === 201) {
        //             this.dispatch_list_change()
        //             success(response)
        //         }

        //         if (xhr.status === 500 || xhr.status === 400) {
        //             let message = ''
        //             for(let index in response.messages){
        //                 message = response.messages[index]
        //             }
        //             error(message)
        //         }
        //     }
        // })
    }

    update(data, success, error){
        //update_list
        const _item = this.get_item(data.id)
        for(let index in data){
            _item[index] = data[index]
        }

        success()

        //Todo : push to remote

        // this.props.ajax.send_request({
        //     url: 'account',
        //     type: 'PUT',
        //     data: data,
        //     content_type: 'json',
        //     data_type: 'json',
        //     // before_send: () => { before_send() },
        //     done: (xhr, response) => {

        //         if (xhr.status === 201) {
        //             this.props.ajax.set_cache('account/'+ this.metadata.id, 'GET', this.metadata)
        //             success()
        //         }

        //         // if (xhr.status === 500 || xhr.status === 400) {
        //         //     error(response.messages.error)
        //         // }
        //     }
        // })
    }

    read(id){
        return this.get_item(id)
    }

    delete(id, success, error){

        const item_index = this.get_item_index(id)
        this.list.splice(item_index, 1)
        this.dispatch_list_change()

        success()
        //Todo : push to remote

        // this.props.ajax.send_request({
        //     url: 'account',
        //     type: 'DELETE',
        //     data_type: 'json',
        //     done: (xhr, response) => {

        //         if (xhr.status === 201) {
        //             let index_catched = null
        //             this.list.map((account, index) => {
        //                 if (account.id == id) {
        //                     index_catched = index
        //                 }
        //             })

        //             if (index_catched !== null) {
        //                 this.list.splice(index_catched, 1)
        //                 this.dispatch_list_change()
        //             }

        //             //update_metadata
        //             this.metadata_list['_' + id] = undefined
        //             this.dispatch_data_change(this.metadata_list['_' + id])
        //         }

        //         // if (xhr.status === 500 || xhr.status === 400) {
        //         //     error(response.messages.error)
        //         // }
        //     }
        // })
    }

    get_item(id){
        let result = null
        this.list.map((item, index) => {
            if (item.id === id) {
                result = item
            }
        })

        return result
    }

    get_item_index(id){
        let result = null
        this.list.map((item, index) => {
            if (item.id === id) {
                result = index
            }
        })

        return result
    }

    get_form(data){

        const date_now = new Date()
        const year_now = date_now.getFullYear()
        return {
            title: this.props.lang.line('std_new_booking'),
            data_list: [
                {
                    type: 'hidden',
                    name: 'id',
                    id: 'id',
                    value: data.id,
                },
                {
                    label: this.props.lang.line('std_title'),
                    type: 'text',
                    name: 'title',
                    id: 'title',
                    value: data.title,
                    placeholder: this.props.lang.line('std_title'),
                    is_required: true,
                },
                {
                    label: this.props.lang.line('std_description'),
                    type: 'textarea',
                    name: 'description',
                    id: 'description',
                    value: data.description,
                    placeholder: this.props.lang.line('std_description'),
                    is_required: true,
                },
                {
                    label: this.props.lang.line('std_date'),
                    type: 'date',
                    name: 'date',
                    id: 'date',
                    value: data.date_str,
                    min_year: year_now,
                    year_length: 5,
                    placeholder: this.props.lang.line('std_date'),
                    is_required: true,
                },
                {
                    label: this.props.lang.line('std_heure_begin'),
                    type: 'time',
                    name: 'hour_begin',
                    id: 'hour_begin',
                    value: data.hour_begin,
                    placeholder: this.props.lang.line('std_heure_begin'),
                    is_required: true,
                },
                {
                    label: this.props.lang.line('std_heure_end'),
                    type: 'time',
                    name: 'hour_end',
                    id: 'hour_end',
                    value: data.hour_end,
                    placeholder: this.props.lang.line('std_heure_end'),
                    is_required: true,
                },

            ]

        }
    }

    add_event_listner(event_name, _function){
        if (event_name === undefined) {
            return false
        }

        switch(event_name){

            case 'list_change':
                this.list_change_callback_list.push(_function);
                break;

        }
    }

    remove_event_listner = (event_name, _function) => {

        if (event_name === undefined) {
            return false
        }

        var index_catched = null

        switch(event_name){

            case 'list_change':
                this.list_change_callback_list.map((event, index) => {
                    if (event === _function) {
                        index_catched = index
                    }
                })

                if (index_catched === null){
                    return false
                }

                this.list_change_callback_list.splice(index_catched, 1)
                break;

        }
    }

    dispatch_list_change(param){
        this.list_change_callback_list.map((event) => {
            if (typeof event === 'function') {
                event(param)
            }
        })
    }

}


export default Booking