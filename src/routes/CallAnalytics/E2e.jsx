import React, { PureComponent, useState, useEffect, useContext } from "react";

import style from "./E2e.less";

import ConferenceInfo from '../../components/CallAnalytics/ConferenceInfo';
import UserList from '../../components/CallAnalytics/UserList';

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { 
    Col,
    Tabs,
    Spin,
    Icon
} from "antd";

import { get_by_confrId } from '../../services/rtc-analytics/conferences'
import { 
    get_users
} from '../../services/rtc-analytics/conference';


import { 
    get_cpu,
    get_captured_volume,
    get_play_volume,
    get_audio_up,
    get_audio_down,
    get_video_up,
    get_video_down,
    get_send_fps,
    get_receive_fps,
    get_resolution,
    get_audio_lost_rate,
    get_video_lost_rate
} from '../../services/rtc-analytics/e2e';

import tableFormat from './table-format';

// Highcharts 全局配置
Highcharts.setOptions({
	global: {
		useUTC: false
	}
});

const E2eContext = React.createContext();

class E2e extends PureComponent {
    state = {
        from_memId: this.props.match.params.from_memId,
        to_memId: this.props.match.params.to_memId,
        confrId: this.props.match.params.confrId,

        conference_info: [],
        conference_info_table_loading: true,
        user_list: [],
        user_list_table_loading: true,
    };

  componentDidMount() {

      let { 
          confrId,
          from_memId,
          to_memId
      } = this.state;

      let _this = this;
      get_users(confrId, {filter: from_memId+','+to_memId }).then(response => {
        _this.setState({ 
          user_list: response.data,
          user_list_table_loading: false
        });
      }).catch(error => console.log(error));

      const get_conference_info = get_by_confrId;//获取会议基本信息

      get_conference_info({ confrId }).then(response => {
          _this.setState({
            conference_info: response.data,
            conference_info_table_loading: false
          })
      }).catch(error => console.error(error))


  }
  render() {
    let { 
        confrId,
        from_memId, // 发送端memId
        to_memId,
        conference_info, 
        conference_info_table_loading,
        user_list,
        user_list_table_loading
    } = this.state;
    
    const context_value = {
        confrId,
        from_memId,
        to_memId,
        conference_info
    }


    return (
      <div className={style['e2e-wrapper']}>
        <div className='custom-nav-back' >
            <span onClick={this.props.history.goBack} > <Icon type="arrow-left" /> 通话详情 </span>
        </div>
        <ConferenceInfo data={conference_info} loading={conference_info_table_loading}/>
        <UserList 
            data={user_list} 
            loading={user_list_table_loading} 
            conference_info={conference_info[0]}
        />
        
        <E2eContext.Provider value={context_value}>
            <Details /> 
        </E2eContext.Provider>
      </div>
    );
  }
}
// audio video 区域
const Details = () => {
    const [current_tab_key, set_current_tab_key] = useState('video');
    
    const change = key => {
        console.log('Details change');
        set_current_tab_key(key); // modify state.current_tab_key, clear component cache
    }
    const { TabPane } = Tabs;
    return <Tabs onChange={change} type="card" defaultActiveKey='video'>
                <TabPane tab="audio" key="audio">
                    {/* 切换 tab 重新渲染 */}
                    { current_tab_key == 'audio' ? 
                        (
                            <div className={style['tab-pane-wrapper']}>
                                <Col span={12} >
                                    <AudioEnd end_type='sender'/>
                                </Col>
                                <Col span={12} >
                                    <AudioEnd end_type='receiver'/>
                                </Col>
                            </div>
                        ) : <i></i>
                    } 
                </TabPane>
                <TabPane tab="video" key="video">
                    { current_tab_key == 'video' ? 
                        (
                            <div className={style['tab-pane-wrapper']}>
                                <Col span={12} >
                                    <VideoEnd  end_type='sender'/>
                                </Col>
                                <Col span={12} >
                                    <VideoEnd end_type='receiver'/>
                                </Col>
                            </div>
                        ) : <i></i>
                    }
                </TabPane>
            </Tabs>
}

