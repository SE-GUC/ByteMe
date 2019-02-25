# ByteMe
Alright so I've went ahead and set up an API for mongo, connected to our cloud Atlas server and finished up CRUD operations and schema for merchandise (For now I'm keeping the image as a string entry till we have developed an API for uploading pictures we can handle the outcome of that, I think you could do the same for now).

If you want to just get things done check the next 2 sections, If you want to understand check the last section.

# Mimicing Merchandise into other entities
Ok so first things first, take a look at the structure you'll see we have an `api` folder with `merchandise` inside of it.
create a folder for your own entity inside of it in the same structure, make inside of that 4 js files simillair to the ones in merchandise, I even suggest TAKING A CUP OF COFFEE (So you don't forget to change anything) and just copying the 4 files into your entity, renaming them, and just changing every "merchandise" into "yourentityname", bearing in mind capitalizations etc.


#Setting up routes
open up the `server.js` file, on line 8 you can see I have:
`var merchandiseRoutes = require('./api/merchandise/merchandise.routes');`
, mimic it for your entity, for example:
`var donkeyRoutes = require('./api/donkey/donkey.routes');`

Then, Mimic lines 38 and 41 (also in `server.js):
Instead of: 

`app.use('/merchandise',router);`

`merchandiseRoutes(router);`

, mimic it into:

`app.use('/donkey',router);`

`donkeyRoutes(router);`




# Testing endpoints
Get Postman or Insomnia from google, I'm personally used to Insomnia but both are as good.

DONT FORGET TO RUN YOUR SERVER FOR YOUR ENDPOINTS TO WORK, TO DO SO IN TERMINAL TYPE
`node server.js`

If you get module not found errors run this first
`npm install`

1-Creating Entries

![Creating Entry endpoint](https://i.ibb.co/rswt20Z/Screenshot-7.png)

2-Retrieving all entries

![Retrieving all entries](https://i.ibb.co/rtkgT3z/Screenshot-8.png)

3-Searching for specific entry

![Searching for specific entry](https://i.ibb.co/6cMDh6x/Screenshot-9.png)

4- Delete an Entry

![Delete Entry endpoint](https://i.ibb.co/rGx3nLb/Screenshot-10.png)

5-Update an Entry

![Update an Entry](https://i.ibb.co/rk8T4LB/Screenshot-11.png)





# How everything is actually working
If you want to understand the actual procedure and what's happening, here's the tutorial I followed to get this setup: 
https://medium.com/@vsvaibhav2016/create-crud-application-in-express-js-9b88a5a94299

`DO NOT FOLLOW THIS TUTORIAL AND INSTEAD COPY MY FILES, THERE WERE FAULTS IN THE CODE IN THE TUTORIAL, IM JUST LEAVING IT IF YOU WANT TO UNDERSTAND HOW EVERYTHING IS WORKING`

If there's something you can't wrap your head around hit me up i'd be more than happy to help.

If something doesn't work its very probably I missed something or forget to mention it in this sum-up, I apologize and let me know if googling doesn't really help.
