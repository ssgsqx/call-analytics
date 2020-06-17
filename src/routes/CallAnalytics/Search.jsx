import React, { PureComponent } from "react";
import style from "./Search.less";

import { Form, Select, DatePicker, Input, Button, Col, Row, Table } from "antd";

class Search extends PureComponent {
  render() {
    const { Option } = Select;

    return (
      <div className={style.wrapper}>
        <div>
          <label htmlFor="">切换项目：</label>
          <Select defaultValue="lucy" style={{ width: 120 }}>
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </div>

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
              <Select defaultValue="Zhejiang" style={{ width: "35%" }}>
                <Option value="Zhejiang">Zhejiang</Option>
                <Option value="Jiangsu">Jiangsu</Option>
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

// 进入详情页面
function join_qoe(id) {
  if (!id) {
    return;
  }

  let { protocol, host } = window.location;

  let url = `${protocol}//${host}/call-analytics/qoe?id=${id}`;

  window.open(url, false);
}

// 结果列表
class List extends PureComponent {
  state = {
    data: [],
    columns: [
      {
        title: "通话ID",
        dataIndex: "id"
      },
      {
        title: "时区",
        dataIndex: "timeRange"
      },
      {
        title: "时长",
        dataIndex: "duration"
      },
      {
        title: "频道名称",
        dataIndex: "cname"
      },
      {
        title: "操作",
        dataIndex: "action"
      }
    ],
    loading: true
  };

  get_data() {
    let { data } = this.state;
    let _this = this;
    setTimeout(() => {
      data = [
        {
          key: 1,
          id: 1,
          timeRange: "2020/06/04 15:00 - 2020/06/04 15:08",
          duration: "3 min",
          cname: "test",
          action: (
            <Button type="link" onClick={() => join_qoe(1)}>
              查看通话
            </Button>
          )
        },
        {
          key: 2,
          id: 2,
          timeRange: "2020/06/04 15:00 - 2020/06/04 15:08",
          duration: "3 min",
          cname: "test2",
          action: <Button type="link">查看通话</Button>
        },
        {
          key: 3,
          id: 3,
          timeRange: "2020/06/04 15:00 - 2020/06/04 15:08",
          duration: "3 min",
          cname: "test3",
          action: <Button type="link">进行中</Button>
        }
      ];

      _this.setState({
        data,
        loading: false
      });
    }, 2000);
  }

  componentDidMount() {
    this.get_data();
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
