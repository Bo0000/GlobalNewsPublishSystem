import { Button } from 'antd'
import React from 'react'
import NewsPulish from '../../../components/publish-manage/NewsPulish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Unpublished() {
  const {dataSource,handleOption}=usePublish(1)
  return (
    <div>
      <NewsPulish dataSource={dataSource} button={(id)=><Button type='primary' onClick={()=> handleOption(id)}>发布</Button>} />
    </div>
  )
}