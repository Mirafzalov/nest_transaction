// import { Bot, InlineKeyboard } from "grammy";
const { Post, BadRequestException } = require("@nestjs/common");
const { repl } = require("@nestjs/core");
const { response } = require("express");
const { Bot, InlineKeyboard } = require("grammy");
const { nextTick } = require("process");


const bot = new Bot("8496144394:AAFeO_2VMe3GM1g96nt3L_aTyPVpr541F8s");

const userState = new Map();



const calculateByDate = async (data) => {

    const transaction = data
    const expenses = transaction.reduce((expense, transac) => transac.type == 'expense' ? transac.amount + expense : expense + 0, 0)
    const incomes = transaction.reduce((income, transac) => transac.type == 'income' ? transac.amount + income : income + 0, 0)
    // const total = incomes - expenses

                let balance = `
━━━━━━━━━━━━━━━━
💰 <b>Total expenses:</b> ${expenses.toLocaleString()} UZS
💵 <b>Total income:</b> ${incomes.toLocaleString()} UZS
📈 <b>Balance:</b> ${(incomes-expenses).toLocaleString()} UZS`
    return balance
}


const postTransaction = async (data) => {
    const response = await fetch('http://localhost:3000/transactions/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    console.log(JSON.stringify(data));
    const result = await response.json()


    let text = '\n' +
        `
💸 <b>Type of transaction:</b> ${result.type}

━━━━━━━━━━━━━━━━━━
💰 <b>Amount:</b> ${result.amount.toLocaleString()} UZS
🏷️ <b>Category:</b> ${result.category}
📝 <b>Description:</b> ${result.description}
📅 <b>Date:</b> ${result.transactionDate.slice(0, 10)}
━━━━━━━━━━━━━━━━━━

🆔 Transaction #${result.id}\n\n\n`

    return text
}



const getTransactionPaginated = async () => {
    const response = await fetch('http://localhost:3000/transactions/')
    const transactions = await response.json()

    const datas = transactions.sort((a, b) => {
        return new Date(a.transactionDate) - new Date(b.transactionDate)
    })

    const result = []
    let res = []

    datas.map(data => {
        let operator = data.type == 'expense' ? '-' : '+';
        let emoji = operator === '-' ? '🔴' : '🟢';

        let text = '\n' +
            `
💸 <b>Type of transaction:</b> ${data.type}

━━━━━━━━━━━━━━━━━━
${emoji} <b>Amount:</b> ${operator}${data.amount.toLocaleString()} UZS
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
    ctx.reply('Hello', {
        reply_markup: {
            keyboard: [
                ["➕ Add transaction"],
                ["📋 View all transactions"],
                ["📊 Account transactions"]
            ],
            resize_keyboard: true
        }
    })
})



bot.hears('➕ Add transaction', async (ctx, next) => {

    userState.set(ctx.from.id, 'ADDING_TRANSACTION')

    ctx.reply(`
📝 <b>Create a Transaction</b>

Please send your transaction details in the following format:

💰 <b>100000</b> → Amount of the transaction
📌 <b>expense</b> → Type: <code>expense</code> or <code>income</code>
🏷️ <b>Lunch</b> → Category of your transaction
📝 <b>Had lunch at a cafe</b> → Short description
📅 <b>2026-06-06</b> → Transaction date

<b>Example:</b>
<code>
100000
expense
Lunch 
Had lunch at a cafe 
2026-06-06
</code>

✨ Please make sure all details are provided in the correct order.
`, {
        parse_mode: 'HTML'
    })

})



bot.hears("📋 View all transactions", async (ctx) => {

    userState.set(ctx.from.id, 'VIEW_TRANSACTION');


    const data = await getTransactionPaginated()
    let len = data.length
    let page = len - 1
    const keyboard = getKeyboard(len, page)


    await ctx.reply(data[page].join('\n'), {
        reply_markup: keyboard,
        parse_mode: 'HTML'
    });

});




bot.hears("📊 Account transactions", async (ctx) => {

    userState.set(ctx.from.id, 'ACCOOUNT_TRANSACTIONS')

    let text = `

🔎 <b>Find Your Transactions</b>

Want to see where your money went? 💸
Enter the date range you'd like to check.

📅 <b>Use this format:</b> <code>YYYY-MM-DD</code> <code>YYYY-MM-DD</code>

✨ <b>Example:</b> 
<code>
2026-05-06
2026-06-06
</code>

⬆️ Start date
⬇️ End date

I'll show you all your transactions within this period. 📊
`

    ctx.reply(text, {
        parse_mode: 'HTML'
    })

})




bot.on('message:text', async (ctx, next) => {

    const state = userState.get(ctx.from.id)
    console.log(state)

    if (state == 'ADDING_TRANSACTION' && ctx.message.text.split('\n').length == 5) {

        const amount = Number(ctx.message.text.split('\n')[0])
        const [_, type, category, description, transactionDate] = ctx.message.text.split('\n')

        try {
            const data = {
                amount: amount,
                type: type,
                category: category,
                description: description,
                transactionDate: transactionDate
            }

            const result = await postTransaction(data)

            console.log('POST acomplished')

            ctx.reply(result, {
                parse_mode: "HTML",
            })

        } catch {
            ctx.reply("Inserted values could not meet the reuiqrements of the trnasction")
        }



    } else if (state == 'ACCOOUNT_TRANSACTIONS' && ctx.message.text.split('\n').length == 2) {


        const [from, to] = ctx.message.text.split('\n')

        if (!new Date(from).getDate() || !new Date(to).getDate() || from > to) {
            ctx.reply('Date input is invalid, try agian')
            return;
        }

        try {

            const response = await fetch(`http://localhost:3000/transactions?from=${from}&&to=${to}`)
            const data = await response.json()

            if (data.statusCode == 404) {
                ctx.reply('No transaction is found in this intrerval of time, try using other Dates')
                return
            }

            const result = []

            data.forEach(data => {

                let operator = data.type == 'expense' ? '-' : '+';

                let emoji = operator === '-' ? '🔴' : '🟢';

                let text = `

💸 <b>Type of transaction:</b> ${data.type}

━━━━━━━━━━━━━━━━
${emoji} <b>Amount:</b> ${operator}${data.amount.toLocaleString()} UZS
🏷️ <b>Category:</b> ${data.category}
📝 <b>Description:</b> ${data.description}
📅 <b>Date:</b> ${data.transactionDate.slice(0, 10)}
━━━━━━━━━━━━━━━━

🆔 Transaction #${data.id}\n\n\n
`;

                result.push(text)
            })


            let text = `            
📊 <b>My Transactions</b>

━━━━━━━━━━━━━━━━
`
            result.unshift(text)
            result.push('━━━━━━━━━━━━━━━━')


            await ctx.reply(result.join('\n'), {
                parse_mode: 'HTML'
            });
            
            const balance = await calculateByDate(data)


            ctx.reply(balance, {
                parse_mode: "HTML"
            })


        } catch (err) {
            ctx.reply(" Error" + err)
        }

    } else {
        ctx.reply('Invalid input')
    }

})




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
            const keyboard = getKeyboard(len, page)

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



// i = 0
// while (i < 30) {
// bot.api.sendPhoto(6184005806)
// i+=1
// }

bot.start();

