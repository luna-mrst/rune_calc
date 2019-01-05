import { trDefine, calc, rounding, ElementBuilder } from './define.js';

const tbl = document.getElementById('tbl');
const strageKey = 'strage_value';
let currentScrollY;

tbl.addEventListener('change', event => {
    if (!event.target.classList.contains('value')) return;
    const match = event.target.value.match(/^(\d)?\.\d{1,3}$/);
    if (match) {
        const add = parseInt(match[1]);
        event.target.value = isNaN(add)
            ? '27' + event.target.value
            : add + 27 + (event.target.value.substring(1));
    }
    const esa = parseFloat(event.target.value) * 1000;
    if (esa < 27000 || esa > 33000) {
        event.target.value = '';
        return;
    }
    const parent = event.target.parentNode.parentNode;
    const base_rise = (((esa - 27000) / 10) + 50) / 1000;
    parent.querySelector('.rise').innerText = rounding(base_rise, 3) || '';
    parent.querySelector('.same30').innerText = rounding(30 - base_rise * 2, 3) || '';
    parent.querySelector('.diff30').innerText = rounding(30 - base_rise, 3) || '';
    parent.querySelector('.same33').innerText = rounding(33 - base_rise, 3) || '';
    parent.querySelector('.diff33').innerText = rounding(33 - base_rise / 2, 3) || '';
});

tbl.addEventListener('click', event => {
    const elm = event.target;
    if (!elm.classList.contains('deleteButton')) return;
    tbl.removeChild(elm.parentNode.parentNode);
});

tbl.addEventListener('keyup', e => {
    if (!(e.target instanceof HTMLInputElement && e.key === 'Enter')) return;
    const tr = document.querySelectorAll('#tbl tr');
    const idx = [].indexOf.call(tr, e.target.parentNode.parentNode);
    if ((tr.length - 1) === idx) {
        document.getElementById('add').click();
    } else {
        tr[idx + 1].querySelector('.value').focus();
    }
});

document.getElementById('add').addEventListener('click', event => {
    const tr = document.getElementById('tbl').appendChild(trDefine.create());
    tr.querySelector('.value').focus();
});

document.getElementById('save').addEventListener('click', e => {
    if (localStorage.getItem(strageKey) && !confirm('既に保存されている内容があるけど上書きしちゃうのん？')) return;
    const values = [];
    [].forEach.call(document.getElementsByClassName('value'), v => { values.push(v.value) });
    localStorage.setItem(strageKey, values);
    confirm('保存したよ！');
});

document.getElementById('load').addEventListener('click', e => {
    const values = localStorage.getItem(strageKey);
    if (values == null) {
        confirm('値が保存されてないよ。。。？');
        return
    }
    while (tbl.firstChild) tbl.removeChild(tbl.firstChild);
    createRows(values.split(','));
});

document.getElementById('delete').addEventListener('click', e => {
    localStorage.removeItem(strageKey);
    confirm('消したよ！');
});

document.getElementById('calc').addEventListener('click', e => {
    const result = document.getElementById('result');
    let base = parseFloat(document.getElementById('base').value) * 1000;
    const riseList = [].map.call(document.querySelectorAll('.value'), v => {
        const esa = parseFloat(v.value) * 1000;
        const rise = (((esa - 27000) / 10) + 50);
        return base <= 30000 ? rounding(rise, 0) : rounding(rise / 2, 0);
    }).map(v => isNaN(v) ? 0 : v);
    if (isNaN(base)) return;
    const limit = base <= 30000 ? 30000 : 33000;
    const ans = calc(riseList, limit, base);
    const use = document.getElementsByClassName('use');
    while (use.length > 0) use[0].classList.remove('use');
    ans.forEach(v => {
        const tr = document.querySelector('#tbl tr:nth-child(' + (v + 1) + ')');
        tr.classList.add('use');
        base += riseList[v];
    });
    result.innerText = `強化後の値は${rounding(base / 1000, 3)}`;
    e.target.removeAttribute('disabled');
});

