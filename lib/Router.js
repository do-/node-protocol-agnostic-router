const EventEmitter    = require ('events')
const winston         = require ('winston')
const {Tracker}       = require ('events-to-winston')

const PROCESS_MESSAGE = Symbol ('process')
const TEST_MESSAGE    = Symbol ('process')

class Router extends EventEmitter {

	static PROCESS_MESSAGE = PROCESS_MESSAGE
	static TEST_MESSAGE    = TEST_MESSAGE

	constructor (o) {		

		if (o == null) throw Error ('Options not set')
		if (typeof o !== 'object') throw Error ('Options set must be an object')

		if (typeof o.name !== 'string') throw Error ('Router name must be a string')
		if (o.name === '') throw Error ('Router name must not be empty')

		if (o.logger == null) throw Error ('`logger` not set')
		if (!(o.logger instanceof winston.Logger)) throw Error ('the `logger` option must be a winston.Logger')

		super ()

		for (const k of ['name', 'logger']) this [k] = o [k]
	
		this.destinations = []

		this.tracker = new Tracker (this, this.logger)

		this.tracker.listen ()

		this.errorHandler = e => this.emit ('error', e)

	}

	get [Tracker.LOGGING_ID] () {

		return this.name

	}

	get [Tracker.LOGGING_EVENTS] () {

		return {

			start: {
				level: 'info',
				details: {},
			},

			data: {
				level: 'debug',
				details: o => o,
			},

			finish: {
				level: 'info',
			},

		}

	}
	
	add (destination) {
	
		this.destinations.push (destination)

		destination.router = this

		{

			const {LOGGING_PARENT} = Tracker

			delete destination [LOGGING_PARENT]

			destination [LOGGING_PARENT] = this

		}
		
		return this
	
	}

	process (message) {
	
		this.emit ('data', message)

		try {

			for (const destination of this.destinations) {

				if (TEST_MESSAGE in destination && !destination [TEST_MESSAGE] (message)) continue

				destination [PROCESS_MESSAGE] (message)

				return

			}

		}
		catch (x) {
		
			this.emit ('error', x)

			return
		
		}

		this.emit ('error', Error ('No destination accepted this message: ' + message))
	
	}
	
	listen () {

		this.emit ('start')
	
		for (const destination of this.destinations) 
		
			if (destination instanceof EventEmitter && destination.listenerCount ('error') === 0)

				destination.on ('error', this.errorHandler)

	}

	close () {

		this.emit ('finish')

		for (const destination of this.destinations)

			if (destination instanceof EventEmitter)

				destination.off ('error', this.errorHandler)

	}

}

module.exports = Router