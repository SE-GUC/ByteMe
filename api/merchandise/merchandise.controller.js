var Merchandise = require('./merchandise.dao');

exports.createMerchandise = function (req, res, next) {
    var merchandise = {
        name: req.body.name,
        price: req.body.price,
        img : req.body.img,
    };

    Merchandise.create(merchandise, function(err, merchandise) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "Merchandise created successfully"
        })
    })
}

exports.getMerchandise = function(req, res, next) {
    
    Merchandise.get({}, function(err, merchandise) {
        if(err) {
            res.json({
                error: err
            })
        }
        res.json({
            merchandise: merchandise
        })
    })
}

exports.getMerchandiseByName = function(req, res, next) {
    Merchandise.getByName({name: req.params.name}, function(err, merchandise) {
        if(err) {
            res.json({
                error: err
            })
        }
        res.json({
            merchandise: merchandise
        })
    })
}

exports.updateMerchandise = function(req, res, next) {
    var merchandise = {
        name: req.body.name,
        price: req.body.price,
        img : req.body.img
    }
    Merchandise.update({_id: req.params.id}, req.body, function(err, merchandise) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "Merchandise updated successfully"
        })
    })
}

exports.removeMerchandise = function(req, res, next) {
    Merchandise.delete({_id: req.params.id}, function(err, merchandise) {
        if(err) {
            res.json({
                error : err
            })
        }
        res.json({
            message : "Merchandise deleted successfully"
        })
    })
}
