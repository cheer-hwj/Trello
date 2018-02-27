(function () {
    //board数据初始化
    function initData() {
        var index = location.href.indexOf('id=')
        var b_id = index > -1 ? location.href.substr(index + 3) : 0
        var boardData = data.boards[b_id]
        boardData.init = function () {
            boardData.lists.forEach(function (t) {
                t.__defineGetter__('cardItems', function () {
                    return this.cardList.map(function (t2) {
                        return boardData.cards.find(function (t3) {
                            return t3['c_id'] === t2
                        })
                    })
                })
            })
        }
        boardData.save = function () {
            data.boards[b_id] = boardData
            return saveData(data)
        }
        boardData.init()
        return boardData
    }

    var boardData = initData()

    //初始化背景以及标题信息
    function contentHeader(boardData) {
        var body = document.querySelector('body')
        if (boardData.bg[0] === 'color') {
            body.style.backgroundColor = data.color[boardData.bg[1]]
        }
        else {
            var imgsrc = '../common/data/img/' + data.img[boardData.bg[1]] + '.jpg'
            body.style.backgroundImage = 'url(' + imgsrc + ')'
            adaptFontColor(imgsrc)
        }

        var header = document.querySelector('.content-header')
        var h2 = document.querySelector('h2')
        h2.innerText = boardData.header

        var renameBoard = document.querySelector('#renameBoard')
        var input = renameBoard.querySelector('input')
        h2.onclick = function () {
            renameBoard.hidden = false
            input.value = boardData.header
            input.select()
            input.focus()
        }

        var renameBtn = renameBoard.querySelector('.rename-btn')
        renameBtn.onclick = function () {
            if(input.value) {
                h2.innerText = input.value
                renameBoard.hidden = true
                boardData.header = input.value
                boardData.save()
                console.log(data)
                updateList(['starred-boards', 'personal-boards'], data)
            }
        }
        var closeBtn = renameBoard.querySelector('.close-re')
        closeBtn.onclick = function () {
            input.value = ''
            renameBoard.hidden = true
        }

        var starBtn = header.querySelector('.star-btn')
        updateStarBtn()
        starBtn.onclick = function () {
            if (this.classList.contains('starred')) {
                var n = data.feature['starred-boards'].indexOf(boardData.id)
                data.feature['starred-boards'].splice(n, 1)
            }
            else {
                data.feature['starred-boards'].push(boardData.id)
            }
            boardData.save()
            var newEvent = new Event('starChange')
            window.dispatchEvent(newEvent)
        }

        function updateStarBtn() {
            starBtn.classList.toggle('starred', data.feature['starred-boards'].indexOf(boardData.id) > -1)
        }

        window.addEventListener('starChange', updateStarBtn)

    }

    contentHeader(boardData)

    //创建列表内容
    function contentList(boardData) {
        var content = document.querySelector('.content')

        var addwrapper = document.createElement('div')
        addwrapper.classList.add('add-list-wrapper')
        var addlist = document.createElement('div')
        addlist.className = 'add-list'
        addlist.innerHTML = '<p>Add list...</p>'
        addwrapper.appendChild(addlist)
        content.appendChild(addwrapper)
        addlist.onclick = addList

        var lists = boardData.lists.sort(function (a1, a2) {
            return boardData.listOrder.indexOf(a1.l_id) - boardData.listOrder.indexOf(a2.l_id)
        })
        lists.forEach(function (t) {
            var wrapper = document.createElement('div')
            wrapper.className = 'list-wrapper'
            var parent = document.createElement('div')
            parent.className = 'content-list'
            parent.dataset.l_id = t['l_id']

            var h3 = document.createElement('h3')
            var headerInput = adaptArea(h3, t.title, function (value) {
                boardData.lists[boardData.listOrder.indexOf(t['l_id'])].title = value
                boardData.save()
            })

            h3.onclick = function (event) {
                if(event.target === headerInput.input) {
                    headerInput.edit()
                }
            }
            parent.appendChild(h3)

            var ul = document.createElement('ul')
            if (t.cardItems.length > 0) {
                t.cardItems.forEach(function (elem) {
                    var li = document.createElement('li')
                    li.className = 'card-item'
                    li.dataset.c_id = elem.c_id

                    var cardInput = adaptArea(li, elem.name, function (value) {
                        var id = li.dataset.c_id
                        boardData.cards[id].name = value
                        boardData.save()
                    })

                    var button = document.createElement('button')
                    button.className = 'edit'
                    button.onclick = function (event) {
                        event.stopPropagation()
                        cardInput.edit()
                    }
                    li.appendChild(button)
                    ul.appendChild(li)
                })
            }
            parent.appendChild(ul)

            var add = document.createElement('div')
            add.className = 'add-card'
            var p = document.createElement('p')
            p.innerText = 'Add a card...'
            add.appendChild(p)
            add.onclick = addCard
            parent.appendChild(add)

            wrapper.appendChild(parent)
            content.insertBefore(wrapper, addwrapper)
            listDrag(parent)
        })

    }

    contentList(boardData)

    //添加新的list
    function addList() {
        if (this.className === 'add-list') {
            this.className = 'adding-list'

            var wrapper = document.createElement('div')
            wrapper.className = 'adding-list-wrapper'
            var other = document.createElement('div')
            wrapper.appendChild(other)
            var input = adaptArea(other, '', function(value) {
                addListItem(value, wrapper)
            })
            input.placeholder = 'Add a list...'
            var btn = document.createElement('button')
            btn.innerText = 'Save'
            btn.className = 'add-btn'
            var btnclose = document.createElement('button')
            btnclose.innerText = 'X'
            btnclose.className = 'close-add'

            wrapper.appendChild(btn)
            wrapper.appendChild(btnclose)

            this.parentNode.appendChild(wrapper)

            btn.onclick = function(event, value) {
                event.preventDefault()
                addListItem(value, wrapper)
            }
            btnclose.onclick = closeAddList
            input.edit()
        }
    }

    function closeAddList(event) {
        event.stopPropagation()
        var div = this.parentNode
        div.parentNode.querySelector('.adding-list').className = 'add-list'
        div.parentNode.removeChild(div)
    }

    function addListItem(value, parent) {
        var content = document.querySelector('.content')
        var list = createListItem(value, content)
        listDrag(list)

        var closebtn = parent.querySelector('.close-add')
        closebtn.click()
    }

    function createListItem(value, content) {
        var wrapper = document.createElement('div')
        wrapper.className = 'list-wrapper'
        var parent = document.createElement('div')
        parent.className = 'content-list'

        var newId = boardData.lists.length

        var h3 = document.createElement('h3')
        var headerInput = adaptArea(h3, value, function (value) {
            boardData.lists[boardData.listOrder.indexOf(newId)].title = value
            boardData.save()
        })

        h3.onclick = function (event) {
            if(event.target === headerInput.input) {
                headerInput.edit()
            }
        }

        parent.appendChild(h3)

        var ul = document.createElement('ul')
        parent.appendChild(ul)
        var add = document.createElement('div')
        add.className = 'add-card'
        var p = document.createElement('p')
        p.innerText = 'Add a card...'
        add.appendChild(p)
        add.onclick = addCard
        parent.appendChild(add)


        parent.dataset.l_id = newId
        var newlist = {
            l_id: newId,
            title: value,
            cardList: []
        }
        newlist.__defineGetter__('cardItems', function () {
            return this.cardList.map(function (t2) {
                return boardData.cards.find(function (t3) {
                    return t3['c_id'] === t2
                })
            })
        })
        boardData.lists.push(newlist)
        boardData.listOrder.push(newId)

        wrapper.appendChild(parent)
        content.insertBefore(wrapper, document.querySelector('.add-list-wrapper'))

        boardData.save()
        return parent
    }

    //添加新的card
    function addCard() {
        if (this.className === 'add-card') {
            this.className = 'adding-card'

            var wrapper = document.createElement('div')
            wrapper.className = 'adding-card-wrapper'

            var ul = this.parentNode.querySelector('ul')
            ul.appendChild(wrapper)
            var other = document.createElement('div')
            wrapper.appendChild(other)
            var textarea = adaptArea(other, '', function (value) {
                addItem(value, ul)
            })
            textarea.edit()

            var btn = document.createElement('button')
            btn.innerText = 'Add'
            btn.className = 'add-btn'
            var btnclose = document.createElement('button')
            btnclose.innerText = 'X'
            btnclose.className = 'close-add'
            wrapper.appendChild(btn)
            wrapper.appendChild(btnclose)

            btn.onclick = function(event, value) {
                event.preventDefault()
                event.stopPropagation()
                addItem(value, ul)
            }
            btnclose.onclick = closeAdd
        }
    }

    function closeAdd(event) {
        event.stopPropagation()
        var div = this.parentNode
        div.parentNode.parentNode.querySelector('.adding-card').className = 'add-card'
        div.parentNode.removeChild(div)
    }

    function addItem(value, ul) {
        var li = createCardItem(value, ul)
        cardDrag(li)

        var closebtn = ul.querySelector('.close-add')
        closebtn.click()
    }

    function createCardItem(value, ul) {
        var li = document.createElement('li')
        var newId = boardData.cards.length

        var cardInput = adaptArea(li, value, function (value) {
            boardData.cards[newId].name = value
            boardData.save()
        })

        li.className = 'card-item'
        var button = document.createElement('button')
        button.className = 'edit'
        button.onclick = function (event) {
            event.stopPropagation()
            cardInput.edit()
        }
        li.appendChild(button)

        li.dataset.c_id = newId
        var newcard = {
            c_id: newId,
            name: value
        }
        boardData.cards.push(newcard)

        var list = ul.parentNode
        var l_id = list.dataset.l_id
        boardData.lists[l_id].cardList.push(newId)
        boardData.save()

        ul.appendChild(li)
        return li
    }

    //两个drag事件的模拟
    function listDrag(list) {
        var start = false
        var moving = false
        var eventX, eventY,
            initX, initY,
            w, h, oldX,
            placeholder,
            parentlist
        var content = document.querySelector('.content')
        var addlistWrapper = content.querySelector('.add-list-wrapper')
        list.addEventListener('mousedown', function (event) {
            if ((event.target.parentNode.tagName === 'H3') || event.target.classList.contains('content-list')) {
                event.preventDefault()
                event.stopPropagation()
                start = true
                eventX = event.clientX
                eventY = event.clientY
                oldX = event.clientX
                initX = this.offsetLeft - content.scrollLeft
                initY = this.offsetTop + 84
                w = this.offsetWidth
                h = this.offsetHeight
                placeholder = document.createElement('div')
                placeholder.className = 'list-placeholder list-wrapper'
                placeholder.style.width = w + 'px'
                placeholder.style.height = h + 'px'
            }
        })
        content.addEventListener('mousemove', function (event) {
            if (start) {
                event.preventDefault()
                if (!moving) {
                    moving = true
                    list.classList.add('list-moving')
                    list.parentNode.style.margin = '0'
                }
                parentlist = content.querySelectorAll('.list-wrapper')

                //判断占位图形的位置
                var index = Math.round((event.clientX + content.scrollLeft) / w)
                if (index <= 0) {
                    content.insertBefore(placeholder, content.firstElementChild)
                }
                else if (index > parentlist.length - 2) {
                    content.insertBefore(placeholder, addlistWrapper)
                }
                else {
                    if (content.contains(parentlist[index])) {
                        //判断左右滑动
                        if (event.clientX >= oldX) {
                            content.insertBefore(placeholder, parentlist[index + 1])
                        }
                        else {
                            content.insertBefore(placeholder, parentlist[index])
                        }
                        oldX = event.clientX
                    }
                    else {
                        console.log('error')
                    }
                }

                // 模拟边缘滚动
                if (parseInt(window.getComputedStyle(list, null).getPropertyValue('right')) < 10) {
                    content.scrollLeft += 10
                }
                else if (parseInt(list.style.left) < 10) {
                    content.scrollLeft -= 10
                }

                //拖拽目标的位置
                list.style.left = (event.clientX - eventX + initX) + 'px'
                list.style.top = (event.clientY - eventY + initY) + 'px'
            }
        })
        document.addEventListener('mouseup', function (event) {
            if (start) {
                start = false
                if (moving) {
                    moving = false
                    console.log('end')
                    if (content.contains(placeholder)) {
                        var currentparent = list.parentNode
                        placeholder.appendChild(list)
                        placeholder.style = ''
                        placeholder.classList.remove('list-placeholder')
                        content.removeChild(currentparent)
                        boardData.listOrder = Array.prototype.map.call(content.querySelectorAll('.content-list'), function (t) {
                            return parseInt(t.dataset.l_id)
                        })
                        boardData.save()
                    }
                    list.classList.remove('list-moving')
                    list.style.top = ''
                    list.style.left = ''
                }
            }
        })
    }

    function cardDrag(card) {
        var start = false
        var moving = false
        var startX, startY, targetX, targetY
        var placeholder = document.createElement('div')
        placeholder.className = 'card-placeholder'
        var itemHeight
        var itemWidth
        var content = document.querySelector('.content')

        card.addEventListener('mousedown', function (event) {
            event.preventDefault()
            event.stopPropagation()
            start = true

            itemHeight = card.offsetHeight
            itemWidth = card.offsetWidth
            startX = event.clientX
            startY = event.clientY
        })
        document.addEventListener('mousemove', function (event) {
            event.stopPropagation()
            if (start) {
                if (!moving) {
                    moving = true
                    card.className = 'card-moving'
                    card.style.width = itemWidth + 'px'
                    card.style.height = itemHeight + 'px'
                    card.parentNode.insertBefore(placeholder, card)
                    targetX = card.offsetLeft - content.scrollLeft
                    targetY = card.offsetTop - card.parentNode.scrollTop - itemHeight
                }
                else {
                    var path = eventPath(event)
                    card.style.left = targetX + event.clientX - startX + 'px'
                    card.style.top = targetY + event.clientY - startY + 'px'

                    var current = path.find(function (val) {
                        if (val.classList) {
                            return val.classList.contains('list-wrapper')
                        }
                    })

                    if (current) {
                        var ul = current.querySelector('ul')
                        if (ul.querySelectorAll('li').length === 0) {
                            ul.appendChild(placeholder)
                        }
                        else {
                            var brother = path.find(function (val) {
                                if (val.classList) {
                                    return val.classList.contains('card-item')
                                }
                            })
                            if (brother) {
                                ul.insertBefore(placeholder, brother)
                            }

                            if (event.clientY < itemHeight + 120) {
                                ul.scrollTop -= 10
                            }
                            else if (event.clientY > ul.offsetHeight + 120) {
                                ul.scrollTop += 10
                                ul.appendChild(placeholder)
                            }
                        }

                    }
                    // 模拟边缘滚动
                    if (parseInt(window.getComputedStyle(card, null).getPropertyValue('right')) < 10) {
                        content.scrollLeft += 10
                    }
                    else if (parseInt(card.style.left) < 10) {
                        content.scrollLeft -= 10
                    }
                }
            }
        })
        document.addEventListener('mouseup', function (event) {
            event.stopPropagation()
            if (start) {
                event.preventDefault()
                if (moving) {
                    moving = false
                    card.className = 'card-item'
                    card.style.width = ''
                    card.style.height = ''

                    if (placeholder.parentNode) {
                        var oldparent = card.parentNode
                        var a = oldparent.removeChild(card)
                        a.style = ''
                        var newparent = placeholder.parentNode
                        newparent.insertBefore(a, placeholder)
                        newparent.removeChild(placeholder)
                        boardData.lists[oldparent.parentNode.dataset.l_id].cardList = Array.prototype.map.call(oldparent.querySelectorAll('.card-item'), function (el) {
                            return parseInt(el.dataset.c_id)
                        })
                        boardData.lists[newparent.parentNode.dataset.l_id].cardList = Array.prototype.map.call(newparent.querySelectorAll('.card-item'), function (el) {
                            return parseInt(el.dataset.c_id)
                        })
                        boardData.save()
                    }
                }
                start = false
            }
        })
    }

    Array.prototype.forEach.call(document.querySelectorAll('.card-item'), function (val) {
        cardDrag(val)
    })
    scrollMove(document.querySelector('.content'))
})()
//鼠标拖拽滑动网页
function scrollMove(content) {
    var initialx
    var down = false
    content.addEventListener('mousedown', function (event) {
        if (event.target.parentNode.isEqualNode(content)) {
            event.stopPropagation()
            initialx = event.clientX
            down = true
            content.classList.add('scroll-move')
        }
    })
    document.addEventListener('mousemove', function (event) {
        if (down) {
            var dis = event.clientX - initialx
            content.scrollLeft -= dis
            initialx = event.clientX
        }
    })
    document.addEventListener('mouseup', function (event) {
        if (down) {
            event.stopPropagation()
            down = false
            content.classList.remove('scroll-move')
        }
    })
}

