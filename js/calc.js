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
    const base_rise = (((esa - 27000) / 10) + 50) / 1000;
    findFirstByClassName(parent, 'rise').innerText = rounding(base_rise, 3) || '';
    findFirstByClassName(parent, 'same30').innerText = 30 - rounding(base_rise * 2, 3) || '';
    findFirstByClassName(parent, 'diff30').innerText = 30 - rounding(base_rise, 3) || '';
    findFirstByClassName(parent, 'same33').innerText = 33 - rounding(base_rise, 3) || '';
    findFirstByClassName(parent, 'diff33').innerText = 33 - rounding(base_rise / 2, 3) || '';

});

tbl.addEventListener('click', event => {
    const elm = event.target;
    if (!elm.classList.contains('deleteButton')) return;
    elm.parentNode.parentNode.parentNode.removeChild(elm.parentNode.parentNode);
});

tbl.addEventListener('keyup', e => {
    if(e.key !== 'Enter') return;
    const tr = document.querySelectorAll('#tbl tr');
    const idx = [].indexOf.call(tr, e.target.parentNode.parentNode);
    if((tr.length - 1) === idx) {
        document.getElementById('add').click();
    } else {
        findFirstByClassName(tr[idx+1], 'value').focus();
    }
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

document.getElementById('calc').addEventListener('click', e => {
    const result = document.getElementById('result');
    result.innerText = '';
    const riseList = [].map.call(document.querySelectorAll('.rise'), v => parseFloat(v.innerText) * 1000).map(v => isNaN(v) ? 0 : v);
    let base = parseFloat(document.getElementById('base').value) * 1000;
    if(isNaN(base)) return;
    const limit = base <= 30000 ? 30000 : 33000;
    const ans = solve(riseList, limit, base);
    const use = document.getElementsByClassName('use');
    while(use.length > 0) use[0].classList.remove('use');
    ans.forEach(v => {
        const tr = document.querySelector('#tbl tr:nth-child('+v+')');
        tr.classList.add('use');
        base += parseFloat(findFirstByClassName(tr, 'rise').innerText) * 1000;
    });
    result.innerText = `強化後の値は${base / 1000}`;
});