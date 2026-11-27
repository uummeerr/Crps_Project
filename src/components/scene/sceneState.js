// What the 3D sculpture should be doing right now. The pinned story chapter
// writes these numbers as the visitor scrolls; HomeScene reads them on every
// frame. A plain object, not React state, so a scroll never causes a re-render.
//
//   shape    which shape the particles form, as a number that can sit between
//            two shapes while they blend:
//            0 aura (hero), 1 strand, 2 storm, 3 brain, 4 column, 5 wave
//   chapter  0 to 1: how far the page has darkened for the story chapter
export const sceneState = { shape: 0, chapter: 0 };

export function resetSceneState() {
  sceneState.shape = 0;
  sceneState.chapter = 0;
}
