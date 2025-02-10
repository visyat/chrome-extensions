(function () {
    var in_loop = false
    var finite_loop = false
    var countdown = 0

    var upper_b = 0;
    var lower_b = 0;

    document.addEventListener('yt-navigate-finish', function (event) {
        in_loop = false
    });
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'indefinite') {
            in_loop = true
            finite_loop = false
            upper_b = request.upper_b;
            lower_b = request.lower_b;
            sendResponse({ message: 'Current Video will Loop Indefinitely ...' });
        } else if (request.action === 'finite') {
            in_loop = true
            finite_loop = true
            countdown = request.data;
            upper_b = request.upper_b;
            lower_b = request.lower_b;
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
    function parseTimestamp(str) {
        const [minutes, seconds] = str.split(':').map(Number);
        let totalSeconds = (minutes*60)+seconds;
        return totalSeconds;
    }
    function clickProgressBar(percent) {
        const progressList = document.querySelector('.ytp-progress-list');
        if (progressList) {
            const rect = progressList.getBoundingClientRect();
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                clientX: rect.left + (rect.width * percent),
                clientY: rect.top + (rect.height / 2),
                view: window
            });
            const mouseUpEvent = new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                clientX: rect.left + (rect.width * percent),
                clientY: rect.top + (rect.height / 2),
                view: window
            });
            progressList.dispatchEvent(mouseDownEvent);
            progressList.dispatchEvent(mouseUpEvent);
        }
    }
    // function hoverOverVideo() {
    //     const videoPlayer = document.querySelector('.html5-main-video');
    //     if (videoPlayer) {
    //         const rect = videoPlayer.getBoundingClientRect();
    //         const mouseOverEvent = new MouseEvent('mousemove', {
    //             bubbles: true,
    //             cancelable: true,
    //             clientX: rect.left + (rect.width / 2),  // hover in middle of video
    //             clientY: rect.top + (rect.height / 2),
    //             view: window
    //         });
    //         videoPlayer.dispatchEvent(mouseOverEvent);
    //     }
    // }


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
            // hoverOverVideo();
            const currentTimeEl = document.querySelector('.ytp-time-current');
            const durationTimeEl = document.querySelector('.ytp-time-duration');
            
            if (currentTimeEl && durationTimeEl) {
                if (upper_b === 0) {
                    if (compareTimestamps(currentTimeEl.textContent, durationTimeEl.textContent)) {
                        if (lower_b === 0) {
                            const playButton = document.querySelector('.ytp-play-button');
                            if (playButton) playButton.click();
                        } else {
                            clickProgressBar(lower_b/parseTimestamp(durationTimeEl.textContent));
                        }
                    }
                } else {
                    if (parseTimestamp(currentTimeEl.textContent) >= upper_b) {
                        if (lower_b === 0) {
                            clickProgressBar(0);
                        } else {
                            clickProgressBar(lower_b/parseTimestamp(durationTimeEl.textContent));
                        }
                    }
                }
            }
        }
    }
    setInterval(checkVideoEnd, 1000);
})();
