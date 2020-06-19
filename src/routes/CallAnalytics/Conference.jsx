import React, { PureComponent } from "react";
import style from "./Conference.less";

import { Form, Select, DatePicker, Input, Button, Col, Row, Table } from "antd";


import { get_by_confrId } from '../../services/rtc-analytics/conferences'
import { get_users } from '../../services/rtc-analytics/conference';

class Conference extends PureComponent {
  state = {
    basic_info: [],
    basic_info_table_loading: true,
    user_list: [],
    user_list_table_loading: true,

    confrId: this.props.match.params.confrId
  };

  // 通话质量
  get_qoe_counters() {
    setTimeout(() => {}, 2000);
  }

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
      basic_info, 
      basic_info_table_loading,
      user_list,
      user_list_table_loading
    } = this.state;
    return (
      <div className={style.wrapper}>
        <BasicInfo data={basic_info} loading={basic_info_table_loading}/>
        <UserList data={user_list} loading={user_list_table_loading} />
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

export default Conference;
