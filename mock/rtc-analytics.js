export const getConferences = (req, res) => {
    if(
        req.query &&
        req.query.confrId
    ) { // 单个会议
        setTimeout(() => {
            res.json([
                {
                    "id": 1,
                    "confrId":"LBJ18765439087",
                    createdTs: 1593420887,
                    destroyedTs: 1593421319,
                    "dur":432 ,//持续时间（秒） destroyedTs - createdTs
                    "roomName":"room", // 如果没有，显示空
                    "creator": "sqx", //创建人 jid中的username
                    "reason": 0, //会议解散原因
                    "allowVX": true, //支持小程序
                    "isMixLive" : true, //合流直播会议
                    "finished":true, //是否结束
                    "type":10, //普通会议，大会议等
                    "liveCfg": {}, //直播设置
                    "hopeVcodes": []
                }
            ])
        }, 2000)
    } else {
        setTimeout(() => {
    
            res.json(
                {   // 倒序
                    "from":15,
                    "size":15,
                    "requestTs": 1591237718, //请求时间
                    "data":[
                        {
                            "id": 1,
                            "confrId":"LBJ18765439087",
                            "createdTs":1591237718, //创建时间
                            "destroyedTs":1591237919, //销毁时间
                            "roomName":"room", // 如果没有，显示空
                            "creator": "sqx", //创建人 jid中的username
                            "reason": 0, //会议解散原因
                            "allowVX": true, //支持小程序
                            "isMixLive" : true, //合流直播会议
                            "finished":true, //是否结束
                            "type":10, //普通会议，大会议等
                            "dur":201 ,//持续时间（秒） destroyedTs - createdTs
                            "liveCfg": {}, //直播设置
                            "hopeVcodes": []
                        }
                    ]
                }
            )
    
        }, 2000)
    }
};



export const getUsers = (req, res) => {
    
    setTimeout(() => {
        res.json(
            { 
                "requestTs": 1591237718, //请求时间
                "dur":'' , //查询耗时时长，单位毫秒
                "data":[
                    {
                        "sessionId": "",
                        "memId": "4789321",
                        "memName":"sqx1",           
                        "ip":"ip地址",        // 可以从 nginx =》media-service获取到
                        "joinTs":1591238040, // 通过sdk上报的时间戳计算offset，统一到服务器时间
                        "exitTs":1591238240, // 希望能够从media-servcie获取       
                        "endReason":1,       // 希望能够从media-servcie获取
                        "dur":200, //秒      // 可以是  exitTs - joinTs
                        "role": 3,       // 角色 media-service获取到，SDK上报
                        "sdkVersion":"2.9.2",
                        "osVersion":"",
                        "os":"Android",
                        "net":"Wi-Fi",
                        "deviceInfo":"huawei/tas-an00/tas-an00/hwtas/29/4.14.116", //设备类型
                    }, 
                    {
                        "sessionId": "",
                        "memId": "478897",
                        "memName":"sqx2",           
                        "ip":"ip地址",        // 可以从 nginx =》media-service获取到
                        "joinTs":1591238040, // 通过sdk上报的时间戳计算offset，统一到服务器时间
                        "exitTs":1591238240, // 希望能够从media-servcie获取       
                        "endReason":1,       // 希望能够从media-servcie获取
                        "dur":200, //秒      // 可以是  exitTs - joinTs
                        "role": 7,       // 角色 media-service获取到，SDK上报
                        "sdkVersion":"2.9.2",
                        "osVersion":"",
                        "os":"Android",
                        "net":"Wi-Fi",
                        "deviceInfo":"oppoe/tas-an00/tas-an00/hwtas/29/4.14.116", //设备类型
                    }, 
                    {
                        "sessionId": "",
                        "memId": "6723878",
                        "memName":"qqy",           
                        "ip":"ip地址",        // 可以从 nginx =》media-service获取到
                        "joinTs":1591238040, // 通过sdk上报的时间戳计算offset，统一到服务器时间
                        "exitTs":1591238240, // 希望能够从media-servcie获取       
                        "endReason":1,       // 希望能够从media-servcie获取
                        "dur":200, //秒      // 可以是  exitTs - joinTs
                        "role": 1,       // 角色 media-service获取到，SDK上报
                        "sdkVersion":"2.9.2",
                        "osVersion":"",
                        "os":"Android",
                        "net":"Wi-Fi",
                        "deviceInfo":"mozlia/tas-an00/tas-an00/hwtas/29/4.14.116", //设备类型
                    }, 
                ]
            }
        )
    },2000)
}

// 获取事件列表
export const getEventList = (req, res) => {
    setTimeout(() => {
        res.json({   
            "requestTs": 1591237718, //请求时间
            "dur": 123, //查询耗时时长，单位毫秒
            "data":[
                { ts: 1593420887533, evt: 'Session Start' },
                { ts: 1593420888513, evt: 'vosdk.audioEnabled' },
                { ts: 1593420888542, evt: 'vosdk.videoEnabled' },
                { ts: 1593420888798, evt: 'vosdk.firstVideoPacketSent' },
                { ts: 1593420888846, evt: 'vosdk.firstAudioPacketSent' },
                { ts: 1593420892486, evt: 'joinGateway' },
                { ts: 1593420895493, evt: 'publish' },
                { ts: 1593420902500, evt: 'apiInvoke' },
                { ts: 1593420927050, evt: 'vosdk.firstAudioPacketReceived' },
                { ts: 1593420938963, evt: 'apiInvoke' },
                { ts: 1593421143712, evt: 'vosdk.firstAudioPacketReceived' },
                { ts: 1593421155697, evt: 'apiInvoke' },
                { ts: 1593421157760, evt: 'apiInvoke' },
                { ts: 1593421217000, evt: 'vos.uquit' },
                { ts: 1593421217942, evt: 'WebQuit' }
              ]
        })
    }, 2000)
}

