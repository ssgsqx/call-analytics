import {
    Table
} from 'antd';

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
      dataIndex: "joinTs",
      ellipsis: true
    },
    {
      title: "时长",
      dataIndex: "dur",
      key:'time_length',
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