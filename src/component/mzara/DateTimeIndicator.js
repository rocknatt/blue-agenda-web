import React, { Component } from 'react'

import Utils from '../../Utils/Utils'

import Moment from "moment"

class DateTimeIndicator extends Component {
    state = {

    }

    lang = null

    constructor(props){
        super(props)

        this.state = {
            className: props.className,
            date_time_value: props.date_time_value,
            is_date_span: props.is_date_span,
            is_simple_date_span: props.is_simple_date_span,
            is_auto_update : props.is_auto_update === undefined ? true : props.is_auto_update,
        }

        this.lang = props.lang
    }

    componentWillMount(){

    }

    componentWillUnmount(){
        clearInterval(this.update_interval)
    }

    componentWillUpdate(nextProps, nextState){

    }

    update_interval
    componentDidMount(){
        //On force le composant à se renderer tout les 30 secondes
        //Todo : à évaluer : Le composant peut ne pas se renderer si elle n'est pas visible sur l'écran
        this.update_interval = setInterval(() => {
            this.refresh()
        }, 30000)
    }

    refresh(){
        this.forceUpdate()
    }

    get_date_time_span(date_time) {

        if (date_time === undefined) {
            return ''
        }

        var date_now = new Moment();
        var date_to_compare = new Moment(date_time);

        var date_span = Math.round((date_now - date_to_compare) / 1000);
        var negatif = date_span < 0;
        if (negatif) {
            date_span = date_span * -1;
        }
        var minute = Math.round(date_span / 60);
        var hour = Math.round(minute / 60);
        var day = Math.round(hour / 24);

        // console.log(date_now, date_time, date_to_compare, (date_now - date_to_compare), date_span, minute, hour, day)

        if (negatif) {
            if (day >= 7) {

                if (day / 7 <= 1) {
                    return this.lang.line('std_one_week_left');
                }
                if (day / 7 <= 2) {
                    return this.lang.line('std_two_week_left');
                }
                if (day / 7 <= 3) {
                    return this.lang.line('std_three_week_left');
                }
                if (day / 7 <= 4) {
                    return this.lang.line('std_one_month_left');
                }
                if (day / 7 > 1) {
                    return Moment(date_time).format('DD-MM-YYYY');
                }
            }else if (day > 0) {
                if (day == 1) {
                    return this.lang.line('std_one_day_left');
                }
                return Utils.sprintf(this.lang.line('std_x_day_left'), day);
            }else if(hour > 0){
                if (hour == 1) {
                    return this.lang.line('std_one_hour_left');
                }else{
                    return Utils.sprintf(this.lang.line('std_x_hour_left'), hour);
                }
            }else if (minute > 0) {
                if (minute <= 60) {
                    if (minute == 1) {
                        return this.lang.line('std_one_minute_left');
                    }
                    return Utils.sprintf(this.lang.line('std_x_minute_left'), minute);
                }
            }else{
                return this.lang.line('std_at_one_moment');
            }
        }else{

            if (day >= 7) {

                if (day / 7 <= 1) {
                    return this.lang.line('std_one_week_ago');
                }
                if (day / 7 <= 2) {
                    return this.lang.line('std_two_week_ago');
                }
                if (day / 7 <= 3) {
                    return this.lang.line('std_three_week_ago');
                }
                if (day / 7 <= 4) {
                    return this.lang.line('std_one_month_ago');
                }
                if (day / 7 > 1) {
                    return Moment(date_time).format('DD-MM-YYYY');
                }
            }else if (day > 0) {
                if (day == 1) {
                    return this.lang.line('std_one_day_ago');
                }
                return Utils.sprintf(this.lang.line('std_x_days_ago'), day);
            }else if(hour > 0){
                if (hour == 1) {
                    return this.lang.line('std_one_hour_ago');
                }else{
                    return Utils.sprintf(this.lang.line('std_x_hour_ago'), hour);
                }
            }else if (minute > 0) {
                if (minute <= 60) {
                    if (minute == 1) {
                        return this.lang.line('std_one_minute_ago');
                    }
                    return Utils.sprintf(this.lang.line('std_x_minute_ago'), minute);
                }
            }else{
                return this.lang.line('std_a_moment_ago');
            }
        }
    }

    get_simple_date_time_span(date_time) {
        var date_now = new Date();
        var date_to_compare = new Date(date_time);

        var date_span = Math.round((date_now - date_to_compare) / 1000);
        var negatif = date_span < 0;
        if (negatif) {
            date_span = date_span * -1;
        }
        var minute = Math.round(date_span / 60);
        var hour = Math.round(minute / 60);
        var day = Math.round(hour / 24);

        if (negatif) {
            if (day >= 7) {

                if (day / 7 <= 1) {
                    return '> 1S';
                }
                if (day / 7 <= 2) {
                    return '> 2S';
                }
                if (day / 7 <= 3) {
                    return '> 3S';
                }
                if (day / 7 <= 4) {
                    return '> 1M';
                }
                if (day / 7 > 1) {
                    return Moment(date_time).format('DD-MM-YYYY');
                }
            }else if (day > 0) {
                if (day == 1) {
                    return '> 1J';
                }
                return '> ' + day + 'J';
            }else if(hour > 0){
                if (hour == 1) {
                        return '> 1h';
                }else{
                    return '> ' + hour + 'h';
                }
            }else if (minute > 0) {
                if (minute <= 60) {
                    if (minute == 1) {
                        return '> 1m';
                    }
                    return '> ' + minute + 'm';
                }
            }else{
                return '...';
            }
        }else{

            if (day >= 7) {

                if (day / 7 <= 1) {
                    return '< 1S';
                }
                if (day / 7 <= 2) {
                    return '< 2S';
                }
                if (day / 7 <= 3) {
                    return '< 3S';
                }
                if (day / 7 <= 4) {
                    return '< 1M';
                }
                if (day / 7 > 1) {
                    return Moment(date_time).format('DD-MM-YYYY');
                }
            }else if (day > 0) {
                if (day == 1) {
                    return '< 1J';
                }
                return '< ' + day + 'J';
            }else if(hour > 0){
                if (hour == 1) {
                        return '< 1h';
                }else{
                    return '< ' + hour + 'h';
                }
            }else if (minute > 0) {
                if (minute <= 60) {
                    if (minute == 1) {
                        return '< 1m';
                    }
                    return '< ' + minute + 'm';
                }
            }else{
                return '...';
            }
        }
    }

    render() {

        const { date_time_value, is_date_span, is_auto_update, is_simple_date_span, className } = this.state

        var dt = new Date(date_time_value)
        var view_date_value = dt.toLocaleString()
        var date_span = this.get_date_time_span(date_time_value)

        if (is_simple_date_span) {
            date_span = this.get_simple_date_time_span(date_time_value)
        }

        if (date_span === 'Invalid date') {
            date_span = ''
        }

        if (is_date_span) {
            return (
                <span className={ 'date-time-span ' + className} title={ view_date_value }>{ date_span }</span>
            )
        }

        return (
            <span className={ 'date-time-span ' + className} title={ this.get_simple_date_time_span(date_time_value) }>{ view_date_value }</span>
        )
    }
}

export default DateTimeIndicator