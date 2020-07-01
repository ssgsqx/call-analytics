 import {
    Table
 } from 'antd'
 // 会议基本信息模块
 export default function ConferenceInfo(props) {
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