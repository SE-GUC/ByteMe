if (process.env.NODE_ENV === 'production')
    module.exports = require('./keys_prod')
else
    module.exports = require('./keys_dev')

    module.exports = {
        mongoURI: 'mongodb://ahmaademaad:1234@munbytemecluster-shard-00-00-da3gg.mongodb.net:27017,munbytemecluster-shard-00-01-da3gg.mongodb.net:27017,munbytemecluster-shard-00-02-da3gg.mongodb.net:27017/test?ssl=true&replicaSet=MUNByteMeCluster-shard-0&authSource=admin&retryWrites=true',
    }
    