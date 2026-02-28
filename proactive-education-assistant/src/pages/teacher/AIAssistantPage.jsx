import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, Bot, User, Database, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import apiService from '../../services/apiService';

// Add scrollbar hide styles
const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default function AIAssistantPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Inject styles
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  
  const [isDatabaseMode, setIsDatabaseMode] = useState(searchParams.get('mode') === 'database');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: isDatabaseMode 
        ? "Hello! I'm your Database Assistant. Ask me about student data, attendance, reports, and more!"
        : "Hello! I'm your Proactive Education Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Knowledge base for general chat mode
  const knowledgeBase = {
    greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    about: ['what is this', 'what is proactive education', 'about', 'what does this do'],
    features: ['features', 'what can you do', 'capabilities', 'functionality'],
    pricing: ['pricing', 'cost', 'price', 'how much', 'subscription'],
    support: ['help', 'support', 'contact', 'assistance']
  };

  const responses = {
    greetings: [
      "Hello! Welcome to Proactive Education Assistant. How can I help you today?",
      "Hi there! I'm here to assist you with anything related to our education platform."
    ],
    about: [
      "Proactive Education Assistant is a comprehensive platform designed to help educational institutions manage students, teachers, and administrative tasks efficiently."
    ],
    features: [
      "Our platform includes: Student Management, Teacher Dashboard, Analytics & Reporting, Class Management, Data Import/Export, and much more."
    ],
    pricing: [
      "We offer a premium plan at ₹499/month with a 50% discount from the regular ₹999. This includes all features and priority support."
    ],
    support: [
      "You can reach our support team through the contact section or email us at support@proactiveeducation.com. We're here to help 24/7!"
    ],
    default: [
      "I'm not sure about that specific question. Could you please rephrase it or ask about our features, pricing, or support?"
    ]
  };

  const getResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (knowledgeBase.greetings.some(word => message.includes(word))) {
      return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
    }
    if (knowledgeBase.about.some(word => message.includes(word))) {
      return responses.about[0];
    }
    if (knowledgeBase.features.some(word => message.includes(word))) {
      return responses.features[0];
    }
    if (knowledgeBase.pricing.some(word => message.includes(word))) {
      return responses.pricing[0];
    }
    if (knowledgeBase.support.some(word => message.includes(word))) {
      return responses.support[0];
    }
    
    return responses.default[0];
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    if (isDatabaseMode) {
      // Database mode - use AI Assistant API
      try {
        const requestBody = {
          query: currentInput
        };
        
        if (pendingConfirmation) {
          requestBody.confirmAction = pendingConfirmation.confirmAction;
          requestBody.confirmData = pendingConfirmation.confirmData;
        }
        
        const result = await apiService.queryAIAssistant(
          requestBody.query,
          requestBody.confirmAction,
          requestBody.confirmData
        );

        setIsTyping(false);
        
        if (result?.success) {
          const botResponse = {
            id: messages.length + 2,
            text: result.response,
            sender: 'bot',
            timestamp: new Date(),
            isAI: true,
            needsConfirmation: result.needsConfirmation,
            confirmAction: result.confirmAction,
            confirmData: result.confirmData
          };
          
          setMessages(prev => [...prev, botResponse]);
          
          if (result.needsConfirmation) {
            setPendingConfirmation({
              confirmAction: result.confirmAction,
              confirmData: result.confirmData
            });
          } else {
            setPendingConfirmation(null);
          }
        } else {
          const errorResponse = {
            id: messages.length + 2,
            text: result?.error || 'Failed to process your query. Please try again.',
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorResponse]);
        }
      } catch (error) {
        setIsTyping(false);
        const errorResponse = {
          id: messages.length + 2,
          text: 'Unable to connect to AI Assistant. Please try again later.',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    } else {
      // General chat mode - use Gemini AI with system knowledge
      try {
        const result = await apiService.queryGeneralAssistant(currentInput);
        
        setIsTyping(false);
        
        if (result?.success) {
          const botResponse = {
            id: messages.length + 2,
            text: result.response,
            sender: 'bot',
            timestamp: new Date(),
            isAI: true
          };
          setMessages(prev => [...prev, botResponse]);
        } else {
          const errorResponse = {
            id: messages.length + 2,
            text: result?.error || 'Failed to process your query. Please try again.',
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorResponse]);
        }
      } catch (error) {
        setIsTyping(false);
        // Fallback to basic responses if API fails
        const botResponse = {
          id: messages.length + 2,
          text: getResponse(currentInput),
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMode = () => {
    setIsDatabaseMode(!isDatabaseMode);
    setPendingConfirmation(null);
    
    const modeMessage = {
      id: messages.length + 1,
      text: !isDatabaseMode 
        ? "🔄 Switched to Database Mode. You can now ask about student data, attendance, reports, and more!" 
        : "🔄 Switched to General Chat Mode. Ask me about features, pricing, and support!",
      sender: 'bot',
      timestamp: new Date(),
      isSystem: true
    };
    setMessages(prev => [...prev, modeMessage]);
  };

  // Helper function to render formatted AI messages
  const renderFormattedMessage = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let tableRows = [];
    let inTable = false;
    
    lines.forEach((line, idx) => {
      // Detect table rows
      if (line.includes('|') && line.trim().startsWith('|')) {
        const cells = line.split('|').filter(cell => cell.trim() !== '');
        const isHeaderSeparator = cells.every(cell => cell.trim().match(/^[-:]+$/));
        
        if (isHeaderSeparator) {
          return; // Skip separator rows
        }
        
        // Check if this is a header row
        const isHeader = cells.some(cell => 
          cell.trim().match(/^(Field|Metric|Type|Factor|#|Student Name|Class|Roll|Attendance|Marks|Risk|Status|Value|Grade|Count|Trend|Priority)/i)
        );
        
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        
        tableRows.push(
          <div key={`table-row-${idx}`} className={`flex border-b ${theme === 'dark' ? 'border-slate-600' : 'border-slate-200'} py-2`}>
            {cells.map((cell, cellIdx) => (
              <div 
                key={cellIdx} 
                className={`flex-1 px-3 text-sm ${
                  isHeader 
                    ? `font-bold ${theme === 'dark' ? 'text-white bg-slate-700' : 'text-slate-900 bg-slate-100'}` 
                    : `${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`
                }`}
              >
                {cell.trim()}
              </div>
            ))}
          </div>
        );
      } else {
        // If we were in a table and now we're not, render the table
        if (inTable && tableRows.length > 0) {
          elements.push(
            <div key={`table-${idx}`} className={`my-3 rounded-lg border ${theme === 'dark' ? 'border-slate-600 bg-slate-800' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
              {tableRows}
            </div>
          );
          tableRows = [];
          inTable = false;
        }
        
        // Main headers with emoji (📊, 📅, etc.)
        if (line.match(/^[📊📅📚🎭⚠️💡📋🎯👥✅🚨⚡]\s*\*\*(.+?)\*\*$/)) {
          const match = line.match(/^([📊📅📚🎭⚠️💡📋🎯👥✅🚨⚡])\s*\*\*(.+?)\*\*$/);
          elements.push(
            <h2 key={idx} className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mt-6 mb-3 flex items-center gap-2`}>
              <span>{match[1]}</span>
              <span>{match[2]}</span>
            </h2>
          );
        }
        // Headers with **text** only
        else if (line.match(/^\*\*(.+?)\*\*$/)) {
          const headerText = line.replace(/\*\*/g, '');
          elements.push(
            <h3 key={idx} className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mt-4 mb-2`}>
              {headerText}
            </h3>
          );
        }
        // Bold inline text with colon (labels)
        else if (line.match(/^\*\*(.+?):\*\*/)) {
          const boldText = line.replace(/\*\*/g, '');
          elements.push(
            <p key={idx} className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'} mt-3 mb-1`}>
              {boldText}
            </p>
          );
        }
        // Bold text within line (inline bold)
        else if (line.includes('**')) {
          const parts = line.split(/(\*\*.*?\*\*)/g);
          elements.push(
            <p key={idx} className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} leading-relaxed my-1`}>
              {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={i} className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{part.slice(2, -2)}</strong>;
                }
                return <span key={i}>{part}</span>;
              })}
            </p>
          );
        }
        // List items starting with • or -
        else if (line.trim().match(/^[•\-]\s/)) {
          const text = line.trim().substring(1).trim();
          elements.push(
            <div key={idx} className="flex gap-2 ml-2 my-1.5">
              <span className="text-blue-500 font-bold mt-0.5">•</span>
              <span className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} flex-1`}>{text}</span>
            </div>
          );
        }
        // Numbered lists
        else if (line.trim().match(/^\d+\.\s/)) {
          elements.push(
            <div key={idx} className={`flex gap-2 ml-2 my-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <span className="font-semibold">{line.trim().split('.')[0]}.</span>
              <span className="flex-1">{line.trim().substring(line.trim().indexOf('.') + 1).trim()}</span>
            </div>
          );
        }
        // Empty lines
        else if (line.trim() === '') {
          elements.push(<div key={idx} className="h-2"></div>);
        }
        // Regular text
        else if (line.trim() !== '') {
          elements.push(
            <p key={idx} className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} leading-relaxed my-1`}>
              {line}
            </p>
          );
        }
      }
    });
    
    // If we ended while in a table, render it
    if (inTable && tableRows.length > 0) {
      elements.push(
        <div key="table-final" className={`my-3 rounded-lg border ${theme === 'dark' ? 'border-slate-600 bg-slate-800' : 'border-slate-200 bg-white'} overflow-hidden shadow-sm`}>
          {tableRows}
        </div>
      );
    }
    
    return elements;
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'} pt-16`}>
      {/* Header */}
      <div className={`sticky top-16 z-10 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Title and Mode */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${isDatabaseMode ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} rounded-full flex items-center justify-center shadow-lg`}>
                {isDatabaseMode ? <Database className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
              </div>
              <div>
                <h1 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  AI Assistant
                </h1>
                <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isDatabaseMode ? 'Database Mode' : 'General Chat'}
                </p>
              </div>
            </div>
            
            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              {/* Mode Toggle */}
              <button
                onClick={toggleMode}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isDatabaseMode 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                title={isDatabaseMode ? 'Switch to General Chat' : 'Switch to Database Mode'}
              >
                {isDatabaseMode ? (
                  <>
                    <Bot className="w-4 h-4" />
                    <span className="hidden sm:inline">General</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span className="hidden sm:inline">Database</span>
                  </>
                )}
              </button>
              
              {/* Close */}
              <button
                onClick={() => navigate(-1)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'} transition-all`}
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                      : 'bg-gradient-to-br from-green-500 to-emerald-600'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`px-4 py-3 sm:px-5 sm:py-4 rounded-2xl shadow-md ${
                      message.sender === 'user'
                        ? `${theme === 'dark' ? 'bg-slate-700 text-white border border-slate-600' : 'bg-white text-slate-800 border border-slate-300'}`
                        : `${theme === 'dark' ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-800 border border-slate-200'}`
                    }`}
                  >
                    {message.isAI ? (
                      <div className="space-y-2">
                        {renderFormattedMessage(message.text)}
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    )}
                    <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-3xl">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className={`px-4 py-3 sm:px-5 sm:py-4 rounded-2xl shadow-md ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className={`sticky bottom-0 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-t shadow-lg`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Quick suggestions */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
            {isDatabaseMode ? (
              ['Show today\'s attendance', 'List students with low attendance', 'Show high-risk students'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputMessage(suggestion)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    theme === 'dark'
                      ? 'bg-green-600 text-white hover:bg-green-500'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {suggestion}
                </button>
              ))
            ) : (
              ['Features', 'Pricing', 'Support'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputMessage(`Tell me about ${suggestion.toLowerCase()}`)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  {suggestion}
                </button>
              ))
            )}
          </div>

          {/* Input field */}
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isDatabaseMode ? "Ask about students, attendance, reports..." : "Ask me anything about our platform..."}
              className={`flex-1 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 text-sm sm:text-base ${
                theme === 'dark' 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500' 
                  : 'bg-white border-slate-300 text-slate-800 placeholder-slate-500 focus:border-blue-500'
              } focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all`}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all ${
                inputMessage.trim()
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg'
                  : `${theme === 'dark' ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'} cursor-not-allowed`
              }`}
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
