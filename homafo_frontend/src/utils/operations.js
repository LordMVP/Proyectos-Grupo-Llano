function count(array, key) {
    return array.reduce(function (r, a) {
        return r + a[key];
    }, 0);
}