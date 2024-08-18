const {URL} = require ('url')
const {Readable} = require ('stream')

const CONTENT_TYPE = 'content-type'

class HttpRequestContext {

	constructor (request, response) {

		this.request = request

		this.response = response

	}

	get searchParams () {

		const {request} = this

		return Object.fromEntries ((new URL (request.url, `http://${request.headers.host}`)).searchParams)

	}

	async getBodyAsString () {
	
		const {request} = this
	
		let buffers = []; await new Promise ((ok, fail) => request
			.on ('error', fail)
			.on ('end', ok)
			.on ('data', buffer => buffers.push (buffer))
		)
		
		return (Buffer.concat (buffers)).toString ()
	
	}

	writeStream (os, o = {}) {

		const {response} = this; if (response.headersSent) return

		if (!response.hasHeader (CONTENT_TYPE)) response.setHeader (CONTENT_TYPE, o.type || 'application/octet-stream')

		response.writeHead (o.code || 200)

		os.pipe (response)

	}
	
	writeBuffer (b, o = {}) {
	
		this.response.setHeader ('content-length', b.length)

		this.writeStream (Readable.from (b), o)

	}
	
	writeString (s, o = {}) {
	
		if (!o.encoding) o.encoding = 'utf-8'

		if (!o.type) o.type = 'text/plain'
		
		o.type += '; charset=' + o.encoding

		this.writeBuffer (Buffer.from (s, o.encoding), o)

	}

}

module.exports = HttpRequestContext