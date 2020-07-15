import React, { PureComponent, useState, useEffect, useContext } from "react";

import style from "./E2e.less";

import ConferenceInfo from '../../components/CallAnalytics/ConferenceInfo';
import UserList from '../../components/CallAnalytics/UserList';

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { 
    Form, Select, DatePicker, Input, Button, Col, Row, Table,
    Popover,
    Tabs
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
    get_resolution
} from '../../services/rtc-analytics/e2e';

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
        from_memId,
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
        <ConferenceInfo data={conference_info} loading={conference_info_table_loading}/>
        <UserList data={user_list} loading={user_list_table_loading} />
        
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
                <div className={style['user-info']}>{memId}</div>
                <CPU {...props} />
                <Volume {...props} />
                <BitAndPackLoss stream_type='audio'{...props} />
                { props.end_type == 'receiver' ? <div >Freeze</div> : ''}
            </div>)
}
// 视频端
const VideoEnd = props => {
    const context = useContext(E2eContext);

    let endType = props.end_type;
    let memId = endType == 'sender' ? context.from_memId : context.to_memId;

    return (<div className={style['end-wrapper']}>
                <div className={style['user-info']}>{memId}</div>
                <CPU {...props} />
                <BitAndPackLoss stream_type='video'{...props} />
                <FrameRate {...props} />
                { props.end_type == 'receiver' ? <Resolution /> : ''}
            </div>)
}

// 设备状态
const CPU = props => {

    const [data,setData] = useState([])
    let chartOptions = {
        title:{
            text:'设备状态'
        },
        series: data
    }

    const context = useContext(E2eContext);

    let confrId = context.confrId,
        endType = props.end_type;
    let memId = endType == 'sender' ? context.from_memId : context.to_memId;

    useEffect(() => {
        get_cpu(confrId, memId).then(response => {
            setData(response.data)
        }).catch(error => {
            console.error('get_cpu', error);
        })
    }, []);
    
    
    return <ChartsWrapper chartOptions={chartOptions} />
}
// 音量
const Volume = props => {
    const [data,setData] = useState([]);

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

        if(endType == 'sender') {
            memId = context.from_memId;
            get_captured_volume(confrId, memId).then(response => { //发送端采集音量
                setData(response.data)
            }).catch(error => {
                console.error('get_captured_volume', error);
            })
        } else {
            memId = context.to_memId;
            get_play_volume(confrId, memId).then(response => {  //接收端播放音量
                setData(response.data)
            }).catch(error => {
                console.error('get_play_volume', error);
            })
        }
       
    }, []);
    
    
    return <ChartsWrapper chartOptions={chartOptions} />
}

// audio video bit and pack_loss
const BitAndPackLoss = props => {
    const [data,setData] = useState([]);

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
        'audio_sender': '音频上行和网络丢包',
        'audio_receiver': '音频下行和端到端丢包',
        'video_sender': '视频频上行和网络丢包',
        'video_receiver': '视频下行和端对端丢包'
    };

    let chartOptions = {
        title:{
            text: chart_title_texts[chart_type]
        },
        series: data
    }
    const context = useContext(E2eContext);
    // 请求数据
    useEffect(() => {
        let confrId = context.confrId,
            memId = props.end_type == 'sender' ? context.from_memId : context.to_memId;

        if(chart_type == 'audio_sender') { // 四种类型合到一起
            get_audio_up(confrId, memId).then(response => {
                setData(response.data)
            }).catch(error => {
                console.error('get bit error', error);
            });
        } else if(chart_type == 'audio_receiver') {
            get_audio_down(confrId, memId).then(response => {
                setData(response.data)
            }).catch(error => {
                console.error('get bit error', error);
            });
        } else if(chart_type == 'video_sender') {
            get_video_up(confrId, memId).then(response => {
                setData(response.data)
            }).catch(error => {
                console.error('get bit error', error);
            });
        } else if(chart_type == 'video_receiver') {
            get_video_down(confrId, memId).then(response => {
                setData(response.data)
            }).catch(error => {
                console.error('get bit error', error);
            });
        }
        
    },[])

    return <ChartsWrapper chartOptions={chartOptions} />
}

// 音频解码卡顿（待定）
const AudioFreeze = props => {
    
}

// 视频帧率
const FrameRate = props => {
    const [data,setData] = useState([]);

    let chartOptions = {
        title:{
            text: props.end_type == 'sender' ? '视频发送帧率' : '视频帧率和卡顿'
        },
        series: data,
        // plotOptions: {
        //     line:{
        //         threshold: 4,
        //         negativeColor: 'red'
        //     }
        // },
        // yAxis:{
        //     min:0,
        //     max:20
        // }
    }
    const context = useContext(E2eContext);
    // 请求数据
    useEffect(() => {
        let confrId = context.confrId,
            endType = props.end_type,
            memId;

        if(endType == 'sender') {
            memId = context.from_memId;
            get_send_fps(confrId, memId).then(response => { //发送端帧率
                setData(response.data)
            }).catch(error => {
                console.error('get_send_fps', error);
            })
        } else {
            memId = context.to_memId;
            get_receive_fps(confrId, memId).then(response => {  //接收端帧率和卡顿
                setData(response.data)
            }).catch(error => {
                console.error('get_receive_fps', error);
            })
        }
    },[])
    return <ChartsWrapper chartOptions={chartOptions} />
}

// 分辨率
const Resolution = () => {
    const [data,setData] = useState([]);

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
    }
    useEffect(() => {
        let confrId = context.confrId,
            memId = context.to_memId;
        get_resolution(confrId, memId).then(response => {
            setData(response.data)
        }).catch(error => {
            console.error('get_resolution', error);
        })
    }, [])
    const context = useContext(E2eContext);
    return <ChartsWrapper chartOptions={chartOptions} />
}

// 将highcharts 包装一下
const ChartsWrapper = props => {
    const context = useContext(E2eContext);
    
    if(!context.conference_info[0]) { // 没拿到会议信息之前，不执行
        return <i></i>
    }
    const { createTs, destroyedTs } = context.conference_info[0]

    const options = {
        chart: {
          zoomType: "x",
          height:191
        },
        
        credits: {
            enabled: false
        },
        plotOptions: {
            line: {
                lineWidth:1
            },
            series: {
                states: {
                    hover: {
                        lineWidthPlus: 0 //hover 时 线条加粗量 默认 1
                    }
                }
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
            // min: -120,  //最小
            // tickInterval: 120, //步长
            // max:840,//最大
            gridLineWidth: 0,
            tickWidth:1,
        },
        tooltip: {
          shared: true,
          crosshairs: [
            {
              width: 1,
              color: "#000"
            }
          ]
        },
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




    return <HighchartsReact highcharts={Highcharts} options={options} />
}

export default E2e;