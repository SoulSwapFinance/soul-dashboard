/* global chrome */

const POPUP_WIDTH = 400;
const POPUP_HEIGHT = 620;

export default class PopupManager {
    constructor() {}

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

    showTab(url) {
        chrome.tabs.create({
            url: url,
        });
    }
}
