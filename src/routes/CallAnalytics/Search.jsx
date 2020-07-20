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
  notification,
  Icon
} from "antd";
import moment from 'moment';
import tableFormat from './table-format';
import { getPageQuery } from '../../utils/utils';

class Search extends PureComponent {
    state = {
        data: [],
        loading: false,
        next_id: null,
        params: {
            fromTs: moment().subtract(14, 'days'),
            toTs: moment(),
            size:15,
            start: null,
            userName: '',
            confrId: '',
            inputGroupType: 'confrId', // 输入框组分类，选择的哪一个
            inputGroupValue: '', // 输入框组值
        }
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

            return
        }

        this.get_list()
    }

    // 设置请求参数
    update_params(params) {
        this.setState({
            params,
            next_id: null,
        }, this.get_list)
    }
    // format
    get_format_params() {
        
        let { fromTs, toTs } = this.state.params;
        fromTs = fromTs.valueOf(); 
        toTs = toTs.valueOf(); // 转换 moment 对象为字符串

        let { start, size, userName, confrId } = this.state.params;
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

        return params
    }
    
    // 设置分页
    set_pagination_params() {
        // set prev id and next id
        let { size } = this.state.params;
        let { data } = this.state;

        if(data.length < size) { // 代表没有下一页 
            this.setState({
                next_id: null
            })
        } else {
            
            this.setState({
                next_id: data[data.length-1].id,
            })
        }
        


    }
    
    // 请求下一页 
    get_next() {
        // get next_id used as start

        let { next_id } = this.state;

        let params = Object.assign(this.state.params, { start:next_id })
        this.setState({
            params
        }, this.get_list)

    }
    get_list() {
        let params = this.get_format_params();

        let _this = this;
        this.setState({ // 设置loading
            loading: true
        },() => {
            get(params).then(response => {
                _this.setState({
                    data: response.data,
                    loading: false
                });
                _this.set_pagination_params()
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

        let { prev_id, next_id } = this.state;
        let { get_next } = this;
        return (
            <div className={style.wrapper}>
                <SearchParams update_params={this.update_params.bind(this)} params={this.state.params}/>
                <List {...this.state} />
                <CustomPagination  
                    {...{prev_id, next_id}} 
                    get_next={this.get_next.bind(this)}
                />
            </div>
        );
    }
}

// 搜索条件
class SearchParams extends PureComponent {
    constructor(props) {
        super(props)
        this.state = props.params; 
    }
    
    handleSubmit(e) {
        if(e) {
            e.preventDefault();
        }
        this.props.update_params(this.state)

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
            pagination={false}
        />
            
    );
  }
}

// 自定义分页
const CustomPagination = props => {
    let { next_id } = props;
    return (
        <div style={{marginTop:'10px', textAlign: 'right'}}>
            
            <li 
                className={(next_id? '' : 'ant-pagination-disabled') + " ant-pagination-prev"} 
                title="下一页" 
                onClick={props.get_next}
            >
                <a className="ant-pagination-item-link">
                    <Icon type="right" />
                </a>
            </li>
        </div>
    )  
}

export default Search;
