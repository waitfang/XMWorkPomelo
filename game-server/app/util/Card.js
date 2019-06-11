 
 var cardEnum = require('../enum/cardEnum');
 var exp = module.exports;
 /**
  * 功能说明：定义扑克牌数。除去大小王，牛牛不需要大小王的。
  */

 exp.POKER_VALUE_LIST =function(){
        return Arrays.asList(cardEnum.cardValueEnum);
        // return Arrays.asList('1','2','3','4');
    };

exp.POKER_COLOR_LIST= function(){
    return Arrays.asList(cardEnum.cardEnum);
} 
 
//随机取52张牌，发给room的人。
const  imagePath= 'image/pukeImage/';
const  jpg= '.jpg';
const  Cardslength = 5;//牛牛是每人5张牌，所以先写死5
exp.getCard=function(){
    var Cards = [];
    var j=0; 
    var Poker =cardEnum.cardArry; 
    var cardCount = Poker.length; 
    for(var i=0;i<cardCount;i++){
        var itemCards=  Math.ceil(Math.random()*cardCount) - 1;
        console.log('itemCards=='+itemCards);
        if(Cards.indexOf(itemCards) == -1)
            Cards[j] = imagePath + Poker[itemCards]+jpg;
        if(Cards.length>=Cardslength) break;//满5张牌，跳出loop；  
        j++; 
    }
    return Cards; 
}


 