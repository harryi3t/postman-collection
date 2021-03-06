var expect = require('expect.js'),
    fixtures = require('../fixtures'),
    Cookie = require('../../lib/index.js').Cookie;

/* global describe, it */
describe('Cookie', function () {
    describe('json representation', function () {
        it('must match what it was initialized with', function () {
            var rawCookie = fixtures.collectionV2.item[0].response[0].cookie[0],
                cookie = new Cookie(rawCookie),
                jsonified = cookie.toJSON();
            expect(jsonified.domain).to.eql(rawCookie.domain);
            expect(jsonified.httpOnly).to.eql(rawCookie.httpOnly);
            expect(jsonified.hostOnly).to.eql(rawCookie.hostOnly);
            expect(jsonified.name).to.eql(rawCookie.key);
            expect(jsonified.path).to.eql(rawCookie.path);
            expect(jsonified.expires).to.eql(rawCookie.expires.toString());
            expect(jsonified.secure).to.eql(rawCookie.secure);
            expect(jsonified.session).to.eql(rawCookie.session);
            expect(jsonified.value).to.eql(rawCookie.value);
        });
    });

    describe('parsing', function () {
        var rawCookie = fixtures.rawCookie;
        it('should be parsed properly', function () {
            var parsed = Cookie.parse(rawCookie),
                ext;
            expect(parsed).to.have.property('key', 'GAPS');
            expect(parsed).to.have.property('value', 'lol');
            expect(parsed).to.have.property('expires', 'Sun, 04-Feb-2018 14:18:27 GMT');
            expect(parsed.secure).to.be(true);
            expect(parsed.httpOnly).to.be(true);
            expect(parsed.extensions).to.be.an(Array);
            expect(parsed.extensions.length).to.be(1);

            ext = parsed.extensions[0];
            expect(ext.key).to.be('Priority');
            expect(ext.value).to.be('HIGH');
        });
    });

    describe('isCookie', function () {
        var rawCookie = {
            domain: '.httpbin.org',
            expires: 1502442248,
            hostOnly: false,
            httpOnly: false,
            key: '_ga',
            path: '/',
            secure: false,
            session: false,
            _postman_storeId: '0',
            value: 'GA1.2.113558537.1435817423'
        };

        it('should return true for a cookie instance', function () {
            expect(Cookie.isCookie(new Cookie(rawCookie))).to.be(true);
        });

        it('should return false for a raw cookie object', function () {
            expect(Cookie.isCookie(rawCookie)).to.be(false);
        });

        it('should return false when called without arguments', function () {
            expect(Cookie.isCookie()).to.be(false);
        });
    });

    describe('value', function () {
        it('should be returned by valueOf function', function () {
            expect((new Cookie({
                name: 'blah',
                value: 'this is a cookie value'
            })).valueOf()).to.eql('this is a cookie value');
        });
    });
});
