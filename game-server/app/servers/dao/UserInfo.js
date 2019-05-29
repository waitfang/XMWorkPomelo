var MongoDBConn = require("./MongoDBConn");
var exp = module.exports;

/** @param conditions 查询条件*/
exp.UserInfo =function(SqlWhere){
    //查询单一条数据
    MongoDBConn.findOne('USERINFO', SqlWhere, function (err, res) {
        console.log("USERINFO findOne=="+res);
    });

    //查询多条数据
    MongoDBConn.find('USERINFO',SqlWhere, {}, function (err, res) {
        console.log("USERINFO find=="+res);
    });
}
