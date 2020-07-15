import React, { PureComponent } from "react";
import style from "./Conference.less";

import ConferenceInfo from '../../components/CallAnalytics/ConferenceInfo';
import UserList from '../../components/CallAnalytics/UserList';

import { get_by_confrId } from '../../services/rtc-analytics/conferences';
import { 
    get_users,
    get_event_list,
    get_qoe
} from '../../services/rtc-analytics/conference';



import { Link } from 'dva/router';

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { 
    Form, Select, DatePicker, Input, Button, Col, Row, Table,
    Popover
} from "antd";


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

        get_by_confrId({ confrId }).then(response => { // 获取会议 基本信息
            _this.setState({
              basic_info: response.data,
              basic_info_table_loading: false
            })
        }).catch(error => console.error(error))

        get_users(confrId).then(response => { // 获取会议成员
            _this.setState({ 
                user_list: response.data,
                user_list_table_loading: false
            });
        }).catch(error => console.error(error));
        
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
            <ConferenceInfo data={basic_info} loading={basic_info_table_loading}/>
            <UserList data={user_list} loading={user_list_table_loading} />

            {/* 通话质量面板 */}
            <Row gutter={[16,16]}>

                { user_list.map((item,index) => (
                    <UserPanel 
                        user={item} 
                        user_list={user_list} 
                        key={index}
                        confrId={confrId}
                        conference_info={basic_info[0]}
                    />
                )) }
            </Row>

      </div>
    )
  }
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
            if(response && response.data) {

                _this.setState({
                    event_list: response.data
                })
            }
        });

        // 通话质量数据
        get_qoe(confrId, memId).then(response => {
            if(response && response.data) {
                _this.setState({
                    qoe: response.data
                })
            }
        })
    }
    // 获取可被选择的发送端用户
    get_can_choose_users() {
        let { memId:my_memId } = this.state.user;

        let { qoe } = this.state;

        let can_choose_users = [];

        qoe.map(item => {
            if(item.subMemId && item.subMemId != my_memId){ // 自己的不算
                can_choose_users.push(item.subMemId)
            }
        })

        can_choose_users = Array.from(new Set(can_choose_users))

        return can_choose_users
    } 
    // 进入 e2e 详情
    get_to_e2e_action_el() {
        
        let can_choose_users = this.get_can_choose_users();

        let { confrId } = this.state;
        let { memId:to_memId } = this.state.user;

        
        if(can_choose_users.length == 0) {
            return ''
        }
        if(can_choose_users.length == 1) {
            let from_memId = can_choose_users[0];
            return <Link 
                        to={`/call-analytics/e2e/${confrId}/${from_memId}/${to_memId}`}
                        target='_blank'>
                        <Button>查看详情</Button>
                    </Link>
        }

        // 多个成员加一个 popover
        const content = (
            <div>
                {can_choose_users.map((item,index) => {
                    let from_memId = item;
                    return <div key={index} >
                                <Link 
                                    onMouseEnter={() => console.log(from_memId)}
                                    to={`/call-analytics/e2e/${confrId}/${from_memId}/${to_memId}`}
                                    target='_blank'>{from_memId}</Link>
                            </div>
                })}
            </div>
        )
        return  <Popover content={content} title="选择发送端" trigger="click">
                    <Button style={{float:'right'}} shape="round">查看详情</Button>
                </Popover>
        

    }
    render() {
        let { 
            user, 
            event_list,
            qoe
        } = this.state;

        let { conference_info } = this.props;
        return <Col span={12}>
                    <div className={style['user-panel']}>
                        <div className={style["user-info"]}>
                            <h2 style={{display:'inline-block'}}>{user.memName}</h2>
                            <span>{user.os}</span>
                            <span>{user.sdkVersion}</span>
                            { this.get_to_e2e_action_el() }
                        </div>
                        <Chart { ...{qoe, conference_info}}/>
                        <EventList { ...{event_list, conference_info}}/>
                    </div>
                </Col>
    }
}



