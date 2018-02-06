$(() => {
    let $window = $('#window')
    let $wrapper = $('#wrapper')
    let $firstCopy = $wrapper.children(':first').clone(true)
    let $lastCopy = $wrapper.children(':last').clone(true)
    let $index = $('#index > ul > li')
    let $lis = $wrapper.children()
    let $picWidth = $lis.eq(0).width()
    let $prev = $('#window > .prev')
    let $next = $('#window > .next')
    let len = $lis.length
    let current = 0

    init()
    let index = 0
    let timer = autoPlay()
    ergodic()
    hoverAndPage()
    $prev.on('click',() => {
        goToSlide(current - 1)
    })
    $next.on('click',() => {
        goToSlide(current + 1)
    })
    // 工具函数
    function init() {
        $wrapper.append($firstCopy)
        $wrapper.prepend($lastCopy)
    }

    function ergodic(){
        $index.each((indexInner,ele) => {
            $(ele).hover((event) => { // hover mouseenter 时会干掉计时器，比 click 事件好，click 事件不可能去干掉计时器
                clearInterval(timer)
                goToSlide(indexInner)
                index = indexInner
            },() => {
                timer = autoPlay()
            })
        })
    }

    function goToSlide(goIndex){
        if(goIndex >= len){
            goIndex = 0
        }
        if(goIndex < 0){
            goIndex = len - 1
        }
        if(current === len-1 && goIndex === 0){
            special((len+1)*$picWidth,$picWidth)
        }else if(current === 0 && goIndex === len-1){
            special(0,len*$picWidth)
        }else{
            $wrapper.css({transform: `translateX(-${(goIndex+1)*$picWidth}px)`},500)
        }
        $index.eq(goIndex).addClass('active').siblings().removeClass('active')
        current = goIndex
    }

    function special(falsePos,truePos){
        $wrapper.css({transform: `translateX(-${falsePos}px)`},500).one('transitionend',(event) => {
            $wrapper.hide().offset()
            $wrapper.css({transform: `translateX(-${falsePos}px)`},500).show()
        })
    }

    function autoPlay() {
        return setInterval(() => {
            goToSlide(current + 1)
        }, 2500)
    }

    function hoverAndPage() {
        $window.hover(() => {
            clearInterval(timer)
            addKlass(true)
        }, () => {
            timer = autoPlay()
            addKlass(false)
        })
        $(document).on('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(timer)
            } else {
                timer = autoPlay()
            }
        })
    }

    function addKlass(isAdd) {
        let method = isAdd ? 'addClass' : 'removeClass'
        $prev[method]('active')
        $next[method]('active')
    }
})