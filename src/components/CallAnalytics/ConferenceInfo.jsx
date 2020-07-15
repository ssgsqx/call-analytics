 import {
    Table
 } from 'antd'
 import tableFormat from '../../routes/CallAnalytics/table-format'
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
        title: "时间",
        key: "timeRange",
        render:(text,record) => tableFormat.get_time_range(record.joinTs,record.exitTs)
      },
      {
        title: "时长",
        dataIndex: "dur",
        render:text => tableFormat.get_dur(text)
      }
  ];
  return <Table 
            dataSource={data} 
            columns={columns} 
            pagination={false}
            loading={loading} 
            style={{background:'#fff'}}
          />;
}