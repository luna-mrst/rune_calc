(() => {
  const old = document.getElementById('msecTimer');
  if (old != null) {
    document.body.removeChild(old);
    clearInterval(window.msecTimer.timer);
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
      z-index: 2147483647;
    }
    #msecTimer span {
      display: inline-block;
      width: 5.5em;
      vertical-align: middle;
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
    window.msecTimer = {};
  }
  const elm = document.createElement('div');
  elm.id = 'msecTimer';
  elm.classList.add('notranslate');
  document.body.appendChild(elm);
  const reload = document.createElement('div');
  reload.classList.add('reload');
  elm.appendChild(reload);
  const span = document.createElement('span');
  elm.appendChild(span);
  const apiList = [
    'https://ntp-a1.nict.go.jp/cgi-bin/json?',
    'https://ntp-b1.nict.go.jp/cgi-bin/json?',
    'http://ntp-a1.nict.go.jp/cgi-bin/json?',
    'http://ntp-b1.nict.go.jp/cgi-bin/json?'
  ];

  const point = { x: 0, y: 0 };
  let diff = 0;

  const mdown = e => {
    if (e.target === reload) {
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
    fetch(apiList[0] + (Date.now() / 1000), {
      mode: 'cors'
    })
      .then(res => res.json())
      .then(time => {
        const now = Date.now();
        diff = ((time.st * 1000) + ((now - (time.it * 1000)) / 2)) - now;
      })
      .catch(e => {
        console.log(`error occurred in API ${apiList.shift()}, removed.`);
        if (apiList.length > 0) refleshDiff();
        else {
          alert('エラー起きたから終了するよ');
          document.body.removeChild(elm);
          clearInterval(window.msecTimer.timer);
        }
      });
  };

  elm.addEventListener('mousedown', mdown, false);

  const getTime = () => {
    const date = new Date(Date.now() + diff);
    return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}.${Math.floor(date.getMilliseconds() / 100)}`;
  };

  reload.addEventListener('click', e => {
    e.preventDefault();
    refleshDiff();
  });

  window.msecTimer.timer = setInterval(() => {
    span.innerText = getTime();
  }, 100);
  refleshDiff();
})();

// javascript:((a,b,o)=>{const c=a.getElementById('msecTimer');if(c!=null){a.body.removeChild(c);clearInterval(b.msecTimer.timer);return;}else{const d=a.createElement('style');d.type='text/css';d.innerText=`#msecTimer{font-size:25px;width:8em;height:1.5em;text-align:center;position:fixed;top:10px;left:10px;border:1px solid black;border-radius:5%;background:white;z-index:2147483647;}#msecTimer span{display:inline-block;width:5.5em;vertical-align:middle;}#msecTimer .reload{position:relative;top:6px;left:2px;width:25px;height:25px;border:3px solid;border-right-color:transparent;border-radius:100%;box-sizing:border-box;display:inline-block;margin-right:15px;cursor:pointer;}#msecTimer .reload:before{position:absolute;top:5px;right:-4.5px;content:"";height:10px;width:10px;border:5px solid transparent;border-top:10px solid;background:transparent;transform-origin:left top;transform:rotate(-40deg);box-sizing:border-box;}`;a.head.appendChild(d);b.msecTimer={};}const e=a.createElement('div');e.id='msecTimer';e.classList.add('notranslate');a.body.appendChild(e);const f=a.createElement('div');f.classList.add('reload');e.appendChild(f);const g=a.createElement('span');e.appendChild(g);const h=['https://ntp-a1.nict.go.jp/cgi-bin/json?','https://ntp-b1.nict.go.jp/cgi-bin/json?','http://ntp-a1.nict.go.jp/cgi-bin/json?','http://ntp-b1.nict.go.jp/cgi-bin/json?'];const i={x:0,y:0};let j=0;const k=z=>{if(z.target===f)return;i.x=z.pageX-e.offsetLeft;i.y=z.pageY-e.offsetTop;a.body.addEventListener('mousemove',l,false);};const l=z=>{z.preventDefault();e.style.top=z.pageY-i.y+'px';e.style.left=z.pageX-i.x+'px';e.addEventListener('mouseup',o=>{a.body.removeEventListener('mousemove',l,false);},false);};const m=z=>{fetch(h[0]+(o.now()/1000),{mode: 'cors'}).then(y=>y.json()).then(x=>{const w=o.now();j=((x.st*1000)+((w-(x.it*1000))/2))-w;}).catch(v=>{console.log(`error occurred in API ${h.shift()}, removed.`);if(h.length>0)m();else{alert('エラー起きたから終了するよ');a.body.removeChild(v);clearInterval(b.msecTimer.timer);}});};e.addEventListener('mousedown',k,false);const n=z=>{const y=new o(o.now()+j);return `${('0'+y.getHours()).slice(-2)}:${('0'+y.getMinutes()).slice(-2)}:${('0'+y.getSeconds()).slice(-2)}.${Math.floor(y.getMilliseconds()/100)}`;};f.addEventListener('click',z=>{z.preventDefault();m();});b.msecTimer.timer=setInterval(z=>{g.innerText=n();},100);m();})(document,window,Date);