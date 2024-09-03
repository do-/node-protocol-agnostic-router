![workflow](https://github.com/do-/node-protocol-agnostic-router/actions/workflows/main.yml/badge.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)

This module features [`Router`](https://github.com/do-/node-protocol-agnostic-router/wiki/Router): an abstract boilerplate synchronous message processor for custom middleware applications.

Although it's accompanied with an [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) specific descendant, [`HttpRouter`](https://github.com/do-/node-protocol-agnostic-router/wiki/HttpRouter) (see [test code](https://github.com/do-/node-protocol-agnostic-router/blob/8ff912fee72f3805f34997798a40464789dcf4c3/__tests__/HttpStaticSite.js#L8) for a working example), this is only a proof of concept, by no means supposed to compete with advanced HTTP servers. Developers in need of a well known HTTP centric RESTful framework better consider using [express](https://github.com/expressjs/express) or like.

This, really `protocol-agnostic-router`, may be useful in complex applications where messages of different nature are better to be processed in some uniform way. 
