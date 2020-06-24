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
                {
                    "evt": "WS_NET",
                    "ts": 1592981939383, //事件发生时的时间戳，以服务器时间为参考
                    "sendTs": '',//sdk 发送时间戳
                    "recvTs":  '', //服务器时间戳
                }, 
                {
                    "evt": "JOINED_CONFR",
                    "ts": 1592981939925, 
                    "sendTs": '',
                    "recvTs":  '', 
                }, 
                {
                    "evt": "GET_USER_MEDIA",
                    "ts": 1592981943101, 
                    "sendTs": '',
                    "recvTs":  '', 
                }, 
                {
                    "evt": "MEM_ENTER",
                    "ts": 1592981943101, 
                    "sendTs": '',
                    "recvTs":  '', 
                }, 
                {
                    "evt": "STREAM_PUB",
                    "ts": 1592981956616, 
                    "sendTs": '',
                    "recvTs":  '', 
                }, 
                {
                    "evt": "STREAM_setVideoProfile",
                    "ts": 1592981964619, 
                    "sendTs": '',
                    "recvTs":  '', 
                }, 
                {
                    "evt": "DECODE_FIRST_VIDEO_FRAME",
                    "ts": 1592982021625, 
                    "sendTs": '',
                    "recvTs":  '', 
                }, 
                {
                    "evt": "STREAM_setVideoProfile",
                    "ts": 1592982034522, 
                    "sendTs": '',
                    "recvTs":  '', 
                }, 
                {
                    "evt": "MEM_EXIT",
                    "ts": 1592982226782, 
                    "sendTs": '',
                    "recvTs":  '', 
                }, 
                {
                    "evt": "WebQuit",
                    "ts": 1592982221580, 
                    "sendTs": '',
                    "recvTs":  '', 
                }, 
            ]
        })
    }, 2000)
}
export default {
    getConferences,
    getUsers,
    getEventList
};
  