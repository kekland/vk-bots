let vk = require('vksdk')

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

function iteration() {
    console.log('iteration')
    client.request('messages.get', { count: 20 }, (response) => {
        let dialogs = response.response.items
        //console.log(JSON.stringify(dialogs))
        for (let msg of dialogs) {
            if (msg.read_state == 0) {

                let lowerCase = msg.body.toLowerCase()
                if (lowerCase.search('казах') == 0) {
                    client.request('messages.markAsRead', { message_ids: msg.id }, (readResponse) => { })
                    console.log(msg.body)
                    if (lowerCase.search('кто') != -1 && msg.chat_id != undefined) {
                        whoIs(msg)
                    }
                    else if (lowerCase.search('шар') != -1 && msg.chat_id != undefined) {
                        ball(msg)
                    }
                }
            }
        }
    })

}
setInterval(iteration, 5000)