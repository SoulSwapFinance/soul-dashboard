/* global chrome */

const POPUP_WIDTH = 400;
const POPUP_HEIGHT = 620;

export default class PopupManager {

    concurrentLock = 0;
    openedTabId = null;

    /**
     * Open popup window or replace its content if it is already opened
     * @param url URL to be opened
     */
    showOrUpdatePopup(url) {
        // prevent opening multiple popups by concurrent calls
        if (this.concurrentLock > Date.now()) return;
        this.concurrentLock = Date.now() + 500;

        if (!this.openedTabId) {
            this.showPopup(url);
        } else {
            chrome.tabs.update(this.openedTabId, { url: url }, (tab) => {
                if (chrome.runtime.lastError) { // window already closed
                    this.showPopup(url);
                } else {
                    chrome.windows.update(tab.windowId, { focused: true });
                }
            });
        }
    }

    /**
     * Open popup window
     * @param url URL to be opened
     */
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
                    this.openedTabId = win.tabs[0].id;
                    this.concurrentLock = 0;
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
