function base64encode(a) {
    var b, c, d, e, f, g;
    for (d = a.length, c = 0, b = ""; d > c;) {
        if (e = 255 & a.charCodeAt(c++), c == d) {
            b += base64EncodeChars.charAt(e >> 2), b += base64EncodeChars.charAt((3 & e) << 4), b += "==";
            break
        }
        if (f = a.charCodeAt(c++), c == d) {
            b += base64EncodeChars.charAt(e >> 2), b += base64EncodeChars.charAt((3 & e) << 4 | (240 & f) >> 4), b += base64EncodeChars.charAt((15 & f) << 2), b += "=";
            break
        }
        g = a.charCodeAt(c++), b += base64EncodeChars.charAt(e >> 2), b += base64EncodeChars.charAt((3 & e) << 4 | (240 & f) >> 4), b += base64EncodeChars.charAt((15 & f) << 2 | (192 & g) >> 6), b += base64EncodeChars.charAt(63 & g)
    }
    return b
}
function base64decode(a) {
    var b, c, d, e, f, g, h;
    for (g = a.length, f = 0, h = ""; g > f;) {
        do b = base64DecodeChars[255 & a.charCodeAt(f++)];
        while (g > f && -1 == b);
        if (-1 == b) break;
        do c = base64DecodeChars[255 & a.charCodeAt(f++)];
        while (g > f && -1 == c);
        if (-1 == c) break;
        h += String.fromCharCode(b << 2 | (48 & c) >> 4);
        do {
            if (d = 255 & a.charCodeAt(f++), 61 == d) return h;
            d = base64DecodeChars[d]
        } while (g > f && -1 == d);
        if (-1 == d) break;
        h += String.fromCharCode((15 & c) << 4 | (60 & d) >> 2);
        do {
            if (e = 255 & a.charCodeAt(f++), 61 == e) return h;
            e = base64DecodeChars[e]
        } while (g > f && -1 == e);
        if (-1 == e) break;
        h += String.fromCharCode((3 & d) << 6 | e)
    }
    return h
}
function utf16to8(a) {
    var b, c, d, e;
    for (b = "", d = a.length, c = 0; d > c; c++) e = a.charCodeAt(c), e >= 1 && 127 >= e ? b += a.charAt(c) : e > 2047 ? (b += String.fromCharCode(224 | e >> 12 & 15), b += String.fromCharCode(128 | e >> 6 & 63), b += String.fromCharCode(128 | e >> 0 & 63)) : (b += String.fromCharCode(192 | e >> 6 & 31), b += String.fromCharCode(128 | e >> 0 & 63));
    return b
}
function utf8to16(a) {
    var b, c, d, e, f, g;
    for (b = "", d = a.length, c = 0; d > c;) switch (e = a.charCodeAt(c++), e >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            b += a.charAt(c - 1);
            break;
        case 12:
        case 13:
            f = a.charCodeAt(c++), b += String.fromCharCode((31 & e) << 6 | 63 & f);
            break;
        case 14:
            f = a.charCodeAt(c++), g = a.charCodeAt(c++), b += String.fromCharCode((15 & e) << 12 | (63 & f) << 6 | (63 & g) << 0)
    }
    return b
}
function ThunderEncode(a) {
    var b = "AA",
        c = "ZZ",
        d = "thunder://",
        e = d + base64encode(utf16to8(b + a + c));
    return e
}
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
