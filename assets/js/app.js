function debounce(fn) {
    let frame, params;
    return function () {
        params = arguments;
        if (frame) {
            cancelAnimationFrame(frame);
        }
        frame = requestAnimationFrame(function () {
            fn.apply(null, params);
        });
    }
}

function bind(parent,event,selector,callback){
    return parent.addEventListener(event,function(ev){
        if( ev.target.matches(selector) ||  ev.target.closest(selector)){
            let target   = ev.target.matches(selector) ? ev.target : ev.target.closest(selector);
            callback.call(target,ev);
        }
    },true);
}

(function () {
    let selector = 'a[href]';
    let href = location.href, expr;
    let links = document.querySelectorAll(selector);
    [].slice.call(links).filter(function (el) {
        el.classList.remove('active');
        expr = el.getAttribute('data-rel');
        return expr ? href.match(expr) : el.href ? href.indexOf(el.href) !== -1 : false;
    }).forEach(function (el) {
        el.classList.add('active');
    });
})();


(function () {
    let callback;
    let html      =  document.documentElement;
    let container = document.scrollingElement;
    let scroll = 0;
    function scroller() {
        let scrollTop = container.scrollTop;
        let progress  = parseFloat(window.scrollY / ((html.scrollHeight - html.clientHeight) / 100) ).toFixed(2);
        html.style.setProperty('--progress',String(progress));
        html.classList.toggle('scroll', scrollTop > 0);
        html.classList.toggle('scroll-bottom', scrollTop > 0 && (scroll < scrollTop));
        html.classList.toggle('scroll-top', scrollTop > 0 && (scroll > scrollTop));
    }
    callback = debounce(scroller);
    window.addEventListener('orientationchange', callback, {passive: true});
    window.addEventListener('resize', callback, {passive: true});
    window.addEventListener('scroll', callback, {passive: true});
    scroller();
})();

(function(){

    function togglePreview(ev){
        ev.preventDefault();
        let html = document.documentElement;
        let scrollbar = window.innerWidth - document.documentElement.clientWidth;
        let state = html.classList.toggle('show-image',this.classList.toggle('active'));
        let target = ev.target;
        html.classList.toggle('hide-image',state === false);
        html.style.setProperty('--scrollbar', String(scrollbar) );
    }

    bind(document,'click','.image-thumb',togglePreview);

    bind(document,'click','[data-nav]',function(ev){
        ev.preventDefault();
        let html = document.documentElement;
        let scrollbar = window.innerWidth - document.documentElement.clientWidth;
        html.classList.toggle('show-nav');
        let state = html.classList.contains('show-nav');
        html.classList.toggle('hide-nav',state === false);
        html.style.setProperty('--scrollbar', String(scrollbar) );
    });

})();
