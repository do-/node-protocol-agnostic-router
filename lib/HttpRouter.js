const http               = require ('http')
const Router             = require ('./Router.js')
const {Tracker}          = require ('events-to-winston')

class HttpRouter extends Router {

	constructor (o) {
	
		super (o)
	
		this.listenOptions = o.listen

		this.server = http.createServer (o.server || {})

			.on ('request', (_, response) => this.process (response))

	}

	get [Tracker.LOGGING_DETAILS] () {

		return {listen: this.listenOptions}

	}
	
	listen () {

		super.listen ()
	
		this.server.listen (this.listenOptions)
	
	}

	async close () {

		await new Promise ((ok, fail) => this.server.close (err => err ? fail (err) : ok ()))

		super.close ()
	
	}

}

module.exports = HttpRouter