import React, { PureComponent } from "react";

import style from "./Conference.less";
import ConferenceInfo from '../../components/CallAnalytics/ConferenceInfo';
import UserList from '../../components/CallAnalytics/UserList';
import { Link } from 'dva/router';

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
    );
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
    // 获取可被选择的发送端用户
    get_can_choose_users() {
        let { memId:my_memId } = this.state.user;

        let { qoe } = this.state;

        let can_choose_users = [];

        qoe.map(item => {
            if(item.memId && item.memId != my_memId){ // 自己的不算
                can_choose_users.push(item.memId)
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
            user_list, 
            event_list,
            qoe
        } = this.state;

        let { conference_info } = this.props;
        return <Col span={12}>
                    <div className={style['user-panel']}>
                        <div className={style["user-info"]}>
                            <h2 style={{display:'inline-block'}}>{user.memId}</h2>
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
        plotOptions: {
            areaspline: {
                lineWidth:1
            }
        },
        xAxis: {
            type:"datetime",
            tickInterval: 60000,
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
        let left = Math.round(((ts - (createdTs*1000))/(dur*1000))*100);

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
