

class Entity {
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
            { id: 1, designation: 'New booking 1', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod', date: '2020/01/08', hour_begin: '09:30', hour_end: '10:15' },
            { id: 2, designation: 'New booking 2', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod', date: '2020/01/10', hour_begin: '09:30', hour_end: '10:15' },
            { id: 3, designation: 'New booking 3', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod', date: '2020/01/13', hour_begin: '09:30', hour_end: '10:15' },
            { id: 4, designation: 'New booking 4', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod', date: '2020/01/13', hour_begin: '09:30', hour_end: '10:15' },
        ]
    }

    get_item_list(data_begin, date_end){
        //for now, just ripped data

        return this.list
    }

    create(data, success, error){

        //Exception dev
        let adr = {
            id: parseInt(Math.random() * 100),
        }

        for(let index in data){
            adr[index] = data[index]
        }

        this.list.push(adr)

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

    delete(id){

        const item_index = this.get_item_index(id)
        this.list.splice(item_index, 1)
        this.dispatch_list_change()

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


export default Entity