// 音频端
const AudioEnd = props => {

    const context = useContext(E2eContext);

    let endType = props.end_type;
    let memId = endType == 'sender' ? context.from_memId : context.to_memId;

    return (<div className={style['end-wrapper']}>
                <div className={style['user-info']}>
                    User {tableFormat.get_short_memId(memId, context.confrId) } 
                    <span style={{marginLeft:'20px', fontSize:'14px', fontWeight: 'normal'}}>
                        {endType == 'sender' ? ' 发送端' : ' 接收端'}
                    </span>
                </div>
                <CPU {...props} />
                <Volume {...props} />
                <BitAndPackLoss stream_type='audio'{...props} />
                {/* { props.end_type == 'receiver' ? <div >Freeze</div> : ''} */}
            </div>)
}
// 视频端
const VideoEnd = props => {
    const context = useContext(E2eContext);

    let endType = props.end_type;
    let memId = endType == 'sender' ? context.from_memId : context.to_memId;

    return (<div className={style['end-wrapper']}>
                <div className={style['user-info']}>
                    User {tableFormat.get_short_memId(memId, context.confrId) } 
                    <span style={{marginLeft:'20px', fontSize:'14px', fontWeight: 'normal'}}>
                        {endType == 'sender' ? ' 发送端' : ' 接收端'}
                    </span>
                </div>
                <CPU {...props} />
                <BitAndPackLoss stream_type='video'{...props} />
                <FrameRate {...props} />
                { props.end_type == 'receiver' ? <Resolution /> : ''}
            </div>)
}

// 设备状态
const CPU = props => {

    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);

    let chartOptions = {
        title:{
            text:'设备状态'
        },
        yAxis: {
            labels: {
                formatter: function() {
                    return this.value + "%";
                },
            }
        },
        series: data
    }

    const context = useContext(E2eContext);

    let confrId = context.confrId,
        endType = props.end_type;
    let memId = endType == 'sender' ? context.from_memId : context.to_memId;

    useEffect(() => {
        setLoading(true)
        get_cpu(confrId, memId).then(response => {
            setData(response.data);
            setLoading(false)
        }).catch(error => {
            console.error('get_cpu', error);
            setLoading(false)
        })
    }, []);
    
    
    return <ChartsWrapper chartOptions={chartOptions} loading={loading}/>
}
// 音量
const Volume = props => {
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);
    let chartOptions = {
        title:{
            text: props.end_type == 'sender' ? '音频采集音量' : '音频播放音量'
        },
        series: data
    }

    const context = useContext(E2eContext);

    useEffect(() => {
        let confrId = context.confrId,
            endType = props.end_type,
            memId;
        setLoading(true)
        if(endType == 'sender') {
            memId = context.from_memId;
            get_captured_volume(confrId, memId).then(response => { //发送端采集音量
                setData(response.data);
                setLoading(false)
            }).catch(error => {
                console.error('get_captured_volume', error);
                setLoading(false)
            })
        } else {
            memId = context.to_memId;
            get_play_volume(confrId, memId).then(response => {  //接收端播放音量
                setData(response.data);
                setLoading(false)
            }).catch(error => {
                console.error('get_play_volume', error);
                setLoading(false)
            })
        }
       
    }, []);
    
    
    return <ChartsWrapper chartOptions={chartOptions}  loading={loading}/>
}

