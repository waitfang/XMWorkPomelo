var MongoDBConn = require("./MongoDBConn");
var exp = module.exports;

/** @param conditions 查询条件*/
exp.UserInfo =function(SqlWhere){
    //查询单一条数据
    MongoDBConn.findOne('USERINFO', SqlWhere, function (err, res) {
        // console.log("USERINFO findOne=="+res);
    });

    //查询多条数据
    const JsonUSERINFO =   MongoDBConn.find('USERINFO',SqlWhere, {}, function (err, res) {
        // console.log("USERINFO find=="+res);
    });

    const JsonCOMPANYINFO =  MongoDBConn.find('COMPANYINFO',{}, {}, function (err, res) {
        // console.log("COMPANYINFO find=="+res);
    });
 
    //关联查询 COMPANYINFO-》USERINFO ,COMPANYID 关联字段
    SqlWhere={COMPANYID:"1"}; //查询条件
    const Table ="COMPANYINFO";
    const JoinTable = "USERINFO"; //关联table
    const fields = "COMPANYID"; //关联字段
    const sort = {USERID:1}; //-1倒序，1顺序。
    MongoDBConn.findJoin(JoinTable,Table,SqlWhere,fields,sort, function (err, res) {
        console.log("COMPANYINFO findJoin=="+res);
    });
}
