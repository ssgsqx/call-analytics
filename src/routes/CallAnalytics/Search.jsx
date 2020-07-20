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
  Table,
  notification
} from "antd";
import moment from 'moment';
import tableFormat from './table-format';
import { getPageQuery } from '../../utils/utils';

class Search extends PureComponent {
    state = {
        data: [],
        loading: false
    }

    componentDidMount() {

        // 存储 appkey 
        const { appkey } = getPageQuery('appkey');
        localStorage.setItem('easemob-appkey',appkey || '') // undefind 存进去 为字符串，影响后面判断
        // 没有 appkey 给出提示
        if(!appkey) {
            notification['error']({
                message: '请在url 中填写 appkey query',
            });
        }
    }


    get_list(params) {
        let _this = this;

        this.setState({ // 设置loading
            loading: true
        },() => {
            get(params).then(response => {
                _this.setState({
                    data: response.data,
                    loading: false
                });
            }).catch(err => {
                console.error('get data error', err)
                _this.setState({
                    loading: false
                });
            })
        })


    }
    
    render() {
        let appkey = localStorage.getItem('easemob-appkey');

        if(!appkey) {
            return <i></i>
        }

        return (
            <div className={style.wrapper}>
                <SearchParams search={this.get_list.bind(this)}/>
                <List {...this.state} />
            </div>
        );
    }
}

// 搜索条件
class SearchParams extends PureComponent {
    state = {
        fromTs: moment().subtract(14, 'days'),
        toTs: moment(),
        start: 0,
        size:15,
        userName: '',
        confrId: '',
        inputGroupType: 'confrId', // 输入框组分类，选择的哪一个
        inputGroupValue: '', // 输入框组值
    }
    componentDidMount() {
        this.handleSubmit()
    }
    handleSubmit(e) {
        if(e) {
            e.preventDefault();
        }
        let { fromTs, toTs } = this.state;
        fromTs = fromTs.valueOf(); 
        toTs = toTs.valueOf(); // 转换 moment 对象为字符串

        let { start, size, userName, confrId } = this.state;

        let params = {
            fromTs,
            toTs,
            size,
        }
        // 非必须 参数，有值就传
        if(start) {
            params.start = start
        }
        if(userName) {
            params.userName = userName
        }
        if(confrId) {
            params.confrId = confrId
        }

        this.props.search(params)
    }
    
    dateChange(value) {
        this.setState({
            fromTs: value[0],
            toTs: value[1]
        })
    }
    inputGroupValueChange(e) {
        let { inputGroupType } = this.state;

        this.setState({
            [inputGroupType] : e.target.value,
            inputGroupValue: e.target.value
        })
    }
    inputGroupChange(value) {
        this.setState({
            inputGroupType: value,
            confrId: '',
            userName: '',
            inputGroupValue: '' // 全部置空
        })
    }
  render() {
    const { RangePicker } = DatePicker;
    const InputGroup = Input.Group;
    const { Option } = Select;

    let { fromTs, toTs, inputGroupValue } = this.state
    return (
      <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
        <Row gutter={8}>
          <Col span={7}>
            <RangePicker 
                onChange={this.dateChange.bind(this)}
                showTime={{ format: 'HH:mm' }}
                style={{ width: "100%" }}  
                size="large" 
                defaultValue={[fromTs, toTs]}
            />
          </Col>

          <Col span={10}>
            <InputGroup compact size="large" >
              <Select 
                defaultValue="confrId" 
                style={{ width: "35%" }} 
                size="large" 
                onChange={this.inputGroupChange.bind(this)}
              >
                <Option value="confrId">会议ID</Option>
                <Option value="userName">userName</Option>
              </Select>
              <Input 
                defaultValue={inputGroupValue} 
                value={inputGroupValue} 
                style={{ width: "65%" }} 
                size="large" 
                onChange={this.inputGroupValueChange.bind(this)}
              />
            </InputGroup>
          </Col>

          {/* <Col span={7}>
            <Select defaultValue="all" size="large" >
              <Option value="all">全部</Option>
              <Option value="end">通话结束</Option>
              <Option value="in_progress">进行中</Option>
            </Select>
          </Col> */}

          <Col span={3}>
            <Button type="primary" size="large" htmlType='submit'>搜索通话</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

// 结果列表
class List extends PureComponent {
  state = {
    columns: [
      {
        title: "通话ID",
        dataIndex: "confrId"
      },
      {
        title: "时间",
        key: "timeRange",
        render:(text,record) => tableFormat.get_time_range(record.createTs,record.destroyedTs)
      },
      {
        title: "时长",
        dataIndex: "dur",
        render:text => tableFormat.get_dur(text)
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
  };

  render() {
    let { columns } = this.state;
    let { data, loading } = this.props

    return (
      <Table
        dataSource={data}
        columns={columns}
        size="small"
        loading={loading}
        className={style['conference-list']}
      />
    );
  }
}

export default Search;