// audio video bit and pack_loss
const BitAndPackLoss = props => {
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);
    let {
        stream_type,
        end_type
    } = props;

    // 区分属于哪种图表

    let chart_type;
    if( stream_type == 'audio' ) {
        if(end_type == 'sender') {
            chart_type = 'audio_sender'
        }else {
            chart_type = 'audio_receiver'
        }
    } else if( stream_type == 'video' ) {

        if(end_type == 'sender') {
            chart_type = 'video_sender'
        }else {
            chart_type = 'video_receiver'
        }
    }

    let chart_title_texts = {
        'audio_sender': '音频上行码率',
        'audio_receiver': '音频下行码率和丢包率',
        'video_sender': '视频上行码率',
        'video_receiver': '视频下行码率和丢包率'
    };

    let chartOptions = {
        title:{
            text: chart_title_texts[chart_type]
        },
        plotOptions: {
            column : {
                color:'#FF0000'
            }
        },
        yAxis: {
            labels: {
                formatter: function() {
                    return this.value + "KBps";
                },
            }
        },
        series: data
    }
    const context = useContext(E2eContext);
    // 请求数据
    useEffect(() => {
        setLoading(true)
        let confrId = context.confrId,
            memId = props.end_type == 'sender' ? context.from_memId : context.to_memId;
        if(chart_type == 'audio_sender') { // 四种类型合到一起
            get_audio_up(confrId, memId).then(response => {
                setData(response.data);
                setLoading(false)
            }).catch(error => {
                console.error('get bit error', error);
                setLoading(false)
            });
        } else if(chart_type == 'audio_receiver') {// 两个接口合并一个数据

            (async () => {

                let video_down_respone = await get_audio_down(confrId, memId);// 音频下行
                let video_lost_rate_respone = await get_audio_lost_rate(confrId, memId);// 音频下行 丢包率

                let new_data = video_down_respone.data.concat(video_lost_rate_respone.data);
                setLoading(false);
                setData(new_data)
            })();

        } else if(chart_type == 'video_sender') {

            get_video_up(confrId, memId).then(response => {
                setData(response.data);
                setLoading(false)
            }).catch(error => {
                console.error('get bit error', error);
                setLoading(false)
            });
        } else if(chart_type == 'video_receiver') { // 两个接口合并一个数据

            (async () => {

                let video_down_respone = await get_video_down(confrId, memId);
                let video_lost_rate_respone = await get_video_lost_rate(confrId, memId);
    
                let new_data = video_down_respone.data.concat(video_lost_rate_respone.data);
                setLoading(false);
                setData(new_data)
            })()
        }
        
    },[])
    
    return <ChartsWrapper chartOptions={chartOptions}  loading={loading}/>
}

// 视频帧率
const FrameRate = props => {
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);
    let chartOptions = {
        title:{
            text: props.end_type == 'sender' ? '视频发送帧率' : '视频接收帧率'
        },
        series: data,
        yAxis: {
            labels: {
                formatter: function() {
                    return this.value + "fps";
                },
            }
        }
    }
    const context = useContext(E2eContext);
    // 请求数据
    useEffect(() => {
        let confrId = context.confrId,
            endType = props.end_type,
            memId;
        setLoading(true);

        if(endType == 'sender') {
            memId = context.from_memId;
            get_send_fps(confrId, memId).then(response => { //发送端帧率
                setData(response.data)
                setLoading(false);
            }).catch(error => {
                setLoading(false);
                console.error('get_send_fps', error);
            })
        } else {
            memId = context.to_memId;
            get_receive_fps(confrId, memId).then(response => {  //接收端帧率和卡顿
                setLoading(false);
                setData(response.data)
            setLoading(false);
            }).catch(error => {
                setLoading(false);
                console.error('get_receive_fps', error);
            })
        }
    },[])
    return <ChartsWrapper chartOptions={chartOptions}  loading={loading}/>
}

