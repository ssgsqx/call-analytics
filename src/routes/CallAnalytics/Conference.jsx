import React, { PureComponent } from "react";
import PropTypes from 'prop-types';

import style from "./Conference.less";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { 
    Form, Select, DatePicker, Input, Button, Col, Row, Table,
    Popover
} from "antd";


import { get_by_confrId } from '../../services/rtc-analytics/conferences'
import { 
    get_users, 
    get_event_list,
    get_qoe
} from '../../services/rtc-analytics/conference';

class Conference extends PureComponent {
    state = {
        basic_info: [],
        basic_info_table_loading: true,
        user_list: [],
        user_list_table_loading: true,

        confrId: this.props.match.params.confrId
    };

  componentDidMount() {

      let { confrId } = this.state;
      let _this = this;
      get_users(confrId).then(response => {
        _this.setState({ 
          user_list: response.data,
          user_list_table_loading: false
        });
      }).catch(error => console.log(error));

      const get_basic_info = get_by_confrId;//获取会议基本信息

      get_basic_info({ confrId }).then(response => {
          _this.setState({
            basic_info: response,
            basic_info_table_loading: false
          })
      }).catch(error => console.error(error))
  }
  render() {
    let { 
        confrId,
      basic_info, 
      basic_info_table_loading,
      user_list,
      user_list_table_loading
    } = this.state;
    return (
      <div className={style.wrapper}>
        <BasicInfo data={basic_info} loading={basic_info_table_loading}/>
        <UserList data={user_list} loading={user_list_table_loading} />
        {/* 通话质量面板 */}

        { user_list.map((item,index) => (
            <UserPanel 
                user={item} 
                user_list={user_list} 
                key={index}
                confrId={confrId}
                conference_info={basic_info[0]}
            />
        )) }

      </div>
    );
  }
}

// 通话基础信息模块
function BasicInfo(props) {
  let { data, loading } = props;

  const columns = [
    {
      title: "项目名称",
      dataIndex: "projectId"
    },
    {
      title: "频道名称",
      dataIndex: "roomName"
    },
    {
      title: "时区",
      dataIndex: "createdTs"
    },
    {
      title: "时长",
      dataIndex: "dur"
    }
  ];
  return <Table 
            dataSource={data} 
            columns={columns} 
            pagination={false}
            loading={loading} 
          />;
}
// 通话人员模块
function UserList(props) {
  let { data, loading } = props;

  const columns = [
    {
      title: "User",
      dataIndex: "memId",
      ellipsis: true
    },
    {
      title: "区域",
      dataIndex: "ip",
      ellipsis: true
    },
    {
      title: "通话在线状态",
      dataIndex: "",
      ellipsis: true
    },
    {
      title: "用户进出频道时间",
      dataIndex: "joinTs",
      ellipsis: true
    },
    {
      title: "时长",
      dataIndex: "dur",
      key:'time_length',
      ellipsis: true
    },
    {
      title: "在频道内时间",
      dataIndex: "dur",
      ellipsis: true
    },
    {
      title: "SDK",
      dataIndex: "sdkVersion",
      ellipsis: true
    },
    {
      title: "平台",
      dataIndex: "os",
      ellipsis: true
    },
    {
      title: "网络",
      dataIndex: "net",
      ellipsis: true
    },
    {
      title: "设备",
      dataIndex: "deviceInfo",
      ellipsis: true
    },
    {
      title: "查看体验",
      key: "operation",
      ellipsis: true
    }
  ];
  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={false}
      loading={loading}
      size="small"
    />
  );
}
// 通话质量模块
class UserPanel extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            user_list: this.props.user_list,
            confrId: this.props.confrId,
            event_list: [],
            qoe: []
        }
    }

    componentDidMount() {
        let { confrId } = this.state;
        let { memId } = this.state.user;

        let _this = this;
        get_event_list(confrId, memId).then(response => {
            _this.setState({
                event_list: response.data
            })
        });

        // 通话质量数据
        get_qoe(confrId, memId).then(response => {
            _this.setState({
                qoe: response
            })
        })
    }

    render() {
        let { 
            user, 
            user_list, 
            event_list,
            qoe
        } = this.state;

        let { conference_info } = this.props;
//         deviceInfo: "huawei/tas-an00/tas-an00/hwtas/29/4.14.116"
// dur: 200
// endReason: 1
// exitTs: 1591238240
// ip: "ip地址"
// joinTs: 1591238040
// memId: "4789321"
// memName: "sqx1"
// net: "Wi-Fi"
// os: "Android"
// osVersion: ""
// role: 3
// sdkVersion: "2.9.2"
// sessionId: ""
        return <Col span={12} className={style['user-panel']}>
            <div className={style["user-info"]}>
                <h2 style={{display:'inline-block'}}>{user.memId}</h2>
                <span>{user.os}</span>
                <span>{user.sdkVersion}</span>
            </div>
            <Chart { ...{qoe, conference_info}}/>
            <EventList { ...{event_list, conference_info}}/>
        </Col>
    }
}



