import React from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Layout, Dropdown, Avatar, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux'

const { Header } = Layout;
function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false);
  const changeCollapsed = () => {
    // setCollapsed(!collapsed)
    props.changeCollapsed()
  }
  const {role:{roleName},username}=JSON.parse(localStorage.getItem("token"))
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <span>{roleName}</span>
          ),
        },
        {
          key: '2',
          danger: true,
          label: '退出',
          onClick:()=>{
            localStorage.removeItem("token")
            props.history.replace("/login")
          }
        },
      ]}
    />
  );
  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed),
      })} */}
      {props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />}

      <div style={{float:"right"}}>
        <span style={{marginRight:"5px"}}>欢迎回来，<span style={{color:"#1890ff"}}>{username}</span></span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
export default connect(
  ({CollapsedReducer:{isCollapsed}})=>({
    isCollapsed
  }),
  {
    changeCollapsed(){
      return {
        type:"change_collapsed"
      }
    }
  }
)(withRouter(TopHeader))