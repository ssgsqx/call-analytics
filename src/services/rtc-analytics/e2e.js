import request from '../../utils/request';
import config from './config';

const { prefix } = config;
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

// 音频下行bit 
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

// 音频下行端对端丢包
export async function get_audio_lost_rate(confrId, memId) {
    if(
        !confrId ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get_audio_lost_rate confrId、memId is required'
            })
        })
    }

    return request( `${prefix}/rtc/analytics/conference/${confrId}/receiver/${memId}/audio-lst-rate`);
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
// 视频下行bit 
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
// 视频下行端对端丢包
export async function get_video_lost_rate(confrId, memId) {
    if(
        !confrId ||
        !memId
    ) {
        return new Promise((resolve,reject) => {
            reject({
                error:-1,
                message:'get_video_lost_rate confrId、memId is required'
            })
        })
    }

    return request( `${prefix}/rtc/analytics/conference/${confrId}/receiver/${memId}/video-lst-rate`);
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




