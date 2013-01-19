function NaviXParser() {
    NaviXParser.prototype.common = new NaviXCommon();
};
NaviXParser.prototype.NaviX = function (naviXUrl, backUrl) {
    var naviX = this;
    $().scrapePage(naviXUrl, function (data) {
        var splx = data.html.body.p;
        var plx = new Plx();
        plx.Parse(splx);
        naviX.WriteViewTo($("#NaviX"), plx.Value, naviXUrl, backUrl);
    });
};
NaviXParser.prototype.WriteViewTo = function(div, plx, naviXUrl, backUrl) {
    var html = "";
    //create html variant of playlist
    for (var i = 0; i < plx.length; i++) {
        if (plx[i].Background) {
            $("NaviX").style("background-url", plx[i].Background);
        }

        if (plx[i].Type == "window" || plx[i].Type == "directory") continue;

        //Thumb Exists, does not start with default and contains http
        if (plx[i].Thumb && plx[i].Thumb.indexOf("default") != 0 && plx[i].Thumb.contains("http")) {
            html += '<img src="' + plx[i].Thumb + '" width="32" height="32" />';
        }
        if (plx[i].Url && plx[i].Url.indexOf("http") == 0) {
            if (plx[i].Type == "video") {
                html += '<a href="' + plx[i].Url + '" target="_blank">' + plx[i].Name + '</a><br/>';
            } else {
                html += '<a href="javascript:NaviXParser.prototype.NaviX(\'' + plx[i].Url + '\', \'' + naviXUrl + '\')">' + plx[i].Name + '</a><br/>';
            }
        } else {
            html += plx[i].Name + "<br/>";
        }
    }

    if (backUrl)
        html += '<a href="javascript:NaviXParser.prototype.NaviX(\'' + backUrl + '\')">BACK</a><br/>';
    div.html(html);
    location.hash = new Date().getMilliseconds();
};


