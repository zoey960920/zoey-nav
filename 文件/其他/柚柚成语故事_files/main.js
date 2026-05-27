/* 柚柚成语故事 · 主页逻辑 v0.4
 * - 单屏首页（一屏完成核心交互）
 * - 100 宫格作为浮层（modal）
 * - localStorage 进度记忆
 */

const STORAGE_KEY = 'yoyo_chengyu_progress';

const STYLE_AVATAR = {
  v1: 'assets/avatars/yoyo_v1.png',
  v2: 'assets/avatars/yoyo_v2.png',
  v4: 'assets/avatars/yoyo_v4.png',
  v5: 'assets/avatars/yoyo_v5.png',
  v6: 'assets/avatars/yoyo_v6.png',
};

let DATA = null;
let progress = loadProgress();

// ----- 进度管理 -----
function loadProgress(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return { learned: [], started: null };
    return JSON.parse(raw);
  }catch(e){ return { learned: [], started: null }; }
}
function saveProgress(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function calculateTodayId(){
  if(!progress.started){
    progress.started = new Date().toISOString().slice(0,10);
    saveProgress();
  }
  const startDate = new Date(progress.started);
  const today = new Date();
  startDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  const diffDays = Math.floor((today - startDate) / 86400000);
  return Math.min(100, Math.max(1, diffDays + 1));
}

// ----- 渲染 -----
async function init(){
  try{
    const res = await fetch('data/episodes.json');
    DATA = await res.json();
  }catch(e){
    showFetchHint();
    return;
  }

  const todayId = calculateTodayId();
  window.__todayEpId = todayId;  // 供 speakTodayIdiom 拼 audio URL 用
  const todayEp = findEpisode(todayId);
  renderToday(todayId, todayEp);
  renderAvatar(todayEp);
  renderChapters();
  updateProgressBar();
  updateGreeting();
  renderSettingsPanel();
}

// === 设置面板 ===
function renderSettingsPanel(){
  if(!window.AudioSettings) return;
  // 顶栏右侧"全部 100 集"按钮旁加一个齿轮
  const topBar = document.querySelector('.top-bar');
  if(!topBar) return;
  if(topBar.querySelector('.settings-btn')) return;  // 已存在则跳过

  const btn = document.createElement('button');
  btn.className = 'all-btn settings-btn';
  btn.innerHTML = '⚙️ 声音';
  btn.style.marginRight = '8px';
  btn.onclick = openSettings;
  topBar.querySelector('.all-btn').before(btn);
}

window.openSettings = function(){
  if(!window.AudioSettings) return;
  const cur = window.AudioSettings.get();
  let overlay = document.getElementById('settingsOverlay');
  if(!overlay){
    overlay = document.createElement('div');
    overlay.id = 'settingsOverlay';
    overlay.className = 'overlay';
    overlay.innerHTML = `
      <div class="modal" style="max-width:480px">
        <div class="modal-head">
          <h2>🔊 声音设置</h2>
          <button class="modal-close" onclick="closeSettings()">✕</button>
        </div>
        <div class="modal-body">
          <h3 style="font-size:14px;margin-bottom:10px;opacity:.7">选一个讲故事的声音</h3>
          <div id="voiceList"></div>
          <h3 style="font-size:14px;margin:18px 0 10px;opacity:.7">语速（Web Speech fallback 时生效）</h3>
          <input type="range" id="rateSlider" min="0.5" max="1.5" step="0.05" style="width:100%">
          <div style="display:flex;justify-content:space-between;font-size:11px;opacity:.5;margin-top:4px">
            <span>慢</span><span id="rateValue">1.0×</span><span>快</span>
          </div>
          <h3 style="font-size:14px;margin:18px 0 10px;opacity:.7">先点一下试听</h3>
          <button class="btn btn-ghost" style="width:100%" onclick="testCurrentVoice()">🔉 试听一句</button>
          <p style="font-size:12px;opacity:.5;margin-top:18px;line-height:1.6">
            预生成的真人风 mp3（晓晓 · 讲故事等）需要联网首次加载。<br>
            网络慢/资源缺失时自动回退到浏览器自带语音。
          </p>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  // 渲染 voice 列表
  const list = overlay.querySelector('#voiceList');
  list.innerHTML = window.AudioSettings.voices.map(v => `
    <label class="voice-option" style="display:flex;align-items:center;gap:10px;padding:12px 14px;border:1.5px solid ${cur.voiceKey===v.key?'var(--vermillion)':'rgba(49,41,32,.08)'};border-radius:12px;margin-bottom:8px;cursor:pointer;background:${cur.voiceKey===v.key?'rgba(192,72,81,.04)':'#fff'}">
      <input type="radio" name="voice" value="${v.key}" ${cur.voiceKey===v.key?'checked':''} onchange="onVoiceChange(this.value)" style="cursor:pointer">
      <div style="flex:1">
        <div style="font-weight:600">${v.label}</div>
        <div style="font-size:12px;opacity:.6;margin-top:2px">${v.hint}</div>
      </div>
    </label>
  `).join('');
  // rate slider
  const slider = overlay.querySelector('#rateSlider');
  slider.value = cur.rate;
  overlay.querySelector('#rateValue').textContent = (+cur.rate).toFixed(2) + '×';
  slider.oninput = () => {
    window.AudioSettings.setRate(slider.value);
    overlay.querySelector('#rateValue').textContent = (+slider.value).toFixed(2) + '×';
  };
  overlay.classList.add('show');
};
window.closeSettings = function(){
  const o = document.getElementById('settingsOverlay');
  if(o) o.classList.remove('show');
};
window.onVoiceChange = function(k){
  window.AudioSettings.setVoice(k);
  // 视觉上更新选中边框
  document.querySelectorAll('#voiceList .voice-option').forEach(el => {
    const isChecked = el.querySelector('input').value === k;
    el.style.borderColor = isChecked ? 'var(--vermillion)' : 'rgba(49,41,32,.08)';
    el.style.background = isChecked ? 'rgba(192,72,81,.04)' : '#fff';
  });
};
window.testCurrentVoice = function(){
  const sampleText = '柚柚，今天我们来听一个故事。';
  if(window.stopSpeak) window.stopSpeak();
  // 找一个示例预生成的音频（Ep1 idiom 守株待兔）—— 没有则纯文字回退
  const url = `assets/audio/<VOICE>/ep_001/idiom.mp3`;
  speakIdiom(sampleText, null, { audioUrl: url });
};

function findEpisode(id){
  for(const ch of DATA.chapters){
    for(const ep of ch.episodes){
      if(ep.id === id) return { ep, ch };
    }
  }
  return null;
}

function renderToday(id, found){
  if(!found) return;
  const { ep } = found;
  document.getElementById('todayNum').textContent = `第 ${id} 期 / 全 100 期`;
  document.getElementById('todayIdiom').textContent = ep.idiom;
  document.getElementById('todayPinyin').textContent = ep.pinyin;
  document.getElementById('todayCore').textContent = ep.core;
}

function renderAvatar(found){
  if(!found) return;
  const src = STYLE_AVATAR[found.ep.style] || STYLE_AVATAR.v2;
  document.getElementById('yoyoAvatar').src = src;
}

function renderChapters(){
  const wrap = document.getElementById('chaptersContainer');
  const todayId = calculateTodayId();
  let html = '';
  for(const ch of DATA.chapters){
    html += `
      <div class="chapter">
        <div class="chapter-head">
          <span class="ch-num">第 ${ch.ch} 章</span>
          <h3>${ch.title}</h3>
        </div>
        <div class="episodes">
          ${ch.episodes.map(ep => renderCell(ep, todayId)).join('')}
        </div>
      </div>
    `;
  }
  wrap.innerHTML = html;
}

function renderCell(ep, todayId){
  const isLearned = progress.learned.includes(ep.id);
  const isToday = ep.id === todayId;
  const isLocked = ep.id > todayId;
  const isSpecial = ep.is_special || ep.is_finale;

  const cls = [
    'ep-cell',
    isToday ? 'today' : '',
    isLearned && !isToday ? 'learned' : '',
    isLocked ? 'locked' : '',
    isSpecial ? 'special' : ''
  ].filter(Boolean).join(' ');

  const onclick = isLocked ? '' : `onclick="openEpisode(${ep.id})"`;

  return `
    <div class="${cls}" ${onclick} title="${ep.idiom} · ${ep.pinyin}">
      <span class="num">${ep.id}</span>
      <span class="ch-idiom">${ep.idiom}</span>
    </div>
  `;
}

function updateProgressBar(){
  const learned = progress.learned.length;
  const pct = Math.max(1, learned);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLearned').textContent = learned;
  document.getElementById('progressLeft').textContent = 100 - learned;

  // 计算小墨当前尾巴数：取已学集中最大 fox_tails；尚未学任何就是 1（出场态）
  let maxTails = 1;
  if(DATA){
    for(const ch of DATA.chapters){
      for(const ep of ch.episodes){
        if(progress.learned.includes(ep.id) && ep.fox_tails && ep.fox_tails > maxTails){
          maxTails = ep.fox_tails;
        }
      }
    }
  }
  const tailsNow = document.getElementById('tailsNow');
  const tailsDots = document.getElementById('tailsDots');
  if(tailsNow) tailsNow.textContent = maxTails;
  if(tailsDots){
    let html = '';
    for(let i=1;i<=9;i++){
      html += `<span class="tail ${i<=maxTails?'on':''}"></span>`;
    }
    tailsDots.innerHTML = html;
  }
}

function updateGreeting(){
  const h = new Date().getHours();
  let msg;
  if(h < 6)       msg = '夜深啦，柚柚 🌙（爸爸该睡觉了）';
  else if(h < 11) msg = '早安，柚柚 ☀️';
  else if(h < 14) msg = '中午好，柚柚 🍱';
  else if(h < 18) msg = '下午好，柚柚 🌿';
  else if(h < 21) msg = '晚饭后听个故事吧，柚柚 🌅';
  else            msg = '睡前故事时间，柚柚 🌜';
  document.getElementById('greetMsg').textContent = msg;
}

// ----- 操作 -----
function goToToday(){
  openEpisode(calculateTodayId());
}

window.openEpisode = function(id){
  window.location.href = `episode.html?id=${id}`;
};

window.openAll = function(){
  document.getElementById('allOverlay').classList.add('show');
};

window.closeAll = function(){
  document.getElementById('allOverlay').classList.remove('show');
};

// ESC 关闭浮层
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeAll();
});

// 调试：清空进度
window.resetProgress = function(){
  if(confirm('确定清空全部学习进度吗？')){
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
};
window.setDay = function(n){
  const d = new Date();
  d.setDate(d.getDate() - (n-1));
  progress.started = d.toISOString().slice(0,10);
  saveProgress();
  location.reload();
};

function showFetchHint(){
  const stage = document.querySelector('.stage');
  stage.innerHTML = `
    <div style="padding:24px;background:#FFF4E6;border-radius:14px;border-left:3px solid #C04851;max-width:480px">
      <h3 style="color:#C04851;margin-bottom:8px">数据加载受限</h3>
      <p style="font-size:13px;line-height:1.7">
      file:// 协议下浏览器拦截了 fetch。<br>
      解决：在 site/ 目录运行：<br>
      <code style="background:#fff;padding:4px 8px;border-radius:4px">python3 -m http.server 8642</code><br>
      然后打开 <code>http://localhost:8642</code>
      </p>
    </div>
  `;
}

init();
