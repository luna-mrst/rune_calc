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
    findFirstByClassName(parent, 'same30').innerText = rounding(30 - base_rise * 2, 3) || '';
    findFirstByClassName(parent, 'diff30').innerText = rounding(30 - base_rise, 3) || '';
    findFirstByClassName(parent, 'same33').innerText = rounding(33 - base_rise, 3) || '';
    findFirstByClassName(parent, 'diff33').innerText = rounding(33 - base_rise / 2, 3) || '';
});

tbl.addEventListener('click', event => {
    const elm = event.target;
    if (!elm.classList.contains('deleteButton')) return;
    elm.parentNode.parentNode.parentNode.removeChild(elm.parentNode.parentNode);
});

tbl.addEventListener('keyup', e => {
    if (e.key !== 'Enter') return;
    const tr = document.querySelectorAll('#tbl tr');
    const idx = [].indexOf.call(tr, e.target.parentNode.parentNode);
    if ((tr.length - 1) === idx) {
        document.getElementById('add').click();
    } else {
        findFirstByClassName(tr[idx + 1], 'value').focus();
    }
});

document.getElementById('add').addEventListener('click', event => {
    const tr = document.getElementById('tbl').appendChild(createDOM(getTrDefine()));
    findFirstByClassName(tr, 'value').focus();
});

document.getElementById('save').addEventListener('click', e => {
    if (localStorage.getItem('values') && !confirm('既に保存されている内容があります。上書きしますか？')) return;
    const values = [];
    [].forEach.call(document.getElementsByClassName('value'), v => { values.push(v.value) });
    localStorage.setItem('values', values);
    confirm('保存したよ！');
});

document.getElementById('load').addEventListener('click', e => {
    const values = localStorage.getItem('values');
    if (values == null) {
        confirm('値が保存されてないよ。。。？');
        return
    }
    const tbl = document.getElementById('tbl');
    while (tbl.firstChild) tbl.removeChild(tbl.firstChild);
    createRows(values.split(','));
});

document.getElementById('delete').addEventListener('click', e => {
    localStorage.removeItem('values');
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
    const ans = solve(riseList, limit, base);
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

    let count = 0;
    e.target.setAttribute('disabled', true);

    [].forEach.call(file.files, (f, idx) => {
        const reader = new FileReader();
        reader.onload = re => {
            const img = new Image();
            img.src = re.target.result;
            img.onload = () => {
                OCRAD(img, txt => {
                    const values = txt.replace(/[zoT]/g, c => ({ z: '2', o: '0', T: '7' }[c])).match(/\d{2}\.\d{3}/g);
                    createRows(values);
                    if (--count === 0) e.target.removeAttribute('disabled');
                });
            };
        };
        reader.readAsDataURL(f);
        count++;
    });
});