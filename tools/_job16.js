module.exports = [
  { file: 'tools/preview/render.js', old: `  ctx.setData = function (patch) { Object.assign(this.data, patch || {}); };`, new: `  ctx.setData = function (patch, cb) { Object.assign(this.data, patch || {}); if (typeof cb === 'function') cb(); };` }
];
