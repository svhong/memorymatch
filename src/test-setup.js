// jsdom has no media playback; stub it so components can call play()/pause().
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};