// 分辨率
const Resolution = () => {
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(false);

    let chartOptions = {
        title:{
            text: '视频接收分辨率'
        },
        plotOptions: {
            areaspline: {
                fillOpacity:0.2,
                lineWidth:1
            }
        },
        series: data,
        yAxis:{
            min:0,
            // max: 1880*980,
            // tickAmount: 4,
            // tickInterval: 

            // 172800 360P
            // 921600 720P
            // 2073600 1080P

            // labels: {
            //     formatter: function() {
            //         // console.log('分辨率 yAxiis this', this);
            //         return this.value
            //     }  
            // }
        }
        
    }
    useEffect(() => {
        let confrId = context.confrId,
            memId = context.to_memId;

        setLoading(true);  
        get_resolution(confrId, memId).then(response => {
            setData(response.data);
            setLoading(false);  
        }).catch(error => {
            setLoading(false);  
            console.error('get_resolution', error);
        })
    }, [])
    const context = useContext(E2eContext);
    return <ChartsWrapper chartOptions={chartOptions}  loading={loading}/>
}

// 将highcharts 包装一下
const ChartsWrapper = props => {

    if(props.loading) {
        return <div className={style['Spin-wrapper']}>
                    <Spin size="large" />
                </div>
    }
    const context = useContext(E2eContext);
    
    let createTs, destroyedTs;
    if(context.conference_info[0]) { // 没拿到会议信息之前，不执行
        createTs = context.conference_info[0].createTs;
        destroyedTs = context.conference_info[0].destroyedTs;
    }

    const options = {
        chart: {
          zoomType: "x",
          height:300
        },
        
        credits: {
            enabled: false
        },
        plotOptions: {
            line: {
                lineWidth:1
            },
            series: {
                shared: true,
                states: {
                    hover: {
                        lineWidthPlus: 0 //hover 时 线条加粗量 默认 1
                    }
                },
                marker: {
                    enabled: false
                },
                pointWidth: 1,
                minPointLength: 3
            }
        },
        xAxis: {
            type:"datetime",
            min: createTs,
            max: destroyedTs,
        },
        title: {
            align:'left',
            style: {
                fontSize: '14px'
            }
        },
        yAxis: {
          title: {
            text: null // y 轴标题
          },
        //   labels: {
        //     formatter: function() {
        //       return Math.abs(this.value) + "kbps";
        //     }
        //   },
            min: 0,  //最小
            // tickInterval: 120, //步长
            // max:840,//最大
            // gridLineWidth: 0,
            // tickWidth:1,
        },
        tooltip: {
          shared: true,
          crosshairs: [
            {
              width: 1,
              color: "#000"
            }
          ],
          xDateFormat: '%H:%m:%S',
          formatter: function(){
                let { confrId } = context;
                return tableFormat.e2e_tooltip_formatter.bind(this,confrId)()
          },
        },
        legend: {
            // enabled: false,
            labelFormatter: function() {
                let confrId;
                if(context.conference_info[0]) { // 没拿到会议信息之前，不执行
                    confrId = context.conference_info[0].confrId;
                }
                return tableFormat.e2e_legend_formatter.bind(this,confrId)();
            }
        }
    };

    // test ...object 
        // 深合并对象
        // 遇到相同元素级属性，以后者（main）为准
        // 不返还新Object，而是main改变
        function deepAssignObj (source, target) {

            // 附上工具
            function isJSON(target) {
                return typeof target == "object" && target.constructor == Object;
            }

            for (var key in source) {
                if (target[key] === undefined) {  // 不冲突的，直接赋值
                    target[key] = source[key];
                    continue;
                }
            
                // 冲突了，如果是Object，看看有么有不冲突的属性
                // 不是Object 则以main为主，忽略即可。故不需要else
                if (isJSON(source[key])) {
                    deepAssignObj(source[key], target[key]);  // 严格模式，arguments.callee 递归调用报错 
                }
            }
        }

        deepAssignObj(props.chartOptions,options) // 深度合并对象

        if(
            !options.series ||
            options.series.length == 0
        ) {
            let title = options.title.text;
            return <div className={style['no-data-placeholder']}> 
                        <div className={style['chart-title']}>{title}</div>
                        <span className={style['no-data-text']}> 暂无数据 </span>
                    </div>
        }


    return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default E2e;
