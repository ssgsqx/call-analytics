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
        pageNum: 0,
        pageSize: 15,
        next_disabled: false,
        params: {
            fromTs: moment().subtract(14, 'days'),
            toTs: moment(),
            userName: '',
            confrId: '',
            inputGroupType: 'confrId', // 输入框组分类，选择的哪一个
            inputGroupValue: '', // 输入框组值
            finished: true
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
            pageNum: 0,
            next_disabled: false
        }, this.get_list)
    }
    // format
    get_format_params() {
        
        let { fromTs, toTs } = this.state.params;
        fromTs = fromTs.valueOf(); 
        toTs = toTs.valueOf(); // 转换 moment 对象为字符串

        let { userName, confrId, finished } = this.state.params;
        let params = {
            fromTs,
            toTs,
            finished
        }
        // 非必须 参数，有值就传
        
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
        let { pageSize } = this.state;
        let { data } = this.state;

        if(data.length < pageSize) { // 代表没有下一页 
            this.setState({
                next_disabled: true
            })
        }
        
        


    }
    get_prev() {
        this.setState(state => ({
            pageNum: state.pageNum - 1,
            next_disabled: false
        }), this.get_list)
    }
    // 请求下一页 
    get_next() {

        this.setState(state => ({
            pageNum: state.pageNum + 1 
        }), this.get_list)

    }
    get_list() {
        let params = this.get_format_params();
        let { pageNum, pageSize } = this.state;

        let _this = this;
        this.setState({ // 设置loading
            loading: true
        },() => {
            get(pageNum, pageSize, params).then(response => {
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

        let { pageNum, next_disabled } = this.state;

        return (
            <div className={style.wrapper}>
                <WrapperSearchParams params={this.state.params} update_params={this.update_params.bind(this)} />
                <List {...this.state} />
                <CustomPagination  
                    {...{pageNum, next_disabled}} 
                    get_next={this.get_next.bind(this)}
                    get_prev={this.get_prev.bind(this)}
                />
            </div>
        );
    }
}

// 搜索条件
class SearchParams extends PureComponent {
    constructor(props) {
        super(props)
    }
    
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
                console.log('Received values of form: ', values);

                let {

                    dateRange,
                    exactType, // confrId or userName
                    exactValue, // the value of confrId or userName
                    finished
                } = values;

                let params = {
                    fromTs: dateRange[0],
                    toTs: dateRange[1],
                    finished
                }
                if(exactValue) {
                    params[exactType] = exactValue;
                }
                this.props.update_params(params)
          }
        });
    }
    
    dateChange(value) {
        this.setState({
            fromTs: value[0],
            toTs: value[1]
        })
    }
    
    inputGroupChange() {
        this.props.form.setFieldsValue({
            exactValue: ''
        });
    }
  render() {
    const { RangePicker } = DatePicker;
    const InputGroup = Input.Group;
    const { Option } = Select;

    let { fromTs, toTs } = this.props.params;

    const { getFieldDecorator } = this.props.form;

    return (
      <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
        <Row gutter={8}>
            
          <Col span={7}>
                <Form.Item className="Item">
                    {getFieldDecorator('dateRange', {
                            rules: [{ required: true, message: '请选择时间范围' }],
                            initialValue: [fromTs, toTs]
                    })(
                        <RangePicker 
                            onChange={this.dateChange.bind(this)}
                            showTime={{ format: 'HH:mm' }}
                            style={{ width: "100%" }}  
                            size="large" 
                        />
                    )}
                </Form.Item>
          </Col>

          <Col span={10}>
            <InputGroup compact size="large" >
                {getFieldDecorator('exactType', {
                        rules: [{ required: true, message:'' }],
                        initialValue: 'confrId'
                })(
                    <Select 
                        style={{ width: "35%" }} 
                        size="large" 
                        onChange={this.inputGroupChange.bind(this)}
                    >
                        <Option value="confrId">会议ID</Option>
                        <Option value="userName">创建者userName</Option>
                    </Select>
                )}
                {getFieldDecorator('exactValue', {
                        rules: [{ required:false }],
                        initialValue: ''
                })(
                    <Input 
                        style={{ width: "65%" }} 
                        size="large" 
                    />
                )}
              
            </InputGroup>
          </Col>

          <Col span={4}>
                {getFieldDecorator('finished', {
                    rules: [{ required:true }],
                    initialValue: 'true'
                })(
                    <Select size="large" >
                        <Option value='true'>通话结束</Option>
                        {/* <Option value='false'>进行中</Option> */}
                    </Select>
                )}
            
          </Col>

          <Col span={3}>
            <Button type="primary" size="large" htmlType='submit'>搜索通话</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrapperSearchParams = Form.create()(SearchParams)

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
                <Link 
                    to={`/call-analytics/conference/${record.confrId}`}
                    target='_blank'
                >
                    {record.finished ? '查看通话' : '进行中'}
                </Link>
            )

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
    let { pageNum, next_disabled } = props;
    return (
        <div style={{marginTop:'10px', textAlign: 'right'}}>
            
            <li 
                className={(pageNum == 0 ? 'ant-pagination-disabled' : '') + " ant-pagination-prev"} 
                title="上一页" 
                onClick={props.get_prev}
            >
                <a className="ant-pagination-item-link">
                    <Icon type="left" />
                </a>
            </li>

            <li 
                className={(next_disabled ? 'ant-pagination-disabled' : '') + " ant-pagination-prev"} 
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
