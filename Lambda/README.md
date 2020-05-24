Requirements:
- Node.js 12.x
- Lambda Role: Lambda_EC544

Lambda Fn:
- send-telegram-message
  - Environmental Variables:
    - MY_CHAT_ID (Evelyn's chat ID)
    - TELEGRAM_BOT_TOKEN
    
    
    Set webhook: https://api.telegram.org/bot{my_bot_token}/setWebhook?url={url_to_send_updates_to}
