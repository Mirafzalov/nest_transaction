import requests 
response = requests.get('http://localhost:3000/accounting/')

data = response.json()

print(data)


import telebot 

TOKEN = '8496144394:AAFeO_2VMe3GM1g96nt3L_aTyPVpr541F8s'



bot = telebot.TeleBot(TOKEN)




@bot.message_handler(commands=["start"])
def start(message):
    bot.reply_to(message, data['message'])  

bot.infinity_polling()