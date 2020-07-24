

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

function get_short_memId(memId, confrId) {
    if(confrId) {
        let reg = new RegExp(confrId, 'g')

        return memId.replace(reg, '')
    }

    if(memId.length < 9) {
        return memId
    }

    
    let before = memId.substring(0,4),
        after = memId.substring(memId.length - 4);
    return before + ' **** ' + after
}

// 格式化 qoe 页面的 chart tooltip
function qoe_tooltip_format(confrId) {

    const get_name = (item) => {
        let names = {
            'SUB_AUDIO_RECV_BITRATE' : 'sub_audio',
            'SUB_VIDEO_RECV_BITRATE' : 'sub_video'
        }

        let { userOptions, name } = item.series; 
        let reg = new RegExp((`__Of_|${confrId}`), 'g')

        let name_prefix = names[name] || name,
            memId = userOptions.subMemId.replace(reg,''),
            sid = userOptions.subSId.replace(reg,''),
            value = Math.abs(item.y);

        return `${name_prefix}: <b>${value}</b>, MemId: ${memId}, Sid: ${sid}`
    }
    

    let value = '';
    this.points.map(item => {
        value += get_name(item) + '<br/>'
    })
    // let name_prefix = 

    return value
}
// 格式化 e2e 页面的 chart tooltip 添加 sid or subSid
function e2e_tooltip_formatter(confrId) {

    let value = '';
    this.points.map(item => {
        value += formatter_by_series(item.series, confrId, item.y) + '<br/>'
    })

    return value
}

// e2e chart legend 格式化 添加 sid or subSid
function e2e_legend_formatter(confrId) {
    return formatter_by_series(this, confrId) // this 就是 series 对象
}

// 通过 series 对象 将 neme 和 sid or subSid 结合到一起
function formatter_by_series(series, confrId, y) {
    // sid or subSid
    // name prefix
    //  series对象
    //  y : 图表的y 轴值， tooltip 需要 legend 不需要
    
    let names = { // 几个关键字 缩短 name 
        'PUB_SEND_VIDEO_BITRATE': {
            name: 'send-bit',
            end_type: 'send'
        },
        'PUB_SEND_VIDEO_FRAME_RATE': {
            name: 'send-fps',
            end_type: 'send'
        },
        'SUB_VIDEO_RECV_FRAME_RATE': {
            name: 'receive-fps',
            end_type: 'receive'
        },
        'SUB_VIDEO_RECV_BITRATE': {
            name: 'receive-bit',
            end_type: 'receive'
        },
        'SUB_VIDEO_RECV_RESOLUTION': {
            name: 'receive-resolution',
            end_type: 'receive'
        },
        'SUB_VIDEO_LOSS_RATE': {
            name: 'receive-loss-rate',
            end_type: 'receive'
        },

        // audio
        'PUB_SEND_AUDIO_INPUT_LEVEL': {
            name: 'send-audio-level',
            end_type: 'send'
        },
        'SUB_PLAY_AUDIO_INPUT_LEVEL': {
            name: 'receive-play-volume',
            end_type: 'receive'
        },
        'PUB_SEND_AUDIO_BITRATE': {
            name: 'send-bit',
            end_type: 'send'
        },
        'SUB_AUDIO_RECV_BITRATE': {
            name: 'receive-bit',
            end_type: 'receive'
        },
        'SUB_AUDIO_LOSS_RATE': {
            name: 'receive-loss-rate',
            end_type: 'receive'
        },
    }

    let name_info = names[series.name];

    if(!name_info) {
        if(y != undefined) {
            return `${series.name}: <b>${y}</b>`;
        }
        return series.name
    }


    let { userOptions } = series;
    let stream_id = '';
    stream_id = name_info.end_type == 'send' ? userOptions.sid : userOptions.subSId; // 订阅不同的 字段

    let reg = new RegExp(`__Of_${confrId || ''}`, 'g')
    stream_id = stream_id.replace(reg,'_'); // 裁剪

    if(y != undefined) { // tooltip 需要 y 值
        return `${name_info.name}-${stream_id}: <b>${y}</b>`;
    }
    return name_info.name + '-' + stream_id;

}



export default {
    get_dur,
    get_time_range,
    get_short_memId,
    qoe_tooltip_format,
    e2e_tooltip_formatter,
    e2e_legend_formatter
}