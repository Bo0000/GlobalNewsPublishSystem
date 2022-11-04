import { Button, PageHeader, Steps, Form, Select, Input, message, notification } from 'antd'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import NewsEditor from '../../../components/news-manage/NewsEditor'

const { Step } = Steps
const { Option } = Select
export default function NewsAdd(props) {
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState("")
  // const [clearContent, setClearContent] = useState(false)
  const NewsForm = useRef()
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current.validateFields().then(res => {
        console.log(res)
        setFormInfo(res)
        setCurrent(current + 1)
      }).catch(err =>
        console.log(err)
      )
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error("请输入新闻内容")
      } else {
        setCurrent(current + 1)
      }
    }

  }

  const handlePrevious = () => {
    setCurrent(current - 1)
  }
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 8,
    },
  };
  useEffect(() => {
    axios.get("/categories").then(res =>
      setCategoryList(res.data)
    )
  }, [])
  const User = JSON.parse(localStorage.getItem("token"))
  const handleSave = (value) => {
    axios.post("/news", {
      ...formInfo,
      "content": content,
      "region": User.region === "" ? "全球" : User.region,
      "author": User.username,
      "roleId": User.roleId,
      "auditState": value,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      // "publishTime": 1615778496314
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          value === 0 ? "您的新闻已保存到草稿箱" : "提交成功，请等待审核",
        placement: "bottomRight"
      });
      props.history.push("/home")
    })
  }
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle=""
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      <div style={{ marginTop: "50px" }}>
        <div style={{ display: current === 0 ? "block" : "none" }}>
          <Form {...layout} name="control-hooks" ref={NewsForm}>
            <Form.Item
              name="title"
              label="新闻标题"
              rules={[
                {
                  required: true,
                  message: "请输入您的新闻标题！"
                },
              ]}
            >
              <Input placeholder="请输入您的新闻标题" />
            </Form.Item>
            <Form.Item
              name="category"
              label="新闻类型"
              rules={[
                {
                  required: true,
                  message: "请选择您的新闻类型！"
                },
              ]}
            >
              <Select
                placeholder="请选择您的新闻类型"
              >
                {categoryList.map(item =>
                  <Option value={item.title} key={item.id}>{item.title}</Option>
                )}
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div style={{ display: current === 1 ? "block" : "none" }}>
          <NewsEditor getContent={(value) => {
            setContent(value)
          }} 
          // clearContent={clearContent}
          />
        </div>

        <div style={{ display: current === 2 ? "block" : "none" }}></div>
      </div>
      <div style={{ marginTop: "50px", display: "flex", justifyContent: "right" }}>
        {
          current > 0 && <Button type='primary' onClick={() => handlePrevious()}>上一步</Button>
        }
        {
          current < 2 && <Button type='primary' onClick={() => handleNext()}>下一步</Button>
        }
        {
          current === 2 && <span>
            <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
            <Button danger onClick={() => handleSave(1)}>提交审核</Button>
          </span>
        }
      </div>
    </div>
  )
}
