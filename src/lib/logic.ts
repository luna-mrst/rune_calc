export namespace Logic {
  /**
   * 丸めフラグ
   */
  export const RoundFlag = {
    /** 切り上げ */
    Ceil: Symbol('ceil'),
    /** 切り捨て */
    Floor: Symbol('floor'),
    /** 四捨五入 */
    Round: Symbol('round')
  }

  /**
   * 任意の桁数で丸める関数
   * @param val 丸める値
   * @param digit 桁数
   * @param roundFlag 丸め方の指定
   * @returns 丸めた値
   */
  export const rounding = (val: number, digit: number = 3, roundFlag: Symbol = RoundFlag.Round): number => {
    if (isNaN(val)) return NaN;
    const func = roundFlag === RoundFlag.Ceil ? Math.ceil : roundFlag === RoundFlag.Floor ? Math.floor : Math.round;
    const tmp = Math.pow(10, digit);
    return func(val * tmp) / tmp;
  }

  /**
   * 強化の上昇量を計算するやつ
   * @param value 餌の魔力値
   * @param same 同種素材フラグ
   * @param ext 極優フラグ
   * @returns 強化値
   */
  export const riseCalc = (value: string, same: boolean, ext: boolean): number => {
    const esa = parseFloat(value) * 1000;

    if (isNaN(esa) || esa < 27000 || esa > 33000) {
      return NaN;
    } else {
      const base_rise = ((esa - 27000) / 10 + 50) / 1000;
      const rise = base_rise * (same ? 2 : 1) * (ext ? 0.5 : 1);
      return rise;
    }
  }

  /**
   * limitに近づく強化素材の組み合わせを探索するやつ
   * @param riseList 強化値のリスト
   * @param limit 強化の上限
   * @param base 強化元の魔力値
   * @returns 強化に使用する餌のindex番号のリスト
   */
  export const calc = (riseList: number[], limit: number, base: number): number[] => {
    const use:number[] = [];

    const memo = new Map<string, { use: number[]; now: number }>();
    const len = riseList.length;
    return (function fn(idx: number, now: number): { use: number[], now: number } {
      const memoValue = memo.get(`${idx}-${now}`);
      if (memoValue) {
        return { use: memoValue.use.slice(), now: memoValue.now };
      }

      let res;
      if (idx === len) {
        res = { use: use.slice(), now: 0 };
      } else if (now + riseList[idx] > limit) {
        // 強化に使うと超えてしまうため不使用
        // 以降の値を使った時の最大値を返す
        res = fn(idx + 1, now);
      } else {
        // 強化に使わない場合
        const tmp1 = fn(idx + 1, now);
        // 強化に使う場合
        const tmp2 = fn(idx + 1, now + riseList[idx]);
        tmp2.now = tmp2.now + riseList[idx];
        tmp2.use = tmp2.use.slice();
        tmp2.use.push(idx);
        res = tmp1.now >= tmp2.now ? tmp1 : tmp2;
      }

      memo.set(`${idx}-${now}`, { use: res.use.slice(), now: res.now });

      return res;
    })(0, base).use;
  }

  /**
   * なんか省略した入力を良い感じにするよ 
   * @param val 入力値
   * @returns 良い感じにした文字列
   */
  export const valueFormat = (val: string): string => {
    const match = val.match(/^(\d)?\.\d{1,3}$/);
    if (match) {
      const add = parseInt(match[1]);
      return isNaN(add) ? "27" + val : add + 27 + val.substring(1);
    }
    return val;
  }
}
