/* 柚柚成语故事 · 读音模块 v0.7
 *
 * 双轨：
 *   1. 优先预生成 mp3（Microsoft Edge TTS 合成的 Azure Neural voice — 有感情）
 *   2. fallback Web Speech API（iOS Tingting/Mei-Jia — 机械）
 *
 * Voice 切换 + 速度调节存 localStorage，全局 settings 模块管理。
 */

(function(){
  // === 设置（在 localStorage 里持久化）===
  const SETTINGS_KEY = 'yoyo_chengyu_audio_settings';
  const VOICE_OPTIONS = [
    { key: 'xiaoxiao_story',  label: '晓晓 · 讲故事',  hint: '温暖讲故事感（默认 / 妈妈风）',  webspeech_hint: 'Tingting' },
    { key: 'xiaoyi_lively',   label: '晓伊 · 卡通',    hint: '卡通活泼女声（适合白天）',     webspeech_hint: 'Tingting' },
    { key: 'yunxia_cute',     label: '云夏 · 萌哥哥',   hint: '萌系男声（小哥哥风）',          webspeech_hint: 'Sin-ji' },
  ];

  function loadSettings(){
    try{
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : {};
    }catch(e){ return {}; }
  }
  function saveSettings(s){
    try{ localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }catch(e){}
  }
  let SETTINGS = Object.assign({
    voiceKey: 'xiaoxiao_story',
    rate: 0.95,           // 全局速度（Web Speech 用；mp3 由预合成时固化）
    useMp3: true,
  }, loadSettings());

  window.AudioSettings = {
    voices: VOICE_OPTIONS,
    get(){ return Object.assign({}, SETTINGS); },
    setVoice(k){
      if(!VOICE_OPTIONS.find(v=>v.key===k)) return;
      SETTINGS.voiceKey = k; saveSettings(SETTINGS);
    },
    setRate(r){ SETTINGS.rate = Math.max(0.5, Math.min(1.5, +r)); saveSettings(SETTINGS); },
    setUseMp3(b){ SETTINGS.useMp3 = !!b; saveSettings(SETTINGS); },
  };

  // === Web Speech API（fallback）===
  let voicesReady = false;
  let preferredVoice = null;

  function pickVoice(){
    const voices = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    if(!voices.length) return null;
    const prefs = ['Tingting', 'Mei-Jia', 'Sin-ji', 'Yu-shu', 'Ya-ling'];
    for(const name of prefs){
      const v = voices.find(x => x.name && x.name.includes(name));
      if(v) return v;
    }
    return voices.find(v => /zh[-_]CN/i.test(v.lang)) ||
           voices.find(v => /^zh/i.test(v.lang)) ||
           null;
  }
  function ensureVoices(cb){
    if(voicesReady){ cb(preferredVoice); return; }
    const v = pickVoice();
    if(v){ preferredVoice = v; voicesReady = true; cb(v); return; }
    if(window.speechSynthesis && 'onvoiceschanged' in speechSynthesis){
      speechSynthesis.addEventListener('voiceschanged', function once(){
        speechSynthesis.removeEventListener('voiceschanged', once);
        preferredVoice = pickVoice(); voicesReady = true; cb(preferredVoice);
      }, {once:true});
    }else{
      setTimeout(() => { preferredVoice = pickVoice(); voicesReady = true; cb(preferredVoice); }, 200);
    }
  }

  // === 当前序列控制 ===
  let currentToken = 0;        // 每次 speakSequence 自增，所有播放检查这个 token 判断是否仍有效
  let currentAudio = null;     // 当前在播放的 <audio> 元素

  function stopAll(){
    currentToken++;
    if(window.speechSynthesis) speechSynthesis.cancel();
    if(currentAudio){
      try{ currentAudio.pause(); currentAudio.src = ''; }catch(e){}
      currentAudio = null;
    }
    document.querySelectorAll('.speak-btn.speaking').forEach(b => b.classList.remove('speaking'));
  }
  window.stopSpeak = stopAll;

  // 尝试播 mp3；成功返回 Promise<true>，失败返回 Promise<false>
  function tryPlayMp3(audioUrl, token, btn){
    return new Promise((resolve) => {
      if(!audioUrl || !SETTINGS.useMp3){ resolve(false); return; }
      const url = audioUrl.replace('<VOICE>', SETTINGS.voiceKey);
      const a = new Audio(url);
      currentAudio = a;
      let started = false;
      a.onplaying = () => { started = true; };
      a.onended = () => {
        if(btn) btn.classList.remove('speaking');
        if(token !== currentToken){ resolve(false); return; }
        currentAudio = null;
        resolve(true);
      };
      a.onerror = () => {
        if(btn) btn.classList.remove('speaking');
        if(currentAudio === a) currentAudio = null;
        resolve(false);
      };
      // 启动播放（需要 user gesture 才能 autoplay，但在用户点击翻页/喇叭后即可）
      a.play().then(() => {
        if(btn) btn.classList.add('speaking');
      }).catch(() => {
        if(btn) btn.classList.remove('speaking');
        resolve(false);
      });
      // 6s 超时还没 playing → 当作失败
      setTimeout(() => { if(!started && token === currentToken){ resolve(false); } }, 6000);
    });
  }

  function speakWebSpeechOnce(text, rate, token, btn){
    return new Promise((resolve) => {
      if(!('speechSynthesis' in window)){ resolve(); return; }
      ensureVoices(voice => {
        if(token !== currentToken){ resolve(); return; }
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'zh-CN';
        u.rate = rate;
        u.pitch = 1;
        if(voice) u.voice = voice;
        u.onend = () => { if(btn) btn.classList.remove('speaking'); resolve(); };
        u.onerror = () => { if(btn) btn.classList.remove('speaking'); resolve(); };
        if(btn) btn.classList.add('speaking');
        speechSynthesis.speak(u);
      });
    });
  }

  // === 对外 API ===

  // 慢读成语（专用慢速）
  // opts: { audioUrl }
  window.speakIdiom = async function(text, btn, opts){
    stopAll();
    const token = currentToken;
    if(btn) btn.classList.add('speaking');
    const audioUrl = opts && opts.audioUrl;
    const ok = await tryPlayMp3(audioUrl, token, btn);
    if(token !== currentToken) return;
    if(!ok){
      await speakWebSpeechOnce(text, 0.65, token, btn);
    }
  };

  // 顺序朗读多段
  // items: [{text, audioUrl?, btn?}, ...]
  // opts: { gap, onAllEnd, rate }
  window.speakSequence = function(items, opts){
    opts = opts || {};
    if(!items || !items.length) return () => {};
    stopAll();
    const myToken = currentToken;
    const gap = opts.gap != null ? opts.gap : 250;
    const rate = opts.rate != null ? opts.rate : SETTINGS.rate;

    let i = 0;
    async function next(){
      if(myToken !== currentToken) return;
      if(i >= items.length){
        if(opts.onAllEnd) opts.onAllEnd();
        return;
      }
      const it = items[i++];
      const btn = it.btn || null;
      // 优先 mp3
      let played = false;
      if(it.audioUrl){
        played = await tryPlayMp3(it.audioUrl, myToken, btn);
      }
      if(myToken !== currentToken) return;
      // fallback Web Speech
      if(!played){
        if(btn) btn.classList.add('speaking');
        await speakWebSpeechOnce(it.text, rate, myToken, btn);
      }
      if(myToken !== currentToken) return;
      setTimeout(next, gap);
    }
    next();
    return function cancel(){ stopAll(); };
  };

  window.addEventListener('beforeunload', () => { stopAll(); });
})();
