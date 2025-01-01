document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = new FormData (form)
        if (formData.has("indefinite")) {
            console.log("INDEFINITE!")
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'indefinite' });
            });
        } else {
            console.log(`FINITE: ${formData.get("finite")}!`)
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