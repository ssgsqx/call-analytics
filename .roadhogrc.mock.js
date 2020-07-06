import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList, commonProblems  } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';



// 以下为 easemob project
import { 
  getConferences, 
  getUsers, 
  getEventList,
  getQoe,
  getCPU,
  getCapturedVolume,
  getPlayVolume, 
  getAudioUp,
  getAudioDown, 
  getVideoUp,
  getVideoDown,
  getSendFps,
  getreceiveFps,
  getResolution
} from './mock/rtc-analytics';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },



  // 以下为 easemob 项目
  'GET /api/rtc/analytics/conferences': getConferences,
  // 'GET /api/rtc/analytics/conferences?confrId=LBJ18765439087': getConferences,
  'GET /api/rtc/analytics/conference/LBJ18765439087/users': getUsers,
  'GET /api/rtc/analytics/conference/LBJ18765439087/users/4789321/events': getEventList,
  'GET /api/rtc/analytics/conference/LBJ18765439087/users/478897/events': getEventList,
  'GET /api/rtc/analytics/conference/LBJ18765439087/users/6723878/events': getEventList,
  'GET /api/rtc/analytics/conference/LBJ18765439087/users/4789321/qoe': getQoe,
  'GET /api/rtc/analytics/conference/LBJ18765439087/users/478897/qoe': getQoe,
  'GET /api/rtc/analytics/conference/LBJ18765439087/users/6723878/qoe': getQoe,

    // e2e
    'GET /api/rtc/analytics/conference/LBJ18765439087/sender/100020/system': getCPU,   
    'GET /api/rtc/analytics/conference/LBJ18765439087/receiver/4789321/system': getCPU, 
    
    'GET /api/rtc/analytics/conference/LBJ18765439087/sender/100020/audio-near': getCapturedVolume,
    'GET /api/rtc/analytics/conference/LBJ18765439087/receiver/4789321/audio-play-volume': getPlayVolume,

    'GET /api/rtc/analytics/conference/LBJ18765439087/sender/100020/audio-up': getAudioUp,
    'GET /api/rtc/analytics/conference/LBJ18765439087/receiver/4789321/audio-down': getAudioDown,
    'GET /api/rtc/analytics/conference/LBJ18765439087/sender/100020/video-up': getVideoUp,
    'GET /api/rtc/analytics/conference/LBJ18765439087/receiver/4789321/video-down': getVideoDown,

    'GET /api/rtc/analytics/conference/LBJ18765439087/sender/100020/video-capture': getSendFps,
    'GET /api/rtc/analytics/conference/LBJ18765439087/receiver/4789321/video-render-fps': getreceiveFps,
    'GET /api/rtc/analytics/conference/LBJ18765439087/receiver/4789321/video-render-qp': getResolution,


};

const real_server = {
  'GET /api/(.*)' : 'http://a1.easemob.com',
  // 'GET /api/rtc/analytics/conferences' : 'http://a1.easemob.com/rtc/analytics/conferences',
}
// export default (noProxy ? {} : delay(proxy, 2000));
export default (noProxy ? real_server : proxy)
