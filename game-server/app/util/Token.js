var jsonwebtoken =require('jsonwebtoken');

//创建token
module.exports.CreatToken = function(uid){
    //用户名产生token
    var aes = 'wait';//加密字段
    var myToken = jsonwebtoken.sign({uid:uid},aes);
    console.log("myToken=="+myToken);	
}