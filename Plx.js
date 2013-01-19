function Plx() {
    Plx.prototype.common = new NaviXCommon();
};
Plx.prototype.Value = null;
Plx.prototype.Parse = function (data) {
    var sections = this._getSectionsByType(data);
    var plxHeaders = this._getSectionHeaders(sections);
    var plxParts = this._getPlxPartBySectionForHeaders(sections, plxHeaders);
    var playlist = this._convertPlxPartsToPlaylist(plxParts);
    this.Value = playlist;
    return playlist;
};

Plx.prototype._getSectionsByType = function (data) {
    var indexes = this.common.getIndicesOf("type=", data, false);
    var sections = [];
    for (var i = 0; i < indexes.length; i++) {
        if (indexes[i + 1] != null) {
            sections[i] = data.substr(indexes[i], indexes[i + 1] - indexes[i]);
        } else { //Get the last index of
            sections[i] = data.substr(indexes[i]);
        }
    }
    return sections;
};

Plx.prototype._getSectionHeaders = function (sections) {
    var plxHeaders = [];
    for (var i = 0; i < sections.length; i++) {
        var headerLocations = [];

        var heads = ["type", "name", "icon", "description",
            "thumb", "date", "view", "url", "player",
            "rating", "version", "background", "processor"];

        for (var f = 0; f < heads.length; f++) {
            var indicies = this.common.getIndicesOf(heads[f] + "=", sections[i], false);
            var indiciesRem = this.common.getIndicesOf("#" + heads[f] + "=", sections[i], false);
            $(indicies).each(function(bindex, indecie) {
                headerLocations.push(indecie);
            });
            $(indiciesRem).each(function(bindex, indecie) {
                headerLocations.push(indecie);
            });
            headerLocations.sort(this.common.sortNumber);
        }
        plxHeaders[i] = headerLocations;
    }
    return plxHeaders;
};

Plx.prototype._getPlxPartBySectionForHeaders = function(sections, plxHeaders) {
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
    return plxPart;
};

Plx.prototype._convertPlxPartsToPlaylist = function (plxPart) {
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

                if (type == "url") { //urls cannot contain spaces
                    var link = plxPart[i][a].substr(type.length + 1, plxPart[i][a].length - type.length).trim();
                    link = link.substr(0, link.indexOf(" "));
                    playlists[i][type] = link;
                } else {
                    playlists[i][type] = plxPart[i][a].substr(type.length + 1, plxPart[i][a].length - type.length).trim();
                }
            }
        }
    }
    return playlists;
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
Playlist.prototype.Background = null;
Playlist.prototype.Processor = null;