import { useEffect, useState } from 'react'

const WS_BASE_URL = import.meta.env.VITE_API_URL?.replace(/^http/, 'ws') ?? 'ws://localhost:8000'

export function useRealtime() {
  const [lastEvent, setLastEvent] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    let socket: WebSocket | null = null
    let reconnectTimeout: any = null

    function connect() {
      socket = new WebSocket(`${WS_BASE_URL}/api/v1/ws`)

      socket.onopen = () => {
        console.log('WS: Connected to Nebra Realtime Hub')
        setIsConnected(true)
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastEvent(data)
        } catch (err) {
          console.error('WS: Error parsing message', err)
        }
      }

      socket.onclose = () => {
        console.log('WS: Disconnected. Reconnecting...')
        setIsConnected(false)
        reconnectTimeout = setTimeout(connect, 3000)
      }

      socket.onerror = (err) => {
        console.error('WS: Socket error', err)
        socket?.close()
      }
    }

    connect()

    return () => {
      socket?.close()
      clearTimeout(reconnectTimeout)
    }
  }, [])

  return { lastEvent, isConnected }
}
