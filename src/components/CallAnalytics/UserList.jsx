import {
    Table
} from 'antd';
import tableFormat from '../../routes/CallAnalytics/table-format';
import style from '../../routes/CallAnalytics/Conference.less'
// 通话在线状态
const OnlineStatus = props => {

    const get_pos_and_width = () => {
        let { 
            createTs,
            destroyedTs,
            joinTs, 
            exitTs,
        } = props;

        let conference_dur = destroyedTs - createTs;
        let user_dur = exitTs - joinTs;

        if(conference_dur == user_dur) {
            return {
                left:'0%',
                width:'100%'
            }
        }

        let left = (((joinTs - createTs)/conference_dur).toFixed(2))*100 + '%',
            width = ((user_dur/conference_dur).toFixed(2))*100 + '%';

        return {
            left,
            width
        }
    }
    
    return <div className={style['online-status-wrapper']}>
        <div className={style['online-status']} style={get_pos_and_width()}></div>
    </div>
}
// 通话人员模块
export default function UserList(props) {

    let { data, loading, conference_info } = props;
    
    

  const columns = [
    {
      title: "MemId",
      dataIndex: "memId",
      render: text => tableFormat.get_short_memId(text, conference_info && conference_info.confrId)
    },
    {
      title: "UserName",
      dataIndex: "memName",
    },
    {
      title: "区域",
      dataIndex: "ip",
    //   ellipsis: true
    },
    {
      title: "通话在线状态",
      dataIndex: "online-type",
      render:(text, record) => {
          if(!conference_info) {
              return ''
          }
          let { createTs, destroyedTs } = conference_info;

          return (

              <OnlineStatus 
                {...{createTs, destroyedTs}} 
                joinTs={record.joinTs} 
                exitTs={record.exitTs} />
          )
      }
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
      key:'in-confr-dur', 
      render:text => tableFormat.get_dur(text)
    },
    {
      title: "SDK",
      dataIndex: "sdkVersion",
    //   ellipsis: true
    },
    {
      title: "平台",
      dataIndex: "os",
    //   ellipsis: true
    },
    {
      title: "网络",
      dataIndex: "net",
    //   ellipsis: true
    },
    {
      title: "设备",
      dataIndex: "deviceInfo",
    //   ellipsis: true
    },
    // {
    //   title: "查看体验",
    //   key: "operation",
    //   ellipsis: true
    // }
  ];
  let style = {
      margin:'18px 0',
      background:'#fff',
      minWidth:'1170px'
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