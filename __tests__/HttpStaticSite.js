const Path = require ('path')
const {HttpStaticSite} = require ('..')
const {getResponse} = require ('./lib/MockServer.js')

async function getResponseFromStaticSite (path, o = {}) {
	const service = new HttpStaticSite ({root: Path.resolve ('__tests__/data')})
	return getResponse ({service, path, ...o})
}

test ('dir', async () => {

	const rp = await getResponseFromStaticSite ('/')
	
	expect (rp.statusCode).toBe (200)
	expect (rp.responseText).toBe ('It worked')

})

test ('200', async () => {

	const rp = await getResponseFromStaticSite ('/index.html')
	
	expect (rp.statusCode).toBe (200)
	expect (rp.headers ['content-type']).toBe ('text/html')
	expect (rp.responseText).toBe ('It worked')

})

test ('no-type', async () => {

	const rp = await getResponseFromStaticSite ('/README')
	expect (rp.headers ['content-type']).toBe ('application/octet-stream')
	expect (rp.statusCode).toBe (200)

})

test ('unknown-type', async () => {

	const rp = await getResponseFromStaticSite ('/README.not')
	expect (rp.headers ['content-type']).toBe ('application/octet-stream')
	expect (rp.statusCode).toBe (200)

})

test ('404', async () => {

	const rp = await getResponseFromStaticSite ('/index.htm?id=1', {requestOptions: {method: 'POST', body: '{}'}})
	expect (rp.statusCode).toBe (404)
	expect (rp.__).toStrictEqual ({
		method: 'POST',
		searchParams: {id: '1'},
		body: '{}',
	})

})