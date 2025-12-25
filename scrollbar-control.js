// 滚动条控制脚本 - 默认隐藏，滚动时显示
(function() {
    let scrollTimeout;
    let isScrolling = false;
    
    function handleScroll() {
        if (!isScrolling) {
            isScrolling = true;
            document.documentElement.classList.add('scrolling');
            document.body.classList.add('scrolling');
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
            document.documentElement.classList.remove('scrolling');
            document.body.classList.remove('scrolling');
        }, 500);
    }
    
    function init() {
        // 确保 html 和 body 的样式正确
        document.documentElement.style.width = '100%';
        document.documentElement.style.height = '100%';
        document.body.style.width = '100%';
        document.body.style.minHeight = '100%';
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('touchmove', handleScroll, { passive: true });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

