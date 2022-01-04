import LogUtils from './constants';
import  { MsgType} from './msgType'



LogUtils.warn("content_script.js加载")

window.addEventListener('load', () => {
    LogUtils.warn("宿主页面load")
    // chrome.runtime && chrome.runtime.sendMessage({ type: MsgType.Refresh});
})
window.addEventListener('unload', () => {
    LogUtils.warn("宿主页面页面unload")
    chrome.runtime && chrome.runtime.sendMessage({ type: MsgType.Refresh});
})

// 监听页面发起的__EASYCANVAS_BRIDGE_TOPANEL__事件，一般用于选择元素时
document.addEventListener('__EASYCANVAS_BRIDGE_TOPANEL__', function(recieveData: CustomEvent){
    LogUtils.log("content_script 接受到消息啦", recieveData.detail)
    if (!recieveData.detail) {
        return;
    } else {
        chrome.runtime.sendMessage({ type: MsgType.Data, message: recieveData.detail});
    }
});


