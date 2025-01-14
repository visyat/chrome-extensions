(function () {
    var in_loop = false
    var finite_loop = false
    var countdown = 0

    document.addEventListener('yt-navigate-finish', function (event) {
        in_loop = false
    });
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'indefinite') {
            in_loop = true
            finite_loop = false
            sendResponse({ message: 'Current Video will Loop Indefinitely ...' });
        } else if (request.action === 'finite') {
            in_loop = true
            finite_loop = true
            countdown = request.data;
            sendResponse({ message: 'Current Video will Loop for the Stated Time Period ...' });
        } else if (request.action === 'query') {
            // popup queries extension for current state on load ...
            sendResponse({ message: in_loop, loop_finite: finite_loop, data: countdown });
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
            // increment counter (if needed) ...
            if (finite_loop) {
                if (countdown <= 0) { 
                    in_loop = false;
                    finite_loop = false;
                }
                else {
                    countdown -= 1;
                }
            }
            
            // check if video end and restart ...
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
