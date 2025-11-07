import MessageContainer from '@/components/home/MessageContainer'
import Sidebar from '@/components/home/Sidebar'
import Textarea from '@/components/home/Textarea'
import React from 'react'

const page = () => {
  return (
    <div>
      <Sidebar />
      <Textarea />
      <MessageContainer />
    </div>
  )
}

export default page
