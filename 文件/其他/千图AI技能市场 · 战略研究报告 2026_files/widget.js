
(function() {
  if (window.__wwei_widget_loaded) return;
  window.__wwei_widget_loaded = true;

  const AUTH_BASE = 'https://auth.wwei.ai';

  // 创建宿主元素 + Shadow DOM 隔离样式
  const host = document.createElement('div');
  host.id = 'wwei-auth-widget';
  host.style.cssText = 'position:fixed;top:16px;right:16px;z-index:2147483647;';
  document.body.appendChild(host);
  const root = host.attachShadow({ mode: 'open' });

  // 渲染 loading 占位
  root.innerHTML = renderHTML(`
    <div class="wrap">
      <div class="avatar loading"></div>
    </div>
  `);

  // fetch 登录态
  fetch(AUTH_BASE + '/me', { credentials: 'include' })
    .then(r => r.json())
    .then(d => render(d))
    .catch(() => render({ loggedIn: false }));

  function render(d) {
    if (d.loggedIn && d.user) {
      const u = d.user;
      const initial = (u.name || u.email || '?')[0].toUpperCase();
      const lvl = u.access_level || 'none';
      const lvlColors = {
        admin: '#f87171',
        svip:  '#fbbf24',
        vip:   '#6ee7b7',
        none:  '#a0a3ab',
      };
      const lvlColor = lvlColors[lvl] || '#a0a3ab';
      // 修复 P1：之前 fallback 到 lvl 原始值 → 可通过伪造 JWT 注入字符串到 HTML
      const lvlLabel = ({admin:'ADMIN', svip:'SVIP', vip:'VIP', none:'已登录'})[lvl] || 'USER';
      const avatar = u.avatar_url
        ? `<img src="${escapeAttr(u.avatar_url)}" referrerpolicy="no-referrer" alt="">`
        : `<span class="fallback">${escapeHTML(initial)}</span>`;

      root.innerHTML = renderHTML(`
        <div class="wrap">
          <button class="avatar" id="avatar" aria-label="user menu" title="${escapeAttr(u.email)} · ${lvlLabel}">
            ${avatar}
            <span class="dot" style="background:${lvlColor}" title="${lvlLabel}"></span>
          </button>
          <div class="dropdown" id="dropdown">
            <div class="dropdown-head">
              <div class="dropdown-avatar">${avatar}</div>
              <div class="dropdown-info">
                <div class="dropdown-name">${escapeHTML(u.name || u.email)}</div>
                <div class="dropdown-email">${escapeHTML(u.email)}</div>
                <div class="dropdown-level" style="color:${lvlColor};border-color:${lvlColor}40">${lvlLabel}</div>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            ${lvl === 'admin' ? '<a class="dropdown-item" href="https://admin.wwei.ai/">管理后台 →</a>' : ''}
            <a class="dropdown-item" href="${AUTH_BASE}/logout?next=${encodeURIComponent(location.href)}">退出登录</a>
          </div>
        </div>
      `);

      const btn = root.getElementById('avatar');
      const dd = root.getElementById('dropdown');
      btn.onclick = (e) => {
        e.stopPropagation();
        dd.classList.toggle('open');
      };
      document.addEventListener('click', () => dd.classList.remove('open'));
    } else {
      root.innerHTML = renderHTML(`
        <div class="wrap">
          <a class="login-btn" href="${AUTH_BASE}/login?next=${encodeURIComponent(location.href)}">登录</a>
        </div>
      `);
      // 未登录 → 触发底部 banner
      maybeShowBanner();
    }
  }

  // ─────────────────────────────────────
  // 底部 banner：仅未登录、未关闭、滚动 >30% 才出现
  // ─────────────────────────────────────
  const BANNER_KEY = 'wwei_banner_dismissed_at';
  const BANNER_TTL_DAYS = 30;

  function isBannerDismissed() {
    try {
      const ts = +(localStorage.getItem(BANNER_KEY) || 0);
      if (!ts) return false;
      return (Date.now() - ts) < BANNER_TTL_DAYS * 86400000;
    } catch { return false; }
  }

  function maybeShowBanner() {
    if (isBannerDismissed()) return;
    // 等滚动到 30% 才出
    const trigger = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop + window.innerHeight;
      const total = h.scrollHeight;
      const pct = total > 0 ? scrolled / total : 1;
      if (pct >= 0.3 || total - window.innerHeight < 200) {
        renderBanner();
        window.removeEventListener('scroll', trigger);
      }
    };
    window.addEventListener('scroll', trigger, { passive: true });
    // 首屏内容很短的页面也要兜底显示
    setTimeout(trigger, 1500);
  }

  function renderBanner() {
    if (document.getElementById('wwei-banner-host')) return;
    const bhost = document.createElement('div');
    bhost.id = 'wwei-banner-host';
    bhost.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2147483646;pointer-events:none;';
    document.body.appendChild(bhost);
    const broot = bhost.attachShadow({ mode: 'open' });

    broot.innerHTML = `<style>
      :host { all: initial; }
      * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', system-ui, sans-serif; }
      .bg { pointer-events: auto; background: rgba(10,10,12,0.92); backdrop-filter: blur(20px) saturate(180%);
            border-top: 1px solid rgba(255,255,255,0.08); box-shadow: 0 -8px 32px rgba(0,0,0,0.3);
            color: #f4f4f5; animation: slideUp .35s cubic-bezier(0.16,1,0.3,1); }
      @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      .row { max-width: 1080px; margin: 0 auto; padding: 14px 20px; display: flex; align-items: center; gap: 18px; }
      .text { flex: 1; min-width: 0; }
      .title { font-size: 14px; font-weight: 600; line-height: 1.4; letter-spacing: -0.005em; }
      .sub { font-size: 12px; color: #a1a1aa; margin-top: 3px; line-height: 1.5; }
      .actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
      .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px;
             background: #ffffff; color: #18181b; border: 0; border-radius: 8px;
             font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none;
             transition: all .15s; font-family: inherit; white-space: nowrap; }
      .btn:hover { background: #f4f4f5; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.25); }
      .btn svg { width: 16px; height: 16px; }
      .close { background: transparent; border: 0; color: #71717a; width: 32px; height: 32px;
               display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
               border-radius: 6px; transition: all .12s; font-size: 18px; line-height: 1; padding: 0; }
      .close:hover { background: rgba(255,255,255,0.06); color: #f4f4f5; }
      .brand { display: inline-block; padding: 2px 7px; font-size: 10px; font-weight: 600;
               letter-spacing: 0.06em; color: #6ee7b7; background: rgba(110,231,183,0.1);
               border-radius: 4px; margin-right: 8px; vertical-align: middle;
               font-family: 'JetBrains Mono', ui-monospace, monospace; text-transform: uppercase; }
      @media (max-width: 640px) {
        .row { padding: 12px 14px; gap: 10px; flex-wrap: nowrap; }
        .title { font-size: 13px; }
        .sub { display: none; }
        .btn { padding: 8px 12px; font-size: 12px; }
        .btn-text { display: none; }
      }
    </style>
    <div class="bg">
      <div class="row">
        <div class="text">
          <div class="title"><span class="brand">wwei.ai</span>登录解锁 Wayne 的全部研究内容</div>
          <div class="sub">商业判断 · 研究报告 · AI 工具 · 企业级交付方案 · 登录可加 Wayne 微信</div>
        </div>
        <div class="actions">
          <a class="btn" id="banner-cta" href="${AUTH_BASE}/login?next=${encodeURIComponent(location.href)}">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="btn-text">使用 Google 登录</span>
          </a>
          <button class="close" id="banner-close" aria-label="关闭">×</button>
        </div>
      </div>
    </div>`;

    broot.getElementById('banner-close').addEventListener('click', () => {
      try { localStorage.setItem(BANNER_KEY, String(Date.now())); } catch {}
      bhost.style.transition = 'opacity .25s, transform .25s';
      bhost.style.opacity = '0';
      bhost.style.transform = 'translateY(20px)';
      setTimeout(() => bhost.remove(), 280);
    });
  }

  function escapeHTML(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function escapeAttr(s) {
    return String(s == null ? '' : s).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function renderHTML(body) {
    return `<style>
      :host { all: initial; }
      * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }
      .wrap { position: relative; }
      .avatar {
        width: 36px; height: 36px; border-radius: 50%; padding: 0; cursor: pointer; position: relative;
        border: 2px solid rgba(255,255,255,0.15); background: #111214; color: #f0f0f2;
        display: flex; align-items: center; justify-content: center; overflow: hidden;
        transition: all .2s; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      .avatar:hover { transform: scale(1.05); border-color: rgba(255,255,255,0.3); }
      .avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
      .avatar .fallback { font-weight: 600; font-size: 14px; }
      .avatar.loading { animation: pulse 1.4s infinite; cursor: default; }
      @keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 0.9; } }
      .dot {
        position: absolute; bottom: -2px; right: -2px; width: 12px; height: 12px;
        border-radius: 50%; border: 2px solid #111214;
      }
      .login-btn {
        display: inline-block; padding: 7px 16px; border-radius: 100px;
        background: rgba(110, 231, 183, 0.95); color: #08090a; font-size: 13px; font-weight: 500;
        text-decoration: none; transition: all .2s; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        border: 1px solid rgba(110, 231, 183, 0.3);
      }
      .login-btn:hover { background: #6ee7b7; transform: translateY(-1px); }
      .dropdown {
        position: absolute; top: 44px; right: 0; min-width: 260px;
        background: #111214; border: 1px solid #1e2024; border-radius: 12px;
        padding: 16px; opacity: 0; transform: translateY(-6px) scale(0.96);
        pointer-events: none; transition: all .18s cubic-bezier(.4,0,.2,1);
        box-shadow: 0 12px 40px rgba(0,0,0,0.4); color: #f0f0f2;
      }
      .dropdown.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
      .dropdown-head { display: flex; gap: 12px; align-items: center; }
      .dropdown-avatar { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: #1e2024; display: flex; align-items: center; justify-content: center; }
      .dropdown-avatar img { width: 100%; height: 100%; object-fit: cover; }
      .dropdown-info { flex: 1; min-width: 0; }
      .dropdown-name { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .dropdown-email { font-size: 11px; color: #a0a3ab; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .dropdown-level {
        display: inline-block; margin-top: 6px; padding: 2px 8px; border-radius: 4px;
        font-size: 10px; font-weight: 600; letter-spacing: 0.05em;
        border: 1px solid;
      }
      .dropdown-divider { height: 1px; background: #1e2024; margin: 14px 0; }
      .dropdown-item {
        display: block; padding: 8px 12px; font-size: 13px; color: #f0f0f2;
        text-decoration: none; border-radius: 6px; transition: background .15s;
      }
      .dropdown-item:hover { background: #1e2024; }
    </style>${body}`;
  }
})();
