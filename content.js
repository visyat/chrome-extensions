(function () {
    var in_loop = false
    document.addEventListener('yt-navigate-finish', function (event) {
        in_loop = false
    });
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'indefinite') {
            in_loop = true
            sendResponse({ message: 'Current Video will Loop Indefinitely ...' });
        } else if (request.action === 'finite') {
            in_loop = true
            sendResponse({ message: 'Current Video will Loop for the Stated Time Period ...' });
        } else if (request.action === 'stop') {
            in_loop = false
            sendResponse({ message: 'Loop Has Been Stopped!'} )
        }
    });

    function compareTimestamps(time1, time2) {
        const getSeconds = (time) => {
            const parts = time.split(':');
            const seconds = parseInt(parts.pop());
            const minutes = parseInt(parts.pop() || 0);
            const hours = parseInt(parts.pop() || 0);
            return hours*3600 + minutes*60 + seconds;
        };
        const diff = Math.abs(getSeconds(time1) - getSeconds(time2));
        return diff === 0 || diff === 1;
    }
    function checkVideoEnd() {
        if (in_loop) {
            const currentTimeEl = document.querySelector('.ytp-time-current');
            const durationTimeEl = document.querySelector('.ytp-time-duration');
            
            if (currentTimeEl && durationTimeEl) {
                if (compareTimestamps(currentTimeEl.textContent, durationTimeEl.textContent)) {
                    const playButton = document.querySelector('.ytp-play-button');
                    if (playButton) playButton.click();
                }
            }
        }
    }
    setInterval(checkVideoEnd, 1000);
})();
