let vk = require('vksdk')
const http = require("http");
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
    client.request('messages.getChatUsers', { chat_id: chat_id, fields: 'first_name, last_name, online' }, (response) => {
        listener(response.response)
    })
}

function getRandomUser(chat_id, listener) {
    getUsers(chat_id, (users) => {
        listener(users[Math.floor(Math.random() * users.length)])
    })
}

function getRandomOnlineUser(chat_id, listener) {
    getUsers(chat_id, (users) => {
        let onlineUsers = []
        for (let user of users) {
            if (user.online == 1) {
                onlineUsers.push(user)
            }
        }
        listener(onlineUsers[Math.floor(Math.random() * onlineUsers.length)])
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

function whoIsOnline(msg) {
    getRandomOnlineUser(msg.chat_id, (user) => {
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

function fact(msg) {
    http.get('http://randstuff.ru/fact/', res => {
        let body = "";
        res.on("data", data => {
            body += data;
        });
        res.on("end", () => {
            let tdIndex = body.indexOf('<td>')
            let text = body.substr(tdIndex + 4, body.indexOf('</td>') - tdIndex - 4)

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

function roll(msg) {
    let msgText = msg.body.toLowerCase()
    let fromIndex = msgText.lastIndexOf('от')
    let toIndex = msgText.lastIndexOf('до')

    let num1 = parseInt(msgText.substr(fromIndex + 2, toIndex))
    let num2 = parseInt(msgText.substr(toIndex + 2))

    let text = ''
    if (isNaN(num1) || isNaN(num2)) {
        text = 'Проверьте параметры'
    }
    else {
        if (num1 > num2) { let temp = num1; num1 = num2; num2 = temp;}
        text = (Math.floor(Math.random() * (num2 - num1 + 1)) + num1).toString();
    }

    client.request('messages.send',
        {
            chat_id: msg.chat_id,
            message: text,
            forward_messages: msg.id
        }, (msgRes) => {
            console.log(msgRes)
        })

}

function roll_dice(msg) {
    let text = (Math.floor(Math.random() * (6 - 1 + 1)) + 1).toString();


    client.request('messages.send',
    {
        chat_id: msg.chat_id,
        message: text,
        forward_messages: msg.id
    }, (msgRes) => {
        console.log(msgRes)
    })
}

function flip_coin(msg) {
    let text = 'Решка'

    if (Math.random() > 0.5) {
        text = 'Орёл'
    }

    client.request('messages.send',
        {
            chat_id: msg.chat_id,
            message: text,
            forward_messages: msg.id
        }, (msgRes) => {
            console.log(msgRes)
        })
}

function add_emojis(msg) {
    let text = msg.body
    let textLower = msg.body.toLowerCase()
    let substitute = '🅱'
    let index = textLower.indexOf('b-emoji') + 'b-emoji'.length
    text = text.substr(index)

    let chars = ['б', 'в', 'г', 'д', 'ж', 'з', 'й', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ',
        'Б', 'В', 'Г', 'Д', 'Ж', 'З', 'Й', 'К', 'Л', 'М', 'Н', 'П', 'Р', 'С', 'Т', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ',
        'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z',
        'b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z']

    let ctr = 0
    let prevch = 'x'
    let newText = ''
    for (var i = 0; i < text.length; i++) {
        var ch = text[i]
        var b = false
        for (let chc of chars) {
            if (ch == chc) {
                b = true
            }
        }
        if (b && ctr < 1 && prevch != 'b') {
            ctr++
            newText += substitute
            prevch = 'b'
        }
        else {
            newText += ch
            prevch = 'x'
        }

        if (ch == ' ') {
            ctr = 0
            prevch = 'x'
        }
    }

    client.request('messages.send',
        {
            chat_id: msg.chat_id,
            message: newText,
            forward_messages: msg.id
        }, (msgRes) => {
            console.log(msgRes)
        })
}

function whoIsKazakhToday(msg) {
    getUsers(msg.chat_id, (users) => {
        let now = new Date();
        let start = new Date(now.getFullYear(), 0, 0);
        let diff = now - start;
        let oneDay = 1000 * 60 * 60 * 24;
        let day = Math.floor(diff / oneDay);

        let user = users[day % users.length]
        let text = 'Сегодняшний казах -  ' + user.first_name + ' ' + user.last_name
        client.request('messages.send',
            { chat_id: msg.chat_id, message: text, forward_messages: msg.id }, (msgRes) => {
                console.log(msgRes)
            })

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
                if (lowerCase.search('казах') == 0 && msg.chat_id != undefined) {
                    console.log(msg.body)
                    if (lowerCase.search('сегодня казах') != -1) {
                        whoIsKazakhToday(msg)
                    }
                    else if (lowerCase.search('кто') != -1) {
                        if (lowerCase.search('онлайн') != -1) {
                            whoIsOnline(msg)
                        }
                        else {
                            whoIs(msg)
                        }
                    }
                    else if (lowerCase.search('шар') != -1) {
                        ball(msg)
                    }
                    else if (lowerCase.search('топ крипт') != -1) {
                        coins_top(msg)
                    }
                    else if (lowerCase.search('криптовалюта ') != -1) {
                        coin_specific(msg)
                    }
                    else if (lowerCase.search('факт') != -1) {
                        fact(msg)
                    }
                    else if (lowerCase.search('рандом') != -1 && lowerCase.search('от') != -1 && lowerCase.search('до') != -1) {
                        roll(msg);
                    }
                    else if (lowerCase.search('игральная кость') != -1 || lowerCase.search('дайс') != -1 || lowerCase.search('dice') != -1) {
                        roll_dice(msg)
                    }
                    else if (lowerCase.search('монетк') != -1) {
                        flip_coin(msg)
                    }
                    else if (lowerCase.search('b-emoji') != -1) {
                        add_emojis(msg)
                    }
                }
            }
        }
    })

}
setInterval(iteration, 2500)