//判断图片背景的灰度来决定标题的字体颜色
function adaptFontColor(imgsrc) {
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var img = new Image()
    img.src = imgsrc
    img.onload = function () {
        ctx.drawImage(img, 0, 0)
        var myImageData = ctx.getImageData(0, 0, 100, 100);
        var l = handleData(myImageData.data)
        if (l > 0.5) {
            console.log(l)
            document.querySelector('.content-header').classList.add('adapt-font-color')
        }
    }

    function handleData(data) {
        var result = []
        data.reduce(function (sum = [], value, index) {
            var n = (index + 1) % 4
            var m = parseInt((index + 1) / 4)
            if (n !== 0 && m % 2 !== 0) {
                sum.push(value)
                if (n === 3) {
                    result.push(sum)
                    sum = []
                }
                return sum
            }
        }, [])
        var remain = result.filter((el, n) => {return n % 10 === 0})
        var hsl = remain.map(function (t) {
            var max = Math.max.apply(null, t)
            var min = Math.min.apply(null, t)
            return ((max + min) / 2 / 255).toFixed(2)
        })
        return hsl.reduce(function (sum, value) {
            return (parseFloat(sum) + parseFloat(value)) / 2
        })
    }
}

//textarea高度自适应
function adaptArea(parent, initial, savefuc) {
    var o = {}
    var input = document.createElement('textarea')
    input.value = initial
    input.className = 'adapt'
    var pre = document.createElement('div')
    pre.className = 'pre'
    pre.innerText = initial
    parent.appendChild(input)
    parent.appendChild(pre)

    input.addEventListener('input', function (event) {
        pre.innerText = this.value
    })
    input.addEventListener('keydown', function (event) {
        if(event.code === 'Enter') {
            event.preventDefault()
            this.blur()
        }
    })
    input.addEventListener('blur', function (event) {
        if (/\S/.test(this.value)) {
            savefuc(this.value)
        }
        else {
            input.focus()
        }
    }, true)

    o.input = input
    o.edit = function () {
        input.select()
        input.focus()
    }
    return o
}