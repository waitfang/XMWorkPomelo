/**
 * 功能说明：存放session
 */
class mSessionService{
    constructor(){
        sessions = {};     // sid -> session
        uidMap = {};       // uid -> sessions  //用于将uid与session绑定起来
    } 

    /**
     * 清空被检查的session id
     * @return {void}
    */
    clear() {
        this.m_sidmap = {};
    }

       /**
     * 当有连接过来时
     * @param {Number} paramSessionId 连接过来的id
     * @return {void}
     */
    doConnect(paramSessionId) {
        let v = {sid:paramSessionId, t:Date.now()};
        this.m_sidmap[paramSessionId] = v;
    }
    /**
     * 当前连接关闭时
     * @param {Number} paramSessionId 被关闭的连接
     * @return {void}
     */
    doClose(paramSessionId, /*paramReason*/) {
        let v = this.m_sidmap[paramSessionId];
        if(utils.isNotNull(v)) {
            delete this.m_sidmap[paramSessionId];
        } 
    }
 

}

exports.mSessionService = mSessionService;