var jam = {
    "packages": [
        {
            "name": "async",
            "location": "jam/async",
            "main": "./lib/async"
        },
        {
            "name": "backbone",
            "location": "jam/backbone",
            "main": "backbone.js"
        },
        {
            "name": "backbone.subroute",
            "location": "jam/backbone.subroute",
            "main": "backbone.subroute.js"
        },
        {
            "name": "domReady",
            "location": "jam/domReady",
            "main": "domReady.js"
        },
        {
            "name": "handlebars",
            "location": "jam/handlebars",
            "main": "handlebars.js"
        },
        {
            "name": "hbt",
            "location": "jam/hbt",
            "main": "hbt.js"
        },
        {
            "name": "jquery",
            "location": "jam/jquery",
            "main": "jquery.js"
        },
        {
            "name": "radagast",
            "location": "jam/radagast",
            "main": "src/radagast.js"
        },
        {
            "name": "text",
            "location": "jam/text",
            "main": "text.js"
        },
        {
            "name": "underscore",
            "location": "jam/underscore",
            "main": "underscore.js"
        }
    ],
    "version": "0.2.11",
    "shim": {}
};

if (typeof require !== "undefined" && require.config) {
    require.config({packages: jam.packages, shim: jam.shim});
}
else {
    var require = {packages: jam.packages, shim: jam.shim};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}