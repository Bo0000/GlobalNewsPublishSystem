import React, { useState, useEffect } from 'react'
import "./SideMenu.css"
import { withRouter } from "react-router-dom"
import axios from 'axios'
import {
  UserOutlined ,
  HomeOutlined,
  KeyOutlined,
  FileTextOutlined,
  DeliveredProcedureOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import {connect} from 'react-redux'
import { Layout, Menu } from 'antd';

const obj = (key, icon, label, children) => {
  return {
    key,
    icon,
    label,
    children,
  }
}
// function getItem(label, key, icon, children, type) {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//   };
// }
// const items = [
//   getItem('首页', '/home', <MailOutlined />),
//   getItem('用户管理', '/user-manage', <AppstoreOutlined />, [
//     getItem('用户列表', '/user-manage/userlist'),
//     ]),
//   getItem('权限管理', '/right-manage', <SettingOutlined />, [
//     getItem('角色列表', '/right-manage/role/list'),
//     getItem('权限管理', '/right-manage/right/list'),
//     ]),
// ];

const { Sider } = Layout;
function SideMenu(props) {
  // const [collapsed,setCollapsed] = useState(false)
  const [menu, setMenu] = useState([])
  const iconList = {
    "/home": <HomeOutlined />,
    "/user-manage": <UserOutlined />,
    "/right-manage": <KeyOutlined />,
    "/news-manage": <FileTextOutlined />,
    "/publish-manage": <DeliveredProcedureOutlined />,
    "/audit-manage": <AuditOutlined />,
    //.......
  }

  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      console.log(res.data)
      setMenu(res.data)
    })
  }, [])
  const {role:{rights}}=JSON.parse(localStorage.getItem("token"))
  const checkPagePermission = (item)=>{
    if(rights.checked){
      return item.pagepermisson && rights.checked.includes(item.key)
    }
    return item.pagepermisson && rights.includes(item.key)
  }
  const items = (menu) => {
    const arr = []
    menu.map((item) => {
      if (item.children && item.children.length !== 0 && item.pagepermisson === 1&&checkPagePermission(item)) {
        return arr.push(
          obj(item.key, iconList[item.key], item.title, items(item.children))
        )
      } else {
        return checkPagePermission(item)&&item.pagepermisson &&arr.push(obj(item.key, iconList[item.key], item.title))
      }
    })
    return arr
  }
  const selectedPath=[props.location.pathname]
  const openKey=["/"+props.location.pathname.split("/")[1]]
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className="logo" style={{display:props.isCollapsed?"none":"block"}} >全球新闻发布系统</div>
        <div style={{ flex: "1", "overflow": "auto" }}>
          <Menu
            mode="inline"
            theme='dark'
            // style={{
            //   width: 200,
            // }}
            items={items(menu)}
            onClick={(e) => {
              props.history.push(e.key)
            }} 
            selectedKeys={selectedPath}
            defaultOpenKeys={openKey}/>
        </div>
      </div>
    </Sider>
  )
}
export default connect(({CollapsedReducer:{isCollapsed}})=>({
  isCollapsed
}))(withRouter(SideMenu))
