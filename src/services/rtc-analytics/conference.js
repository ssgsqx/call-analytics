
import request from '../../utils/request';
import config from './config';

const { prefix } = config;

// 通话成员列表
export async function get_users(confrId, params) {
    if(!confrId) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get users confrId is required'
            })
        })
    }
    
    let params_str = '';
    if(params) {
        let dataStr = ''; //数据拼接字符串
        Object.keys(params).forEach(key => {
            dataStr += key + '=' + params[key] + '&';
        })

        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
            params_str = '?' + dataStr;
        }
    }

    return request( `${prefix}/rtc/analytics/conference/${confrId}/users${params_str}`);
}

// 通话成员事件集合
export async function get_event_list(confrId, memId, params) {
    
    if(
        !confrId ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-2,
                message:'get event_list confrId and memId is required'
            })
        })
    }

    return request( `${prefix}/rtc/analytics/conference/${confrId}/user/${memId}/events`);
}

// 通话质量数据集合
export async function get_qoe(confrId, memId, params) {
    if(
        !confrId ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-2,
                message:'get qoe confrId and memId is required'
            })
        })
    }

    return request( `${prefix}/rtc/analytics/conference/${confrId}/user/${memId}/qoe`);
}