import { Button } from 'antd'
import React from 'react'
import NewsPulish from '../../../components/publish-manage/NewsPulish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Sunset() {
  const {dataSource,handleOption}=usePublish(3)
  return (
    <div>
      <NewsPulish dataSource={dataSource} button={(id)=><Button danger type='primary' onClick={()=> handleOption(id)}>删除</Button>} />
    </div>
  )
}