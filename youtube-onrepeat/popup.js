document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("form");
    const timer = document.getElementById("timer");
    const countdownDiv = document.querySelector(".countdown");
    
    // query extension backend to check if timer is running ... 
    // if so, get current state of timer, print and start incrementing ...
    var counterState = 0;
    timer.textContent = '';

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        (async () =>  {
            const { message, loop_finite, data } = await chrome.tabs.sendMessage(tabs[0].id, { action: 'query' });
            if (message === true) {
                if (loop_finite === true) {
                    countdownDiv.classList.remove("hidden")
                    counterState = data;
                } else {
                    countdownDiv.classList.remove("hidden")
                    counterState = -1;
                }
            }
        })();
    });
    function incrementCounter() {
        if (counterState == 0) {
            timer.textContent = 'COUNTDOWN COMPLETE!';
        } else if (counterState == -1) {
            timer.textContent = 'Looping indefinitely ...';
        } else {
            counterState -= 1;
            timer.textContent = `${String(Math.floor(counterState/60)).padStart(2,'0')}:${String(counterState%60).padStart(2,'0')} left in loop ...`;
        }
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = new FormData (form)
        if (formData.has("indefinite")) {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'indefinite' });
            });
            timer.textContent = '';
            countdownDiv.classList.remove("hidden")

            counterState = -1;
        } else {
            const [minutes, seconds] = formData.get("finite").split(':').map(Number);
            let totalSeconds = (minutes*60)+seconds;
            
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'finite', data: totalSeconds });
            });
            timer.textContent = '';
            countdownDiv.classList.remove("hidden")

            // reset timer and start incrementing ...
            counterState = totalSeconds;
        }
    });
    setInterval(incrementCounter, 1000);
});