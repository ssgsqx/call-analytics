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
    get_cpu
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
            conference_info: response,
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
      <div className={style.wrapper}>
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
    const [current_tab_key, set_current_tab_key] = useState('audio');
    
    const change = key => {
        set_current_tab_key(key); // modify state.current_tab_key, clear component cache
    }
    const { TabPane } = Tabs;
    return <Tabs onChange={change} type="card">
                <TabPane tab="audio" key="audio">
                    {/* 切换 tab 重新渲染 */}
                    { current_tab_key == 'audio' ? 
                        (
                            <div>
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
                            <div>
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

    // const = 
    return (<div className={style['end-wrapper']}>
                <div className={style['user-info']}>user-info</div>
                <CPU {...props} />
                <Volume {...props} />
                {/* { props.end_type == 'sender' ? <SenderVolume /> : <ReceiverVolume />} */}
                <div >Bit-and-PackLoss</div>
                { props.end_type == 'receiver' ? <div >Freeze</div> : ''}
            </div>)
}
// 视频端
const VideoEnd = props => {
    return (<div className={style['end-wrapper']}>
                <div >user-info</div>
                <CPU {...props} />
                <div >Bit-and-PackLoss</div>
                <div >Frame Rate</div>
                { props.end_type == 'receiver' ? <div >Resolution</div> : ''}
            </div>)
}
let data = [
    {
        "id": "2038",
        "peer": 0,
        "name": "Wrtc Audio Send Input Level",
        "counter_id": "2038",
        "data": [
            [
                1593420888000,
                null
            ],
            [
                1593420890000,
                670
            ],
            [
                1593420892000,
                670
            ],
            [
                1593420894000,
                124
            ],
            [
                1593420896000,
                1873
            ],
            [
                1593420898000,
                1873
            ],
            [
                1593420900000,
                57
            ],
            [
                1593420902000,
                97
            ],
            [
                1593420904000,
                97
            ],
            [
                1593420906000,
                48
            ],
            [
                1593420908000,
                240
            ],
            [
                1593420910000,
                240
            ],
            [
                1593420912000,
                1900
            ],
            [
                1593420914000,
                24
            ],
            [
                1593420916000,
                24
            ],
            [
                1593420918000,
                225
            ],
            [
                1593420920000,
                494
            ],
            [
                1593420922000,
                494
            ],
            [
                1593420924000,
                95
            ],
            [
                1593420926000,
                5
            ],
            [
                1593420928000,
                5
            ],
            [
                1593420930000,
                4
            ],
            [
                1593420932000,
                5
            ],
            [
                1593420934000,
                5
            ],
            [
                1593420936000,
                6
            ],
            [
                1593420938000,
                73
            ],
            [
                1593420940000,
                73
            ],
            [
                1593420942000,
                8
            ],
            [
                1593420944000,
                10
            ],
            [
                1593420946000,
                10
            ],
            [
                1593420948000,
                11
            ],
            [
                1593420950000,
                39
            ],
            [
                1593420952000,
                39
            ],
            [
                1593420954000,
                17
            ],
            [
                1593420956000,
                18
            ],
            [
                1593420958000,
                18
            ],
            [
                1593420960000,
                38
            ],
            [
                1593420962000,
                13
            ],
            [
                1593420964000,
                13
            ],
            [
                1593420966000,
                20
            ],
            [
                1593420968000,
                13
            ],
            [
                1593420970000,
                13
            ],
            [
                1593420972000,
                12
            ],
            [
                1593420974000,
                8
            ],
            [
                1593420976000,
                8
            ],
            [
                1593420978000,
                9
            ],
            [
                1593420980000,
                14
            ],
            [
                1593420982000,
                14
            ],
            [
                1593420984000,
                27
            ],
            [
                1593420986000,
                9
            ],
            [
                1593420988000,
                9
            ],
            [
                1593420990000,
                25
            ],
            [
                1593420992000,
                7
            ],
            [
                1593420994000,
                7
            ],
            [
                1593420996000,
                6
            ],
            [
                1593420998000,
                40
            ],
            [
                1593421000000,
                40
            ],
            [
                1593421002000,
                37
            ],
            [
                1593421004000,
                5
            ],
            [
                1593421006000,
                5
            ],
            [
                1593421008000,
                41
            ],
            [
                1593421010000,
                11
            ],
            [
                1593421012000,
                11
            ],
            [
                1593421014000,
                35
            ],
            [
                1593421016000,
                24
            ],
            [
                1593421018000,
                24
            ],
            [
                1593421020000,
                5
            ],
            [
                1593421022000,
                18
            ],
            [
                1593421024000,
                18
            ],
            [
                1593421026000,
                8
            ],
            [
                1593421028000,
                8
            ],
            [
                1593421030000,
                8
            ],
            [
                1593421032000,
                34
            ],
            [
                1593421034000,
                7
            ],
            [
                1593421036000,
                7
            ],
            [
                1593421038000,
                11
            ],
            [
                1593421040000,
                8
            ],
            [
                1593421042000,
                8
            ],
            [
                1593421044000,
                134
            ],
            [
                1593421046000,
                7
            ],
            [
                1593421048000,
                7
            ],
            [
                1593421050000,
                7
            ],
            [
                1593421052000,
                5
            ],
            [
                1593421054000,
                5
            ],
            [
                1593421056000,
                14
            ],
            [
                1593421058000,
                39
            ],
            [
                1593421060000,
                39
            ],
            [
                1593421062000,
                12
            ],
            [
                1593421064000,
                10
            ],
            [
                1593421066000,
                10
            ],
            [
                1593421068000,
                9
            ],
            [
                1593421070000,
                11
            ],
            [
                1593421072000,
                11
            ],
            [
                1593421074000,
                11
            ],
            [
                1593421076000,
                5
            ],
            [
                1593421078000,
                5
            ],
            [
                1593421080000,
                7
            ],
            [
                1593421082000,
                8
            ],
            [
                1593421084000,
                8
            ],
            [
                1593421086000,
                11
            ],
            [
                1593421088000,
                9
            ],
            [
                1593421090000,
                9
            ],
            [
                1593421092000,
                10
            ],
            [
                1593421094000,
                23
            ],
            [
                1593421096000,
                23
            ],
            [
                1593421098000,
                77
            ],
            [
                1593421100000,
                33
            ],
            [
                1593421102000,
                33
            ],
            [
                1593421104000,
                39
            ],
            [
                1593421106000,
                26
            ],
            [
                1593421108000,
                26
            ],
            [
                1593421110000,
                23
            ],
            [
                1593421112000,
                19
            ],
            [
                1593421114000,
                19
            ],
            [
                1593421116000,
                532
            ],
            [
                1593421118000,
                6
            ],
            [
                1593421120000,
                6
            ],
            [
                1593421122000,
                10
            ],
            [
                1593421124000,
                49
            ],
            [
                1593421126000,
                49
            ],
            [
                1593421128000,
                10
            ],
            [
                1593421130000,
                3
            ],
            [
                1593421132000,
                3
            ],
            [
                1593421134000,
                7
            ],
            [
                1593421136000,
                16
            ],
            [
                1593421138000,
                16
            ],
            [
                1593421140000,
                25
            ],
            [
                1593421142000,
                5
            ],
            [
                1593421144000,
                5
            ],
            [
                1593421146000,
                10
            ],
            [
                1593421148000,
                7
            ],
            [
                1593421150000,
                7
            ],
            [
                1593421152000,
                16
            ],
            [
                1593421154000,
                6
            ],
            [
                1593421156000,
                6
            ],
            [
                1593421158000,
                9
            ],
            [
                1593421160000,
                6
            ],
            [
                1593421162000,
                6
            ],
            [
                1593421164000,
                8
            ],
            [
                1593421166000,
                16
            ],
            [
                1593421168000,
                16
            ],
            [
                1593421170000,
                13
            ],
            [
                1593421172000,
                10
            ],
            [
                1593421174000,
                10
            ],
            [
                1593421176000,
                9
            ],
            [
                1593421178000,
                8
            ],
            [
                1593421180000,
                8
            ],
            [
                1593421182000,
                8
            ],
            [
                1593421184000,
                8
            ],
            [
                1593421186000,
                8
            ],
            [
                1593421188000,
                9
            ],
            [
                1593421190000,
                6
            ],
            [
                1593421192000,
                6
            ],
            [
                1593421194000,
                9
            ],
            [
                1593421196000,
                5
            ],
            [
                1593421198000,
                5
            ],
            [
                1593421200000,
                7
            ],
            [
                1593421202000,
                44
            ],
            [
                1593421204000,
                44
            ],
            [
                1593421206000,
                9
            ],
            [
                1593421208000,
                10
            ],
            [
                1593421210000,
                10
            ],
            [
                1593421212000,
                8
            ],
            [
                1593421214000,
                39
            ]
        ],
        "type": "line",
        "color": "#51BEF0",
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
        "max": 1900
    }
]

const HOCwarpper = (WrappedComponent) => {
    
    return <WrappedComponent />
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
        get_cpu(confrId, endType, memId).then(response => {
            setData(response.data)
        }).catch(error => {
            console.error('get_cpu', error);
        })
    }, []);
    
    
    return <ChartsWrapper chartOptions={chartOptions} />
}
// 音量
const Volume = props => {

}


const SenderVolume = () => {
    let chartOptions = {
        title:{
            text:'音量'
        },
        series: data
    }
    return <ChartsWrapper chartOptions={chartOptions} />
}
const ReceiverVolume = () => {
    let chartOptions = {
        title:{
            text:'接收音量'
        },
        series: data
    }
    return <ChartsWrapper chartOptions={chartOptions} />
}



// 将highcharts 包装一下
const ChartsWrapper = props => {
    const context = useContext(E2eContext);
    
    if(!context.conference_info[0]) { // 没拿到会议信息之前，不执行
        return <i></i>
    }
    const { createdTs, destroyedTs } = context.conference_info[0]

    const options = {
        chart: {
          zoomType: "x",
          height:191
        },
        
        credits: {
            enabled: false
        },
        
        xAxis: {
            type:"datetime",
            tickInterval: 60000,
            min: createdTs*1000,
            max: destroyedTs*1000,
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
