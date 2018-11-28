document.getElementById('tbl').addEventListener('change', event => {
    const esa = parseFloat(event.target.value) * 1000;
    if(esa < 27000 || esa > 33000) {
        event.target.value = '';
        return;
    }
    const parent = event.target.parentNode.parentNode;
    const base_rise = Math.round((((esa - 27000) / 5) + 100)) / 1000;

    find(parent, 'rise').innerText = base_rise || '';
    find(parent, 'same30').innerText = 30 - base_rise || '';
    find(parent, 'diff30').innerText = 30 - Math.ceil(base_rise / 2 * 1000) / 1000 || '';
    find(parent, 'same33').innerText = 33 - Math.ceil(base_rise / 2 * 1000) / 1000 || '';
    find(parent, 'diff33').innerText = 33 - Math.ceil(base_rise / 4 * 1000) / 1000 || '';

});

document.getElementById('add').addEventListener('click', event => {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    const inp = document.createElement('input');
    Object.entries({type: 'number', min: '27.000', max: '33.000', step: '0.001'}).forEach(v => inp.setAttribute(v[0], v[1]));
    td.appendChild(inp);
    tr.appendChild(td);
    ['rise', 'same30', 'diff30', 'same33', 'diff33'].forEach(v => {
        const td = document.createElement('td');
        td.classList.add(v);
        tr.appendChild(td);
    });
    document.getElementById('tbl').appendChild(tr);
    inp.focus();
});

function find(parent, target) {
    let ret = null;
    [].forEach.call(parent.children, c => {
        if(c.classList.contains(target)) ret = c;
    });
    return ret;
}