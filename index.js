let vk = require('vksdk')
const https = require("https");

let client = new vk({
    appId: 6316719,
    appSecret : 'biSgngl646k4W1urbA1C'
})

// Turn on requests with access tokens
client.setSecureRequests(true);
client.setToken('6c790a8b4f89a5aab1e973fea935e3f395f492c3a1dbfedf1bd65a99f006038e5b8f900d70e3ca7ad4877')

let friends = []

function getUsers(chat_id, listener) {
    client.request('messages.getChatUsers', { chat_id: chat_id, fields: 'first_name, last_name' }, (response) => {
        listener(response.response)
    })
}

function getRandomUser(chat_id, listener) {
    getUsers(chat_id, (users) => {
        listener(users[Math.floor(Math.random() * users.length)])
    })
}
function whoIs(msg) {
    getRandomUser(msg.chat_id, (user) => {
        let text = 'По моему мнению, это ' + user.first_name + ' ' + user.last_name
        client.request('messages.send',
            { chat_id: msg.chat_id, message: text, forward_messages: msg.id }, (msgRes) => {
                console.log(msgRes)
            })
    })
}

function ball(msg) {
    let responses = ['Бесспорно',
        'Предрешено',
        'Никаких сомнений',
        'Определённо да',
        'Можешь быть уверен в этом',
        'Мне кажется — «да»',
        'Вероятнее всего',
        'Хорошие перспективы',
        'Знаки говорят — «да»',
        'Да',
        'Даже не думай',
        'Мой ответ — «нет»',
        'По моим данным — «нет»',
        'Перспективы не очень хорошие',
        'Весьма сомнительно',
        'Даже не думай',
        'Мой ответ — «нет»',
        'По моим данным — «нет»',
        'Перспективы не очень хорошие',
        'Весьма сомнительно'
    ]

    client.request('messages.send',
        {
            chat_id: msg.chat_id,
            message: responses[Math.floor(Math.random() * responses.length)],
            forward_messages: msg.id
        }, (msgRes) => {
            console.log(msgRes)
        })

}

function coins_top(msg) {
    https.get('https://api.coinmarketcap.com/v1/ticker/?limit=10', res => {
        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", () => {
            let coins = JSON.parse(body)
            let index = 1
            let text = ''

            for (let coin of coins) {
                //1. Bitcoin : 573.1333$
                text += index + '. '
                text += coin.name + ' (' + coin.symbol + ') : ' + coin.price_usd + '$'
                text += '\n'
                index += 1
            }

            client.request('messages.send',
                {
                    chat_id: msg.chat_id,
                    message: text,
                    forward_messages: msg.id
                }, (msgRes) => {
                    console.log(msgRes)
                })
        });
    })
}

function coin_specific(msg) {
    let msgBody = msg.body.toLowerCase()
    let index = msgBody.indexOf('криптовалюта ') + 'криптовалюта'.length
    let coinName = msgBody.substr(index + 1)
    console.log('https://api.coinmarketcap.com/v1/ticker/' + coinName + '/')
    https.get('https://api.coinmarketcap.com/v1/ticker/' + coinName + '/', res => {
        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", () => {
            let text = ''
            console.log(body)
            try {
                let coins = JSON.parse(body)
                let coin = coins[0]
                //1. Bitcoin : 573.1333$
                text += coin.rank + '. '
                text += coin.name + ' (' + coin.symbol + ') : ' + coin.price_usd + '$'
                text += '\n'
                text += 'Market Cap: ' + coin.market_cap_usd + '$' + '\n'
            } catch (error) {
                console.log(error)
                text = 'Проверьте запрос'
            }

            client.request('messages.send',
                {
                    chat_id: msg.chat_id,
                    message: text,
                    forward_messages: msg.id
                }, (msgRes) => {
                    console.log(msgRes)
                })
        });
    })
}

function iteration() {
    console.log('iteration')
    client.request('messages.get', { count: 20 }, (response) => {
        let dialogs = response.response.items
        //console.log(JSON.stringify(dialogs))
        for (let msg of dialogs) {
            if (msg.read_state == 0) {
                let lowerCase = msg.body.toLowerCase()
                if (lowerCase.search('казах') == 0) {
                    console.log(msg.body)
                    if (lowerCase.search('кто') != -1 && msg.chat_id != undefined) {
                        whoIs(msg)
                    }
                    else if (lowerCase.search('шар') != -1 && msg.chat_id != undefined) {
                        ball(msg)
                    }
                    else if (lowerCase.search('топ крипт') != -1 && msg.chat_id != undefined) {
                        coins_top(msg)
                    }
                    else if (lowerCase.search('криптовалюта ') != -1 && msg.chat_id != undefined) {
                        coin_specific(msg)
                    }
                }
            }
        }
    })

}
setInterval(iteration, 5000)