import { MsgType } from './msgType';
import LogUtils from './constants'

LogUtils.warn("devTools 加载")
chrome.devtools.panels.create(
  'RdxDevtools',
  'icon.png',
  'panel.html',
  function (extensionPanel) {
    var _window; // Going to hold the reference to panel.html's `window`
  
    var port = chrome.runtime.connect({ name: 'devtools' });
    window.onbeforeunload = () => {
      LogUtils.warn("devtools加载")
      port.postMessage({
        type: MsgType.onDevtoolUnload,
        tabId: chrome.devtools.inspectedWindow.tabId,
        data: _window && _window.getState()
      })
    };
    port.onMessage.addListener( (msg) => {
      _window.setState && _window.setState(msg);
    });

    port.postMessage({
      type: MsgType.devtoolBind,
      tabId: chrome.devtools.inspectedWindow.tabId,
    });

    extensionPanel.onHidden.addListener(() => {

    })
    extensionPanel.onShown.addListener(function tmp(panelWindow: any) {
      LogUtils.warn("panelShow加载")
      extensionPanel.onShown.removeListener(tmp); // Run once only
      _window = panelWindow;
      port.postMessage({
        type: MsgType.onPanelShown,
        tabId: chrome.devtools.inspectedWindow.tabId
      });
    });
  }
);

