import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

export default function NotificationCard({ item, onView }) {
  const isNew = !item.viewed;
  return (
    <Card sx={{ mb: 1, borderRadius: 2, boxShadow: 1 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle2" color="primary">{item.Type}</Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>{item.Message}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>{item.Timestamp}</Typography>
          </Box>
          <Box textAlign="right">
            <Chip label={isNew ? 'NEW' : 'VIEWED'} color={isNew ? 'primary' : 'default'} size="small" sx={{ mb: 1 }} />
            {isNew && <Button size="small" onClick={() => onView(item.ID)}>Mark viewed</Button>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
