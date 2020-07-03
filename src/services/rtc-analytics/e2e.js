import { stringify } from 'qs';
import request from '../../utils/request';
import EasemobCfg from '../../common/commonCfg';

// const origin = EasemobCfg.rest.url;
const origin = '/api';

// const appkey = localStorage.getItem('easemob-appkey');

// const orgName = appkey.split('#')[0];
// const appName = appkey.split('#')[1];

// const prefix = origin + '/' + orgName + '/' + appName;

const prefix = origin;
// cpu 信息
export async function get_cpu(confrId, endType, memId) {
    if(
        !confrId ||
        !endType ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get cpu confrId、endType、memId is required'
            })
        })
    }
    
    return request( `${prefix}/rtc/analytics/conference/${confrId}/${endType}/${memId}/system`);
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

    return request( `${prefix}/rtc/analytics/conference/${confrId}/users/${memId}/events`);
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

    return request( `${prefix}/rtc/analytics/conference/${confrId}/users/${memId}/qoe`);
}