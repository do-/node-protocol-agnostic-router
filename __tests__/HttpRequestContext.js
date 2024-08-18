const {HttpRequestContext} = require ('..')

test ('headersSent', () => {

	const ctx = new HttpRequestContext ({}, {headersSent: true, setHeader: _ => _})

	ctx.writeBuffer (Buffer.from ([]))
	ctx.writeString ('')
	ctx.writeString ('', {encoding: 'latin1', type: 'text/html'})

})