export const getQoe = (req,res) => {
    res.json([
     
    {
        // "id": 100020,
        "memId": 100020,
        "peer": 2580303294,
        "name": "Audio Receive Bitrate - 2580303294",
        "counter_id": 100020,
        "data": [[1593421134000, 0], [1593421140000, -14], [1593421146000, -20], [1593421152000, -22], [1593421158000,
            -21], [1593421164000, -22], [1593421170000, -22], [1593421176000, -21], [1593421182000, -22], [
            1593421188000, -22], [1593421194000, -22], [1593421200000, -22], [1593421206000, -23], [
            1593421212000, -22]],
        "type": "areaspline",
        "color": "#FF8300",
        "unit": "",
        "borderWidth": 0,
        "fillOpacity": 0.2,
        "zIndex": -1,
        "grouping": true,
        "maxPointWidth": 1,
        "marker": {
            "enabled": false
        },
        "yAxis": 0,
        "min": -23
    },
    {
        // "id": 100020,
        "memId": 100020,
        "peer": 2831771744,
        "name": "Audio Receive Bitrate - 2831771744",
        "counter_id": 100020,
        "data": [[1593420918000, 0], [1593420924000, -21], [1593420930000, -36], [1593420936000, -36], [1593420942000,
            -36], [1593420948000, -36], [1593420954000, -36], [1593420960000, -37], [1593420966000, -37], [
            1593420972000, -37], [1593420978000, -36], [1593420984000, -37], [1593420990000, -37], [
            1593420996000, -36], [1593421002000, -35], [1593421008000, -35], [1593421014000, -36], [
            1593421020000, -36], [1593421026000, -38], [1593421032000, -37], [1593421038000, -37], [
            1593421044000, -36], [1593421050000, -35], [1593421056000, -35], [1593421062000, -34], [
            1593421068000, -35], [1593421074000, -34], [1593421080000, -36], [1593421086000, -36], [
            1593421092000, -37], [1593421098000, -37], [1593421104000, -37], [1593421110000, -36], [
            1593421116000, -36], [1593421122000, -35], [1593421128000, -37], [1593421134000, -36], [
            1593421140000, -37], [1593421146000, -36]],
        "type": "areaspline",
        "color": "#00CF30",
        "unit": "",
        "borderWidth": 0,
        "fillOpacity": 0.2,
        "zIndex": -1,
        "grouping": true,
        "maxPointWidth": 1,
        "marker": {
            "enabled": false
        },
        "yAxis": 0,
        "min": -38
    },
     
    {
        // "id": 7100093,
        "memId": 7100093,
        "peer": 2580303294,
        "name": "Video Receive Bitrate - 2580303294",
        "counter_id": 7100093,
        "data": [[1593421134000, null], [1593421140000, 194], [1593421146000, 474], [1593421152000, 432], [
            1593421158000, 527], [1593421164000, 473], [1593421170000, 504], [1593421176000, 403], [
            1593421182000, 510], [1593421188000, 430], [1593421194000, 515], [1593421200000, 506], [
            1593421206000, 538], [1593421212000, 451]],
        "type": "areaspline",
        "color": "#FF8300",
        "unit": "",
        "borderWidth": 0,
        "fillOpacity": 0.2,
        "zIndex": -1,
        "grouping": true,
        "maxPointWidth": 1,
        "marker": {
            "enabled": false
        },
        "yAxis": 0,
        "max": 538
    },
    {
        // "id": 7100093,
        "memId": 7100093,
        "peer": 2831771744,
        "name": "Video Receive Bitrate - 2831771744",
        "counter_id": 7100093,
        "data": [[1593420918000, null], [1593420924000, 448], [1593420930000, 373], [1593420936000, 374], [
            1593420942000, 421], [1593420948000, 462], [1593420954000, 437], [1593420960000, 469], [
            1593420966000, 460], [1593420972000, 496], [1593420978000, 414], [1593420984000, 518], [
            1593420990000, 526], [1593420996000, 445], [1593421002000, 479], [1593421008000, 481], [
            1593421014000, 469], [1593421020000, 459], [1593421026000, 509], [1593421032000, 506], [
            1593421038000, 480], [1593421044000, 487], [1593421050000, 476], [1593421056000, 476], [
            1593421062000, 406], [1593421068000, 445], [1593421074000, 457], [1593421080000, 475], [
            1593421086000, 315], [1593421092000, 255], [1593421098000, 234], [1593421104000, 182], [
            1593421110000, 275], [1593421116000, 388], [1593421122000, 502], [1593421128000, 448], [
            1593421134000, 481], [1593421140000, 435], [1593421146000, 404]],
        "type": "areaspline",
        "color": "#00CF30",
        "unit": "",
        "borderWidth": 0,
        "fillOpacity": 0.2,
        "zIndex": -1,
        "grouping": true,
        "maxPointWidth": 1,
        "marker": {
            "enabled": false
        },
        "yAxis": 0,
        "max": 526
    },
])
}
export default {
    getConferences,
    getUsers,
    getEventList,
    getQoe
};
  