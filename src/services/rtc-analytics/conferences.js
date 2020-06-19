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
// 通话列表
export async function get() {
    return request( prefix + '/rtc/analytics/conferences');
}
// 通话详情
export async function get_by_confrId(params) {
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