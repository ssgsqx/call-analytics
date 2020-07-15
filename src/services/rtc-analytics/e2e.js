import { stringify } from 'qs';
import request from '../../utils/request';
import EasemobCfg from '../../common/commonCfg';

// const origin = EasemobCfg.rest.url;
const origin = '/api';

const appkey = localStorage.getItem('easemob-appkey');

const orgName = appkey.split('#')[0];
const appName = appkey.split('#')[1];

const prefix = origin + '/' + orgName + '/' + appName;

// const prefix = origin;
// cpu 信息
export async function get_cpu(confrId, memId) {
    if(
        !confrId ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get cpu confrId、memId is required'
            })
        })
    }
    
    return request( `${prefix}/rtc/analytics/conference/${confrId}/user/${memId}/usage`);
}

// 采集音量
export async function get_captured_volume(confrId, memId) {
    if(
        !confrId ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get_captured_volume confrId、memId is required'
            })
        })
    }

    return request( `${prefix}/rtc/analytics/conference/${confrId}/sender/${memId}/audio-near`);
}
// 播放音量
export async function get_play_volume(confrId, memId) {
    if(
        !confrId ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get_play_volume confrId、memId is required'
            })
        })
    }

    return request( `${prefix}/rtc/analytics/conference/${confrId}/receiver/${memId}/audio-play-volume`);
}


// 音频上行bit 丢包
export async function get_audio_up(confrId, memId) {
    if(
        !confrId ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get_audio_up confrId、memId is required'
            })
        })
    }

    return request( `${prefix}/rtc/analytics/conference/${confrId}/sender/${memId}/audio-up`);
}
// 音频下行bit 端对端丢包
export async function get_audio_down(confrId, memId) {
    if(
        !confrId ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get_audio_down confrId、memId is required'
            })
        })
    }

    return request( `${prefix}/rtc/analytics/conference/${confrId}/receiver/${memId}/audio-down`);
}
// 视频上行bit 丢包
export async function get_video_up(confrId, memId) {
    if(
        !confrId ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get_video_up confrId、memId is required'
            })
        })
    }

    return request( `${prefix}/rtc/analytics/conference/${confrId}/sender/${memId}/video-up`);
}
// 视频下行bit 端对端丢包
export async function get_video_down(confrId, memId) {
    if(
        !confrId ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get_audio_down confrId、memId is required'
            })
        })
    }

    return request( `${prefix}/rtc/analytics/conference/${confrId}/receiver/${memId}/video-down`);
}

// 视频发送帧率
export async function get_send_fps(confrId, memId) {
    if(
        !confrId ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get_send_fps confrId、memId is required'
            })
        })
    }

    return request( `${prefix}/rtc/analytics/conference/${confrId}/sender/${memId}/video-capture`);
}

// 视频接收帧率和卡顿
export async function get_receive_fps(confrId, memId) {
    if(
        !confrId ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get_receive_fps confrId、memId is required'
            })
        })
    }

    return request( `${prefix}/rtc/analytics/conference/${confrId}/receiver/${memId}/video-render-fps`);
}

// 接收分辨率
export async function get_resolution(confrId, memId) {
    if(
        !confrId ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get_resolution confrId、memId is required'
            })
        })
    }

    return request( `${prefix}/rtc/analytics/conference/${confrId}/receiver/${memId}/video-render-qp`);
}





// 以下不关注
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