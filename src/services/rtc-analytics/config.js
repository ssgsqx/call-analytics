

const get_prefix = () => { // 在调用API的时候，再去获取, 初始化不准确
    // const origin = '/api';
    // const origin = 'https://rtc-turn4-hsb.easemob.com';
    let origin = 'https://a1-hsb.easemob.com';
    // const origin = 'https://a1.easemob.com';

    if(sessionStorage.getItem('easemob-cluster') == 'vip6') {
        origin = 'https://a1-vip6.easemob.com'
    }
    
    const appkey = sessionStorage.getItem('easemob-appkey');

    let orgName, appName, prefix;
    if(appkey) {
        orgName = appkey.split('#')[0],
        appName = appkey.split('#')[1],
        prefix = origin + '/' + orgName + '/' + appName;
    }

    return prefix
}
export default {
    get_prefix
}