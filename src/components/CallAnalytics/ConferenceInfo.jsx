 import {
    Table
 } from 'antd'
 import tableFormat from '../../routes/CallAnalytics/table-format'
 // 会议基本信息模块
 export default function ConferenceInfo(props) {
  let { data, loading } = props;

  const columns = [
    {
      title: "会议ID",
      dataIndex: "confrId"
    },
    {
      title: "房间名称",
      dataIndex: "roomName"
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