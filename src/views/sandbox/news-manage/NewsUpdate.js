import { Button, PageHeader, Steps, Form, Select, Input, message, notification } from 'antd'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import NewsEditor from '../../../components/news-manage/NewsEditor'

const { Step } = Steps
const { Option } = Select
export default function NewsUpdate(props) {
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])
    const [formInfo, setFormInfo] = useState({})
    const [content, setContent] = useState("")
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
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}`).then(res => {
            const { title, category, content } = res.data
            NewsForm.current.setFieldsValue({
                title,
                category
            })
            setContent(content)
        }
        )
    }, [props.match.params.id])
    // const User = JSON.parse(localStorage.getItem("token"))
    const handleSave = (value) => {
        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": value,
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    "更新成功，已保存" ,
                placement: "bottomRight"
            });
            props.history.goBack()
            console.log(props)
        })
    }
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                subTitle=""
                onBack={() => props.history.goBack()}
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
                        content={content} />
                </div>

                <div style={{ display: current === 2 ? "block" : "none" }}></div>
            </div>
            <div style={{ marginTop: "50px", display: "flex", justifyContent: "right" }}>
                {
                    current > 0 && <Button type='primary' onClick={() => handlePrevious()} style={{ marginRight: "5px" }}>上一步</Button>
                }
                {
                    current < 2 && <Button type='primary' onClick={() => handleNext()} style={{ marginRight: "5px" }}>下一步</Button>
                }
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => handleSave(0)} style={{ marginRight: "5px" }}>保存</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
            </div>
        </div>
    )
}
