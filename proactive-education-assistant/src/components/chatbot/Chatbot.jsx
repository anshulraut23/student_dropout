import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Custom animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-slideIn {
    animation: slideIn 0.4s ease-out;
  }
`;

const Chatbot = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Inject custom animations
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Dragging functionality
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Keep the button within viewport bounds
    const maxX = window.innerWidth - 60;
    const maxY = window.innerHeight - 60;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      {/* Chatbot Button */}
      <div
        className={`fixed z-50 cursor-pointer select-none ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          onClick={() => {
            if (!isDragging) {
              navigate('/ai-assistant?mode=general');
            }
          }}
          className={`w-16 h-16 ${theme === 'dark' ? 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600' : 'bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600'} rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 flex items-center justify-center group relative overflow-hidden`}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full animate-pulse"></div>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full bg-white/30 animate-ping opacity-20"></div>

          <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300 relative z-10" />

          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-bounce shadow-lg border-2 border-white">
            <div className="w-full h-full bg-red-400 rounded-full animate-pulse"></div>
          </div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></div>
        </div>

        {/* Tooltip */}
        {!isDragging && (
          <div className={`absolute bottom-full right-0 mb-3 px-3 py-2 ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'} rounded-lg shadow-xl text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
            Open AI Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-current"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;