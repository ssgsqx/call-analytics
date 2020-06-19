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
export async function get_users(confrId, params) {
    if(!confrId) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get users confrId is required'
            })
        })
    }
    
    return request( `${prefix}/rtc/analytics/conference/${confrId}/users`);
}