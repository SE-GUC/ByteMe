
var Merchandise = require('./merchandise.controller');

module.exports = function(router) {
    router.post('/create', Merchandise.createMerchandise);
    router.get('/get', Merchandise.getMerchandise);
    router.get('/get/:name', Merchandise.getMerchandiseByName);
    router.put('/update/:id', Merchandise.updateMerchandise);
    router.delete('/remove/:id', Merchandise.removeMerchandise);
}