//createboards
function createboards(feature, data) {
    var arr = featureList(feature, data)
    if (arr.length > 0) {
        var section = document.createElement('section')
        section.classList.add(feature + '-list')
        var h3 = document.createElement('h3')
        h3.innerText = feature.replace('-', ' ')
        section.appendChild(h3)

        var ul = document.createElement('ul')

        for (var i = 0; i < arr.length; i++) {
            var li = document.createElement('li')
            if (data.feature['starred-boards'].indexOf(arr[i].id) === -1) {
                li.classList.add('unstarred')
            }
            li.dataset.id = arr[i].id

            if (arr[i].bg[0] == 'color') {
                li.style.backgroundColor = data.color[arr[i].bg[1]]
            }
            else {
                var fade = document.createElement('div')
                fade.className = 'fade'
                li.appendChild(fade)
                li.style.backgroundImage = 'url(common/data/img/' + data.img[arr[i].bg[1]] + '_small.jpg)'
            }

            var p = document.createElement('p')
            p.innerText = arr[i].header
            var button = document.createElement('button')
            button.addEventListener('click', function (event) {
                event.stopPropagation()
                var parent = this.parentNode.parentNode
                var currentId = parseInt(parent.dataset.id)

                if (!parent.classList.contains('unstarred')) {
                    var n = data.feature['starred-boards'].indexOf(currentId)
                    data.feature['starred-boards'].splice(n, 1)
                }
                else {
                    data.feature['starred-boards'].push(currentId)
                }
                parent.classList.toggle('unstarred')
                window.dispatchEvent(changeStarEvent)
            })
            p.appendChild(button)
            li.appendChild(p)

            li.addEventListener('click', function (event) {
                location.href = 'board/board.html?id=' + this.dataset.id
            })
            ul.appendChild(li)
        }
        if (feature !== 'starred-boards') {
            var addli = document.createElement('li')
            addli.innerText = 'Create new boards...'
            addli.classList.add('add')
            addli.onclick = createNewBoard
            ul.appendChild(addli)
        }

        section.appendChild(ul)
        return section
    }
}

function initBoards(arr, data) {
    var parent = document.querySelector('main')

    for (var i = 0; i < arr.length; i++) {
        if (createList(arr[i], data)) {
            var item = createboards(arr[i], data)
            parent.appendChild(item)
        }
    }
}

function removeBoards(arr) {
    var main = document.querySelector('main')
    for (var i = 0; i < arr.length; i++) {
        if (main.querySelector('.' + arr[i] + '-list')) {
            var item = main.querySelector('.' + arr[i] + '-list')
            var parent = item.parentNode
            parent.removeChild(item)
        }
    }
}

function updateBoards(arr, data) {
    removeBoards(arr)
    initBoards(arr, data)
}

(function () {
    initBoards(['starred-boards', 'personal-boards'], data)
    //监听star内容的改变
    window.addEventListener('starChange', function () {
        console.log('starChange')
        //更新DOM
        updateBoards(['starred-boards', 'personal-boards'], data)
    })
})()



