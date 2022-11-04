import React, { useState, useEffect,useRef } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Switch } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import UserForm from '../../../components/user-manege/UserForm';

const { confirm } = Modal


export default function UserList() {
  const [dataSource, setDataSource] = useState([])
  const [isAddVisiable, setisAddVisiable] = useState(false)
  const [isUpdateVisiable, setisUpdateVisiable] = useState(false)
  const [regionList, setRegion] = useState([])
  const [roleList, setRole] = useState([])
  const [current, setCurrent] = useState(null)
  const [isUpdateDisable, setisUpdateDisable] = useState(false)
  const addForm=useRef(null)
  const updateForm=useRef(null)

  const {roleId,region,username}=JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    const roleObj={
      "1":"superadmin",
      "2":"admin",
      "3":"editor"
    }
    axios.get('/users?_expand=role').then(res => {
      const list = res.data
      setDataSource(roleObj[roleId]==="superadmin"?list:[
        ...list.filter(item=>item.username===username),
        ...list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")
      ])
    })
  }, [roleId,region,username])
  useEffect(() => {
    axios.get('/regions').then(res => {
      const list = res.data
      setRegion(list)
    })
  }, [])
  useEffect(() => {
    axios.get('/roles').then(res => {
      const list = res.data
      setRole(list)
    })
  }, [])
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item=>(
          {
            text:item.title,
            value:item.value
          }
        )),
        {
          text: '全球',
          value: '全球',
        },
      ],
      onFilter: (value, item) => {
        if(value==="全球"){
          return item.region===""
        }
        return item.region===value
      },
      render: (region) => {
        return <b>{region === '' ? "全球" : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={()=>handleChange(item)}></Switch>
      }
    },
    {
      title: "操作",
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => showConfirm(item)} disabled={item.default} style={{"marginRight":"5px"}} />
          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={()=>handleUpdate(item)}/>
        </div>
      }
    }
  ]
  const handleChange=(item)=>{
    item.roleState=!item.roleState
    setDataSource([...dataSource])
    axios.patch(`/users/${item.id}`,{
      roleState:item.roleState
    })
  }
  const handleUpdate=(item)=>{
    setTimeout(()=>{
      
      if(item.roleId===1){
          //禁用
          setisUpdateDisable(true)
      }else{
          //取消禁用
          setisUpdateDisable(false)
      }
      updateForm.current.setFieldsValue(item)
  },0)
  setisUpdateVisiable(true)
  setCurrent(item)
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
    axios.delete(`/users/${item.id}`)
  }
  const addFormOK=()=>{
    addForm.current.validateFields().then(value=>{
      // console.log(value)
      setisAddVisiable(false)
      addForm.current.resetFields()
      axios.post("/users",{
        ...value,
        roleState:true,
        default:false
      }).then(res=>{
        setDataSource([...dataSource,{
          ...res.data,
          role:roleList.filter(data=>data.id===value.roleId)[0]
        }
        ])
      })
    }).catch(err=>{
      console.log(err)
    })
  }
  const updateFormOK=()=>{
    setisUpdateVisiable(false)
    updateForm.current.validateFields().then(value=>{
    setDataSource(dataSource.map(item=>{
      if(item.id===current.id){
        return {
          ...item,
          ...value,
          role:roleList.filter(data=>data.id===value.roleId)[0]
        }
      }
      return item
    }))
    axios.patch(`/users/${current.id}`,value)
    setisUpdateDisable(!isUpdateDisable)
  }
  )}
  return (
    <div>
      <Button type='primary' onClick={() => setisAddVisiable(true)}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
      />
      <Modal
        open={isAddVisiable}
        title="添加用户"
        okText="添加"
        cancelText="取消"
        onCancel={() => {
          setisAddVisiable(false)
          addForm.current.resetFields()
        }}
        onOk={() => {
          addFormOK()
        }}
      >
        <UserForm role={roleList} region={regionList} ref={addForm}/>
      </Modal>
      <Modal
        open={isUpdateVisiable}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setisUpdateVisiable(false)
          setisUpdateDisable(!isUpdateDisable)
        }}
        onOk={() => {
          updateFormOK()
        }}
      >
        <UserForm role={roleList} region={regionList} ref={updateForm} isUpdateDisable={isUpdateDisable} isUpdate={true}/>
      </Modal>
    </div>
  )
}
