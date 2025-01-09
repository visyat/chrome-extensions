(function () {
    var bannedSites = ['www.linkedin.com', 'www.instagram.com', 'www.tiktok.com']
    function redirect() {
        bannedSites.forEach((site) => {
            if ((location.hostname+location.pathname).includes(site)) {
                window.location.href="https://www.google.com";
            }
        });
    }
    redirect();
    // setInterval(redirect, 250);
    document.addEventListener('visibilitychange', redirect);
    window.addEventListener('focus', redirect);
    window.addEventListener('popstate', redirect);
})();