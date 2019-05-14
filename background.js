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

browser.browserAction.disable();
browser.storage.local.get({
    dividerSize: 25,
    divider: '―',
    rotate: false
})
    .then(({
        dividerSize,
        divider,
        rotate
    }) => updateDivider(dividerSize, divider, rotate))
    .catch(console.error);

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