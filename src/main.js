import { trDefine, calc, rounding, ElementBuilder } from './define.js';

const tbl = document.getElementById('tbl');
const strageKey = 'strage_value';
let currentScrollY;

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

