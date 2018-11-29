const tbl = document.getElementById('tbl');
tbl.addEventListener('change', event => {
    const esa = parseFloat(event.target.value) * 1000;
    if (esa < 27000 || esa > 33000) {
        event.target.value = '';
        return;
    }
    const parent = event.target.parentNode.parentNode;
    const base_rise = Math.round((((esa - 27000) / 5) + 100)) / 1000;

    findFirstByClassName(parent, 'rise').innerText = base_rise || '';
    findFirstByClassName(parent, 'same30').innerText = 30 - base_rise || '';
    findFirstByClassName(parent, 'diff30').innerText = 30 - Math.ceil(base_rise / 2 * 1000) / 1000 || '';
    findFirstByClassName(parent, 'same33').innerText = 33 - Math.ceil(base_rise / 2 * 1000) / 1000 || '';
    findFirstByClassName(parent, 'diff33').innerText = 33 - Math.ceil(base_rise / 4 * 1000) / 1000 || '';

});
tbl.addEventListener('click', event => {
    const elm = event.target;
    if(!elm.classList.contains('deleteButton')) return;
    elm.parentNode.parentNode.parentNode.removeChild(elm.parentNode.parentNode);
});

document.getElementById('add').addEventListener('click', event => {
    const tr = document.getElementById('tbl').appendChild(createDOM(getTrDefine()));
    findFirstByClassName(tr, 'inp').focus();
});