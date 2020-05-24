from telegram.ext import Updater, CommandHandler, MessageHandler, Filters

import logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

def bop(update, context):
  context.bot.send_message(chat_id=update.effective_chat.id, text="HELLO IT'S EVELYN2")

def echo(update, context):
  context.bot.send_message(chat_id=update.effective_chat.id, text=update.message.text)

def main():
  f=open("Telegram/telegramtoken.txt", "r")
  if f.mode == 'r':
    token = f.read()
  updater = Updater(token, use_context=True)
  dp = updater.dispatcher
  dp.add_handler(CommandHandler('bop', bop))
 # dp.add_handler(CommandHandler(Filters.text, echo))
  updater.start_polling()
  updater.idle()

if __name__ == '__main__':
  main()