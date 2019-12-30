
class DateHelper {

	/**
	 * 
	 * @return int current year
	 */
	static get_current_year(){
        return new Date().getFullYear()
    }

    /**
     * get the first day of the month
     * @param  {int} month 
     * @param  {int} year  
     * @return {int}       
     */
    static get_first_day_in_mounth(month, year){
        return new Date(year, month, 0).getDay()
    }

    /**
     * get days number of the year
     * @param  {int} month 
     * @param  {int} year 
     * @return {int}
     */
    static get_days_in_mounth(month, year){
        return new Date(year, month + 1, 0).getDate()
    }
    
}
export default DateHelper