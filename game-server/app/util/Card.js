 import { Module } from "module";
 import {cardEnum} from '../enum/cardEnum';

 /**
  * 功能说明：定义扑克牌数。除去大小王，牛牛不需要大小王的。
  */

 Module.export.Card= {
    POKER_VALUE_LIST : function(){
        return Arrays.asList(cardEnum.cardValueEnum);
    }, 
    POKER_COLOR_LIST: function(){
        return Arrays.asList(cardEnum.cardEnum);
    } 
 } 

 