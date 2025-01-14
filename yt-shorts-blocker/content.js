(function () {
    document.addEventListener('yt-navigate-finish', function (event) {
        if (location.pathname.includes('/shorts/') || location.pathname === '/shorts') {
            location.replace('https://www.youtube.com')
        }
    });
    function hideShortsCarousel() {
        if (location.pathname.includes('/shorts/') || location.pathname === '/shorts') {
            location.replace('https://www.youtube.com')
        }

        const carousel = document.querySelector('.ytd-rich-section-renderer');
        
        const shelf = document.querySelectorAll('ytd-rich-shelf-renderer');
        const reels = document.querySelectorAll('ytd-reel-shelf-renderer');
        
        if (carousel) {
            carousel.style.display = 'none';
        };
        reels.forEach((el) => {
            el.style.display = 'none'
        });
        shelf.forEach((el) => {
            el.style.display = 'none'
        });
    }
    setInterval(hideShortsCarousel, 1000);
})();