// 图表
class Chart extends PureComponent {
    render() {
        if(!this.props.conference_info) {
            return ''
        }
        let { createdTs, destroyedTs } = this.props.conference_info
        
      const options = {
        chart: {
          zoomType: "x",
          height:200
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
        //   categories: [0, 1, 2, 3] // x 轴分类
            type:"datetime",
            tickInterval: 60000,
            // startOnTick: true,
            // endOnTick: true,
            // labels: {
            //     formatter: function() {
            //         let date = new Date(this.value);
            //         return `${date.getHours()} : ${date.getMinutes()}`
            //     }
            // }
            min: createdTs*1000,
            max: destroyedTs*1000,
        },
        title: {
            text: null
        },
        yAxis: {
          title: {
            text: null // y 轴标题
          },
          labels: {
            formatter: function() {
              return Math.abs(this.value) + "kbps";
            }
          },
            min: -120,  //最小
            tickInterval: 120, //步长
            max:840,//最大
            gridLineWidth: 0,
            tickWidth:1,
            plotLines:[{
                value:0
            }]
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
        series: this.props.qoe
        // series: [
        //   {
        //     type: "areaspline",
        //     name: "小明",
        //     data: [2, 8, 10, 12, 14, 10, 6, 4],
        //     marker: {
        //       enabled: false
        //     }
        //   },
        //   {
        //     type: "areaspline",
        //     name: "小红",
        //     data: [0, 0, -15, -13, -10, -8, -6, -4],
        //     marker: {
        //       enabled: false
        //     }
        //   },
        //   {
        //     type: "column",
        //     color: "red",
        //     pointWidth: 1,
        //     borderWidth: 0,
        //     data: [30, 20, 10, 30, 40]
        //   }
        // ]
      };
      return (
        <div>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      );
    }
}

// 事件列表
class EventList extends PureComponent {
    constructor(props){
        super(props);

        this.state = {
            event_list: this.props.event_list,
            conference_info: this.props.conference_info
        }
    }
    static getDerivedStateFromProps(props) {

        return {
            event_list: props.event_list,
            conference_info: props.conference_info
        };
    }
    

    // 画事件柱子
    /*
    * 平分 100份
    *
    *
    */ 

    // 传入单个数据，得到在progress-par 上的位置
    get_position(data) {
        if(
            !data ||
            !data.ts
        ) {
            return
        }

        let {
            dur,
            createdTs
        } = this.state.conference_info;

        let { ts } = data; //事件的时间戳
        // (当前时间戳 - 会议开始时间)/总会议时长 --- 计算在会议中的位置
        // console.log('ts',ts,createdTs,dur);
        
        let left = Math.round(((ts - createdTs)/(dur*1000))*100);

        let position_info = {
            left,

        }
        return position_info
    }

    // 组合 column 和 popover 
    combination_column_and_popover() {
        let { event_list } = this.state;

        let _this = this;
        let columns = {}; // 以计算的位置为 key
        event_list.map(item => {
            let position = _this.get_position(item);

            let { left } = position;
            if(!columns[left]){ // 不存在 就定义一个 array
                columns[left] = { event_list: []}
            }
            columns[left].event_list.push(item)
            
        })
        return columns
    }
    get_event_el() {
        let columns = this.combination_column_and_popover()

        let columns_el = Object.keys(columns).map((columns_key, index) => {

            let popover_el = columns[columns_key].event_list.map(item => <div>{item.evt}</div>);

            return <Popover content={popover_el} title="Title" trigger="click">
                        <div 
                            key={index}
                            className={style['event-column']} 
                            style={{left:(columns_key + '%'),height:'50%'}}>
                        </div>
                    </Popover>
        })
        
        return <div className={style['event-progress-container']}>{columns_el}</div>
    }
    render() {

        return <div className={style['event-list']}>
                    { this.get_event_el() }
                    <div className={style['progress-par']}></div>
                </div>
    }
}
export default Conference;
