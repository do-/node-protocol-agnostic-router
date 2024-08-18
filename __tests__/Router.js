const {Writable} = require ('stream')
const winston = require ('winston')
const logger = winston.createLogger ({
	transports: [
//	  new winston.transports.Console (),
	  new winston.transports.Stream ({stream: new Writable ({write(){}})})
	]
})

const EventEmitter = require ('events')
const {Router} = require ('..')

class BotchedProcessor extends EventEmitter {

	constructor () {
		super ()
	}

	[Router.PROCESS_MESSAGE] () {
		this.emit ('error', new Error ('OK'))
	}

}

class BrokenProcessor extends EventEmitter {

	constructor () {
		super ()
	}

	[Router.PROCESS_MESSAGE] () {
		throw Error ('OK')
	}

}

test ('Router 1', () => {

	expect (() => new Router ()).toThrow ()
	expect (() => new Router (0)).toThrow ()
	expect (() => new Router ({})).toThrow ()
	expect (() => new Router ({name: 0})).toThrow ()
	expect (() => new Router ({name: ''})).toThrow ()
	expect (() => new Router ({name: '0'})).toThrow ()
	expect (() => new Router ({name: '0', logger: 0})).toThrow ()

})

test ('Not found', () => {

	const r = new Router ({name: 'Roo', logger})
		
	const m = {id: 1}, a = []

	r.on ('error', e => a.push (e))
	
	r.process (m)	

	expect (a).toHaveLength (1)
	expect (a [0].message).toMatch (/^No destination/)

})



test ('Router A', () => {

	const r = new Router ({name: 'Roo', logger})
	
	r.add ({[Router.PROCESS_MESSAGE]: m => m.label = '??', [Router.TEST_MESSAGE]: () => false})
	r.add ({[Router.PROCESS_MESSAGE]: m => m.label = '???'})
	
	let m = {id: 1}
	
	r.process (m)	
	
	expect (m).toStrictEqual ({id: 1, label: '???'})

})

test ('Router error', () => {

	const r = new Router ({name: 'Roo', logger})
	
	const p = new BotchedProcessor ()
	
	r.add (p)
	
	expect (p.listenerCount ('error')).toBe (0)
	
	r.listen ()
	
	expect (p.listenerCount ('error')).toBe (1)
	
	let msg
	
	r.on ('error', e => msg = e.message)
	
	r.process ({id: 1})

	expect (msg).toBe ('OK')

	r.add (p)
	r.add ({})
	r.listen ()

	r.close ()

})


test ('Router error 2', () => {

	const r = new Router ({name: 'Roo', logger})

	let msg

	const p = new BrokenProcessor ()

	r.add (p)
	r.add ({})

	r.on ('error', e => msg = e.message)

	r.process ({id: 1})	

	expect (msg).toBe ('OK')

})