document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("form");
    const timer = document.getElementById("timer");
    const countdownDiv = document.querySelector(".countdown");
    let countdownInterval;

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = new FormData (form)
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        if (formData.has("indefinite")) {
            console.log("INDEFINITE!")
            countdownDiv.classList.add("hidden")
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'indefinite' });
            });
        } else {
            console.log(`FINITE: ${formData.get("finite")}!`)
            
            const [minutes, seconds] = formData.get("finite").split(':').map(Number);
            let totalSeconds = (minutes*60)+seconds;
            countdownDiv.classList.remove("hidden")

            countdownInterval = setInterval(() => {
                if (totalSeconds <= 0) {
                    clearInterval(countdownInterval);
                    timer.textContent = '00:00';
                    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { action: 'stop' });
                    });
                    return;
                }
                timer.textContent = `${String(Math.floor(totalSeconds/60)).padStart(2,'0')}:${String(totalSeconds%60).padStart(2,'0')}`;
                totalSeconds--;
            }, 1000);

            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'finite', data: formData.get("finite") });
            });
        }
    }) 
});

/*
ADD COUNTDOWN LOGIC ... parse finite text data and begin countdown 
make countdown element in popup.html visible and update printed val every second ...
*/