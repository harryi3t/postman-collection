var expect = require('expect.js'),
    fixtures = require('../fixtures'),
    PropertyList = require('../../lib/index.js').PropertyList,
    Url = require('../../lib/index.js').Url,
    Request = require('../../lib/index.js').Request;

/* global describe, it */
describe('Request', function () {
    var rawRequest = fixtures.collectionV2.item[1].request,
        request = new Request(rawRequest);

    describe('isRequest', function () {
        it('must distinguish between requests and other objects', function () {
            var request = new Request(),
                nonRequest = {};

            expect(Request.isRequest(request)).to.be(true);
            expect(Request.isRequest(nonRequest)).to.be(false);
            expect(Request.isRequest()).to.be(false);
        });
    });

    describe('json representation', function () {
        it('must match what the request was initialized with', function () {
            var jsonified = request.toJSON();

            expect(jsonified.method).to.eql(rawRequest.method);
            expect(jsonified.url).to.eql(rawRequest.url);
            expect(jsonified.header).to.eql(rawRequest.header);
            expect(jsonified.body).to.eql(rawRequest.body);
            expect(jsonified.description).to.eql(rawRequest.description);
            expect(jsonified.proxy).to.eql(rawRequest.proxy);
        });
    });

    describe('addQueryParams', function () {
        it('should add query parameters to the request', function () {
            var testReq = request.clone(),
                addedParams = fixtures.queryParams;

            testReq.addQueryParams(addedParams);
            expect(testReq.url.query.count()).to.eql(2);
            testReq.url.query.each(function (param, index) {
                var expectedParam = addedParams[index];
                expect(param.key).to.eql(expectedParam.key);
                expect(param.value).to.eql(expectedParam.value);
            });
        });
    });

    describe('getHeaders', function () {
        it('should get only enabled headers', function () {
            var rawRequest = {
                    url: 'postman-echo.com',
                    method: 'GET',
                    header: [
                        {
                            key: 'some',
                            value: 'header'
                        },
                        {
                            key: 'other',
                            value: 'otherheader',
                            disabled: true
                        }
                    ]
                },
                request = new Request(rawRequest);
            expect(request.getHeaders({ enabled: true })).to.eql({
                some: 'header'
            });
        });

        it('should return an empty object for empty requests', function () {
            var request = new Request();
            expect(request.getHeaders()).to.eql({});
        });
    });

    describe('upsertHeader', function () {
        it('should add a header if it does not exist', function () {
            var rawRequest = {
                    url: 'postman-echo.com',
                    method: 'GET',
                    header: [
                        {
                            key: 'some',
                            value: 'header'
                        },
                        {
                            key: 'other',
                            value: 'otherheader',
                            disabled: true
                        }
                    ]
                },
                request = new Request(rawRequest);
            request.upsertHeader({ key: 'third', value: 'header' });
            expect(request.headers.all()).to.eql([
                {
                    key: 'some',
                    value: 'header'
                },
                {
                    key: 'other',
                    value: 'otherheader',
                    disabled: true
                },
                { key: 'third', value: 'header' }
            ]);
        });
        it('should replace the header value if it exists', function () {
            var rawRequest = {
                    url: 'postman-echo.com',
                    method: 'GET',
                    header: [
                        {
                            key: 'some',
                            value: 'header'
                        },
                        {
                            key: 'other',
                            value: 'otherheader',
                            disabled: true
                        }
                    ]
                },
                request = new Request(rawRequest);
            request.upsertHeader({ key: 'other', value: 'changedvalue' });
            expect(request.headers.all()).to.eql([
                {
                    key: 'some',
                    value: 'header'
                },
                {
                    key: 'other',
                    value: 'changedvalue',
                    disabled: true
                }
            ]);
        });
        it('should do nothing if no header is given', function () {
            var rawRequest = {
                    url: 'postman-echo.com',
                    method: 'GET',
                    header: [
                        {
                            key: 'some',
                            value: 'header'
                        },
                        {
                            key: 'other',
                            value: 'otherheader',
                            disabled: true
                        }
                    ]
                },
                request = new Request(rawRequest);
            request.upsertHeader();
            expect(request.headers.all()).to.eql([
                {
                    key: 'some',
                    value: 'header'
                },
                {
                    key: 'other',
                    value: 'otherheader',
                    disabled: true
                }
            ]);
        });
    });

    describe('removeQueryParams', function () {
        it('should remove query parameters from the request', function () {
            var testReq = request.clone(),
                firstParam = fixtures.queryParams[0],
                secondParam = fixtures.queryParams[1];

            // Add two params
            testReq.addQueryParams([firstParam, secondParam]);

            // Remove one
            testReq.removeQueryParams(firstParam.key);

            // Ensure only one is left
            expect(testReq.url.query.count()).to.eql(1);

            // Ensure that the remaining param is the one that was not removed.
            testReq.url.query.each(function (param) {
                // Ideally, only one param should be left, so this runs only once.
                expect(param.key).to.eql(secondParam.key);
                expect(param.value).to.eql(secondParam.value);
            });
        });
    });

    describe('empty requests', function () {

        it('should have a url', function () {
            var r = new Request();

            expect(r).to.have.property('url');
            expect(r.url).to.be.a(Url);
        });

        it('should have a method', function () {
            var r = new Request();

            expect(r).to.have.property('method');
            expect(r.method).to.be('GET');
        });

        it('should have an empty property-list of headers', function () {
            var r = new Request();

            expect(r).to.have.property('headers');
            expect(r.headers).to.be.a(PropertyList);
            expect(r.headers.count()).to.be(0);
        });
    });
});
