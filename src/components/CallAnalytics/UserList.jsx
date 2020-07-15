import {
    Table
} from 'antd';
import tableFormat from '../../routes/CallAnalytics/table-format'
// 通话人员模块
export default function UserList(props) {
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
      dataIndex: "timeRange",
      render:(text,record) => tableFormat.get_time_range(record.joinTs,record.exitTs)
    },
    {
      title: "时长",
      dataIndex: "dur",
      render:text => tableFormat.get_dur(text)
    },
    {
      title: "在频道内时间",
      dataIndex: "dur",
      render:text => tableFormat.get_dur(text)
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
    // {
    //   title: "查看体验",
    //   key: "operation",
    //   ellipsis: true
    // }
  ];
  let style = {
      margin:'18px 0',
      background:'#fff'
  }
  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={false}
      loading={loading}
      size="small"
      style={style}
    />
  );
}