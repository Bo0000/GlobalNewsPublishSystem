import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table,  Button, Modal, notification  } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  CloudUploadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
const { confirm } = Modal
export default function NewsDraft(props) {
  const [dataSource, setDataSource] = useState([])
  const {username}=JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0`).then(res => {
      const list = res.data
      setDataSource(list)
    })
  }, [username])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render:(title,item)=>{
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
    },
    {
      title: "操作",
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() =>showConfirm(item)} style={{"marginRight":"5px"}}/>
          
          <Button type="primary" shape="circle" icon={<EditOutlined /> } style={{"marginRight":"5px"}} onClick={()=>props.history.push(`/news-manage/update/${item.id}`)}/>
          
          <Button type="primary" shape="circle" icon={<CloudUploadOutlined />} onClick={()=>handleCheck(item.id)}/>
          
        </div>
      }
    }
  ]
  const handleCheck=(id)=>{
    axios.patch(`/news/${id}`,{
      auditState:1
    }).then(res=>{
      // console.log(res.data)
      setDataSource(dataSource.filter(data=>data.id!==res.data.id))
      notification.info({
        message: `通知`,
        description:
            "提交成功，请等待审核",
        placement: "bottomRight"
    })
    })
  }
  const showConfirm = (item) => {
    confirm({
      title: '您确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.delete(`/news/${item.id}`)
  }
  
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item=>item.id}
        pagination={{
          pageSize: 5
        }} />
    </div>
  )
}
