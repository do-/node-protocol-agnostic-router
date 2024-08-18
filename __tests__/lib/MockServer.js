const http = require ('http')
const {HttpRouter} = require ('../..')

const {Writable} = require ('stream')
const winston = require ('winston')
const logger = winston.createLogger({
	transports: [
//	  new winston.transports.Console (),
	  new winston.transports.Stream ({stream: new Writable ({write(){}})})
	]
})

let port = 8010

module.exports = {

	getResponse: async function (o) {

		if (!o.listen) o.listen = {}
		if (!o.listen.host) o.listen.host = '127.0.0.1'
		if (!o.listen.port) o.listen.port = ++ port

		if (!o.requestOptions) o.requestOptions = {}
		if (o.requestOptions.body == null) o.requestOptions.body = ''

		const {listen, service, path, requestOptions} = o

		try {

			const __ = {}

			var r = new HttpRouter ({name: 'httpEndPoint', listen, logger})
			
			for (const s of Array.isArray (service) ? service : [service]) r.add (s)

			r.listen ()

			const [_, rp] = await Promise.all ([

				new Promise ((ok, fail) => {

					r.on ('data', ctx => {

						__.method = ctx.request.method
						__.searchParams = ctx.searchParams

						if (ctx.request.method === 'POST') {
							ctx.getBodyAsString ().then (body => ok (__.body = body), fail)
						}
						else {
							ok ()
						}

					})

				}),				

				new Promise (ok => {

					const rq = http.request (`http://${listen.host}:${listen.port}${path}`, requestOptions, ok)
	
					rq.end (requestOptions.body)
	
				})
	
			])			

			const a = []; for await (b of rp) a.push (b)

			rp.responseText = Buffer.concat (a).toString ()

			rp.__ = __

			return rp

		}
		catch (err) {

			console.log (err)

		}
		finally {

			r.close ()

		}

	}

}