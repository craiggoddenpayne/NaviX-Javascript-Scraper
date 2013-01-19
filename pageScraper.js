(function ($) {
    function pageScraper() { };
    pageScraper.prototype.scrapePage = function (url, callback) {
        ///<param name="url" type="string">Url to get html object from</param>
        ///<param name="callback">Callback, which returns one parameter, data or null if failure</param>
        var encodedUrl = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURI('select * from html where url="' + encodeURI(url) + '" and xpath="*"') + "&format=json";
        $.ajax({
            url: encodedUrl,
            dataType: 'jsonp',
            async: true,
            success: function (data) {
                callback(data.query.results);
            }
        });
        return null;
    };

    pageScraper.prototype.scrapePartialPage = function (url, xpath, callback) {
        ///<param name="url" type="string">Url to get html object from</param>
        ///<param name="xpath" type="string">XPath query to select nodes</param>
        ///<param name="callback">Callback, which returns one parameter, data or null if failure</param>
        var encodedUrl = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURI('select * from html where url="' + url + '" and xpath="' + encodeURI(xpath) + '"') + "&format=json";
        $.ajax({
            url: encodedUrl,
            dataType: 'jsonp',
            async: true,
            success: function (data) {
                callback(data.query.results);
            }
        });
        return null;
    };
    $.fn.scrapePage = pageScraper.prototype.scrapePage;
    $.fn.scrapePartialPage = pageScraper.prototype.scrapePartialPage;
})(jQuery);