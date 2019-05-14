function save() {
    const dividerSize = document.getElementById("dividerSize").value,
        divider = document.getElementById("divider").value || '―',
        rotate = dividerSize != 0;
    return browser.storage.local.set({
        dividerSize: dividerSize > 0 ? dividerSize : 25,
        divider,
        rotate
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const {
        dividerSize,
        divider,
        rotate
    } = await browser.storage.local.get({
        dividerSize: 25,
        divider: '',
        rotate: false
    });

    const sizeOutput = document.getElementById("dividerSizeOutput");

    document.getElementById("dividerSize").value = rotate ? dividerSize : 0;
    document.getElementById("divider").value = divider;
    sizeOutput.value = rotate ? dividerSize : 'auto';

    document.getElementById("dividerSize").addEventListener("input", (event) => {
        save().catch(console.error);
        sizeOutput.value = event.target.value > 0 ? event.target.value : 'auto';
    }, {
        passive: true
    });

    document.getElementById("divider").addEventListener("input", (event) => {
        save().catch(console.error);
    }, {
        passive: true
    });

    document.querySelector("form").addEventListener("submit", (event) => {
        event.preventDefault();
        save().catch(console.error);
    }, {
        passive: false
    });
}, {
    once: true,
    passive: true
});