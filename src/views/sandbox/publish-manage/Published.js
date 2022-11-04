import { Button } from 'antd'
import React from 'react'
import NewsPulish from '../../../components/publish-manage/NewsPulish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Published() {
  const {dataSource,handleOption}=usePublish(2)
  return (
    <div>
      <NewsPulish dataSource={dataSource} button={(id)=><Button danger onClick={()=> handleOption(id)}>下线</Button>} />
    </div>
  )
}
