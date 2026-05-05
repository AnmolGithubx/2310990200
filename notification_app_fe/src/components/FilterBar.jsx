import React from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Box from '@mui/material/Box'

export default function FilterBar({ filter, setFilter }) {
  return (
    <Box sx={{ mb: 2 }}>
      <ButtonGroup variant="outlined">
        {['All','Placement','Result','Event'].map(f=> (
          <Button key={f} variant={filter===f? 'contained' : 'outlined'} onClick={()=>setFilter(f)}>{f}</Button>
        ))}
      </ButtonGroup>
    </Box>
  )
}
