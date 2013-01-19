function NaviXParser() { };
NaviXParser.prototype.NaviX = function (naviXUrl, backUrl) {

    $().scrapePage(naviXUrl, function (data) {
        var splx = data.html.body.p;
        var plx = Plx.prototype.Parse(splx);

        var html = "";
        //create html variant of playlist
        for (var i = 0; i < plx.length; i++) {
            if (plx[i].Type == "window" || plx[i].Type == "directory") continue;

            //Thumb Exists, does not start with default and contains http
            if (plx[i].Thumb && plx[i].Thumb[0] != "d" && plx[i].Thumb.contains("http")) {
                html += '<img src="' + plx[i].Thumb + '" width="32" height="32" />';
            }
            if (plx[i].Url) {
                html += '<a href="javascript:NaviXParser.prototype.NaviX(\'' + plx[i].Url + '\', \''+ naviXUrl + '\')">' + plx[i].Name + '</a><br/>';
            } else {
                html += plx[i].Name + "<br/>";
            }
        }
        
        if(backUrl)
            html += '<a href="javascript:NaviXParser.prototype.NaviX(\'' + backUrl + '\')">BACK</a><br/>';
        $("#NaviX").html(html);
    });
};


function Plx() { };
Plx.prototype = {
    Value: null,
    Parse: function (data) {

        var indexes = getIndicesOf("type=", data, false);
        var sections = [];
        for (var i = 0; i < indexes.length; i++) {
            if (indexes[i + 1] != null) {
                sections[i] = data.substr(indexes[i], indexes[i + 1] - indexes[i]);
            } else { //Get the last index of
                sections[i] = data.substr(indexes[i]);
            }
        }

        var plxHeaders = [];
        for (var i = 0; i < sections.length; i++) {
            var headerLocations = [];

            $(["type=", "name=", "icon=", "description=", "thumb=", "date=", "view=", "url=", "player=", "rating=", "version="])
                .each(function (aindex, header) {
                    $(getIndicesOf(header, sections[i], false)).each(function (bindex, indecie) {
                        headerLocations.push(indecie);
                    });
                });

            plxHeaders[i] = headerLocations;
        }

        var plxPart = [];
        for (var a = 0; a < plxHeaders.length; a++) {
            plxPart[a] = [];
            for (var b = 0; b < plxHeaders[a].length; b++) {
                if (plxHeaders[a][b + 1] != null) {
                    plxPart[a][b] = sections[a].substr(plxHeaders[a][b], plxHeaders[a][b + 1] - plxHeaders[a][b]);
                } else { //Get the last index of
                    plxPart[a][b] = sections[a].substr(plxHeaders[a][b]).trim();
                }
            }
        }

        var playlists = [];
        for (var i = 0; i < plxPart.length; i++) {
            playlists[i] = new Playlist();
            for (var a = 0; a < plxPart[i].length; a++) {
                var line = plxPart[i][a].toLowerCase().trim();
                if (line[0] != "#") {
                    var seperator = line.indexOf("=");
                    var type = line.substr(0, seperator);
                    if (!type)
                        continue;
                    type = (type[0].toUpperCase() + type.substr(1, type.length));
                    playlists[i][type] = plxPart[i][a].substr(type.length+1, plxPart[i][a].length - type.length).trim();
                }
            }
        }

        return playlists;
    },
};

function Playlist() { }
Playlist.prototype.Name = null;
Playlist.prototype.Type = null;
Playlist.prototype.Description = null;
Playlist.prototype.Thumb = null;
Playlist.prototype.Date = null;
Playlist.prototype.Url = null;
Playlist.prototype.Icon = null;
Playlist.prototype.Rating = null;
Playlist.prototype.Player = null;
Playlist.prototype.Version = null;


function getIndicesOf(searchStr, str, caseSensitive) {
    var startIndex = 0, searchStrLen = searchStr.length;
    var index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices.sort(sortNumber);
}

function sortNumber(a, b) {
    return a - b;
}