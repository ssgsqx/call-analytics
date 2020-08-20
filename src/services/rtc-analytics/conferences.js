import { stringify } from 'qs';
import request from '../../utils/request';
import config from './config';


const { prefix } = config;

// 通话列表
export async function get(pageNum, pageSize, params) {

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