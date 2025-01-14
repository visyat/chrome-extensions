(function () {
    var bannedSites = ['www.linkedin.com', 'www.instagram.com', 'www.tiktok.com']
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        // on load, popup requests list of banned sites ... 
        if (request.action === 'load') {
            sendResponse({ message: bannedSites });
        // popup sends request to add or delete banned site entry ...
        } else if (request.action === 'add') {
            const url = request.message;
            bannedSites.push(url);
            sendResponse({ message: `${url} added to the list of banned sites!` });
        } else if (request.action === 'delete') {
            const url = request.message;
            bannedSites.splice(bannedSites.indexOf(url), 1)
            sendResponse({ message: `${url} removed from the list of banned sites!` });
        }
    });

    function redirect() {
        bannedSites.forEach((site) => {
            if ((location.hostname+location.pathname).includes(site)) {
                window.location.href="https://www.google.com";
            }
        });
    }
    redirect();
    setInterval(redirect, 1000);
})();