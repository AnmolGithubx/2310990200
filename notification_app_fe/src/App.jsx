import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'

import { fetchAll, fetchPriority, markViewed } from './api'
import PriorityInbox from './components/PriorityInbox'
import FilterBar from './components/FilterBar'
import NotificationCard from './components/NotificationCard'

export default function App(){
  const [notifications, setNotifications] = useState([])
  const [priority, setPriority] = useState([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(false)
  const [priorityLoading, setPriorityLoading] = useState(false)
  const [error, setError] = useState(null)

  async function loadAll(){
    setLoading(true); setError(null)
    try{
      const res = await fetchAll()
      if (res.error) throw new Error(res.error)
      setNotifications(res.notifications || [])
    }catch(e){ setError(e.message || 'error') }
    setLoading(false)
  }

  async function loadPriority(){
    setPriorityLoading(true)
    try{
      const res = await fetchPriority(10)
      setPriority(res.notifications || [])
    }catch(e){ /* ignore */ }
    setPriorityLoading(false)
  }

  useEffect(()=>{ loadAll(); loadPriority(); const t = setInterval(()=>{ loadAll(); loadPriority(); }, 30_000); return ()=>clearInterval(t); }, [])

  async function handleView(id){
    try{
      await markViewed(id)
      setNotifications(ns => ns.map(n => n.ID===id ? { ...n, viewed: true } : n))
      setPriority(ps => ps.filter(p => p.ID !== id))
    }catch(e){ console.error(e) }
  }

  const filtered = notifications.filter(n => filter==='All' ? true : n.Type === filter)

  return (
    <Box sx={{ minHeight: '100vh', background:'#fafcff' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Toolbar>
          <Typography variant="h6" color="primary">Campus Notifications</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py:3 }}>
        <Paper sx={{ p:2, mb:3, borderRadius:2, boxShadow:1 }}>
          <PriorityInbox items={priority} loading={priorityLoading} onView={handleView} />
          <Divider sx={{ my:2 }} />
          <FilterBar filter={filter} setFilter={setFilter} />
          {loading ? (
            <Box display="flex" justifyContent="center" sx={{ py:4 }}><CircularProgress /></Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : filtered.length===0 ? (
            <Typography color="text.secondary">No notifications</Typography>
          ) : (
            <List>
              {filtered.map(n=> (
                <ListItem key={n.ID} sx={{ py:0 }}>
                  <NotificationCard item={n} onView={handleView} />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  )
}
