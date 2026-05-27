import { useState, useEffect, useRef } from 'react';
import { messagesAPI, usersAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare, Search } from 'lucide-react';

const avatarColors = ['bg-luna-100/50 dark:bg-luna-400/200', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];
const getAvatarColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];
const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    Promise.all([
      messagesAPI.getConversations(),
      usersAPI.getAll()
    ]).then(([convRes, usersRes]) => {
      setConversations(convRes.data.conversations || []);
      setAllUsers(usersRes.data.users || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      messagesAPI.getMessages(selectedUser._id)
        .then(res => setMessages(res.data.messages || []))
        .catch(console.error);
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    setSending(true);
    try {
      const res = await messagesAPI.send({ receiverId: selectedUser._id, content: newMessage });
      setMessages([...messages, res.data.message]);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = allUsers.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.university?.toLowerCase().includes(search.toLowerCase())
  );

  const conversationPartnerIds = new Set(conversations.map(c => c.partner._id));
  const newChatUsers = filteredUsers.filter(u => !conversationPartnerIds.has(u._id));

  return (
    <div className="max-w-5xl mx-auto fade-in">
      <h1 className="text-2xl font-bold text-luna-400 dark:text-luna-100 mb-6 flex items-center gap-2">
        <MessageSquare size={22} className="text-blue-500" /> Messages
      </h1>

      <div className="glass rounded-2xl card-glow-blue card-glow-blue overflow-hidden" style={{ height: '600px' }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-72 border-r border-gray-100 flex flex-col">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-luna-300/50 dark:text-luna-100/30" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-8 pr-3 py-2 border border-luna-200/30 dark:border-luna-100/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Existing conversations */}
              {conversations.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-luna-300/50 dark:text-luna-100/30 px-4 py-2 uppercase tracking-wide">Recent</p>
                  {conversations.map((conv, i) => (
                    <ConvItem key={i} partner={conv.partner} lastMessage={conv.lastMessage}
                      unreadCount={conv.unreadCount} isSelected={selectedUser?._id === conv.partner._id}
                      onClick={() => setSelectedUser(conv.partner)} />
                  ))}
                </div>
              )}

              {/* All users to start new chat */}
              {(search || conversations.length === 0) && newChatUsers.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-luna-300/50 dark:text-luna-100/30 px-4 py-2 uppercase tracking-wide">
                    {search ? 'Users' : 'Start a conversation'}
                  </p>
                  {newChatUsers.slice(0, 10).map((u, i) => (
                    <ConvItem key={i} partner={u} isSelected={selectedUser?._id === u._id}
                      onClick={() => setSelectedUser(u)} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          {selectedUser ? (
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className={`w-9 h-9 ${getAvatarColor(selectedUser.name)} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                  {getInitials(selectedUser.name)}
                </div>
                <div>
                  <p className="font-semibold text-luna-400 dark:text-luna-100 text-sm">{selectedUser.name}</p>
                  <p className="text-xs text-luna-300/50 dark:text-luna-100/30">{selectedUser.university} · {selectedUser.major}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-luna-300/50 dark:text-luna-100/30 py-8">
                    <MessageSquare size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Start a conversation with {selectedUser.name}</p>
                  </div>
                ) : messages.map((msg, i) => {
                  const isMe = msg.sender._id === user._id || msg.sender === user._id;
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                        isMe ? 'btn-primary text-white rounded-br-sm' : 'bg-luna-100/50 dark:bg-luna-400/20 text-luna-400 dark:text-luna-100/80 rounded-bl-sm'
                      }`}>
                        {msg.content}
                        <div className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-luna-300/50 dark:text-luna-100/30'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 border border-luna-200/30 dark:border-luna-100/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="btn-primary text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-luna-300/50 dark:text-luna-100/30">
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConvItem({ partner, lastMessage, unreadCount, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/50 dark:bg-white/5 transition-colors text-left ${isSelected ? 'bg-luna-100/50 dark:bg-luna-400/20' : ''}`}
    >
      <div className={`w-9 h-9 ${getAvatarColor(partner.name)} rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
        {getInitials(partner.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-luna-400 dark:text-luna-100/80 truncate">{partner.name}</p>
          {unreadCount > 0 && (
            <span className="bg-luna-100/50 dark:bg-luna-400/200 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
              {unreadCount}
            </span>
          )}
        </div>
        {lastMessage && (
          <p className="text-xs text-luna-300/50 dark:text-luna-100/30 truncate">{lastMessage.content}</p>
        )}
      </div>
    </button>
  );
}