document.getElementById('read').addEventListener('click', e => {
    const file = document.getElementById('file');
    if (file.files.length === 0) {
        alert('画像選んで出直してこい？');
        return;
    }
try{
    let count = 0;

    const values = [];
    modalOpen();
    const main = document.getElementById('modalMain');
    const loading = document.getElementById('loading');
    const buttons = document.getElementById('buttons');
    currentScrollY = document.documentElement.scrollTop;
    document.getElementById('container');
    while (main.firstChild) main.removeChild(main.firstChild);
    loading.classList.remove('hide');
    main.classList.add('hide');
    buttons.classList.add('hide');

    [].forEach.call(file.files, f => {
        const reader = new FileReader();
        reader.onload = re => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
                OCRAD(img, txt => {
                    const matches = txt.replace(/[zoT]/g, c => ({ z: '2', o: '0', T: '7' }[c])).match(/[\di_]{2}\.[\di_]{3}/g);
                    values.push(...matches);
                    createModalContent(matches, reader.result);
                    if (--count === 0) {
                        loading.classList.add('hide');
                        main.classList.remove('hide');
                        buttons.classList.remove('hide');
                    }
                });
            };
        };
        reader.readAsDataURL(f);
        count++;
    });
} catch (e) {
    // test
    alert(e);
}
});

document.getElementById('modalMain').addEventListener('change', e => {
    const target = e.target;
    if (!target.classList.contains('values')) return;
    target.classList.remove('valid', 'invalid');
    target.classList.add(target.value.match(/^\d{2}\.\d{1,3}$/) ? 'valid' : 'invalid');
});

document.getElementById('modalLoad').addEventListener('click', e => {
    const values = [].map.call(document.querySelectorAll('.values.valid'), v => v.value);
    createRows(values);
    modalClose();
    file.value = '';
});

document.getElementById('modalCancel').addEventListener('click', e => {
    modalClose();
});

/**
* 引数の値が入力された行を追加する
* @param {number[]} values 追加する行の餌の魔力値
*/
const createRows = values => {
    const evt = document.createEvent('Event');
    evt.initEvent('change', true, true);
    values.forEach(v => {
        const tr = trDefine.create();
        const value = tr.querySelector('.value');
        value.value = v;
        tbl.appendChild(tr);
        value.dispatchEvent(evt);
    });
    [].forEach.call(document.querySelectorAll('td > input'), i => {
        if (i.value === '')
            tbl.removeChild(i.parentNode.parentNode);
    });
}

/**
 * なんかモーダル内のコンテンツを生成するやつ
 * @param {any[]} values 画像から読み込んだ値のリスト
 * @param {string} imgData 読み込んだ画像のDataURL形式ソース
 */
const createModalContent = (values, imgData) => {
    const content = document.getElementById('modalMain');
    const container = new ElementBuilder({
        tag: 'div',
        children: [{
            tag: 'img',
            attr: { src: imgData }
        }, {
            tag: 'div',
            class: ['grid'],
            children: []
        }]
    });
    values.forEach(v => {
        container.children[1].children.push({
            tag: 'input',
            class: v.match(/\d{2}\.\d{3}/) ? ['valid', 'values'] : ['invalid', 'values'],
            attr: { value: v }
        });
    });
    content.appendChild(container.create());
}

/**
 * なんかモーダル開くやつ
 */
const modalOpen = () => {
    const overlay = document.querySelector('.modal-overlay');
    overlay.classList.remove('hide');
    document.getElementsByTagName('html')[0].style.overflow = 'hidden';
};

/**
 * なんかモーダル閉じるやつ
 */
const modalClose = () => {
    const overlay = document.querySelector('.modal-overlay');
    overlay.classList.add('hide');
    document.getElementsByTagName('html')[0].removeAttribute('style');
};

