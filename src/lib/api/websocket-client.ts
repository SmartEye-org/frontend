import { io, Socket } from 'socket.io-client'
import { WS_URL } from '../constants'
import type { Detection, Violation, Statistics } from '@/types'

export type WebSocketEvent = 
  | 'detection'
  | 'violation'
  | 'camera_status'
  | 'stats_update'

export interface WebSocketEventData {
  detection: Detection
  violation: Violation
  camera_status: {
    camera_id: string
    status: 'online' | 'offline' | 'error'
    timestamp: string
  }
  stats_update: Statistics
}

export type WebSocketCallback<T extends WebSocketEvent> = (
  data: WebSocketEventData[T]
) => void

type AnyWebSocketCallback = 
  | WebSocketCallback<'detection'>
  | WebSocketCallback<'violation'>
  | WebSocketCallback<'camera_status'>
  | WebSocketCallback<'stats_update'>

/**
 * WebSocket Client for real-time updates
 * Singleton pattern
 */
class WebSocketClient {
  private socket: Socket | null = null
  private handlers: Map<WebSocketEvent, Set<AnyWebSocketCallback>> = new Map()

  connect(): void {
    if (this.socket?.connected) {
      console.log('WebSocket already connected')
      return
    }

    console.log('Connecting to WebSocket...', WS_URL)

    this.socket = io(WS_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket?.id)
    })

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
    })

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('WebSocket reconnected after', attemptNumber, 'attempts')
    })

    this.setupEventHandlers()
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.handlers.clear()
      console.log('WebSocket disconnected')
    }
  }

  /**
   * Subscribe to event with type safety
   */
  on<T extends WebSocketEvent>(
    event: T,
    callback: WebSocketCallback<T>
  ): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    
    const handlers = this.handlers.get(event)!
    handlers.add(callback as AnyWebSocketCallback)
    console.log(`Subscribed to ${event}`)
  }

  /**
   * Unsubscribe from event
   */
  off<T extends WebSocketEvent>(
    event: T,
    callback: WebSocketCallback<T>
  ): void {
    const handlers = this.handlers.get(event)
    if (handlers) {
      handlers.delete(callback as AnyWebSocketCallback)
      console.log(`Unsubscribed from ${event}`)
    }
  }

  emit<T = unknown>(event: string, data?: T): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
      console.log(`Emitted ${event}`, data)
    } else {
      console.warn('Cannot emit, socket not connected')
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  private setupEventHandlers(): void {
    if (!this.socket) return

    this.socket.on('detection', (data: Detection) => {
      console.log('Received detection:', data)
      this.notifyHandlers('detection', data)
    })

    this.socket.on('violation', (data: Violation) => {
      console.log('Received violation:', data)
      this.notifyHandlers('violation', data)
    })

    this.socket.on('camera_status', (data: WebSocketEventData['camera_status']) => {
      console.log('Camera status update:', data)
      this.notifyHandlers('camera_status', data)
    })

    this.socket.on('stats_update', (data: Statistics) => {
      console.log('Stats update:', data)
      this.notifyHandlers('stats_update', data)
    })
  }

  private notifyHandlers<T extends WebSocketEvent>(
    event: T,
    data: WebSocketEventData[T]
  ): void {
    const handlers = this.handlers.get(event)
    if (handlers) {
      handlers.forEach((callback) => {
        (callback as WebSocketCallback<T>)(data)
      })
    }
  }
}

export const wsClient = new WebSocketClient()
