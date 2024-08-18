![workflow](https://github.com/do-/node-protocol-agnostic-router/actions/workflows/main.yaml/badge.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)

This module features [`Router`](https://github.com/do-/node-protocol-agnostic-router/wiki/Router): an abstract synchronous message processor designed to be  a boilerplate for custom middleware frameworks.

Though it's accompanied with an [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) specific descendant, [`HttpRouter`](https://github.com/do-/node-protocol-agnostic-router/wiki/HttpRouter) together with [HttpStaticSite](https://github.com/do-/node-protocol-agnostic-router/wiki/HttpStaticSite) for serving static content from a directory, this is only a proof of concept, by no means supposed to compete with advanced HTTP servers.

Developers in need of a well known HTTP centric RESTful framework better consider using [express](https://github.com/expressjs/express) or like.

This, really `protocol-agnostic-router`, may be useful in complex applications where messages of different nature are better to be processed in some uniform way. 
