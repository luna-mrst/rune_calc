export class ElementBuilder {
    /**
     * @param {Object} def 作成するエレメントの定義情報
     * @param {string} def.tag エレメントのタグ名
     * @param {string[]} [def.class] エレメントのクラス名配列
     * @param {Object} [def.attr] エレメントに設定する属性
     * @param {Object[]} [def.children] 子要素の定義情報の配列
     * @param {string} [def.text] エレメントのテキスト内容
     * @returns {HTMLElement}
     */
    constructor(def) {
        this.tag = def.tag;
        this.class = def.class || [];
        this.attr = def.attr || {};
        this.children = def.children || [];
        this.text = def.text || '';
    }

    /**
     * なんかコンストラクタの定義情報でElement作るやつ
     */
    create() {
        const elm = document.createElement(this.tag);
        elm.classList.add(...this.class);
        Object.entries(this.attr).forEach(v => elm.setAttribute(v[0], v[1]));
        elm.innerText = this.text;
        this.children.forEach(c => elm.appendChild(new ElementBuilder(c).create()));
        return elm;
    }
}

export const trDefine = new ElementBuilder({
    tag: 'tr',
    children: [
        {
            tag: 'td',
            children: [{
                tag: 'button',
                class: ['deleteButton'],
                text: '×'
            }]
        },
        {
            tag: 'td',
            children: [{
                tag: 'input',
                class: ['value'],
                attr: {
                    type: 'number',
                    min: '27.000',
                    max: '33.000',
                    step: '0.001'
                }
            }]
        },
        {
            tag: 'td',
            class: ['rise']
        },
        {
            tag: 'td',
            class: ['same30']
        },
        {
            tag: 'td',
            class: ['diff30']
        },
        {
            tag: 'td',
            class: ['same33']
        },
        {
            tag: 'td',
            class: ['diff33']
        }
    ]
});

/**
 * 任意の桁数で丸めを行う関数
 * @param {number} val 丸める値
 * @param {number} digit 丸めずに残す桁数
 * @param {Symbol} [roundFlag] 丸め方の指定、c→切り上げ f→切り捨て 他→四捨五入
 */
export const rounding = (val, digit, flg) => {
    const func = flg === 'c' ? Math.ceil : flg === 'f' ? Math.floor : Math.round;
    if (isNaN(val)) return NaN;
    const tmp = Math.pow(10, digit);
    return func(val * tmp) / tmp;
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
    return function fun(idx, now) {
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
    }(0, base).use;//.map(v => v + 1);
}