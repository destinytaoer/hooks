// mock fullscreen api
const fullscreenMethods = [
    'requestFullscreen',
    'exitFullscreen',
    'fullscreenElement',
    'fullscreenEnabled',
    'fullscreenchange',
    'fullscreenerror',
];
fullscreenMethods.forEach((item) => {
    document[item] = () => {};
    HTMLElement.prototype[item] = () => {};
});
