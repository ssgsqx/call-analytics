import React, { PureComponent } from "react";
import style from "./Qoe.less";

import { Form, Select, DatePicker, Input, Button, Col, Row, Table } from "antd";

import data from "./data.json";

class Qoe extends PureComponent {
  state = {
    basic_info: [],
    user_list: []
  };
  // 通话概述
  get_basic_info_by_id(id) {
    if (!id) {
      return;
    }

    let _this = this;
    setTimeout(() => {
      let { basic_info } = data;
      _this.setState({ basic_info });
    }, 2000);
  }

  // 通话人员
  get_user_list(params) {
    let _this = this;
    setTimeout(() => {
      let { user_list } = data;
      _this.setState({ user_list });
    }, 2000);
  }

  // 通话质量
  get_qoe_counters() {
    setTimeout(() => {}, 2000);
  }

  componentDidMount() {
    let id = 1;
    this.get_basic_info_by_id(id);
    this.get_user_list();
  }
  render() {
    let { basic_info, user_list } = this.state;
    return (
      <div className={style.wrapper}>
        <BasicInfo basic_info={basic_info} />
        <UserList user_list={user_list} />
      </div>
    );
  }
}

// 通话基础信息模块
function BasicInfo(props) {
  let { basic_info: data } = props;

  const columns = [
    {
      title: "项目名称",
      dataIndex: "projectId"
    },
    {
      title: "频道名称",
      dataIndex: "cname"
    },
    {
      title: "时区",
      dataIndex: "createdTs"
    },
    {
      title: "时长",
      dataIndex: "duration"
    }
  ];
  return <Table dataSource={data} columns={columns} pagination={false} />;
}
// 通话人员模块
function UserList(props) {
  let { user_list: data } = props;

  const columns = [
    {
      title: "User",
      dataIndex: "uid",
      ellipsis: true
    },
    {
      title: "区域",
      dataIndex: "loc",
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
      dataIndex: "duration",
      ellipsis: true
    },
    {
      title: "在频道内时间",
      dataIndex: "duration",
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
      dataIndex: "deviceType",
      ellipsis: true
    },
    {
      title: "查看体验",
      dataIndex: "",
      key: "operation",
      ellipsis: true
    }
  ];
  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={false}
      size="small"
    />
  );
}
// 通话质量模块

export default Qoe;
