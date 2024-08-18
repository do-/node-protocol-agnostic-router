const http               = require ('http')
const Router             = require ('./Router.js')
const HttpRequestContext = require ('./HttpRequestContext.js')
const {Tracker}          = require ('events-to-winston')

class HttpRouter extends Router {

	constructor (o) {
	
		super (o)
	
		this.listenOptions = o.listen

		this.server = http.createServer (o.server || {})

			.on ('request', (request, response) => this.process (new HttpRequestContext (request, response)))

	}

	get [Tracker.LOGGING_DETAILS] () {

		return {listen: this.listenOptions}

	}
	
	listen () {

		super.listen ()
	
		this.server.listen (this.listenOptions)
	
	}

	async close () {

		this.server.close ()

		super.close ()
	
	}

}

module.exports = HttpRouter