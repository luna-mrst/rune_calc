(() => {
  const old = document.getElementById('msecTimer');
  if (old != null) {
    return;
  } else {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = `
    #msecTimer {
      font-size: 25px;
      width: 8em;
      height: 1.5em;
      text-align: center;
      position: fixed;
      top: 10px;
      left: 10px;
      border: 1px solid black;
      border-radius: 5%;
      background: white;
      z-index: 1000;
    }
    #msecTimer span {
      display: inline-block;
      width: 5.5em;
    }
    #msecTimer .reload {
      position: relative;
      top: 6px;
      left: 2px;
      width: 25px;
      height: 25px;
      border: 3px solid;
      border-right-color: transparent;
      border-radius: 100%;
      box-sizing: border-box;
      display: inline-block;
      margin-right: 15px;
      cursor: pointer;
    }
    #msecTimer .reload:before {
      position: absolute;
      top: 5px;
      right: -4.5px;
      content: "";
      height: 10px;
      width: 10px;
      border: 5px solid transparent;
      border-top: 10px solid;
      background: transparent;
      transform-origin: left top;
      transform: rotate(-40deg);
      box-sizing: border-box;
    }`;
    document.head.appendChild(style);
  }
  const elm = document.createElement('div');
  elm.id = 'msecTimer';
  document.body.appendChild(elm);
  const reload = document.createElement('div');
  reload.classList.add('reload');
  elm.appendChild(reload);
  const span = document.createElement('span');
  elm.appendChild(span);

  const point = { x: 0, y: 0 };
  let diff = 0;

  const mdown = e => {
    if(e.target === reload) {
      return;
    }
    point.x = e.pageX - elm.offsetLeft;
    point.y = e.pageY - elm.offsetTop;

    document.body.addEventListener('mousemove', mmove, false);
  };

  const mmove = e => {
    e.preventDefault();

    elm.style.top = e.pageY - point.y + 'px';
    elm.style.left = e.pageX - point.x + 'px';


    elm.addEventListener('mouseup', e => {
      document.body.removeEventListener('mousemove', mmove, false);
    }, false);
  };

  const refleshDiff = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://ntp-a1.nict.go.jp/cgi-bin/json?' + (Date.now() / 1000), true);
    xhr.onload = () => {
      const res = JSON.parse(xhr.response);
      const now = Date.now();
      diff = ((res.st * 1000) + ((now - (res.it * 1000)) / 2)) - now;
    };
    xhr.send();
  };

  elm.addEventListener('mousedown', mdown, false);

  const getTime = () => {
    const date = new Date(Date.now() + diff);
    return `${('0'+date.getHours()).slice(-2)}:${('0'+date.getMinutes()).slice(-2)}:${('0'+date.getSeconds()).slice(-2)}.${Math.floor(date.getMilliseconds() / 100)}`;
  };

  reload.addEventListener('click', e => {
    e.preventDefault();
    refleshDiff();
  });

  setInterval(() => {
    span.innerText = getTime();
  }, 100);
  refleshDiff();
})();
