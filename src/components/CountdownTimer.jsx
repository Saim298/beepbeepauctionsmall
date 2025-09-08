import React, { useEffect, useState } from 'react'

const CountdownTimer = ({ target }) => {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const delta = Math.max(0, target - now)
  const hours = Math.floor(delta / 3600000)
  const minutes = Math.floor((delta % 3600000) / 60000)
  const seconds = Math.floor((delta % 60000) / 1000)
  const out = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  return <>{out}</>
}

export default CountdownTimer


