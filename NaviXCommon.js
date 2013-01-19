function NaviXCommon() { };
NaviXCommon.prototype = {
    getIndicesOf: function (searchStr, str, caseSensitive) {
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
        return indices.sort(this.sortNumber);
    },
    sortNumber: function (a, b) {
        return a - b;
    }
};
