module.exports = function(app) {
    return new ChatRemote(app);
};

var ChatRemote = function(app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

/**
 * Add user into chat channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 *session, uid, self.app.get('serverId'), rid, true
 */
ChatRemote.prototype.add = function(uid, sid, name, flag, cb) {
    var channel = this.channelService.getChannel(name, flag);
    var username = uid.split('*')[0];
    var param = {
        route: 'onAdd',
        user: username
    };
    channel.pushMessage(param);

    if( !! channel) {
        channel.add(uid, sid);
    }

    cb(this.get(name, flag));
};

//加入新房间
ChatRemote.prototype.AddRoom = function(uid, sid, name, flag, cb) {
    var channel = this.channelService.getChannel(name, flag);
    var username = uid.split('*')[0];
    var param = {
        route: 'onAddRoom',
        user: username,
        card: Arrays.asList({bak:'bak.jpg'})
    };
    channel.pushMessage(param);

    if( !! channel) {
        channel.add(uid, sid);
    }
    cb();
    // cb(this.getCard());
};

//随机获取5张牌
ChatRemote.prototype.getCard = function() {
    var Cards = [];
    var cardCount = 52;
    var j=0;
    //牛牛是每人5张牌，所以先写死5
    for(var i=0;i<cardCount;i++){
        var itemCards=  Math.ceil(Math.random()*cardCount);
        var Poker = Card.POKER_VALUE_LIST()[i];
        if(!Cards.concat(Poker))
            Cards[j] = itemCards;

        if(Cards[j].length>=5) break;//满5张牌，跳出loop；  
        j++; 
    }
    return Cards; 
};


 
/**
 * Get user from chat channel.
 *
 * @param {Object} opts parameters for request
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 * @return {Array} users uids in channel
 *
 */
ChatRemote.prototype.get = function(name, flag) {
    var users = [];
    console.log("name==="+name +"=flag="+flag);
    var channel = this.channelService.getChannel(name, flag);
    if( !! channel) {
        users = channel.getMembers();
    }
    for(var i = 0; i < users.length; i++) {
        users[i] = users[i].split('*')[0];
    }
    return users;
};

/**
 * Kick user out chat channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 *
 */
ChatRemote.prototype.kick = function(uid, sid, name, cb) {
    var channel = this.channelService.getChannel(name, false);
    // leave channel
    if( !! channel) {
        channel.leave(uid, sid);
    }
    var username = uid.split('*')[0];
    var param = {
        route: 'onLeave',
        user: username
    };
    channel.pushMessage(param);
    cb();
};
 