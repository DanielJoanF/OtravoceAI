import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Brain, Info, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useChat, Message } from '../context/ChatContext';
import ReactMarkdown from 'react-markdown';

const Chat: React.FC = () => {
  // Mengambil semua fungsi dan state dari ChatContext termasuk TTS
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    clearChat,
    isTTSActive,
    toggleTTS,
    stopSpeaking
  } = useChat();
  
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // State untuk mengontrol autoscroll - hanya scroll jika user berada di bagian bawah
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Suggested prompts for users to start with
  const suggestedPrompts = [
    "Aku merasa gelisah dengan study ku",
    "Aku sedang bertengkar dengan teman ku",
    "Aku memiliki masalah dengan tidur malam ku",
    "Aku merasa kewalahan dengan setiap pekerjaan ku",
    "Aku khawatir dengan masa depan ku",
    "Aku merasa kesepian dan terisolasi"
  ];

  // Fungsi untuk mengecek apakah user berada di bagian bawah chat
  const isUserAtBottom = () => {
    if (!messagesContainerRef.current) return true;
    
    const container = messagesContainerRef.current;
    const threshold = 100; // 100px dari bawah dianggap masih di bawah
    
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold
    );
  };

  // Handle scroll event untuk mendeteksi apakah user scroll ke atas
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const isAtBottom = isUserAtBottom();
    setUserScrolledUp(!isAtBottom);
    setShouldAutoScroll(isAtBottom);
  };

  // Auto-scroll ke bawah hanya jika diperlukan
  const scrollToBottom = (force = false) => {
    if (!messagesEndRef.current) return;
    
    // Scroll paksa (misalnya saat user mengirim pesan) atau jika user masih di bawah
    if (force || shouldAutoScroll) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
      setUserScrolledUp(false);
      setShouldAutoScroll(true);
    }
  };

  // Auto-scroll hanya untuk pesan baru, bukan untuk semua perubahan messages
  useEffect(() => {
    if (messages.length === 0) return;
    
    const lastMessage = messages[messages.length - 1];
    const isNewMessage = lastMessage && Date.now() - lastMessage.timestamp.getTime() < 1000; // Pesan dalam 1 detik terakhir
    
    if (isNewMessage) {
      // Jika user yang mengirim pesan, selalu scroll ke bawah
      if (lastMessage.sender === 'user') {
        scrollToBottom(true);
      } 
      // Jika AI yang mengirim pesan, hanya scroll jika user masih di bawah
      else if (lastMessage.sender === 'ai' && shouldAutoScroll) {
        scrollToBottom(false);
      }
    }
  }, [messages, shouldAutoScroll]);

  // Auto-focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Cleanup: Stop TTS when component unmounts - Bersihkan TTS saat komponen di-unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
      setShowSuggestions(false);
      // Paksa scroll ke bawah saat user mengirim pesan
      setTimeout(() => scrollToBottom(true), 100);
    }
  };

  // Handle textarea height adjustment
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  // Handle selecting a suggested prompt
  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    if (inputRef.current) {
      inputRef.current.focus();
      // Trigger resize
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  };

  // Format timestamp for messages
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle TTS toggle with user feedback - Menangani toggle TTS dengan feedback ke user
  const handleTTSToggle = () => {
    toggleTTS();
    
    // Berikan feedback audio singkat saat TTS diaktifkan
    if (!isTTSActive && 'speechSynthesis' in window) {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance('Suara diaktifkan');
        utterance.lang = 'id-ID';
        utterance.rate = 1;
        utterance.volume = 0.5;
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  // Handle clear chat - reset scroll state
  const handleClearChat = () => {
    clearChat();
    setShouldAutoScroll(true);
    setUserScrolledUp(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
      <div className="container-custom h-full py-4 flex flex-col">
        {/* Chat header */}
        <div className="bg-white dark:bg-gray-800 rounded-t-xl p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-primary-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Otravoce AI</h2>
          </div>
          <div className="flex items-center space-x-2">
            {/* TTS Toggle Button - Tombol untuk mengaktifkan/menonaktifkan TTS */}
            <button
              onClick={handleTTSToggle}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isTTSActive
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={isTTSActive ? 'Nonaktifkan suara' : 'Aktifkan suara'}
              aria-label={isTTSActive ? 'Nonaktifkan Text-to-Speech' : 'Aktifkan Text-to-Speech'}
            >
              {isTTSActive ? (
                <>
                  <Volume2 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">TTS Aktif</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">TTS Nonaktif</span>
                </>
              )}
            </button>

            <Link to="/resources" className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Info className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Crisis Resources</span>
            </Link>
            
            <button 
              onClick={handleClearChat}
              className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Chat messages area */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center p-4">
              <Brain className="h-16 w-16 text-primary-500/50 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to Otravoce AI
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                Aku siap mendengarkan dan menemanimu melewati apa pun yang sedang kamu rasakan. 
                Percakapan ini bersifat rahasia dan tanpa penghakiman.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                Yuk, mulai percakapan dengan mengetik pesan atau memilih saran di bawah.
              </p>
              
              {/* TTS Info untuk user baru - Informasi TTS untuk pengguna baru */}
              {isTTSActive && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 max-w-md">
                  <div className="flex items-center text-blue-700 dark:text-blue-300">
                    <Volume2 className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Suara Aktif</span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Respons AI akan dibacakan dengan suara. Anda bisa menonaktifkannya kapan saja.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message: Message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-primary-500 text-white chat-bubble-out'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white chat-bubble-in'
                    }`}
                  >
                    {message.sender === 'ai' ? (
                      <ReactMarkdown className="prose dark:prose-invert prose-sm max-w-none">
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p>{message.content}</p>
                    )}
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === 'user'
                          ? 'text-white/70 text-right'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-5 py-3 flex items-center space-x-2 text-gray-500 dark:text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse delay-300"></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Scroll to bottom button - tampil jika user scroll ke atas */}
        {userScrolledUp && (
          <div className="absolute bottom-32 right-8 z-10">
            <button
              onClick={() => scrollToBottom(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 flex items-center space-x-2"
              title="Scroll ke bawah"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
              <span className="text-xs hidden sm:inline">Pesan Baru</span>
            </button>
          </div>
        )}
        
        {/* Suggested prompts */}
        <AnimatePresence>
          {showSuggestions && messages.length === 0 && (
            <motion.div 
              className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Saran untuk membuka percakapan:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full px-4 py-2 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Input area */}
        <div className="bg-white dark:bg-gray-800 rounded-b-xl p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="flex-grow relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 pr-12 min-h-[50px] max-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                disabled={isLoading}
                rows={1}
              />
              <button
                  type="submit"
                  className={`absolute right-4 bottom-1 transform -translate-y-1/2 text-white p-1.5 rounded-full ${
                    isLoading || !input.trim()
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600'
                  }`}
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message">
                  <Send className="h-4 w-4" />
                </button>
            </div>
          </form>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            <span>
              This is not a crisis service. If you need immediate help, please visit our{' '}
              <Link to="/resources" className="text-primary-500 hover:underline">
                crisis resources
              </Link>
              .
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;