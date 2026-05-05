import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import NotificationCard from './NotificationCard'

export default function PriorityInbox({ items = [], onView, loading }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Priority Inbox</Typography>
      {loading ? (
        Array.from({length:3}).map((_,i)=>(<div key={i} style={{marginBottom:8}}><div style={{height:72,background:'#f0f0f0',borderRadius:8}}/></div>))
      ) : items.length ? (
        items.map(it => <NotificationCard key={it.ID} item={it} onView={onView} />)
      ) : (
        <Typography color="text.secondary">No priority notifications</Typography>
      )}
    </Box>
  )
}
