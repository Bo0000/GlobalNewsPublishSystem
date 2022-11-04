import { PageHeader, Card, Col, Row, List } from 'antd'
import axios from 'axios'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

export default function News() {
    const [viewList, setViewList] = useState([])
    useEffect(() => {
        axios.get('/news?publishState=2').then(res => {
            setViewList(Object.entries(_.groupBy(res.data, item => item.category)).filter(item=>item[0]!=='undefined'))
            // console.log(viewList)
        })
    },[])
    return (
        <div style={{
            width: "95%",
            margin: '0 auto'
        }}>
            <PageHeader
                className="site-page-header"
                title="全球大新闻"
                subTitle="查看新闻"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {viewList.map(item =>
                        <Col span={8} key={item[0]}>
                            <Card title={item[0]} bordered={true} hoverable>
                                <List
                                    size="small"
                                    pagination={{
                                        pageSize: 3
                                    }}
                                    bordered
                                    dataSource={item[1]}
                                    renderItem={data => <List.Item><a href={`#/detail/${data.id}`}>{data.title}</a></List.Item>}
                                />
                            </Card>
                        </Col>
                    )}
                </Row>
            </div>
        </div>
    )
}
