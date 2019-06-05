var MongoDBConn = require("./MongoDBConn");
var exp = module.exports;

/** @param conditions 查询条件*/
exp.UserInfo =function(SqlWhere){
    //查询单一条数据
    MongoDBConn.findOne('USERINFO', SqlWhere, function (err, res) {
        // console.log("USERINFO findOne=="+res);
    });

    //关联查询 COMPANYINFO-》USERINFO ,COMPANYID 关联字段
    SqlWhere={COMPANYID:"1"}; //查询条件
    const Table ="COMPANYINFO";
    const JoinTable = "USERINFO"; //关联table
    const fields = "COMPANYID"; //关联字段
    const sort = {USERID:1}; //-1倒序，1顺序。
    const ReturnData = MongoDBConn.findJoin(JoinTable,Table,SqlWhere,fields,sort, function (err, res) {
        // console.log("COMPANYINFO findJoin=="+res);
        // exp.GetCompanyInfo({});
    }); 

    //Promise
    // let objPromise = new Promise(function(resolve,reject){
    //     resolve("ok");
    // }).then((data)=>{
    //     console.log("Promise then=="+data);
    //     exp.GetCompanyInfo({},function(data){
    //         console.log("Promise GetCompanyInfo=="+data);
    //     });
    // }); 

    // let objPromise = new Promise(function(resolve,reject){
    //         resolve({});
    //     })
    //     .then(exp.GetCompanyInfo1)
    //     .then(exp.GetUserInfo1) ;

    // Promise.all([exp.GetCompanyInfo1({}), exp.GetUserInfo1({})]).then(function (results) {
    //     console.log("Promise.all results : "+results); // 获得一个Array: ['P1', 'P2']
    // });

    //objPromise 实现同步，GetCompanyInfo成功后，通知then，可以查GetUserInfo 了。
     let objPromise = new Promise(function(resolve,reject){
        exp.GetCompanyInfo({},resolve)
    }).then((data)=>{
        console.log("Promise then=="+data);
        exp.GetUserInfo({},function(data){
            // console.log("Promise GetUserInfo=="+data);
        });
    }); 
 
}
    
//查询多条数据
exp.GetUserInfo1 = function(SqlWhere){ 
    console.log("SqlWhere=="+SqlWhere);
    return   MongoDBConn.find('USERINFO',SqlWhere, {}, function (err, res) {
        // console.log("USERINFO find=="+res);
        return res;
    });
}
exp.GetUserInfo = function(SqlWhere,callback){ 
    return   MongoDBConn.find('USERINFO',SqlWhere, {}, function (err, res) {
        // console.log("USERINFO find=="+res);
        callback(res);
    });
}


exp.GetCompanyInfo1 = function(SqlWhere){ 
    console.log("SqlWhere1=="+JSON.stringify(SqlWhere));
    return MongoDBConn.find('COMPANYINFO',{}, {}, function (err, res) { 
        //   console.log("COMPANYINFO find=="+res);
        return res;
    });
}
exp.GetCompanyInfo = function(SqlWhere,callback){ 
    MongoDBConn.find('COMPANYINFO',{}, {}, function (err, res) {
        // console.log("COMPANYINFO find=="+res);
        callback(res);
    });
} 


