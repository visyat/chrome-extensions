document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("form");
    const timer = document.getElementById("timer");
    const countdownDiv = document.querySelector(".countdown");
    
    // query extension backend to check if timer is running ... 
    // if so, get current state of timer, print and start incrementing ...
    
    var counterState = 0;
    /*
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        (async () =>  {
            const {message, finite_loop, counter} = await chrome.tabs.sendMessage(tabs[0].id, { action: 'query' });
            if (message === true && finite_loop === true) {
                countdownDiv.classList.remove("hidden")
                counterState = counter;
            }
        })();
    });
    */
    function incrementCounter() {
        if (counterState <= 0) {
            timer.textContent = 'COUNTDOWN COMPLETE!';
        } else {
            counterState -= 1;
            timer.textContent = `${String(Math.floor(counterState/60)).padStart(2,'0')}:${String(counterState%60).padStart(2,'0')} left in loop ...`;
        }
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = new FormData (form)
        if (formData.has("indefinite")) {
            countdownDiv.classList.add("hidden")
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'indefinite' });
            });
        } else {
            /*
                UPDATED COUNTDOWN LOGIC ...
                1. on form submit, send # of seconds to extension, so it can independently maintain countdown state
                2. on popup load, query extension for countdown state so it can start printing
                3. extension uses independent counter to determine when to stop loop
            */

            const [minutes, seconds] = formData.get("finite").split(':').map(Number);
            let totalSeconds = (minutes*60)+seconds;
            
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'finite', data: totalSeconds });
            });
            countdownDiv.classList.remove("hidden")

            // reset timer and start incrementing ...
            counterState = totalSeconds;
        }
    });
    setInterval(incrementCounter, 1000);
});