/**
 * 任意の桁数で丸めを行う関数
 * @param {number} val 丸める値
 * @param {number} digit 丸めずに残す桁数
 * @param {Symbol} [roundFlag] 丸め方の指定、c→切り上げ f→切り捨て 他→四捨五入
 */
export const rounding = (val, digit, flg) => {
  const func = flg === "c" ? Math.ceil : flg === "f" ? Math.floor : Math.round;
  if (isNaN(val)) return NaN;
  const tmp = Math.pow(10, digit);
  return func(val * tmp) / tmp;
};

/**
 * なんか強化の上昇量を計算してくれるやつ
 * @param {string} val 餌の魔力値
 * @param {boolean} same 同種素材フラグ
 * @param {boolean} gokuyu 強化元が極優かどうか
 * @returns {string | null} 強化値、valが不正な場合はnull
 */
export const riseCalc = (val, same, gokuyu) => {
  const value = valueFormat(val);
  const esa = parseFloat(value) * 1000;

  if (isNaN(esa) || esa < 27000 || esa > 33000) {
    return null;
  } else {
    const base_rise = ((esa - 27000) / 10 + 50) / 1000;
    const rise = base_rise * (same ? 2 : 1) * (gokuyu ? 0.5 : 1);
    return rise;
  }
};

/**
 * limitに近づく強化素材の組み合わせを探索する関数
 * @todo とりあえず総当たりで出している。計算量がアレだから要改善？
 * @param {number[]} riseList 強化に使用する餌の強化値のリスト
 * @param {number} limit 強化の上限
 * @param {number} base 強化元の魔力値
 * @returns {number[]} 強化に使用するriseListのindex番号
 */
export const calc = (riseList, limit, base) => {
  const len = riseList.length;
  return (function fun(idx, now) {
    let res;
    if (idx == len) {
      res = { use: [], now: 0 };
    } else if (now + riseList[idx] > limit) {
      // 強化に使うと超えてしまうため不使用
      // 以降の値を使った時の最大値を返す
      res = fun(idx + 1, now);
    } else {
      // 強化に使わない場合
      const tmp1 = fun(idx + 1, now);
      // 強化に使う場合
      const tmp2 = fun(idx + 1, now + riseList[idx]);
      tmp2.now = tmp2.now + riseList[idx];
      tmp2.use = tmp2.use.slice();
      tmp2.use.push(idx);
      res = tmp1.now >= tmp2.now ? tmp1 : tmp2;
    }
    return res;
  })(0, base).use;
};

/**
 * なんか省略した入力をいい感じにするやつ
 * @param {string} val
 * @returns {string}
 */
export const valueFormat = val => {
  const match = val.match(/^(\d)?\.\d{1,3}$/);
  if (match) {
    const add = parseInt(match[1]);
    return isNaN(add) ? "27" + val : add + 27 + val.substring(1);
  }
  return val;
};
