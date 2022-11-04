import React, { useState, useEffect } from 'react'
import { Table, Modal, Button, Tree } from 'antd'
import axios from 'axios'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { confirm } = Modal
export default function RoleList() {
  const [dataSource, setDataSource] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [treeData, settreeData] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(0)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: "操作",
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} style={{"marginRight":"5px"}}/>
          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{
            setIsModalOpen(true)
            setCurrentRights(item.rights)
            setCurrentId(item.id)
            }} />
        </div>
      }
    }
  ]
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
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/roles/${item.id}`)
  }
  useEffect(() => {
    axios.get("/roles").then(res => {
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      settreeData(res.data)
    })
  }, [])
  
  const handleOk = () => {
    setIsModalOpen(false);
    setDataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return {
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`,{
      rights:currentRights
    })
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onCheck=(checkKeys)=>{
    setCurrentRights(checkKeys)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}
        pagination={{
          pageSize: 5
        }} />
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          checkStrictly
          treeData={treeData}
        />
      </Modal>
    </div>
  )
}
