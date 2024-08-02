import { Card } from 'flowbite-react'
import React from 'react'
import UserAnalytics from './UserAnalytics'
import SubscriptionAnalytics from './SubscriptionAnalytics'
import EngagementAnalytics from './EngagementAnalytics'

function VisualAnalytics() {
  return (
    <div className="p-6 w-full min-h-screen">
      <div className="grid grid-rows-2">
      <div className='w-["80%"] h-[600px]'>
      <UserAnalytics/>
      </div>
      <div>
      <SubscriptionAnalytics/>
      </div>
        <div>
          <EngagementAnalytics/>
          </div>
       
        
        {/* Add more chart components as needed */}
      </div>
    </div>
  )
}

export default VisualAnalytics