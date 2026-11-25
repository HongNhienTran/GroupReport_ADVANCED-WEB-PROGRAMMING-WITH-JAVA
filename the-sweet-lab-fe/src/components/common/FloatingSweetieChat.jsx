import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, MessageCircle, Send, X } from 'lucide-react';
import { aiApi } from '../../api/aiApi';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/format';

function FloatingSweetieChat() {
  const { isAuthenticated, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Xin chào! Mình là Sweetie. Bạn đang tìm bánh kẹo ít đường, Keto, Vegan hay muốn tư vấn theo dị ứng?',
      suggestedProducts: [],
    },
  ]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending || !isAuthenticated) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setSending(true);

    try {
      const res = await aiApi.sendChat({ sessionId, message: text });
      const data = res.data;
      if (data?.sessionId) {
        setSessionId(data.sessionId);
      }
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data?.reply || 'Mình chưa tìm thấy thông tin phù hợp.',
          suggestedProducts: data?.suggestedProducts || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Xin lỗi, phiên đăng nhập đã hết hạn hoặc Sweetie đang bận. Bạn thử lại sau nhé!',
          suggestedProducts: [],
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="sweetie-floating-widget">
      {open && (
        <div className="sweetie-chat-drawer">
          <div className="sweetie-drawer-header">
            <span>Trợ lý dinh dưỡng Sweetie</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#fff', display: 'flex' }}
              aria-label="Đóng chat"
            >
              <X size={18} />
            </button>
          </div>

          {!isAuthenticated ? (
            <div style={{ padding: '22px 18px', textAlign: 'center', fontSize: '13.5px', color: '#334155', lineHeight: 1.6 }}>
              <p style={{ margin: '0 0 14px' }}>
                Vui lòng <strong>đăng nhập</strong> để trò chuyện với <strong>Sweetie</strong> và nhận
                tư vấn dinh dưỡng cá nhân hóa theo hồ sơ của bạn.
              </p>
              <Link
                to="/login"
                className="login-nav-btn"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setOpen(false)}
              >
                <LogIn size={16} />
                <span>Đăng nhập ngay</span>
              </Link>
              <div style={{ marginTop: '10px', fontSize: '12.5px', color: '#64748b' }}>
                Chưa có tài khoản?{' '}
                <Link
                  to="/register"
                  style={{ color: 'var(--emerald)', fontWeight: 600 }}
                  onClick={() => setOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="sweetie-messages-list">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`sweetie-msg ${msg.role}`}>
                    <div className="sweetie-msg-bubble">
                      {idx === 0 && user?.fullName
                        ? `Chào ${user.fullName}! Mình là Sweetie. Bạn đang tìm bánh kẹo ít đường, Keto, Vegan hay muốn tư vấn theo dị ứng?`
                        : msg.content}
                    </div>
                    {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                      <div className="sweetie-suggested-list">
                        {msg.suggestedProducts.map((p) => (
                          <Link
                            key={p.id}
                            to={`/products/${p.slug}`}
                            className="sweetie-suggested-item"
                            onClick={() => setOpen(false)}
                          >
                            <span className="name">{p.name}</span>
                            <span className="price">{formatCurrency(p.minPrice)}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {sending && (
                  <div className="sweetie-msg assistant">
                    <div className="sweetie-msg-bubble">Sweetie đang suy nghĩ...</div>
                  </div>
                )}
              </div>

              <form className="sweetie-chat-form" onSubmit={handleSend}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Hỏi Sweetie về bánh kẹo..."
                  disabled={sending}
                />
                <button type="submit" disabled={sending || !input.trim()} aria-label="Gửi tin nhắn">
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {!open && (
        <button type="button" className="sweetie-chat-bubble" onClick={() => setOpen(true)}>
          <MessageCircle size={14} />
          <span>Chat với Sweetie</span>
        </button>
      )}

      <button
        type="button"
        className="sweetie-avatar-btn"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Mở chat với Sweetie"
      >
        <img src="/sweetie_wave.png" alt="Sweetie Mascot" />
        <span className="sweetie-online-dot" />
      </button>
    </div>
  );
}

export default FloatingSweetieChat;
