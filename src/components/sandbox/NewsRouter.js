import React, { useEffect, useState } from 'react'
import Home from "../../views/sandbox/home/Home"
import UserList from "../../views/sandbox/user-manage/UserList"
import RoleList from "../../views/sandbox/right-manage/RoleList"
import RightList from "../../views/sandbox/right-manage/RightList"
import Nopermission from "../../views/sandbox/nopermission/Nopermission"
import { Switch, Route, Redirect } from 'react-router-dom'
import axios from 'axios'
import NewsAdd from './../../views/sandbox/news-manage/NewsAdd';
import NewsDraft from './../../views/sandbox/news-manage/NewsDraft';
import NewsCategory from './../../views/sandbox/news-manage/NewsCategory';
import Audit from './../../views/sandbox/audit-manage/Audit';
import AuditList from './../../views/sandbox/audit-manage/AuditList';
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from './../../views/sandbox/publish-manage/Published';
import Sunset from './../../views/sandbox/publish-manage/Sunset';
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import {connect} from "react-redux"
import { Spin } from 'antd'

function NewsRouter(props) {
    const [backRouteList, setbackRouteList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children")
        ]).then(res => {
            console.log(res)
            setbackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])
    const LocalRouterList = {
        "/home": Home,
        "/user-manage/list": UserList,
        "/right-manage/role/list": RoleList,
        "/right-manage/right/list": RightList,
        "/news-manage/add": NewsAdd,
        "/news-manage/draft": NewsDraft,
        "/news-manage/category": NewsCategory,
        "/news-manage/preview/:id": NewsPreview,
        "/news-manage/update/:id": NewsUpdate,
        "/audit-manage/audit": Audit,
        "/audit-manage/list": AuditList,
        "/publish-manage/unpublished": Unpublished,
        "/publish-manage/published": Published,
        "/publish-manage/sunset": Sunset

    }
    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))
    const checkRoute = (item) => {
        return LocalRouterList[item.key] && (item.pagepermisson || item.routepermisson)
    }
    const checkRoutePermisson = (item) => {
        if (rights.checked) {
            return rights.checked.includes(item.key)
        }
        return rights.includes(item.key)
    }
    return (
        <Spin tip="Loading..." spinning={props.isLoading}>
            <Switch>
                {backRouteList.map(item => {
                    if (checkRoute(item) && checkRoutePermisson(item)) {
                        return <Route path={item.key} key={item.key} component={LocalRouterList[item.key]} exact />
                    }
                    return null
                }
                )}
                <Redirect from="/" to="/home" exact />
                <Route path="*" component={Nopermission} />
            </Switch>
        </Spin>
    )
}
export default connect(({LoadingReducer:{isLoading}})=>({
    isLoading
}))(NewsRouter)
