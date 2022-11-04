import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Button, notification } from 'antd'
import { CheckOutlined ,CloseOutlined  } from '@ant-design/icons'

export default function Audit(props) {
  const [dataSource, setDataSource] = useState([])
  const { roleId, region } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`/news?auditState=1`).then(res=>{
      const list=res.data
      setDataSource(roleId===1?list:[
        ...list.filter(data=>data.region===region)
      ])
    })
  }, [roleId, region])
  
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category'
    },
    {
      title: "操作",
      render: (item) => {
        return <div>
          <Button type="primary" shape='circle' icon={<CheckOutlined/>} onClick={() => handleAudit(item,2,1)} style={{marginRight:"5px"}}/>
          <Button danger shape='circle' icon={<CloseOutlined/>} onClick={() => handleAudit(item,3,0)}/>
        </div>
      }
    }
  ]
  const handleAudit = (item,auditState,publishState) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `审核完成，您可以到[审核管理/审核列表]中查看您的新闻的审核状态`,
        placement: "bottomRight"
      });

    })
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}
        pagination={{
          pageSize: 5
        }} />
    </div>
  )
}
