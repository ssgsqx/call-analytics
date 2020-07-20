

import moment from 'moment';
import { before } from 'lodash';


function get_dur(dur) { // 单位 ms
    if(!dur) {
        return ''
    }

    let dur_moment_obj = moment.duration(dur);

    let hours = dur_moment_obj.hours(),
        minutes = dur_moment_obj.minutes(),
        seconds = dur_moment_obj.seconds();

    let str = '';
    if(hours){
        str += `${hours}h`
    }
    if(minutes){
        str += `${minutes}min`
    }
    if(seconds){
        str += `${seconds}s`
    }
    return str

}

function get_time_range(start, end) {

    start = moment(start).format('YYYY/MM/DD HH:mm:ss');
    end = moment(end).format('HH:mm:ss');

    return start + '-' + end
}

function get_short_memId(memId) {
    if(memId.length < 9) {
        return memId
    }

    
    let before = memId.substring(0,4),
        after = memId.substring(memId.length - 4);
    return before + ' **** ' + after
}

export default {
    get_dur,
    get_time_range,
    get_short_memId
}