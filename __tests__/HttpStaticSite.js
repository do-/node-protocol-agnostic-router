const Path = require ('path')
const {Router} = require ('..')
const {HttpStaticSite} = require ('http-server-tools')
const {getResponse} = require ('./lib/MockServer.js')

async function getResponseFromStaticSite (path, o = {}) {

	const service = new HttpStaticSite ({root: Path.resolve ('__tests__/data')})

	service [Router.PROCESS_MESSAGE] = response => {
		service.handle (response).then (_ => _, _ => console.log (_))
	}

	return getResponse ({service, path, ...o})

}

test ('200', async () => {

	const rp = await getResponseFromStaticSite ('/index.html')
	
	expect (rp.statusCode).toBe (200)
	expect (rp.headers ['content-type']).toBe ('text/html')
	expect (rp.responseText).toBe ('It worked')

})