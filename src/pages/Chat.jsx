import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiChevronLeft, FiMenu, FiPaperclip, FiSend, FiSmile } from 'react-icons/fi'
import io from 'socket.io-client'
import 'emoji-picker-element'
import logo from '../image/logo.png'
import './chat.css'
import './dashboard.css'

const API_BASE = import.meta.env.VITE_API_URL || 'https://beep-auctions-backend.onrender.com';

const placeholderConversations = [
  {
    id: '1',
    name: 'Ava Mitchell',
    avatar: '/assets/images/user-img-1.webp',
    online: true,
    unread: 2,
    lastMessage: 'Can we schedule the viewing tomorrow?'
  },
  {
    id: '2',
    name: 'Ethan Wilson',
    avatar: '/assets/images/user-img-2.webp',
    online: false,
    unread: 0,
    lastMessage: 'I uploaded the vehicle report.'
  },
  {
    id: '3',
    name: 'Sophia Carter',
    avatar: '/assets/images/user-img-3.webp',
    online: true,
    unread: 4,
    lastMessage: 'Great! Let me know the reserve price.'
  }
]

const placeholderMessages = {
  '1': [
    { id: 'm1', from: 'them', text: 'Hi there! Interested in the SUV you listed.', at: '10:12 AM' },
    { id: 'm2', from: 'me', text: 'Hi Ava! Absolutely. It’s in great condition.', at: '10:14 AM' },
    { id: 'm3', from: 'them', text: 'Can we schedule the viewing tomorrow?', at: '10:15 AM' }
  ],
  '2': [
    { id: 'm1', from: 'them', text: 'I uploaded the vehicle report.', at: 'Yesterday' },
    { id: 'm2', from: 'me', text: 'Awesome, thanks! I will review.', at: 'Yesterday' }
  ],
  '3': [
    { id: 'm1', from: 'them', text: 'Great! Let me know the reserve price.', at: '9:02 AM' }
  ]
}

