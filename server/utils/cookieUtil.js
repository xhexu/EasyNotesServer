var cookieUtil = {
    get: function(name) {
        var cookieName = encodeURIComponent(name) + "=";
        var cookieStart = document.cookie.indexOf(cookieName);

        var cookieValue = null;
        if (cookieStart > -1) {
            var cookieEnd = document.cookie.indexOf(';', cookieStart);
            if (cookieEnd > -1) {
                cookieValue = decodeURIComponent(document.cookie.substring(cookieEnd));
            } else {
                cookieValue = decodeURIComponent(document.cookie.substring(document.cookie.length))
            }
        }
    }
}