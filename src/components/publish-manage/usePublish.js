import { notification } from 'antd'
import axios from 'axios'
import { useState ,useEffect} from 'react'

function usePublish(type) {
    const [dataSource, setDataSource] = useState([])
    const { roleId, username, region } = JSON.parse(localStorage.getItem("token"))
    useEffect(() => {
        axios.get(`/news?publishState=${type}`).then(res => {
            const list = res.data
            setDataSource(roleId === 1 ? list : [
                ...list.filter(data => data.author === username),
                ...list.filter(data => data.region === region && roleId === 2)
            ])
        })
    }, [roleId, username, region,type])
    const handleOption = (id) => {
        if (type === 1) {
            setDataSource(dataSource.filter(data => data.id !== id))
            axios.patch(`/news/${id}`, {
                "publishState": 2,
                "publishTime": Date.now()
            }).then(res => {
                notification.info({
                    message: `通知`,
                    description: "该新闻已上线",
                    placement: "bottomRight"
                });
            })
        } else if (type === 2) {
            setDataSource(dataSource.filter(data => data.id !== id))
            axios.patch(`/news/${id}`, {
                "publishState": 3,
            }).then(res => {
                notification.info({
                    message: `通知`,
                    description: "该新闻已下线",
                    placement: "bottomRight"
                });
            })
        } else {
            setDataSource(dataSource.filter(data => data.id !== id))
            axios.delete(`/news/${id}`).then(res => {
                notification.info({
                    message: `通知`,
                    description: "该新闻已删除",
                    placement: "bottomRight"
                });
            })
        }
    }
    return {
        dataSource,
        handleOption
    }
}
export default usePublish
