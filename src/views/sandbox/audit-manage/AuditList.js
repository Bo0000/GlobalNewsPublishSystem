import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Tag, Button ,notification} from 'antd'

export default function AuditList(props) {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1`).then(res => {
      const list = res.data
      setDataSource(list)
    })
  }, [username])
  const auditList = ["未审核", "审核中", "已通过", "未通过"]
  const colorList = ["", "orange", "green", "red"]
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: "操作",
      dataIndex: 'auditState',
      render: (auditState,item) => {
        return <div>
          {auditState === 1 && <Button type="primary" onClick={() => handleRervert(item)}>撤销</Button>}
          {auditState === 2 && <Button type="primary" onClick={() => handlePublish(item)}>发布</Button>}
          {auditState === 3 && <Button type="primary" onClick={() => handleUpdate(item)}>修改</Button>}
        </div>
      }
    }
  ]
  const handleRervert = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您可以到草稿箱中查看您的新闻`,
        placement: "bottomRight"
      });

    })
  }

  const handleUpdate = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }

  const handlePublish = (item) => {
    axios.patch(`/news/${item.id}`, {
      "publishState": 2,
      "publishTime": Date.now()
    }).then(res => {
      setDataSource(dataSource.filter(data => data.id !== item.id))
      notification.info({
        message: `通知`,
        description:
          `您可以到【发布管理/已经发布】中查看您的新闻`,
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
