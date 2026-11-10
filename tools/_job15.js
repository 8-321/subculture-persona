module.exports = [
  { file: 'tools/preview/render.js', old: `    if (!inRail && (pr.right > WIDTH + 0.5 || pr.left < -0.5)) {`, new: `    if (!inRail && (pr.right > document.body.clientWidth + 0.5 || pr.left < -0.5)) {` }
];
