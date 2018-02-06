!function(){
    let view = $('#carousel')
    let controller = {
        view: null,
        $window: null,
        $wrapper: null,
        $firstCopy: null,
        $lastCopy: null,
        $index: null,
        $lis: null,
        $picWidth: null,
        $prev: null,
        $next: null,
        len: null,
        current: 0,
        index: 0,
        timer: null,
        init(view) {
            this.view = view
            this.$window = this.view.find('#window')
            this.$wrapper = this.view.find('#wrapper')
            this.$firstCopy = this.$wrapper.children(':first').clone(true)
            this.$lastCopy = this.$wrapper.children(':last').clone(true)
            this.$index = this.view.find('#index > ul > li')
            this.$lis = this.$wrapper.children()
            this.$picWidth = this.$lis.eq(0).width()
            this.$prev = this.view.find('#window > .prev')
            this.$next = this.view.find('#window > .next')
            this.len = this.$lis.length
            this.$wrapper.append(this.$firstCopy)
            this.$wrapper.prepend(this.$lastCopy)
            this.ergodic()
            this.hoverAndPage()
            this.bindEvents()
            this.timer = this.autoPlay()
        },
        bindEvents() {
            this.$prev.on('click',() => {
                this.goToSlide(this.current - 1)
            })
            this.$next.on('click',() => {
                this.goToSlide(this.current + 1)
            })
        },
        hoverAndPage() {
            this.$window.hover(() => {
                clearInterval(this.timer)
                this.addKlass(true)
            }, () => {
                this.timer = this.autoPlay()
                this.addKlass(false)
            })
            $(document).on('visibilitychange', () => {
                if (document.hidden) {
                    clearInterval(this.timer)
                } else {
                    this.timer = this.autoPlay()
                }
            })
        },
        addKlass(isAdd) {
            let method = isAdd ? 'addClass' : 'removeClass'
            this.$prev[method]('active')
            this.$next[method]('active')
        },
        autoPlay() {
            return setInterval(() => {
                this.goToSlide(this.current + 1)
            }, 2500)
        },
        ergodic() {
            this.$index.each((indexInner, ele) => {
                $(ele).hover((event) => { // hover mouseenter 时会干掉计时器，比 click 事件好，click 事件不可能去干掉计时器
                    clearInterval(this.timer)
                    this.goToSlide(indexInner)
                    this.index = indexInner
                }, () => {
                    this.timer = this.autoPlay()
                })
            })
        },
        goToSlide(goIndex) {
            let len = this.len
            if(goIndex >= len){
                goIndex = 0
            }
            if(goIndex < 0){
                goIndex = len - 1
            }
            if(this.current === len-1 && goIndex === 0){
                this.special((this.len+1) * this.$picWidth, this.$picWidth)
            }else if(this.current === 0 && goIndex === len-1){
                this.special(0,len * this.$picWidth)
            }else{
                this.$wrapper.css({'transform':'translateX(-' + (goIndex+1)* this.$picWidth + 'px)'})
            }
            this.$index.eq(goIndex).addClass('active').siblings().removeClass('active')
            this.current = goIndex
        },
        special(falsePos,truePos) {
            this.$wrapper.css({'transform':'translateX(-' + falsePos + 'px)'}).one('transitionend',(event) => {
                this.$wrapper.hide().offset()
                this.$wrapper.css({'transform':'translateX(-' + truePos + 'px)'}).show()
            })
        }, 
    }
    controller.init(view)
}.call()
