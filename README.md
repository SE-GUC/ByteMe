# ByteMe

## An AWG Platform implementation for the GUC and a portal for GUCMUN

- Live Deployment : www.gucmun.me
- Discord Invite : https://discord.gg/CxA6WQ
- To run React app : `cd client` => `npm run start`
- To run Node.js server : `cd server` => `npm run start`
- To run Node.js server Jest tests : `cd server` => `npm run test`
- To run prettify on Node.js server files : `cd server` => `npm run prettify`
- To run prettify on react app files : `cd client` => `npm run prettify`

## Development To-Do List

###### Please add/edit this list as you see fit.

- Replace the reset password link emailed with a web page that uses the token provided to graphically reset the password.
- I've set up a base page in app.js in client, I still haven't figured out if we can somehow make this a base for all pages instead of copying the navbar code in it or how that'll work out.
- We're using [react-bootstrap](https://react-bootstrap.github.io/)
components, I've already implemented it you can import components you want to use and follow the [react-bootstrap component documentation](https://react-bootstrap.github.io/components/alerts/)
- Merchandise page image sizes need to be consistent, margins need to be implemented between products, a nicer UI maybe better title, a motto and a frame around the component.
- Merchandise cart can be implemented later.
