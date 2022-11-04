import { Result } from 'antd'
import React from 'react'

export default function Nopermission() {
  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle="对不起，您所访问的页面不存在."
      />
    </div>
  )
}
