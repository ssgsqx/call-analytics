import React, { PureComponent } from "react";
import style from "./Search.less";
import { get } from '../../services/rtc-analytics/conferences';
import { Link } from 'dva/router';
import { 
  Form, 
  Select, 
  DatePicker, 
  Input, 
  Button, 
  Col, 
  Row, 
  Table 
} from "antd";

class Search extends PureComponent {
  render() {
    return (
      <div className={style.wrapper}>
        <SearchParams />
        <List />
      </div>
    );
  }
}

// 搜索条件
class SearchParams extends PureComponent {
  handleSubmit() {
    alert("aaa");
  }

  render() {
    const { RangePicker } = DatePicker;
    const InputGroup = Input.Group;
    const { Option } = Select;

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Row gutter={8}>
          <Col span={7}>
            <RangePicker style={{ width: "100%" }} />
          </Col>

          <Col span={7}>
            <InputGroup compact>
              <Select defaultValue="cname" style={{ width: "35%" }}>
                <Option value="cname">频道名称</Option>
                <Option value="uid">User</Option>
              </Select>
              <Input defaultValue="" style={{ width: "65%" }} />
            </InputGroup>
          </Col>

          <Col span={7}>
            <Select defaultValue="all">
              <Option value="all">全部</Option>
              <Option value="end">通话结束</Option>
              <Option value="in_progress">进行中</Option>
            </Select>
          </Col>

          <Col span={3}>
            <Button type="primary">搜索通话</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

// 结果列表
class List extends PureComponent {
  state = {
    data: [],
    columns: [
      {
        title: "通话ID",
        dataIndex: "confrId"
      },
      {
        title: "时区",
        key: "timeRange",
        render:(text,record) => (record.createdTs +'-'+ record.destroyedTs)
      },
      {
        title: "时长",
        dataIndex: "dur"
      },
      {
        title: "频道名称",
        dataIndex: "roomName"
      },
      {
        title: "操作",
        key: "action",
        render:(text,record) => (
          record.finished ? 
          <Link 
            to={`/call-analytics/conference/${record.confrId}`}
            target='_blank'
          >查看通话</Link> : '')

      }
    ],
    loading: true
  };

  get_list() {
    let _this = this;
    let params = {}
    get(params).then(response => {
      _this.setState({
        data: response.data,
        loading: false
      });
    })

  }
  set_appkey_in_localstorage(success_callback) {

    const getQueryVariable = (variable) => {
           var query = window.location.href.split('?')[1];
           var vars = query.split("&");
           for (var i=0;i<vars.length;i++) {
                   var pair = vars[i].split("=");
                   if(pair[0] == variable){return pair[1];}
           }
           return(false);
    }
    const appkey = getQueryVariable('appkey');
    localStorage.setItem('easemob-appkey',appkey)

    if(typeof success_callback == 'function'){
      success_callback(this)
    }
  }
  componentDidMount() {
    this.set_appkey_in_localstorage(this.get_list.bind(this))
  }

  render() {
    let { data, columns, loading } = this.state;

    return (
      <Table
        dataSource={data}
        columns={columns}
        size="small"
        loading={loading}
      />
    );
  }
}

export default Search;
