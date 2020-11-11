/* global chrome */

export default class PopupManager {

    concurrentLock = 0;
    openedTabId = null;
    lastOpenedUrl = null;

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
            this.lastOpenedUrl = url;
        } else {
            chrome.tabs.get(this.openedTabId, (tab) => {
                if (chrome.runtime.lastError) { // window already closed
                    this.showPopup(url);
                } else {
                    if (this.lastOpenedUrl !== url) { // prevent infinite refreshing
                        chrome.tabs.update(this.openedTabId, { url: url });
                    }
                    chrome.windows.update(tab.windowId, { drawAttention: true });
                }
                this.lastOpenedUrl = url;
            });
        }
    }

    /**
     * Open popup window
     * @param url URL to be opened
     */
    showPopup(url) {
        chrome.windows.create(
            {
                url: url,
                type: 'popup',
                width: 360,
                height: 750,
            },
            (win) => {
                this.openedTabId = win.tabs[0].id;
                this.concurrentLock = 0;
            }
        );
    }
}
