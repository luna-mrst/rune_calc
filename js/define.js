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
function round(val, digit) {
    if (isNaN(val)) return NaN;
    const tmp = Math.pow(10, digit);
    return Math.round(val * tmp) / tmp;

}