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

    function checkVideoEnd() {
        if (in_loop) {
            const currentTimeEl = document.querySelector('.ytp-time-current');
            const durationTimeEl = document.querySelector('.ytp-time-duration');
            
            if (currentTimeEl && durationTimeEl) {
                if (currentTimeEl.textContent === durationTimeEl.textContent) {
                    const playButton = document.querySelector('.ytp-play-button');
                    if (playButton) playButton.click();
                }
            }
        }
    }
    setInterval(checkVideoEnd, 1000);
})();

/*
* on video end, if timer has not reached zero, restart
* countdown timer sent back to popup? or maintained separately ...
*/