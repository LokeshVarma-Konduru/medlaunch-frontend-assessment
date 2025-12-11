import './SupportChat.css';

function SupportChat() {
  return (
    <button type="button" className="support-chat-btn" aria-label="Support Chat">
      <img 
        src="/manage-accounts.png" 
        alt="" 
        className="icon-user"
        aria-hidden="true"
      />
      <span>Support Chat</span>
    </button>
  );
}

export default SupportChat;

