const process   = require ('node:process')
const {SignalRouter} = require ('..')

const {Writable} = require ('stream')
const winston = require ('winston')
const logger = winston.createLogger({
	transports: [
	//   new winston.transports.Console (),
	  new winston.transports.Stream ({stream: new Writable ({write(){}})})
	]
})

const SIG = 'SIGTERM'

const send = s => process.emit (s, s)

test ('listen', async () => {

	let n = 0

	{

		const r1 = new SignalRouter ({
			logger,
			name: 'r1',
			handler: {
				signal: SIG,
				handler: _ => n ++
			}
		})

		expect (n).toBe (0)

		r1.listen ()

		expect (n).toBe (0)

		send (SIG)

		expect (n).toBe (1)

		send (SIG)

		expect (n).toBe (2)

		await r1.close ()

		expect (n).toBe (2)

	}

	{

		const r2 = new SignalRouter ({
			logger,
			name: 'r2',
			handler: {
				signal: SIG,
				handler: _ => n ++,
				once: true,
			}
		})

		expect (n).toBe (2)

		r2.listen ()

		expect (n).toBe (2)

		send (SIG)

		expect (n).toBe (3)

		send (SIG)

		expect (n).toBe (3)

		await r2.close ()

		expect (n).toBe (3)

	}

})