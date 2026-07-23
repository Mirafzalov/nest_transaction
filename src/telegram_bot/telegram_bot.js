// import { Bot, InlineKeyboard } from "grammy";
const { Bot, InlineKeyboard } = require("grammy");
const { get } = require("http");


const bot = new Bot("8496144394:AAFeO_2VMe3GM1g96nt3L_aTyPVpr541F8s");

// const getTransaction = async () => {
// const response = await fetch('http://localhost:3000/transactions/')
// const data = await response.json()

//     data.forEach(transact => {
//         transact.type === 'expense' ? transact.type = 'Расход' : transact.type = 'Доход'

//     })
//     console.log(data)
//     return data

// }

// const getTransaction = async () => {
//     const response = await fetch('http://localhost:3000/transactions/')
//     const datas = await response.json()
//     const res = datas.map(data =>
//         '\n' +
//         `
//     <b>Amount:</b> ${data.amount} sum\n 
//     <b>Type of the transaction:</b> ${data.type}\n
//     <b>Category:</b> ${data.category}\n 
//     <b>Description:</b> ${data.description}\n 
//     <b>Date of the transaction:</b> ${data.transactionDate.slice(0, 10)}\n 
//     ############################`).join('\n\n')
//     console.log(typeof (res))
//     return res
// }






const getTransactionPaginated = async () => {
    const response = await fetch('http://localhost:3000/transactions/')
    const datas = await response.json()



    const result = []
    let res = []

    datas.map(data => {

        let text = '\n' +
            `
💸 <b>Type of transaction:</b> ${data.type}

━━━━━━━━━━━━━━━━━━
💰 <b>Amount:</b> ${data.amount.toLocaleString()} UZS
🏷️ <b>Category:</b> ${data.category}
📝 <b>Description:</b> ${data.description}
📅 <b>Date:</b> ${data.transactionDate.slice(0, 10)}
━━━━━━━━━━━━━━━━━━

🆔 Transaction #${data.id}\n\n\n`

        res.push(text)

        if (res.length == 3) {
            result.push(res)
            res = []
        }

    })
    if (res.length > 0) result.push(res);

    return result
}




const getKeyboard = (len, page) => {
    if (page == len - 1) {
        const keyboard = new InlineKeyboard()
            .text('<', `previous_${page}`)
            .text(`${page + 1}/${len}`, 'nothing')

        return keyboard

    } else if (page == 0) {
        const keyboard = new InlineKeyboard()
            .text(`${page + 1}/${len}`, 'nothing')
            .text('>', `next_${page}`)

        return keyboard

    } else {
        const keyboard = new InlineKeyboard()
            .text('<', `previous_${page}`)
            .text(`${page + 1}/${len}`, 'nothing')
            .text('>', `next_${page}`)

        return keyboard
    }
}



// ################ BOT


bot.command("start", async (ctx) => {
    ctx.reply('Hello')
})



bot.command("menu", async (ctx) => {
    const data = await getTransactionPaginated()
    let len = data.length
    let page = len-1
    const keyboard = getKeyboard(len, page)


    await ctx.reply(data[page].join('\n'), {
        reply_markup: keyboard,
        parse_mode: 'HTML'
    });
});



bot.on('callback_query:data', async (ctx) => {
    const data = await getTransactionPaginated()
    let len = data.length
    let page = Number(ctx.callbackQuery.data.split('_')[1]);

    if (ctx.callbackQuery.data.split('_')[0] == 'next') {
        await ctx.answerCallbackQuery();

        if (page < len - 1) {
            page += 1

            const keyboard = getKeyboard(len, page)


            await ctx.editMessageText(data[page].join("\n"), {
                reply_markup: keyboard,
                parse_mode: "HTML",
            });

        } else if (page == len - 1) {
            const keyboard = getKeyboard()

        }

    } else if (ctx.callbackQuery.data.split('_')[0] == 'previous') {
        await ctx.answerCallbackQuery();

        if (page >= 0) {
            page -= 1

            const keyboard = getKeyboard(len, page)

            await ctx.editMessageText(data[page].join("\n"), {
                reply_markup: keyboard,
                parse_mode: "HTML",
            });

        }

    } else {
        await ctx.answerCallbackQuery();
    }
})




bot.start();

