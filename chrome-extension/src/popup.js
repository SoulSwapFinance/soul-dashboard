/* global chrome */

const POPUP_WIDTH = 400;
const POPUP_HEIGHT = 620;

export default class PopupManager {

    openedWindowId = null;
    openedTabId = null;

    constructor() {}

    showOrUpdatePopup(url) {
        if (!this.openedTabId) {
            this.showPopup(url);
        } else {
            chrome.tabs.update(this.openedTabId, { url: url }, (tab) => {
                if (chrome.runtime.lastError) { // window not exist already
                    this.showPopup(url);
                } else {
                    chrome.windows.update(tab.windowId, { focused: true });
                }
            });
        }
    }

    showPopup(url) {
        chrome.windows.getLastFocused((lastFocused) => {
            let top = lastFocused.top ? lastFocused.top : null;
            let left = lastFocused.width ? lastFocused.left + (lastFocused.width - POPUP_WIDTH) : null;

            chrome.windows.create(
                {
                    url: url,
                    type: 'popup',
                    width: POPUP_WIDTH,
                    height: POPUP_HEIGHT,
                    top: top,
                    left: left,
                },
                (win) => {
                    this.openedWindowId = win.id;
                    this.openedTabId = win.tabs[0].id;
                    if (left && win.left !== left) {
                        chrome.windows.update(win.id, {
                            top: top,
                            left: left,
                        });
                    }
                }
            );
        });
    }
}