// 图表
class Chart extends PureComponent {
    render() {
        if(!this.props.conference_info) {
            return ''
        }
        let { createTs, destroyedTs } = this.props.conference_info
        let { qoe } = this.props;

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
            plotOptions: {
                areaspline: {
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
                // min: -120,  //最小
                tickInterval: 120, //步长
                // max:840,//最大
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
            series: qoe
        };
        return (
            <div className={style['chart']}>
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

    // 传入单个数据，得到在progress-par 上的left 值
    get_event_left(data) {
        if(
            !data ||
            !data.servTime
        ) {
            return
        }

        let {
            dur,
            createTs
        } = this.state.conference_info;

        let { servTime } = data; //事件的时间戳

        // (当前时间戳 - 会议开始时间)/总会议时长 --- 计算在会议中的位置 单位都为ms
        let left = Math.round(((servTime - createTs)/dur)*100);

        if(left == 100) { // 100% 的定位 会跨出 progress-bar
            left = 99
        }

        let position_info = {
            left,

        }
        return position_info
    }

    // 获取 事件柱子 高度
    get_column_height(length) {
        /*
        * 1 个固定 40
        * 大于1 时 (1 + (n-1)/(n+1)) * 40 
        * 增长率 逐渐减小 粗略计算一下
        */ 

        if(length == 0) {
            return 0
        }

        if(length == 1) {
            return 40
        }

        if(length > 1) {
            return (1 + (length-1)/(length+1)) * 40 
        }

    }

    get_info_by_event_type(event_type) {
        // 绿, color:'rgb(38, 185, 154)'
        // 黄, color:'rgb(255, 215, 0)'
        // 红, color:'rgb(255, 0, 0)'
        let events = {
            0:{ name:'加入会议', color:'rgb(38, 185, 154)'},
            1:{ name:'退出会议', color:'rgb(255, 0, 0)' },
            2:{ name:'网络连接成功', color:'rgb(38, 185, 154)' },
            3:{ name:'网络连接断开', color:'rgb(255, 0, 0)' },
            4:{ name:'网络质量差', color:'rgb(255, 0, 0)' },
            5:{ name:'打开自己的音频', color:'rgb(38, 185, 154)' },
            6:{ name:'打开自己的视频', color:'rgb(38, 185, 154)' },

            7:{ name:'关闭自己的音频', color:'rgb(38, 185, 154)' },
            8:{ name:'关闭自己的视频', color:'rgb(38, 185, 154)' },
            9:{ name:'切换后置摄像头', color:'rgb(255, 215, 0)' },
            10:{ name:'成员加入', color:'rgb(38, 185, 154)' },
            11:{ name:'成员退出', color:'rgb(255, 0, 0)' },
            12:{ name:'流加入', color:'rgb(38, 185, 154)' },
            13:{ name:'流退出', color:'rgb(255, 0, 0)' },

            14:{ name:'pub', color:'rgb(38, 185, 154)' },
            15:{ name:'unpub', color:'rgb(255, 0, 0)' },
            16:{ name:'sub', color:'rgb(38, 185, 154)' },
            17:{ name:'unsub', color:'rgb(255, 0, 0)' },
            18:{ name:'pub失败', color:'rgb(255, 0, 0)' },
            19:{ name:'repub', color:'rgb(255, 0, 0)' },
            20:{ name:'STREAM_PC_CONNECT_STATE', color:'rgb(38, 185, 154)' },
            21:{ name:'ROLE_CHANGE', color:'rgb(38, 185, 154)' },
           
        };

        return events[event_type]
    }
    // 给柱子添加背景色
    get_column_background(event_list) {

        let background_info = {
            background: ''
        };

        let _o = {}
        event_list.map(item => {
            let info = this.get_info_by_event_type(item.event);
            
            if(!_o[info.color]){ // 计算出现次数
                _o[info.color] = 1
            } else {
                _o[info.color] += 1
            }

        })

        // 选出出现次数最多的
        for (const key in _o) {
            if(!background_info.background) { // 第一次赋值
                background_info.background = key;
                background_info.num = _o[key];
            } else { // 开始比较大小
                if(_o[key] > background_info.num) { //大的替换
                    background_info.background = key;
                    background_info.num = _o[key];
                }
            }
        }
        return background_info.background
    }
    // 组合 column 和 popover 
    get_columns() {
        /*
        * 根据 event 时间戳
        * 一段时间内(相同的left)的几个事件，归到一个柱子
        * 上面 的popover 包含事件
        */
       let { event_list } = this.state;

       let _this = this;
       let columns = {}; // 以计算的left位置为 key
       event_list.map(item => {
           let position = _this.get_event_left(item);

           if(position){

               let { left } = position;
               if(!columns[left]){ // 不存在 就定义一个 array
                   columns[left] = { event_list: []}
               }
               columns[left].event_list.push(item);
           }
           
       })

        //给柱子添加 背景色
        for (const key in columns) {
            columns[key].background = this.get_column_background( columns[key].event_list )
        }

        /*
        * columns: {
        *   12: { // 12 left 位置
        *          event_list:[] //事件集合
        *          background: String // 背景色
        *   }
        * 
        * 
        * }
        */ 
       return columns

    }
    
    get_event_popover_el(event, index) {
        if(!event) {
            return ''
        }
        

        let info = this.get_info_by_event_type(event)
        
        return (
            <div 
                style = {{
                    lineHeight: '17px',
                    fontSize: '12px'
                }}
                key={index}
             >
                <span style={{
                    background: info.color,
                    width: '8px',
                    height: '8px',
                    borderRadius: '8px',
                    display:'inline-block',
                    marginRight:'10px'
                }}></span>
                <span>{info.name}</span>
            </div>
        )

    }
    get_event_el() {
        let columns = this.get_columns()

        let columns_el = Object.keys(columns).map((key, index) => {

            
            let left = key + '%', //柱子尺寸
                height = this.get_column_height(columns[key].event_list.length) + '%',
                background = columns[key].background;

            let popover_el = columns[key].event_list.map((item, index) => this.get_event_popover_el(item.event, index));
            return <Popover
                        content={popover_el} 
                        title="事件列表" 
                        trigger="click"
                        key={index}
                    >
                        <div 
                            className={style['event-column']} 
                            style={{ left, height, background }}>
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