const Chat = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [messagesById, setMessagesById] = useState({})
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const emojiHostRef = useRef(null)
  const scrollRef = useRef(null)
  const socketRef = useRef(null)
  const [currentUser, setCurrentUser] = useState(null)
  
  // Context from navigation state (can be car or part)
  const context = location.state
  const carContext = context && context.carId ? context : null
  const partContext = context && context.partId ? context : null

  const activeConvo = useMemo(() => conversations.find(c => c._id === activeId) || conversations[0], [conversations, activeId])
  const messages = useMemo(() => messagesById[activeId] || [], [messagesById, activeId])

  // Initialize user and Socket.IO
  useEffect(() => {
    initializeChat()
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  // Handle context - create/get conversation for car or part
  useEffect(() => {
    if ((carContext || partContext) && currentUser) {
      createOrGetConversation()
    }
  }, [carContext, partContext, currentUser])

  // Join active conversation room when activeId changes
  useEffect(() => {
    if (activeId && socketRef.current && socketRef.current.connected) {
      console.log('🔴 FRONTEND: Ensuring user is in conversation room:', activeId);
      socketRef.current.emit('join-conversation', { conversationId: activeId })
    }
  }, [activeId])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, activeId])

  const initializeChat = async () => {
    try {
      // Get current user info
      const userResponse = await fetch(`${API_BASE}/api/auth/me`, {
        credentials: 'include'
      })
      if (userResponse.ok) {
        const response = await userResponse.json()
        const user = response.user
        setCurrentUser(user)
        
        // Initialize Socket.IO
        console.log('🔴 FRONTEND: Connecting to Socket.IO server at:', API_BASE);
        socketRef.current = io(API_BASE, {
          withCredentials: true
        })
        
        socketRef.current.on('connect', () => {
          console.log('🔴 FRONTEND: Connected to Socket.IO server with ID:', socketRef.current.id);
          
          // Join user room
          socketRef.current.emit('join', {
            userId: user.id,
            userName: user.name
          })
          console.log('🔴 FRONTEND: Sent join event for user:', user.name, user.id);
          
          // If we have an active conversation, join that room too
          if (activeId) {
            console.log('🔴 FRONTEND: Rejoining active conversation room:', activeId);
            socketRef.current.emit('join-conversation', { conversationId: activeId })
          }
        });
        
        socketRef.current.on('disconnect', () => {
          console.log('🔴 FRONTEND: Disconnected from Socket.IO server');
        });
        
        // User join is handled in the 'connect' event handler above
        
        // Listen for new messages (real-time)
        socketRef.current.on('new-message', (messageData) => {
          console.log('📨 Real-time message received:', messageData.text);
          
          // Skip if this message is from the current user (to prevent duplicates)
          if (messageData.sender._id === user.id) {
            console.log('📨 Skipping own message to prevent duplicate');
            
            // Still update conversation metadata for own messages
            setConversations(prev => 
              prev.map(conv => {
                if (conv._id === messageData.conversationId) {
                  return {
                    ...conv, 
                    lastMessage: messageData, 
                    lastActivity: messageData.createdAt,
                    unreadCount: 0 // Always 0 for own messages
                  };
                }
                return conv;
              })
            );
            return;
          }
          
          // Only add messages from OTHER users
          setMessagesById(prev => {
            const currentMessages = prev[messageData.conversationId] || [];
            
            // Check if message already exists (prevent duplicates)
            const messageExists = currentMessages.some(m => m._id === messageData._id);
            if (messageExists) {
              console.log('📨 Message already exists, skipping duplicate');
              return prev;
            }
            
            console.log('📨 Adding new message from:', messageData.sender.name);
            return {
              ...prev,
              [messageData.conversationId]: [
                ...currentMessages,
                messageData
              ]
            };
          });
          
          // Update conversation last message and activity
          setConversations(prev => 
            prev.map(conv => {
              if (conv._id === messageData.conversationId) {
                const isCurrentConversation = activeId === messageData.conversationId;
                
                return {
                  ...conv, 
                  lastMessage: messageData, 
                  lastActivity: messageData.createdAt,
                  // Increment unread count only if not currently viewing this conversation
                  unreadCount: isCurrentConversation ? 0 : (conv.unreadCount || 0) + 1
                };
              }
              return conv;
            })
          );
        })
        
        // Listen for typing indicators
        socketRef.current.on('user-typing', ({ userId, isTyping }) => {
          // Handle typing indicators if needed
        })
        
        // Debug: Listen for room debug response
        socketRef.current.on('debug-rooms-response', ({ rooms }) => {
          console.log('🔴 FRONTEND: Socket is in rooms:', rooms);
        })
        
        // Add debug function to window for testing
        window.debugChatRooms = () => {
          if (socketRef.current) {
            socketRef.current.emit('debug-rooms');
          }
        }
        
        // Load conversations
        await loadConversations()
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error)
      // Redirect to login if not authenticated
      navigate('/signin')
    } finally {
      setLoading(false)
    }
  }

  const createOrGetConversation = async () => {
    try {
      let requestBody = {}
      
      if (carContext && carContext.carId && carContext.vendorId) {
        requestBody = {
          carId: carContext.carId,
          vendorId: carContext.vendorId
        }
      } else if (partContext && partContext.partId && partContext.vendorId) {
        requestBody = {
          partId: partContext.partId,
          vendorId: partContext.vendorId
        }
      } else {
        console.error('Missing context or required fields:', { carContext, partContext });
        return;
      }

      const response = await fetch(`${API_BASE}/api/chat/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      })
      
      if (response.ok) {
        const conversation = await response.json()
        setActiveId(conversation._id)
        
        // Join conversation room
        if (socketRef.current) {
          socketRef.current.emit('join-conversation', {
            conversationId: conversation._id
          })
        }
        
        // Load messages for this conversation
        await loadMessages(conversation._id)
        
        // Add to conversations if not already there
        setConversations(prev => {
          const exists = prev.find(c => c._id === conversation._id)
          return exists ? prev : [conversation, ...prev]
        })
      }
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  const loadConversations = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/chat/conversations`, {
        credentials: 'include'
      })
      if (response.ok) {
        const convos = await response.json()
        setConversations(convos)
        
        // Set first conversation as active if no context
        if (!carContext && !partContext && convos.length > 0) {
          const firstConvo = convos[0]
          setActiveId(firstConvo._id)
          
          // Join the conversation room for real-time updates
          if (socketRef.current) {
            console.log('🔴 FRONTEND: Auto-joining first conversation room:', firstConvo._id);
            socketRef.current.emit('join-conversation', { conversationId: firstConvo._id })
          }
          
          await loadMessages(firstConvo._id)
        }
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }

  const loadMessages = async (conversationId) => {
    try {
      const response = await fetch(`${API_BASE}/api/chat/conversations/${conversationId}/messages`, {
        credentials: 'include'
      })
      if (response.ok) {
        const msgs = await response.json()
        
        // Sort messages by creation date to ensure proper order
        const sortedMessages = msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        
        setMessagesById(prev => ({
          ...prev,
          [conversationId]: sortedMessages
        }))
        
        console.log(`Loaded ${sortedMessages.length} messages for conversation ${conversationId}`)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  useEffect(() => {
    const closeOnOutside = (e) => {
      if (!emojiOpen) return
      if (emojiHostRef.current && !emojiHostRef.current.contains(e.target)) {
        setEmojiOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOnOutside)
    // listen to emoji selection from web component
    const host = emojiHostRef.current
    const pickHandler = (ev) => {
      const detail = ev.detail
      if (detail && detail.unicode) {
        addEmoji(detail.unicode)
        setEmojiOpen(false)
      }
    }
    if (host) host.addEventListener('emoji-click', pickHandler)
    return () => document.removeEventListener('mousedown', closeOnOutside)
  }, [emojiOpen])

  const sendMessage = async () => {
    const text = messageText.trim()
    if (!text || !activeId || sending) return
    
    setSending(true)
    const originalText = messageText
    setMessageText('')
    
    console.log('📤 Sending message:', text);
    
    try {
      // Save to database via API
      const response = await fetch(`${API_BASE}/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: activeId,
          content: { text }
        })
      })
      
      if (response.ok) {
        const savedMessage = await response.json()
        console.log('📤 Message saved and sent successfully');
        
        // Add the message immediately to our local state
        setMessagesById(prev => ({
          ...prev,
          [activeId]: [...(prev[activeId] || []), savedMessage]
        }));
        
        // Update conversation with the new message
        setConversations(prev => 
          prev.map(conv => 
            conv._id === activeId 
              ? { ...conv, lastMessage: savedMessage, lastActivity: savedMessage.createdAt, unreadCount: 0 }
              : conv
          )
        );
        
        // Backend will now emit to Socket.IO for real-time delivery to other users
        
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      
      // Restore message text on error
      setMessageText(originalText);
      
      // Show error to user
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false)
    }
  }

  const handleAttach = () => {
    const input = document.createElement('input')
    input.type = 'file'
          input.accept = 'image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar,.webp,.bmp,.svg,.mp4,.mov,.avi'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return
      
      console.log('📎 File selected:', file.name, file.type, file.size);
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      await uploadAndSendFile(file);
    }
    input.click()
  }

  const uploadAndSendFile = async (file) => {
    if (!activeId || sending) return;
    
    setSending(true);
    
    try {
      console.log('📎 Uploading file:', file.name);
      
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload file to server
      const uploadResponse = await fetch(`${API_BASE}/api/chat/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }
      
      const uploadResult = await uploadResponse.json();
      console.log('📎 File uploaded successfully:', uploadResult);
      
      // Send message with file
      const messageResponse = await fetch(`${API_BASE}/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: activeId,
          content: {
            text: `📎 ${file.name}`,
            fileUrl: uploadResult.fileUrl,
            fileName: uploadResult.fileName,
            fileType: uploadResult.fileType
          }
        })
      });
      
      if (messageResponse.ok) {
        const savedMessage = await messageResponse.json();
        console.log('📎 File message saved successfully');
        
        // Add the file message to local state
        setMessagesById(prev => ({
          ...prev,
          [activeId]: [...(prev[activeId] || []), savedMessage]
        }));
        
        // Update conversation
        setConversations(prev => 
          prev.map(conv => 
            conv._id === activeId 
              ? { ...conv, lastMessage: savedMessage, lastActivity: savedMessage.createdAt, unreadCount: 0 }
              : conv
          )
        );
      } else {
        throw new Error('Failed to send file message');
      }
      
    } catch (error) {
      console.error('❌ File upload failed:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setSending(false);
    }
  }

  const addEmoji = (emoji = '😊') => setMessageText(m => m + ' ' + emoji)

  const pickConversation = async (id) => {
    setActiveId(id)
    setSidebarOpen(false)
    
    // Join conversation room for real-time updates
    if (socketRef.current) {
      // Leave previous conversation
      if (activeId) {
        console.log('🔴 FRONTEND: Leaving conversation:', activeId);
        socketRef.current.emit('leave-conversation', { conversationId: activeId })
      }
      // Join new conversation
      console.log('🔴 FRONTEND: Joining conversation:', id);
      socketRef.current.emit('join-conversation', { conversationId: id })
    }
    
    // Always reload messages to ensure we have the latest data
    // This handles page refresh scenarios and ensures message consistency
    await loadMessages(id)
    
    // Mark conversation as read (reset unread count)
    setConversations(prev => prev.map(c => c._id === id ? { ...c, unreadCount: 0 } : c))
  }

  const confirmSendFile = () => {
    const at = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const fileMsg = { id: `${Date.now()}`, from: 'me', at, fileUrl: previewUrl, fileName: previewName, fileType: previewType }
    setMessagesById(prev => ({ ...prev, [activeId]: [ ...(prev[activeId] || []), fileMsg ] }))
    setPreviewOpen(false)
  }

  const cancelPreview = () => {
    setPreviewOpen(false)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl('')
    setPreviewName('')
    setPreviewType('')
  }

  return (
    <div className="chat-page" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top website navbar */}
      <nav className="chat-navbar" style={{ flexShrink: 0 }}>
        <button className="nav-back" aria-label="Back" onClick={() => navigate('/dashboard') }>
          <FiChevronLeft />
          <span>Back</span>
        </button>
        <div className="nav-brand">
          <img src={logo} alt="Beep Auction" />
          <span>Beep Beep Auction</span>
        </div>
        <button className="nav-menu" aria-label="Toggle sidebar" onClick={() => setSidebarOpen(s => !s)}>
          <FiMenu />
        </button>
      </nav>

      <div className={`chat-root ${sidebarOpen ? 'sidebar-open' : ''}`} style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside className="chat-sidebar" style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="chat-search" style={{ flexShrink: 0, padding: '1rem', borderBottom: '1px solid #e0e0e0' }}>
            <input 
              placeholder="Search conversations…" 
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ddd', 
                borderRadius: '0.5rem',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div className="chat-convos" style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {loading ? (
              <div className="p-4 text-center">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-muted">
                No conversations yet. Click on a car to start chatting!
              </div>
            ) : (
              conversations.map(conv => {
                const otherUser = conv.participants?.find(p => p._id !== currentUser?.id)
                return (
                  <button key={conv._id} className={`convo-item ${activeId === conv._id ? 'active' : ''}`} onClick={() => pickConversation(conv._id)}>
                    <div className="convo-avatar">
                      <img src={otherUser?.avatarUrl || '/assets/images/user-img-1.webp'} alt={otherUser?.name} />
                      <span className="presence on"></span>
                    </div>
                    <div className="convo-main">
                      <div className="convo-top">
                        <span className="name">{otherUser?.name || 'Unknown User'}</span>
                        {conv.unreadCount > 0 && <span className="badge">{conv.unreadCount}</span>}
                      </div>
                      <span className="preview">
                        {conv.carListing?.name && `Re: ${conv.carListing.name} - `}
                        {conv.lastMessage?.text || 'No messages yet'}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </aside>

        {/* Chat area */}
        <main className="chat-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <header className="chat-header" style={{ flexShrink: 0 }}>
            {activeConvo && (
              <div className="peer">
                <div className="avatar">
                  <img 
                    src={activeConvo.participants?.find(p => p._id !== currentUser?.id)?.avatarUrl || '/assets/images/user-img-1.webp'} 
                    alt={activeConvo.participants?.find(p => p._id !== currentUser?.id)?.name} 
                  />
                  <span className="presence on"></span>
                </div>
                <div className="meta">
                  <h3>{activeConvo.participants?.find(p => p._id !== currentUser?.id)?.name || 'Chat'}</h3>
                  <span className="status">
                    {activeConvo.carListing?.name && `About: ${activeConvo.carListing.name}`}
                  </span>
                </div>
              </div>
            )}
          </header>

          <section className="chat-messages" ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            {(carContext || partContext) && (
              <div className="context-banner bg-light p-3 mb-3 rounded">
                <div className="d-flex align-items-center gap-3">
                  {(carContext?.carImage || partContext?.partImage) && (
                    <img 
                      src={carContext?.carImage || partContext?.partImage} 
                      alt={carContext?.carName || partContext?.partName} 
                      style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px'}} 
                    />
                  )}
                  <div>
                    <h6 className="mb-1 text-dark">
                      {carContext ? `🚗 ${carContext.carName}` : `🔧 ${partContext?.partName}`}
                    </h6>
                    <p className="mb-0 text-muted">
                      ${new Intl.NumberFormat().format(carContext?.carPrice || partContext?.partPrice)}
                    </p>
                    {partContext && (
                      <small className="text-muted">Spare Part Inquiry</small>
                    )}
                  </div>
                </div>
              </div>
            )}

            {messages.map(m => {
              const isMe = m.sender?._id === currentUser?.id
              const time = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              
              return (
                <div key={m._id} className={`bubble-row ${isMe ? 'right' : 'left'}`}>
                  {m.fileUrl ? (
                    <div className="bubble file animate-in">
                      {m.fileType && m.fileType.startsWith('image/') ? (
                        <div className="file-preview">
                          <img src={`${API_BASE}${m.fileUrl}`} alt={m.fileName} />
                        </div>
                      ) : (
                        <div className="file-generic">📎</div>
                      )}
                      <a className="file-name" href={`${API_BASE}${m.fileUrl}`} target="_blank" rel="noreferrer">
                        {m.fileName || 'Attachment'}
                      </a>
                      <span className="time">{time}</span>
                    </div>
                  ) : (
                    <div className="bubble animate-in">
                      <p>{m.text}</p>
                      <span className="time">{time}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </section>

          <footer className="chat-input" style={{ flexShrink: 0, borderTop: '1px solid #e0e0e0', padding: '1rem' }}>
            <div className="emoji-host" ref={emojiHostRef}>
              <button className="icon" aria-label="Emoji" onMouseDown={(e)=>{ e.preventDefault(); setEmojiOpen(v=>!v) }}><FiSmile /></button>
              {emojiOpen && (
                <div className="emoji-popover no-grid">
                  <emoji-picker class="emoji-wc" theme="dark"></emoji-picker>
                </div>
              )}
            </div>
            <button className="icon" aria-label="Attach" onClick={handleAttach}><FiPaperclip /></button>
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message…"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
            />
            <button 
              className="send" 
              aria-label="Send" 
              onClick={sendMessage}
              disabled={sending || !messageText.trim()}
            >
              {sending ? '...' : <FiSend />}
            </button>
          </footer>
        </main>
      </div>

      {/* No preview modal: files are sent immediately */}
    </div>
  )
}

export default Chat


