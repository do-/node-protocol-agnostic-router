const process   = require ('node:process')

const  Router   = require ('./Router.js')
const {Tracker} = require ('events-to-winston')

const NOP = () => {}

module.exports = class SignalRouter extends Router {

	constructor (o) {
        
		super (o)

		this.handlers = (o.handlers ?? [o.handler]).map (

			({signals, signal, handler, once}) => ({signals: signals ?? [signal], handler, once})

		)

		for (const {signals, handler} of this.handlers) this.add ({

			[Router.TEST_MESSAGE]:    _ => signals.includes (_),

			[Router.PROCESS_MESSAGE]: _ => handler (_),

		})

    }

    listen () {

        super.listen ()

		const handler = _ => this.process (_)	

		for (const {signals, once} of this.handlers)
			
			for (const signal of signals)

				once ? process.once (signal, handler) : process.on (signal, handler)

    }

    close () {

		for (const {signals} of this.handlers) for (const signal of signals) {

			process.removeAllListeners (signal)

			process.on (signal, NOP)

		}

        super.close ()

    }

	get [Tracker.LOGGING_EVENTS] () {

		return {

			start: {
				level: 'info',
				details: {},
			},

			data: {
				level: 'info',
				details: o => o,
			},

			finish: {
				level: 'info',
			},

		}

	}    

}