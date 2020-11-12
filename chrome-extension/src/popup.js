/* global chrome */

import appConfig from "../../app.config";

export default class PopupManager {

    concurrentLock = 0;
    openedTabId = null;
    lastOpenedUrl = null;

    goto(url) {
        // prevent opening multiple popups by concurrent calls
        if (this.concurrentLock > Date.now()) return;
        this.concurrentLock = Date.now() + 500;

        if (appConfig.chromeExtension.tabNotPopup) {
            this.showOrUpdateTab(url);
        } else {
            this.showOrUpdatePopup(url);
        }
    }

    /**
     * Open popup window or replace its content if it is already opened
     * @param url URL to be opened
     */
    showOrUpdatePopup(url) {
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

    showOrUpdateTab(url) {
        if (!this.openedTabId) {
            this.showTab(url);
            this.lastOpenedUrl = url;
        } else {
            let _this = this;
            chrome.tabs.get(this.openedTabId, (tab) => {
                if (chrome.runtime.lastError) { // tab already closed
                    this.showTab(url);
                } else {
                    if (this.lastOpenedUrl !== url) { // prevent infinite refreshing
                        chrome.tabs.update(this.openedTabId, { url: url });
                    }
                    chrome.tabs.update(this.openedTabId, { active: true });

                    // move popup into active window
                    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                        let currentTab = tabs ? tabs[0] : null;
                        if (currentTab) {
                            chrome.tabs.move(_this.openedTabId, {
                                windowId: currentTab.windowId,
                                index: currentTab.index+1,
                            }, (tab) => {
                                chrome.tabs.update(tab.id, {
                                    openerTabId: currentTab.id,
                                    active: true,
                                });
                            });
                        }
                    });
                }
                this.lastOpenedUrl = url;
            });
        }
    }

    showTab(url) {
        let _this = this;
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            let currentTab = tabs ? tabs[0] : null;
            chrome.tabs.create({
                url: url,
                active: true,
                openerTabId: currentTab ? currentTab.id : null,
                index: currentTab ? currentTab.index+1 : null,
            }, (tab) => {
                _this.openedTabId = tab.id;
                _this.concurrentLock = 0;
            });
        });
    }
}
