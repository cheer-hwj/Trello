function  cardDrag(card, str) {
    var dragged
    var oldX
    var oldY
    var placeholder = document.createElement('div')
    placeholder.className = 'card-placeholder'

    /* 拖动目标元素时触发drag事件 */
    card.addEventListener("drag", function( event ) {
        event.stopPropagation()
        event.preventDefault()
        event.target.classList.add('card-moving')
    }, false)

    document.addEventListener("dragstart", function( event ) {
        // 保存拖动元素的引用(ref.)
        event.dataTransfer.setData('json',null)
        dragged = event.target
        oldX = event.clientX
        oldY = event.clientY
    }, false)

    document.addEventListener("dragend", function( event ) {
        console.log('end')
    }, false)

    /* 放置目标元素时触发事件 */
    document.addEventListener("dragover", function( event ) {
        // 阻止默认动作以启用drop
        event.preventDefault()
        event.stopPropagation()
        if ( event.target.tagName === "LI" ) {
            event.target.classList.remove(':hover')
            if(event.clientY >= oldY) {
                event.target.parentNode.insertBefore(placeholder, event.target.nextSibling)
            }
            else {
                event.target.parentNode.insertBefore(placeholder, event.target)
            }
            oldY = event.clientY
        }
    }, false)

    document.addEventListener("drop", function( event ) {
        // 阻止默认动作（如打开一些元素的链接）
        event.preventDefault()
        // 将拖动的元素到所选择的放置目标节点中
        dragged.classList.remove('card-moving')
        placeholder.parentNode.insertBefore( dragged, placeholder)
        dragged.parentNode.removeChild( placeholder )
    }, false)
}