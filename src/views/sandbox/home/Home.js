import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, Row, Avatar, List, Drawer } from 'antd'
import {  PieChartOutlined, UserOutlined } from '@ant-design/icons'
import * as Echarts from 'echarts'
import _ from 'lodash'
import axios from 'axios'

const { Meta } = Card
export default function Home() {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [allList, setAllList] = useState([])
  const [pieChart, setPieChart] = useState(null)
  const [open, setOpen] = useState(false);
  const barRef = useRef()
  const pieRef = useRef()
  useEffect(() => {
    axios.get(`/news?publishState=2&_sort=view&_order=desc&_limit=6`).then(res => {
      setViewList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/news?publishState=2&_sort=star&_order=desc&_limit=6`).then(res => {
      setStarList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/news?publishState=2`).then(res => {
      setAllList(res.data)
      renderBar(_.groupBy(res.data, item => item.category))
    })
    return () => {
      window.onresize = null
    }
  }, [])

  const renderBar = (data) => {
    console.log(data)
    var myChart = Echarts.init(barRef.current);
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(data)
      },
      yAxis: { minInterval: 1 },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(data).map(item => item.length)
        }
      ]
    };
    myChart.setOption(option);
    window.onresize = () => {
      myChart.resize()
    }
  }
  const { username,region,role:{roleName} } = JSON.parse(localStorage.getItem("token"))
  const renderPie = () => {
    var myChart;
    if (!pieChart) {
      myChart = Echarts.init(pieRef.current)
      setPieChart(myChart)
    } else {
      myChart = pieChart
    }
    var option;
    const currentList = allList.filter(item => item.author === username)
    const gruopObj = _.groupBy(currentList, item => item.category)
    let list = []

    for (var i in gruopObj) {
      list.push(
        {
          name: i,
          value: gruopObj[i].length
        }
      )
    }

    option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      // legend: {
      //   orient: 'vertical',
      //   left: 'left'
      // },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }
  return (
    <div>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card
              title="用户最常浏览"
              bordered={true}

            >
              <List
                size="small"
                // bordered
                dataSource={viewList}
                renderItem={item => <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="用户点赞最多"
              bordered={true}

            >
              <List
                size="small"
                // bordered
                dataSource={starList}
                renderItem={item => <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card

              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <PieChartOutlined key="setting" onClick={() => {
                  setOpen(true)
                  setTimeout(() => {
                    renderPie()
                  }, 0)

                }} />,
                // <EditOutlined key="edit" />,
                // <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={username}
                description={
                 <div>
                    <b style={{marginRight:"10px"}}>{region===''?'全球':region}</b>
                    <span>{roleName}</span>
                 </div>
                }
              />
            </Card>
          </Col>
        </Row>
      </div>
      <div ref={barRef} style={{ width: "100%", height: "400px", marginTop: "30px" }}></div>
      <Drawer width={"500px"} title="个人新闻分类" placement="right" onClose={() => setOpen(false)} open={open}>
        <div ref={pieRef} style={{ width: "100%", height: "400px", marginTop: "30px" }}></div>
      </Drawer>
    </div>
  )
}
