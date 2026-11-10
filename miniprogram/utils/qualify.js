// 商家资质校验（GB 32100-2015 统一社会信用代码）
// 目的：提交前就拦住格式错的执照号，别让「审核」去发现「填错一位」。
// 说明：这里只做格式与校验位判断，不代表真实工商核验；页面上不能写成「已核验」。

// 31 个字符（去掉 I O S V Z），顺序即权重表下标
const CHARS = '0123456789ABCDEFGHJKLMNPQRTUWXY';
const W = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];

function norm(s) {
  return String(s || '').replace(/\s/g, '').toUpperCase();
}

// 返回 { ok, msg }：ok=false 时 msg 直接可以 toast 给用户
function creditCode(input) {
  const s = norm(input);
  if (!s) return { ok: false, msg: '请填写营业执照上的统一社会信用代码' };
  // 老版 15 位工商注册号（个体户常见）只判长度与数字
  if (/^\d{15}$/.test(s)) return { ok: true, msg: '', legacy: true };
  if (s.length !== 18) return { ok: false, msg: '统一社会信用代码是 18 位，现在填了 ' + s.length + ' 位' };
  for (let i = 0; i < 18; i++) {
    if (CHARS.indexOf(s[i]) < 0) return { ok: false, msg: '第 ' + (i + 1) + ' 位「' + s[i] + '」不合法（不含 I O S V Z）' };
  }
  let sum = 0;
  for (let i = 0; i < 17; i++) sum += CHARS.indexOf(s[i]) * W[i];
  const c = (31 - (sum % 31)) % 31;
  if (CHARS[c] !== s[17]) return { ok: false, msg: '校验位不对，请核对执照号是否抄错（末位应为 ' + CHARS[c] + '）' };
  return { ok: true, msg: '' };
}

// 联系方式：手机号或含 @ 的邮箱，二者其一即可
function contact(input) {
  const s = String(input || '').trim();
  if (!s) return { ok: false, msg: '请留一个能联系到你的手机号或邮箱' };
  if (/^1[3-9]\d{9}$/.test(s)) return { ok: true, msg: '' };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return { ok: true, msg: '' };
  return { ok: false, msg: '手机号应是 11 位，或填一个邮箱' };
}

module.exports = { creditCode: creditCode, contact: contact };
