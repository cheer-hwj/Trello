function totalInit () {
    var data = {
        color: {
            default: '#1169a6',
            green: '#4ca257',
            cyan: '#2295b0',
            grass: '#4b8029',
            darkred: '#933c26',
            yellow: '#b17a1d',
            purple: '#8662a0',
            fuschia: '#c85b92',
            gray: '#838c91'
        },

        img: {
            lake: 'lake',
            leaf: 'leaf',
            sunrise: 'sunrise',
            moutain: 'mountain',
            castle: 'castle',
            sand: 'sand'
        },

        boards: [
            {
                id: 0,
                header: '早读课',
                bg: ['color', 'default'],
                team: 'default',
                listOrder: [0, 1, 2, 3, 4, 5],
                lists: [
                    {
                        'l_id': 0,
                        'title': 'todo',
                        'cardList': [1, 0, 2, 3]
                    },
                    {
                        'l_id': 1,
                        'title': 'doing',
                        'cardList': [4, 5, 6, 7, 8]
                    },
                    {
                        'l_id': 2,
                        'title': 'done',
                        'cardList': [9, 10]
                    },
                    {
                        'l_id': 3,
                        'title': 'wishes',
                        'cardList': [11, 12]
                    },
                    {
                        'l_id': 4,
                        'title': 'expecting',
                        'cardList': [13, 14, 15, 16, 17, 18, 19]
                    },
                    {
                        'l_id': 5,
                        'title': 'newList',
                        'cardList': []
                    }
                ],
                cards: [
                    {
                        c_id: 0,
                        name: 'exercise'
                    },
                    {
                        c_id: 1,
                        name: 'studying'
                    },
                    {
                        c_id: 2,
                        name: 'cooking'
                    },
                    {
                        c_id: 3,
                        name: 'reading'
                    },
                    {
                        c_id: 4,
                        name: 'movies'
                    },
                    {
                        c_id: 5,
                        name: 'coding'
                    },
                    {
                        c_id: 6,
                        name: 'music'
                    },
                    {
                        c_id: 7,
                        name: 'typing words'
                    },
                    {
                        c_id: 8,
                        name: 'cow'
                    },
                    {
                        c_id: 9,
                        name: 'high kick'
                    },
                    {
                        c_id: 10,
                        name: 'desperate housewife'
                    },
                    {
                        c_id: 11,
                        name: 'how i met your mother'
                    },
                    {
                        c_id: 12,
                        name: 'friends'
                    },
                    {
                        c_id: 13,
                        name: 'modern family'
                    },
                    {
                        c_id: 14,
                        name: 'thanksgiving'
                    },
                    {
                        c_id: 15,
                        name: 'turkey'
                    },
                    {
                        c_id: 16,
                        name: 'fewer'
                    },
                    {
                        c_id: 17,
                        name: 'wine'
                    },
                    {
                        c_id: 18,
                        name: 'flower'
                    },
                    {
                        c_id: 19,
                        name: 'cookie'
                    }
                ]
            },
            {
                id: 1,
                header: '水滴1',
                bg: ['color', 'cyan'],
                team: 'default',
                listOrder: [],
                lists: [],
                cards: []
            },
            {
                id: 2,
                header: '水滴2',
                bg: ['color', 'grass'],
                team: 'default',
                listOrder: [],
                lists: [],
                cards: []
            },
            {
                id: 3,
                header: '水滴3',
                bg: ['color', 'grass'],
                team: 'default',
                listOrder: [],
                lists: [],
                cards: []
            },
            {
                id: 4,
                header: '水滴4',
                bg: ['color', 'yellow'],
                team: 'default',
                listOrder: [],
                lists: [],
                cards: []
            },
            {
                id: 5,
                header: '水滴5',
                bg: ['img', 'leaf'],
                team: 'default',
                listOrder: [],
                lists: [],
                cards: []
            }
        ],
        feature: {
            'personal-boards': [0, 1, 2, 3, 4, 5],
            'starred-boards': [0, 1, 2],
            'recent-boards': [2, 3, 4]
        },
        menuOn: false
    }
    if(!localStorage.getItem('data')) {
        localStorage.setItem('data', JSON.stringify(data))
    }
}
totalInit ()