
class Utils {
	static test() {
		alert()
	}

	static base_url(){
		var src = document.getElementById('src')

		return Utils.attr(src, 'sp-base-url')
	}

	static site_url(url){
		return Utils.base_url() + url
	}

	static extend(defaultObject, newObject){
		for(var prop in newObject){
			defaultObject[prop] = newObject[prop]
		}

		return defaultObject
	}

	static is_visible(element){
		var rect = element.getBoundingClientRect()
		var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
		return !(rect.bottom < 0 || rect.top - viewHeight >= 0)
	}

	static to_escaped_string(str){
		return str.replace(/(\\)/g, '\\\\')
				.replace(/(?:\r\n|\r|\n)/g, '\\n')
				.replace(/(\")/g, '\\"')
				.replace(/(\')/g, '\\\'')
	}

	static nl2br(str) {
		if (str === null || str === undefined) {
			return ''
		}
		str = str.toString()
	    return str != null ?  str.replace(/(?:\r\n|\r|\n)/g, '<br/>') : '';
	}

	static string_format(str, args) {
		if (str === null || str === undefined) {
			return ''
		}
		var regex = new RegExp("{-?[0-9]+}", "g")
	    return str.replace(regex, function(item) {
	        var intVal = parseInt(item.substring(1, item.length - 1));
	        var replace;
	        if (intVal >= 0) {
	            replace = args[intVal];
	        } else if (intVal === -1) {
	            replace = "{";
	        } else if (intVal === -2) {
	            replace = "}";
	        } else {
	            replace = "";
	        }
	        return replace;
	    });
	}

	static is_numeric(str){
		// var regex = new RegExp('^[0-9 ,.]{1,}$', 'g')

		return /^[\-|\+]?[0-9 ]{1,}([\.|\,][0-9 ]{1,})?$/g.test(str)

		// return regex.exec(str) !== null

		// return Utils.try_parse_float(str) !== null
	}

	static is_string(str){
		typeof str === 'string' || str instanceof String
	}

	static to_numeric_string(str, normalize, maximum_fraction_digit){
		var value = Utils.try_parse_float(str)

		if (value !== null && !isNaN(value)) {
			// console.log(str, value, normalize, maximum_fraction_digit)
			return value.toLocaleString(normalize, { minimumFractionDigits: maximum_fraction_digit, maximumFractionDigits: maximum_fraction_digit})
		}
		return str
	}

	static number_format (number, decimals, dec_point, thousands_sep) {
	    // Strip all characters but numerical ones.
	    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
	    var n = !isFinite(+number) ? 0 : +number,
	        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
	        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
	        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
	        s = '',
	        toFixedFix = function (n, prec) {
	            var k = Math.pow(10, prec);
	            return '' + Math.round(n * k) / k;
	        };
	    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
	    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	    if (s[0].length > 3) {
	        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	    }
	    if ((s[1] || '').length < prec) {
	        s[1] = s[1] || '';
	        s[1] += new Array(prec - s[1].length + 1).join('0');
	    }
	    return s.join(dec);
	}

	static preg_quote (str, delimiter) { // eslint-disable-line camelcase
		//  discuss at: http://locutus.io/php/preg_quote/
		// original by: booeyOH
		// improved by: Ates Goral (http://magnetiq.com)
		// improved by: Kevin van Zonneveld (http://kvz.io)
		// improved by: Brett Zamir (http://brett-zamir.me)
		// bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
		//   example 1: preg_quote("$40")
		//   returns 1: '\\$40'
		//   example 2: preg_quote("*RRRING* Hello?")
		//   returns 2: '\\*RRRING\\* Hello\\?'
		//   example 3: preg_quote("\\.+*?[^]$(){}=!<>|:")
		//   returns 3: '\\\\\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:'
		return (str + '' )
		. replace( new RegExp ( '[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '' ) + '-]' , 'g' ), '\\$&' )
	}

	static get_number_precision (value) {
		if (!isFinite(value)) {
			return 0
		}

		const [int, float = ''] = Number(value).toFixed(12).split('.')

		let precision = float.length
		while( float[precision - 1] === '0' && precision >=0) {
			precision--
		}

		return precision
	}

	static get_date_translated_patern (value) {
		var adr = value.split(/\/|\-/)

		try{
			return adr[1] + '/' + adr[0] + '/' + adr[2]
		}catch(e){ 
			return null
		}
	}

	static get_uniqid(pref){
		if (pref === undefined) {
			pref = ''
		}

		return pref + '' + Math.random().toString(36).substr(2, 9)
	}

	static is_string_pattern(str){
		str = str.trim()
		return /^"(.)*?"/.test(str) 
	}

	static is_date_time_exp (value) {
		//"DD/MM/YYYY" ou "DD/MM/YYYY HH:mm" ou "DD/MM/YYYY HH:mm:ss"
		//"DD MMM YYYY" ou "DD MMM. YYYY" ou "DD MMMM YYYY" ou "DD MMMM YYYY HH:ii" ou "DD MMMM YYYY HH:ii:ss" 
		//"HH:mm" ou "HH:mm:ss"
		return /^[0-9]{1,2}[\/|\-][0-9]{1,2}[\/|\-][0-9]{2,4}( [0-2][0-9]\:[0-6][0-9](\:[0-6][0-9])?)?/.test(value) || 
			/^[0-9]{1,2}[\/|\-| ][A-Za-z]{3,8}(.)?[\/|\-| ][0-9]{2,4}( [0-2][0-9]\:[0-6][0-9](\:[0-6][0-9])?)?/.test(value) || 
			/^[0-9]{1,2}[\/|\-][0-9]{1,2}[\/|\-][0-9]{2,4} [0-2][0-9]\:[0-6][0-9](\:[0-6][0-9])?/.test(value)
	}

	static is_date (value) {
		//On essaye d'inverser les deux premier patern si la date commence sous la forme "05/12/2018"
		if (/^[0-9]{1,2}[\/|\-][0-9]{1,2}[\/|\-][0-9]{2,4}/.test(value)) {
			value = Utils.get_date_translated_patern(value)
		}
		
		var _date = new Date(value)

		if (_date !== "Invalid Date"){
			return _date
		}

	    return false;
	}

	static is_http_link(value) {
		return /^http(s)?:\/\//.test(value)
	}

	static try_parse_float(str){
		try {
			var result = parseFloat(str)
			return isNaN(result) ? 0 : result
		} catch(e) {
			return null
		}
	}

	static attr(object, str, value){
		if (object === null) {
			return undefined
		}
		for (var i = 0; i < object.attributes.length; i++) {
			if (object.attributes[i].name === str) {
				if (value !== undefined) {
					object.attributes[i].value = value
				}
				return object.attributes[i].value
			}
		}

		return undefined
	}

	static addClass(object, str){
		if (object === undefined) {
			return false
		}

		if (!Utils.hasClass(object, str)) {
			object.className += ' ' + str;
		}
	}

	static removeClass(object, str){
		if (object === undefined) {
			return false
		}

		var className_array = object.className.split(' ');
		var result = ''
		for (var i = 0; i < className_array.length; i++) {
			if (className_array[i] !== '' && className_array[i] !== str) {
				result += ' ' + className_array[i]
			}
		}

		object.className = result
	}

	static toggleClass(object, str){
		if (object === undefined) {
			return false
		}

		if (!Utils.hasClass(object, str)) {
			Utils.addClass(object, str)
		}else{
			Utils.removeClass(object, str)
		}
	}

	static hasClass(object, str){
		if (object === undefined) {
			return false
		}

		if (typeof object.className !== 'string') {
			return false
		}

		var className_array = object.className.split(' ');

		for (var i = 0; i < className_array.length; i++) {
			if (className_array[i] === str) {
				return true;
			}
		}

		return false
	}

	static hasFocus(query_selector){
		var hasFocus = false
		var element_list = document.querySelectorAll(query_selector);

		element_list.forEach((element) => {
			if (document.activeElement === element) {
				hasFocus = true
			}
		})
		// check for focus
		return hasFocus;
	}


	static rgb2hex(rgb){
	 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	 return (rgb && rgb.length === 4) ? "#" +
	  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	}

	static get_text_size(str, fontSize, max_width){

		if (fontSize === undefined || fontSize === '') {
			fontSize = '12px'
		}

		var text = document.getElementById("text-container")
		text.innerHTML = str.replace(/(?:\r\n|\r|\n)/g, '<br/>|')
		text.style.fontSize = fontSize
		text.style.maxWidth = max_width
		text.style.lineHeight = '1.4'
		
		var height = (text.offsetHeight)
		var width = (text.offsetWidth)

		return { width, height }
	}

	static get_image_size(base64){

		var image = document.getElementById("image-container")

		Utils.attr(image, 'src', base64)

		return { width: image.offsetWidth, height: image.offsetHeight }
	}

	static get_width(object){
		if (object === undefined || object === null) {
			return 0
		}
		
		return object.offsetWidth
	}

	static get_height(object){
		if (object === undefined || object === null) {
			return 0
		}
		
		return object.offsetHeight
	}

	static get_scroll_height(object){
		if (object === undefined || object === null) {
			return 0
		}
		
		return object.scrollHeight
		
	}

	static get_scroll_width(object){
		if (object === undefined || object === null) {
			return 0
		}
		
		return object.scrollWidth
	}

	static get_cursor_color(index){
		const color_list = [
			'#34495e',
			'#2980b9',
			'#8e44ad',
			'#f1c40f',
			'#d35400',
			'#e74c3c',
			'#6e2c00',
			'#78281f',
		]
		return color_list[index]
	}

	static get_clone(obj) {
	    // Handle the 3 simple types, and null or undefined
	    if (null == obj || "object" != typeof obj) return obj;

	    // Handle Date
	    if (obj instanceof Date) {
	        var copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    // Handle Array
	    if (obj instanceof Array) {
	        var copy = [];
	        for (var i = 0, len = obj.length; i < len; i++) {
	            copy[i] = Utils.get_clone(obj[i]);
	        }
	        return copy;
	    }

	    // Handle Object
	    if (obj instanceof Object) {
	        var copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = Utils.get_clone(obj[attr]);
	        }
	        return copy;
	    }

	    throw new Error("Unable to copy obj! Its type isn't supported.");
	}

	static get_limited_string(str, nb){
		if (nb === undefined) {
			nb = 75
		}

		if (str === undefined) {
			return ''
		}

		if (str.length > nb) {
			return str.substring(0, nb) + '...'
		}

		return str
	}

	static is_active(bool){
		return bool ? 'active' : ''
	}

	static ajax(param){
        var default_param = {
            type: 'POST',
            data: {},
            data_type: 'json',
            auto_retry: true,
            retry_nb: 0,
            success: () => {},
            error: () => {},
            before_send: () => {},
            done: () => {},
        }

        default_param = Utils.extend(default_param, param)

        if (default_param.url === undefined) {
            return false
        }

        var xhr = new XMLHttpRequest();
        xhr.open(default_param.type, default_param.url);

        var form = new FormData();
        if (default_param.type.toLowerCase() === 'get') {
            //todo : inserer les data dans l'url get
        }

        if (default_param.type.toLowerCase() === 'post' && default_param.data instanceof Object){
            for(var prop in default_param.data){
                form.append(prop, default_param.data[prop]);
            }
        }

        if (default_param.data instanceof FormData) {
        	form = default_param.data
        }

        default_param.before_send()

        //Dev : pour éviter une erreur de cross origin
        // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(form);
        xhr.addEventListener('readystatechange', function() {

            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {

                    var response = xhr.responseText
                    if (default_param.data_type === 'json') {
                        try{
                            response = JSON.parse(response)
                            default_param.success(response)
                        }catch(ex){
                            response = null
                            default_param.error(response)
                        }
                        
                    }

                    if (default_param.data_type === 'image') {
                        default_param.success(xhr.response)
                        
                    }
                }

                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 0){
                	if (default_param.auto_retry && default_param.retry_nb < 10) {
                		default_param.retry_nb++

                		Utils.ajax(default_param)
                	}else{
                		default_param.error(xhr)
                	}
                }

                default_param.done()
            }
            
        });
    }

    static serialize_form(form_list){
    	var result = {}
    	var should_submit = true

    	form_list.map((form) => {
    		if (form !== undefined) {
    			if (form.is_valid()) {
    				var val = form.get_input_value()
    				if (val !== undefined) {
    					result[form.get_input_name()] = val
    				}
	    		}else{
	    			should_submit = false
	    		}
    		}
    	})

    	return {
    		should_submit,
    		result
    	}
    }

    static try_parse_json(str){
    	try{
    		return JSON.parse(str)
    	}catch(e){
    		return {}
    	}
    }

    static sprintf (format, ...args) {
        let i = 0;
    	return format.replace(/%s/g, () => args[i++]);
    }
}
export default Utils