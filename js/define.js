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

// define: {tag:タグ名, class:クラス名配列, attr:属性名キー属性値バリューのオブジェクト, children:子要素のdefine配列, text:テキストノード内容}
function createDOM(define) {
    if (define.tag === undefined) return null;
    const elm = document.createElement(define.tag);
    if (Array.isArray(define.class))
        elm.classList.add(...define.class);
    if (define.attr instanceof Object)
        Object.entries(define.attr).forEach(v => elm.setAttribute(v[0], v[1]));
    if (Array.isArray(define.children))
        define.children.forEach(c => elm.appendChild(createDOM(c)));
    if (define.text !== undefined)
        elm.innerText = define.text;
    return elm;
}

// element: 探索するDOMelement
// target: 探索するクラス名
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

// val: 四捨五入する値
// digit: 残す桁数
// flg: c→切り上げ f→切り捨て 他→四捨五入
function rounding(val, digit, flg) {
    const func = flg === 'c' ? Math.ceil : flg === 'f' ? Math.floor : Math.round;
    if (isNaN(val)) return NaN;
    const tmp = Math.pow(10, digit);
    return func(val * tmp) / tmp;

}

// note: とりあえず総当たりで出している。baseが小さかったり入力値が多いと時間がかかってしまうため要改善
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
    }(0, base).use.map(v => v + 1);
}