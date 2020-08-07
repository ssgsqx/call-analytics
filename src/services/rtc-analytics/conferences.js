import { stringify } from 'qs';
import request from '../../utils/request';
import EasemobCfg from '../../common/commonCfg';

// const origin = EasemobCfg.rest.url;
// const origin = '/api';
// const origin = 'https://rtc-turn4-hsb.easemob.com';
const origin = 'https://a1-hsb.easemob.com';
// const origin = 'https://a1.easemob.com';


// const prefix = origin;
// 通话列表
export async function get(pageNum, pageSize, params) {

    const appkey = localStorage.getItem('easemob-appkey');

    const orgName = appkey.split('#')[0];
    const appName = appkey.split('#')[1];

    const prefix = origin + '/' + orgName + '/' + appName;
    if(
        pageNum == undefined ||
        !pageSize 
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get conferences pageNum or pageSize is required'
            })
        }) 
    }
    if(
        !params || 
        !params.fromTs ||
        !params.toTs
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get conferences params is required'
            })
        })  
    }
    return request( prefix + `/rtc/analytics/conferences/${pageNum}/${pageSize}?${stringify(params)}`);
}
// 通话详情
export async function get_by_confrId(params) {

    const appkey = localStorage.getItem('easemob-appkey');

    const orgName = appkey.split('#')[0];
    const appName = appkey.split('#')[1];

    const prefix = origin + '/' + orgName + '/' + appName;
    if(
        !params ||
        !params.confrId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get confr_info confrId is required'
            })
        }) 
    }

    return request( `${prefix}/rtc/analytics/conferences?${stringify(params)}`);
}