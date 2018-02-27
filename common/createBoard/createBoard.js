(function () {
    var data = getData()
    //生成可供选择的颜色列表
    var checkedColor = ['color', 'default']

    function createColorList(ul, arr, n, targetBoard) {
        if(arr.length > 0) {
            for (var i = 0; i < n; i++) {
                var li = document.createElement('li')
                if (arr[i][0] === 'color') {
                    li.style.backgroundColor = data.color[arr[i][1]]
                }
                else {
                    li.style.backgroundImage = 'url(common/data/img/' + data.img[arr[i][1]] + '_small.jpg)'
                }
                if (arr[i][1] === 'default') {
                    li.classList.add('checked')
                }

                li.dataset.color = arr[i]

                li.addEventListener('click', function () {
                    Array.prototype.forEach.call(this.parentNode.querySelectorAll('li'), function (val) {
                        val.classList.remove('checked')
                    })
                    this.classList.add('checked')

                    var value = this.dataset.color.split(',')
                    console.log(value)
                    checkedColor = value
                    targetBoard.updateBg(value)
                })
                ul.appendChild(li)
            }
        }
    }

    function createColorBoard(colorBoard, targetBoard) {
        var ul = document.createElement('ul')
        var colorlist = []
        var imglist = []

        for (var key in data.color) {
            if(data.color.hasOwnProperty(key)) {
                colorlist.push(['color', key])
            }
        }
        for (var keyname in data.img) {
            if (data.img.hasOwnProperty(keyname)) {
                imglist.push(['img', keyname])
            }
        }

        createColorList(ul, colorlist, 4, targetBoard)
        createColorList(ul, imglist, 4, targetBoard)

        var li = document.createElement('li')
        li.innerText = '...'
        li.className = 'more'
        li.title = 'more'


        li.addEventListener('click', function () {
            var morelist = document.querySelector('.morelist')
            morelist.updateBg()
            morelist.style.display = 'block'
        })
        ul.appendChild(li)
        colorBoard.appendChild(ul)

        colorBoard.updateBg = function () {
            var currentBg = checkedColor.join(',')
            Array.prototype.forEach.call(ul.querySelectorAll('li'), function (val) {
                if (val.dataset.color === currentBg) {
                    val.classList.add('checked')
                }
                else {
                    val.classList.remove('checked')
                }
            })

        }
    }

    function initOverlay(overlay) {
        var o = overlay
        o.close = function () {
            overlay.style.display = 'none'
        }
        overlay.addEventListener('touchmove', function (e) {
            e.preventDefault()
        })
        overlay.addEventListener('click', function (e) {
            if (e.target === this) {
                if (document.querySelector('.morelist') &&
                    document.querySelector('.morelist').style.display === 'block') {
                    var morelist = document.querySelector('.morelist')
                    morelist.close()
                }
                else {
                    o.close()
                }
            }
        })
        return o
    }

    /* 生成增加board的面板 */
    function initCreateNew() {
        var o = document.querySelector('.newone-overlay')
        var overlay = initOverlay(o)

        var parent = overlay.querySelector('div')

        var addBoard = document.createElement('div')
        addBoard.className = 'add-board'

        var fade = document.createElement('div')
        fade.className = 'fade'
        addBoard.appendChild(fade)

        var inputTitle = document.createElement('input')
        inputTitle.type = 'text'
        inputTitle.placeholder = "Add board title"
        var closeBtn = document.createElement('button')
        closeBtn.className = 'close-btn'
        closeBtn.innerText = 'X'
        addBoard.appendChild(inputTitle)
        addBoard.appendChild(closeBtn)

        addBoard.updateBg = function (value) {
            var fade = addBoard.querySelector('.fade')
            if (value[0] === 'color') {
                fade.style.display = 'none'
                addBoard.style.backgroundImage = ''
                addBoard.style.backgroundColor = data.color[value[1]]
            }
            else {
                fade.style.display = 'block'
                addBoard.style.backgroundImage = 'url(common/data/img/' + data.img[value[1]] + '_small.jpg)'
            }
        }

        parent.appendChild(addBoard)

        var colorBoard = document.createElement('div')
        colorBoard.className = 'color-board'
        parent.appendChild(colorBoard)

        var addBtn = document.createElement('button')
        addBtn.id = 'addBtn'
        addBtn.disabled = 'disabled'
        addBtn.innerText = 'Create'
        parent.appendChild(addBtn)

        createColorBoard(colorBoard, addBoard)

        var morelist = initMore(colorBoard, addBoard)
        colorBoard.appendChild(morelist)

        /*------添加监听事件-------*/
        closeBtn.addEventListener('click', function () {
            overlay.close()
            morelist.close()
            checkedColor = ['color', 'default']
            colorBoard.updateBg()
        })
        inputTitle.addEventListener('input', function () {
            addBtn.disabled = this.value === ''
        })
        addBtn.addEventListener('click', function () {
            var len = data.boards.length
            var newItem = {
                id: len,
                header: inputTitle.value,
                bg: checkedColor,
                team: 'default',
                listOrder: [],
                lists: [],
                cards: []
            }
            data.boards.push(newItem)
            data.feature['personal-boards'].push(len)

            saveData(data)
            location.href = 'board/board.html?id=' + len
        })
    }

    /* 更多的背景颜色列表 */
    function initMore(colorBoard, targetBoard) {
        var parent = document.createElement('div')
        parent.className = 'morelist'

        var h3 = document.createElement('h3')
        h3.innerText = 'board Background'
        parent.appendChild(h3)

        var closemore = document.createElement('button')
        closemore.innerText = 'X'
        closemore.addEventListener('click', function () {
            parent.close()
        })
        parent.appendChild(closemore)


        var ul = document.createElement('ul')

        var colorh4 = document.createElement('h4')
        colorh4.innerText = 'Colors'
        ul.appendChild(colorh4)

        var colorlist = []
        for (var key in data.color) {
            if (data.color.hasOwnProperty(key)) {
                colorlist.push(['color', key])
            }
        }
        createColorList(ul, colorlist, 6, targetBoard)

        var imgh4 = document.createElement('h4')
        imgh4.innerText = 'Photos'
        ul.appendChild(imgh4)

        var imglist = []
        for (var keyname in data.img) {
            if (data.img.hasOwnProperty(keyname)) {
                imglist.push(['img', keyname])
            }
        }
        createColorList(ul, imglist, 6, targetBoard)
        parent.appendChild(ul)

        parent.updateBg = function () {
            var currentBg = checkedColor.join(',')
            Array.prototype.forEach.call(parent.querySelectorAll('li'), function (val) {
                if (val.dataset.color === currentBg) {
                    val.classList.add('checked')
                }
                else {
                    val.classList.remove('checked')
                }
            })

        }

        parent.close = function () {
            this.style.display = 'none'
            colorBoard.updateBg()
        }
        return parent
    }

    initCreateNew()
})()

function saveData(data) {
    localStorage.setItem('data', JSON.stringify(data))
    return true
}
function getData() {
    var data = localStorage.getItem('data')
    return JSON.parse(data)
}
function createNewBoard() {
    var overlay = document.querySelector('.newone-overlay')
    overlay.style.display = 'block'
}