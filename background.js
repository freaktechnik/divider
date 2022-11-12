async function updateDivider(dividerSize = 25, divider = '―', rotate = false) {
    const dividerLabel = divider.repeat(dividerSize);
    browser.browserAction.setTitle({
        title: dividerLabel
    });
    let image = 'icon.svg';
    if(rotate) {
        image = 'iconr.svg';
    }
    await browser.browserAction.setIcon({
        path: image
    });
}

async function init() {
    browser.browserAction.disable();
    const { dividerSize, divider, rotate } = await browser.storage.local.get({
        dividerSize: 25,
        divider: '―',
        rotate: false
    });
    updateDivider(dividerSize, divider, rotate);
}

browser.runtime.onStartup.addListener(() => {
    init();
});

browser.runtime.onInstalled.addListener((details) => {
    if(details.reason !== "browser_update") {
        init();
    }
});

browser.storage.onChanged.addListener(async (changes, areaName) => {
    if(areaName === 'local') {
        let existingDivider;
        if(!changes.dividerSize || !changes.divider) {
            existingDivider = await browser.browserAction.getTitle();
        }
        const dividerSize = changes.dividerSize ? changes.dividerSize.newValue : existingDivider.length,
            divider = changes.divider ? changes.divider.newValue : existingDivider[0];

        let rotate = false;
        if(changes.rotate) {
            rotate = changes.rotate.newValue;
        }
        else {
            const current = await browser.storage.local.get('rotate');
            if(current.rotate) {
                rotate = current.rotate;
            }
        }

        updateDivider(dividerSize, divider, rotate);
    }
});
