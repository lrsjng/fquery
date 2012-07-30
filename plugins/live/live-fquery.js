/*
  Live.js - One script closer to Designing in the Browser
  Written for Handcraft.com by Martin Kool (@mrtnkl).

  Version 4.
  Recent change: Made stylesheet and mimetype checks case insensitive.

  http://livejs.com
  http://livejs.com/license (MIT)
  @livejs

  Include live.js#css to monitor css changes only.
  Include live.js#js to monitor js changes only.
  Include live.js#html to monitor html changes only.
  Mix and match to monitor a preferred combination such as live.js#html,css

  By default, just include live.js to monitor all css, js and html changes.

  Live.js can also be loaded as a bookmarklet. It is best to only use it for CSS then,
  as a page reload due to a change in html or css would not re-include the bookmarklet.
  To monitor CSS and be notified that it has loaded, include it as: live.js#css,notify
*/

/*
 * This is a modified version of the original code; modified for the use with fQuery.
 * The # feature described above is removed.
 */

(function (doc, win, hint) {

    var resources = {},
        pendingRequests = {},
        currentLinkElements = {},
        oldLinkElements = {},
        interval = 1000,
        loaded = false,
        location = doc.location,
        lastUpdateDate = new Date(),


        // format a date to 'hh:mm:ss'
        formatDate = function(date) {

            var hours = date.getHours(),
                mins = date.getMinutes(),
                secs = date.getSeconds(),
                str;

            str = (hours < 10 ? "0" : "") + hours;
            str += ":" + (mins < 10 ? "0" : "") + mins;
            str += ":" + (secs < 10 ? "0" : "") + secs;
            return str;
        },

        // format an amount of milliseconds to 'hh:mm:ss'
        formatMillis = function(millis) {

            var hours, mins, secs, str;

            hours = Math.floor(millis / 3600000);
            millis = millis - hours * 3600000;
            mins = Math.floor(millis / 60000);
            millis = millis - mins * 60000;
            secs = Math.floor(millis / 1000);
            millis = millis - secs * 1000;

            str = (hours < 10 ? "0" : "") + hours;
            str += ":" + (mins < 10 ? "0" : "") + mins;
            str += ":" + (secs < 10 ? "0" : "") + secs;
            return str;
        },

        // add a timestamp to the document title
        updateTitle = function(message) {

            if (!message) {
                if (hint === "countUp") {
                    message = formatMillis(new Date().getTime() - lastUpdateDate.getTime());
                } else if (hint === "updated") {
                    message = formatDate(lastUpdateDate);
                }
            }

            if (message) {
                doc.title = "[" + message + "] " + doc.title.replace(/^\[.*?\]\s*/, "");
            }
        },

        // helper method to assert if a given url is local
        reIsLocal = new RegExp("^\\.|^\/(?!\/)|^[\\w]((?!://).)*$|" + location.protocol + "//" + location.host),
        isLocal = function(url) {

            return url.match(reIsLocal) !== null;
        },

        // performs a HEAD request and passes the header info to the given callback
        headers = { "Etag": 1, "Last-Modified": 1, "Content-Length": 1, "Content-Type": 1 },
        getHead = function (url, callback) {

            var xhr;

            pendingRequests[url] = true;
            xhr = win.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XmlHttp");
            xhr.open("HEAD", url, true);
            xhr.onreadystatechange = function () {

                var info = {},
                    h, value;

                delete pendingRequests[url];
                if (xhr.readyState === 4 && xhr.status !== 304) {
                    xhr.getAllResponseHeaders();
                    for (h in headers) {
                        value = xhr.getResponseHeader(h);
                        // adjust the simple Etag variant to match on its significant part
                        if (h === "Etag" && value) {
                            value = value.replace(/^W\//, '');
                        } else if (h === "Content-Type" && value) {
                            value = value.replace(/^(.*?);.*$/, "$1");
                        }
                        info[h] = value;
                    }
                    callback(url, info);
                }
            };
            xhr.send();
        },

        // removes the old stylesheet rules only once the new one has finished loading
        removeOldLinkElements = function () {

            var pending = 0,
                url, link, oldLink, html, sheet, rules;

            for (url in oldLinkElements) {
                // if this sheet has any cssRules, delete the old link
                try {
                    link = currentLinkElements[url];
                    oldLink = oldLinkElements[url];
                    html = doc.body.parentNode;
                    sheet = link.sheet || link.styleSheet;
                    rules = sheet.rules || sheet.cssRules;

                    if (rules.length >= 0) {
                        oldLink.parentNode.removeChild(oldLink);
                        delete oldLinkElements[url];
                        setTimeout(function () {
                            html.className = html.className.replace(/\s*livejs\-loading/gi, '');
                        }, 100);
                    }
                } catch (e) {
                    pending += 1;
                }
                if (pending) {
                    setTimeout(removeOldLinkElements, 50);
                }
            }
        },

        // loads all local css and js resources upon first activation
        loadResources = function () {

            // gather all resources
            var scripts = doc.getElementsByTagName("script"),
                links = doc.getElementsByTagName("link"),
                uris = [],
                i,
                script, src,
                type, link, rel, href,
                url,
                head, style, rule, css;

            // track local js urls
            for (i = 0; i < scripts.length; i += 1) {
                script = scripts[i];
                src = script.getAttribute("src");
                if (src && isLocal(src)) {
                    uris.push(src);
                }
            }
            uris.push(location.href);

            // track local css urls
            for (i = 0; i < links.length; i += 1) {
                link = links[i];
                rel = link.getAttribute("rel");
                href = link.getAttribute("href", 2);
                if (href && rel && rel.match(/stylesheet/i) && isLocal(href)) {
                    uris.push(href);
                    currentLinkElements[href] = link;
                }
            }

            // initialize the resources info
            for (i = 0; i < uris.length; i += 1) {
                url = uris[i];
                getHead(url, function (url, info) {
                    resources[url] = info;
                });
            }

            // add rule for morphing between old and new css files
            head = doc.getElementsByTagName("head")[0];
            style = doc.createElement("style");
            rule = "transition: all .3s ease-out;";
            css = ".livejs-loading * { " + rule + " -webkit-" + rule + " -moz-" + rule + " -o-" + rule + " }";
            style.setAttribute("type", "text/css");
            head.appendChild(style);
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(doc.createTextNode(css));
            }

            // yep
            loaded = true;
        },

        // act upon a changed url of certain content type
        refreshResource = function (url, type) {

            if (!type) {
                location.reload();
                return;
            }

            type = type.toLowerCase();

            if (type === "text/css") {

                var link = currentLinkElements[url],
                    html = doc.body.parentNode,
                    head = link.parentNode,
                    next = link.nextSibling,
                    newLink = doc.createElement("link");

                lastUpdateDate = new Date();

                html.className = html.className.replace(/\s*livejs\-loading/gi, '') + ' livejs-loading';
                newLink.setAttribute("type", "text/css");
                newLink.setAttribute("rel", "stylesheet");
                newLink.setAttribute("href", url + "?now=" + new Date() * 1);
                if (next) {
                    head.insertBefore(newLink, next);
                } else {
                    head.appendChild(newLink);
                }
                currentLinkElements[url] = newLink;
                oldLinkElements[url] = link;

                // schedule removal of the old link
                removeOldLinkElements();

            } else if (type === "text/html" && url === location.href) {

                location.reload();

            } else if (type.match(/javascript$/)) {

                location.reload();
            }
        },

        // check all tracking resources for changes
        checkForChanges = function () {

            var url;

            for (url in resources) {
                if (pendingRequests[url]) {
                    continue;
                }

                getHead(url, function (url, newInfo) {

                    var oldInfo, header, oldValue, newValue;

                    oldInfo = resources[url];
                    resources[url] = newInfo;

                    for (header in oldInfo) {

                        // do verification based on the header type
                        oldValue = oldInfo[header];
                        newValue = newInfo[header];

                        if (header.toLowerCase() !== "etag" || newValue) {
                            // if changed, act
                            if (oldValue !== newValue) {
                                refreshResource(url, newInfo["Content-Type"]);
                                break;
                            }
                        }
                    }
                });
            }
        },

        // performs a cycle per interval
        heartbeat = function () {

            if (doc.body) {
                // make sure all resources are loaded on first activation
                if (!loaded) {
                    loadResources();
                }
                checkForChanges();
                updateTitle();
            }
            setTimeout(heartbeat, interval);
        };

    // start listening
    if (!win.LIVE_JS_LOADED && location.protocol !== "file:") {
        win.LIVE_JS_LOADED = true;
        updateTitle();
        heartbeat();
    } else {
        updateTitle("NOT LIVE");
        if (win.console) {
            win.console.log("Live.js doesn't support the file protocol. It needs http.");
        }
    }

}(document, window, LIVE_HINT));
