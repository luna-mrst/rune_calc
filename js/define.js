/**
 * @returns {Object} createDOMで使用する追加列の定義
 */
function getTrDefine() {
    return {
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
    };
}

/**
 * @param {Object} define 作成するエレメントの定義情報
 * @param {string} define.tag エレメントのタグ名
 * @param {string[]} [define.class] エレメントのクラス名配列
 * @param {Object} [define.attr] エレメントに設定する属性
 * @param {Object[]} [define.children] 子要素の定義情報の配列
 * @param {string} [define.text] エレメントのテキスト内容
 * @returns {HTMLElement}
 */
function createDOM(define) {
    if (define.tag === undefined) return null;
    const elm = document.createElement(define.tag);
    if (Array.isArray(define.class))
        elm.classList.add(...define.class);
    if (define.attr instanceof Object)
        Object.entries(define.attr).forEach(v => elm.setAttribute(v[0], v[1]));
    if (Array.isArray(define.children))
        define.children.forEach(c => elm.appendChild(createDOM(c)));
    if ('text' in define)
        elm.innerText = define.text;
    return elm;
}

/**
 * 任意の要素を起点にクラス名で要素を探索する関数、最初に見つかったものを返却する
 * @param {HTMLElement} element 探索の起点となる要素
 * @param {String} target 探索するクラス名
 * @returns {HTMLElement}
 */
function findFirstByClassName(element, target) {
    const queue = [];
    queue.push(element);
    while (true) {
        const elm = queue.shift();
        if (elm == undefined) return;
        if (elm.classList.contains(target)) return elm;
        [].forEach.call(elm.children, c => queue.push(c));
    }
}

/**
 * 任意の桁数で丸めを行う関数
 * @param {number} val 丸める値
 * @param {number} digit 丸めずに残す桁数
 * @param {string} [flg] 丸め方の指定、c→切り上げ f→切り捨て 他→四捨五入
 */
function rounding(val, digit, flg) {
    const func = flg === 'c' ? Math.ceil : flg === 'f' ? Math.floor : Math.round;
    if (isNaN(val)) return NaN;
    const tmp = Math.pow(10, digit);
    return func(val * tmp) / tmp;

}

/**
 * limitに近づく強化素材の組み合わせを探索する関数
 * @todo とりあえず総当たりで出している。計算量がアレだから要改善？
 * @param {number[]} riseList 強化に使用する餌の強化値のリスト
 * @param {number} limit 強化の上限
 * @param {number} base 強化元の魔力値
 * @returns {number[]} 強化に使用するriseListのindex番号
 */
function solve(riseList, limit, base) {
    const len = riseList.length;
    return function fun(idx, now) {
        let res;
        if(idx == len) {
            res = {use:[], now: 0};
        } else if(now + riseList[idx] > limit) {
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
            res = tmp1.now >= tmp2.now ? tmp1: tmp2;
        }
        return res;
    }(0, base).use;//.map(v => v + 1);
}

/**
 * 引数の値が入力された行を追加する
 * @param {number[]} values 追加する行の餌の魔力値
 */
function createRows(values) {
    const tbl = document.getElementById('tbl');
    const evt = document.createEvent('Event');
    evt.initEvent('change', true, true);
    values.forEach(v => {
        const tr = createDOM(getTrDefine());
        const value = findFirstByClassName(tr, 'value');
        value.value = v;
        tbl.appendChild(tr);
        value.dispatchEvent(evt);
    });
    [].forEach.call(document.querySelectorAll('td > input'), i => {
        if(i.value === '')
            tbl.removeChild(i.parentNode.parentNode);

    });
}