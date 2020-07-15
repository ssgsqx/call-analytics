

import moment from 'moment';


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


export default {
    get_dur,
    get_time_range
}