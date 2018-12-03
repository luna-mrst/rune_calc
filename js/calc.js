const tbl = document.getElementById('tbl');
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
    const base_rise = round((((esa - 27000) / 10) + 50) / 1000, 3);
    findFirstByClassName(parent, 'rise').innerText = base_rise || '';
    findFirstByClassName(parent, 'same30').innerText = 30 - base_rise * 2 || '';
    findFirstByClassName(parent, 'diff30').innerText = 30 - base_rise || '';
    findFirstByClassName(parent, 'same33').innerText = 33 - base_rise || '';
    findFirstByClassName(parent, 'diff33').innerText = 33 - round(base_rise / 2, 3) || '';

});
tbl.addEventListener('click', event => {
    const elm = event.target;
    if (!elm.classList.contains('deleteButton')) return;
    elm.parentNode.parentNode.parentNode.removeChild(elm.parentNode.parentNode);
});

document.getElementById('add').addEventListener('click', event => {
    const tr = document.getElementById('tbl').appendChild(createDOM(getTrDefine()));
    findFirstByClassName(tr, 'value').focus();
});

document.getElementById('save').addEventListener('click', e => {
    const values = [];
    [].forEach.call(document.getElementsByClassName('value'), v => { values.push(v.value) });
    localStorage.setItem('values', values);
    alert('保存したよ！');
});

document.getElementById('load').addEventListener('click', e => {
    const values = localStorage.getItem('values');
    if (values == null) {
        alert('値が保存されてないよ。。。？');
        return;
    }
    const tbl = document.getElementById('tbl');
    while (tbl.firstChild) tbl.removeChild(tbl.firstChild);
    const evt = document.createEvent('Event');
    evt.initEvent('change', true, true);
    values.split(',').forEach(v => {
        const tr = createDOM(getTrDefine());
        const value = findFirstByClassName(tr, 'value');
        value.value = v;
        tbl.appendChild(tr);
        value.dispatchEvent(evt);
    });
});

document.getElementById('delete').addEventListener('click', e => {
    localStorage.removeItem('values');
    alert('消したよ！');
});