/* ═══════════════════════════════════════════════════
   上海公园地图 — 主应用逻辑
   模块: 地图 · 筛选 · 列表 · 详情面板
   ═══════════════════════════════════════════════════ */

'use strict';

// ── 应用状态 ─────────────────────────────────────
const State = {
  map: null,
  markers: {},          // { parkId: AMap.Marker }
  cluster: null,
  infoWindow: null,
  selectedId: null,
  filters: {
    district: '',
    type: '',
    audience: '',
    search: ''
  },
  filteredParks: [...PARKS_DATA]
};

// ── 设施图标映射 ──────────────────────────────────
const FACILITY_ICONS = {
  '停车场': '🅿️', '厕所': '🚻', '餐厅': '🍜', '咖啡馆': '☕',
  '儿童乐园': '🎠', '湖面': '🌊', '游船': '⛵', '单车租赁': '🚲',
  '健身器材': '💪', '篮球场': '🏀', '足球场': '⚽', '网球场': '🎾',
  '步道': '🥾', '露营区': '⛺', '烧烤区': '🔥', '观鸟台': '🦅',
  '湿地栈道': '🌿', '温室': '🏡', '博物馆': '🏛️', '古建筑': '🏯',
  '马场': '🐴', '游泳馆': '🏊', '科普中心': '🔬', '运动场': '🏃',
  '广场': '🏙️', '草坪': '🌱', '人工湖': '💧', '观景台': '🔭'
};

const AUDIENCE_ICONS = {
  '亲子': '👨‍👩‍👧', '运动': '🏃', '老年': '👴', '遛狗': '🐕',
  '拍照': '📷', '野餐': '🧺', '文化': '📚'
};

// ── 初始化 ────────────────────────────────────────
function init() {
  const totalEl = document.getElementById('totalCount');
  if (totalEl) totalEl.textContent = PARKS_DATA.length;

  initMap();
  initFilters();
  initSearch();
  renderList(PARKS_DATA);
  updateCount(PARKS_DATA.length);
  initTouchFix();
  initSidebarDrag();
}

// ── 移动端 Touch 滑动修复 ─────────────────────
// AMap canvas 会拦截所有 touchmove，导致覆盖在地图上的 panel/sidebar 无法滚动
// 在这些容器上 stopPropagation，阻止事件透传到地图层
function initTouchFix() {
  var els = [
    document.querySelector('.sidebar'),
    document.getElementById('detailPanel')
  ];
  els.forEach(function (el) {
    if (!el) return;
    ['touchstart', 'touchmove', 'touchend'].forEach(function (evt) {
      el.addEventListener(evt, function (e) {
        e.stopPropagation();
      }, { passive: true });
    });
  });
}

// ── 地图初始化 ────────────────────────────────────
function initMap() {
  // 安全网：无论如何 3s 后强制隐藏加载屏（第一行，确保不被后续错误阻断）
  setTimeout(function () { hideLoading(); }, 3000);

  State.map = new AMap.Map('mapContainer', {
    zoom: 10,
    center: [121.48, 31.25],
    mapStyle: 'amap://styles/normal',
    showIndoorMap: false
  });

  State.infoWindow = new AMap.InfoWindow({
    isCustom: true,
    autoMove: true,
    closeWhenClickMap: true,
    offset: new AMap.Pixel(0, -20)
  });

  // 地图完成后：添加标记 + 隐藏加载屏
  State.map.on('complete', function () {
    try { addAllMarkers(); } catch(e) { console.error('addAllMarkers error:', e); }
    hideLoading();
  });

  // 点击地图空白区域关闭InfoWindow、选中态，并恢复侧边栏
  State.map.on('click', function () {
    State.infoWindow.close();
    clearSelected();
    document.getElementById('detailPanel').classList.remove('open');
    collapseSidebar(); // 移动端：点地图回到收起态
  });
}

// ── 标记点 HTML 内容工厂 ───────────────────────────
function makeMarkerContent(color, active) {
  var size   = active ? 22 : 16;
  var border = active ? '3px solid #fff' : '2px solid #fff';
  var shadow = active ? '0 2px 10px rgba(0,0,0,.55)' : '0 1px 5px rgba(0,0,0,.4)';
  return '<div style="'
    + 'width:'+ size +'px;height:'+ size +'px;'
    + 'background:'+ color +';'
    + 'border-radius:50%;'
    + 'border:'+ border +';'
    + 'box-shadow:'+ shadow +';'
    + 'cursor:pointer;'
    + 'box-sizing:border-box;'
    + '"></div>';
}

// ── 添加所有标记点 ─────────────────────────────────
function addAllMarkers() {
  PARKS_DATA.forEach(function (park) {
    var color   = (PARK_TYPES[park.type] || { color: '#4CAF7D' }).color;
    var content = makeMarkerContent(color, false);

    var marker = new AMap.Marker({
      position: new AMap.LngLat(park.coordinates[0], park.coordinates[1]),
      content:  content,
      offset:   new AMap.Pixel(-8, -8),
      title:    park.name,
      zIndex:   100,
      extData:  { id: park.id, color: color }
    });

    marker.on('click', function () { onMarkerClick(park); });

    State.markers[park.id] = marker;
    State.map.add(marker);
  });
}

// ── 标记点点击 ─────────────────────────────────────
function onMarkerClick(park) {
  const type = PARK_TYPES[park.type] || { color: '#4CAF7D' };

  // InfoWindow 内容
  const content = `
    <div class="info-popup" onclick="openDetail('${park.id}')">
      <div class="info-popup-top">
        <div class="info-popup-name">${park.name}</div>
        <div class="info-popup-meta">
          <span class="type-tag" style="color:${type.color};background:${type.bg}">${park.type}</span>
          <span>${park.district}</span>
        </div>
      </div>
      <div class="info-popup-bottom">
        <span class="info-popup-area">📐 ${park.area} 公顷</span>
        <span class="info-popup-link">查看详情 →</span>
      </div>
    </div>`;

  State.infoWindow.setContent(content);
  State.infoWindow.open(State.map, State.markers[park.id].getPosition());

  // 高亮选中
  selectMarker(park.id);
  // 侧栏选中
  scrollToCard(park.id);
}

// ── 选中态 ────────────────────────────────────────
function selectMarker(id) {
  // 清除上次选中
  if (State.selectedId && State.selectedId !== id) {
    updateMarkerIcon(State.selectedId, false);
  }
  State.selectedId = id;
  updateMarkerIcon(id, true);

  // 列表卡片
  document.querySelectorAll('.park-card').forEach(function (el) {
    el.classList.toggle('selected', el.dataset.id === id);
  });
}

function updateMarkerIcon(id, active) {
  var marker = State.markers[id];
  if (!marker) return;
  var color  = marker.getExtData().color || '#4CAF7D';
  var offset = active ? -11 : -8;
  marker.setContent(makeMarkerContent(color, active));
  marker.setOffset(new AMap.Pixel(offset, offset));
  marker.setTop(active); // AMap 2.0 无 setZIndex，用 setTop 置顶
}

function clearSelected() {
  if (State.selectedId) {
    updateMarkerIcon(State.selectedId, false);
    State.selectedId = null;
  }
  document.querySelectorAll('.park-card.selected').forEach(function (el) {
    el.classList.remove('selected');
  });
}

// ── 列表卡片滚动 ──────────────────────────────────
function scrollToCard(id) {
  const card = document.querySelector(`.park-card[data-id="${id}"]`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ── 筛选初始化 ─────────────────────────────────────
function initFilters() {
  // 行政区 select
  const districtSel = document.getElementById('districtSelect');
  DISTRICTS.forEach(function (d) {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    districtSel.appendChild(opt);
  });
  districtSel.addEventListener('change', function () {
    State.filters.district = this.value;
    applyFilters();
  });

  // 类型 chips
  document.querySelectorAll('#typeChips .chip').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('#typeChips .chip').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      State.filters.type = this.dataset.value;
      applyFilters();
    });
  });

  // 人群 chips (多选)
  document.querySelectorAll('#audienceChips .chip').forEach(function (btn) {
    btn.addEventListener('click', function () {
      this.classList.toggle('active');
      // 取当前所有 active 的人群值
      const actives = Array.from(document.querySelectorAll('#audienceChips .chip.active'))
        .map(function (b) { return b.dataset.value; });
      State.filters.audience = actives;
      applyFilters();
    });
  });
}

// ── 搜索初始化 ─────────────────────────────────────
function initSearch() {
  const input = document.getElementById('searchInput');
  let timer;
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      State.filters.search = input.value.trim();
      applyFilters();
    }, 220);
  });
}

// ── 应用筛选 ──────────────────────────────────────
function applyFilters() {
  const { district, type, audience, search } = State.filters;
  const query = search.toLowerCase();

  State.filteredParks = PARKS_DATA.filter(function (p) {
    if (district && p.district !== district) return false;
    if (type && p.type !== type) return false;
    if (audience && audience.length > 0) {
      const hasAll = audience.every(function (a) { return p.audience.includes(a); });
      if (!hasAll) return false;
    }
    if (query) {
      const inName = p.name.includes(query);
      const inTags = p.tags.some(function (t) { return t.includes(query); });
      const inDistrict = p.district.includes(query);
      if (!inName && !inTags && !inDistrict) return false;
    }
    return true;
  });

  renderList(State.filteredParks);
  updateMarkerVisibility(State.filteredParks);
  updateCount(State.filteredParks.length);
  updateFilterBadge();
}

// ── 更新标记可见性 ────────────────────────────────
function updateMarkerVisibility(filtered) {
  const visibleIds = new Set(filtered.map(function (p) { return p.id; }));
  Object.keys(State.markers).forEach(function (id) {
    const marker = State.markers[id];
    if (visibleIds.has(id)) {
      marker.show();
    } else {
      marker.hide();
    }
  });
}

// ── 渲染公园列表 ──────────────────────────────────
function renderList(parks) {
  const listEl = document.getElementById('parkList');

  if (parks.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🌿</div>
        <p>没有找到符合条件的公园<br>请尝试调整筛选条件</p>
      </div>`;
    return;
  }

  listEl.innerHTML = parks.map(function (park, i) {
    const type = PARK_TYPES[park.type] || { color: '#4CAF7D', bg: '#E8F5EE' };
    const audienceStr = park.audience.slice(0, 3).map(function (a) {
      return `<span class="aud-chip">${AUDIENCE_ICONS[a] || ''}${a}</span>`;
    }).join('');

    return `
      <div class="park-card" data-id="${park.id}" onclick="onCardClick('${park.id}')"
           style="animation-delay:${Math.min(i * 0.025, 0.25)}s">
        <div class="park-card-accent" style="background:${type.color}"></div>
        <div class="park-card-body">
          <div class="park-card-name">${park.name}</div>
          <div class="park-card-row">
            <span class="type-tag" style="color:${type.color};background:${type.bg}">${park.type}</span>
            <span class="district-tag">${park.district}</span>
            <span class="area-tag">${park.area}ha</span>
          </div>
          <div class="audience-chips">${audienceStr}</div>
        </div>
      </div>`;
  }).join('');
}

// ── 更新计数 ──────────────────────────────────────
function updateCount(count) {
  const el = document.getElementById('resultCount');
  if (el) el.textContent = count;
  const headerEl = document.getElementById('totalCount');
  if (headerEl) headerEl.textContent = count;
}

// ── 卡片点击 ──────────────────────────────────────
function onCardClick(id) {
  const park = PARKS_DATA.find(function (p) { return p.id === id; });
  if (!park) return;

  // 地图飞到该公园
  State.map.setZoomAndCenter(14, park.coordinates, false, 400);

  setTimeout(function () {
    onMarkerClick(park);
    openDetail(id);
  }, 420);
}

// ── 公园详情面板 ──────────────────────────────────
function openDetail(id) {
  const park = PARKS_DATA.find(function (p) { return p.id === id; });
  if (!park) return;

  const panel = document.getElementById('detailPanel');
  const type = PARK_TYPES[park.type] || { color: '#4CAF7D', bg: '#E8F5EE' };

  // 设施列表
  const facilitiesHtml = park.facilities.map(function (f) {
    const icon = FACILITY_ICONS[f] || '✓';
    return `<div class="facility-item"><span class="facility-icon">${icon}</span>${f}</div>`;
  }).join('');

  // 人群标签
  const audienceHtml = park.audience.map(function (a) {
    return `<span class="detail-aud-chip">${AUDIENCE_ICONS[a] || ''} ${a}</span>`;
  }).join('');

  // 特色标签
  const tagsHtml = park.tags.map(function (t) {
    return `<span class="tag">${t}</span>`;
  }).join('');

  // 小红书链接
  const xhsUrl = `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(park.xhs_keyword)}&source=web_explore_feed`;
  // 高德导航
  const amapUrl = `https://uri.amap.com/marker?position=${park.coordinates[0]},${park.coordinates[1]}&name=${encodeURIComponent(park.name)}&src=mypage&coordinate=gaode&callnative=0`;

  document.getElementById('panelContent').innerHTML = `
    <div class="detail-header">
      <button class="detail-close" onclick="closeDetail()">✕</button>
      <div class="detail-type" style="color:${type.color}">${park.type}</div>
      <div class="detail-name">${park.name}</div>
      <div class="detail-meta">
        <span>📍 ${park.district}</span>
        <span>📐 ${park.area} 公顷</span>
      </div>
    </div>

    <div class="detail-body">

      <div>
        <div class="detail-section-title">公园介绍</div>
        <div class="detail-description">${park.description}</div>
      </div>

      <div class="detail-stats">
        <div class="stat-box">
          <div class="stat-value">${park.area}</div>
          <div class="stat-label">公顷面积</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">${park.facilities.length}</div>
          <div class="stat-label">配套设施</div>
        </div>
      </div>

      <div>
        <div class="detail-section-title">适合人群</div>
        <div class="detail-chips">${audienceHtml}</div>
      </div>

      <div>
        <div class="detail-section-title">主要设施</div>
        <div class="facilities-grid">${facilitiesHtml}</div>
      </div>

      <div>
        <div class="detail-section-title">特色标签</div>
        <div class="tags-wrap">${tagsHtml}</div>
      </div>

    </div>

    <div class="detail-footer">
      <a href="${xhsUrl}" target="_blank" class="xhs-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
        </svg>
        在小红书搜索「${park.xhs_keyword}」
      </a>
      <a href="${amapUrl}" target="_blank" class="amap-btn">
        🗺️ 高德地图导航
      </a>
    </div>
  `;

  panel.classList.add('open');
  selectMarker(id);
  hideSidebar(); // 移动端：详情打开时收起底部列表
}

function closeDetail() {
  document.getElementById('detailPanel').classList.remove('open');
  collapseSidebar(); // 移动端：详情关闭后恢复收起态
}

// ── 隐藏加载屏 ────────────────────────────────────
function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.add('hidden');
    setTimeout(function () { overlay.style.display = 'none'; }, 500);
  }
}

// ── 工具函数 ──────────────────────────────────────
function getTypeEmoji(type) {
  const map = {
    '综合公园': '🌳', '郊野公园': '🌲', '专类公园': '🌺',
    '社区公园': '🌿', '历史名园': '🏯'
  };
  return map[type] || '🌳';
}

// ── 移动端侧边栏三态控制 ─────────────────────────────
function isMobile() {
  return window.innerWidth <= 768;
}

function expandSidebar() {
  if (!isMobile()) return;
  var s = document.getElementById('sidebar');
  if (s) { s.classList.add('expanded'); s.classList.remove('hidden'); }
}

function collapseSidebar() {
  if (!isMobile()) return;
  var s = document.getElementById('sidebar');
  if (s) { s.classList.remove('expanded'); s.classList.remove('hidden'); }
}

function hideSidebar() {
  if (!isMobile()) return;
  var s = document.getElementById('sidebar');
  if (s) { s.classList.add('hidden'); s.classList.remove('expanded'); }
}

// ── 移动端底部面板拖拽（整体感知，智能防冲突） ────────
function initSidebarDrag() {
  var sidebar  = document.getElementById('sidebar');
  var parkList = document.getElementById('parkList');
  if (!sidebar) return;

  var startY         = 0;
  var startScrollTop = 0;

  sidebar.addEventListener('touchstart', function (e) {
    startY         = e.touches[0].clientY;
    startScrollTop = parkList ? parkList.scrollTop : 0;
  }, { passive: true });

  sidebar.addEventListener('touchend', function (e) {
    var delta      = startY - e.changedTouches[0].clientY; // 正 = 向上滑
    var isExpanded = sidebar.classList.contains('expanded');

    if (delta > 30 && !isExpanded) {
      // 任意位置向上滑 → 展开
      expandSidebar();
    } else if (delta < -30 && isExpanded && startScrollTop <= 0) {
      // 向下滑 + 已展开 + 列表已在顶部 → 收起
      collapseSidebar();
    }
  }, { passive: true });
}

// ── 移动端筛选 Drawer ────────────────────────────────
function openFilterDrawer() {
  var panel   = document.getElementById('filterPanel');
  var backdrop = document.getElementById('filterBackdrop');
  if (panel)   panel.classList.add('open');
  if (backdrop) backdrop.classList.add('visible');
  // 阻止 drawer 内部 touch 冒泡到地图
  if (panel) {
    ['touchstart', 'touchmove', 'touchend'].forEach(function (evt) {
      panel.addEventListener(evt, function (e) { e.stopPropagation(); }, { passive: true });
    });
  }
}

function closeFilterDrawer() {
  var panel   = document.getElementById('filterPanel');
  var backdrop = document.getElementById('filterBackdrop');
  if (panel)   panel.classList.remove('open');
  if (backdrop) backdrop.classList.remove('visible');
}

// 筛选后更新 badge 数量
function updateFilterBadge() {
  var count = 0;
  if (State.filters.district) count++;
  if (State.filters.type)     count++;
  if (State.filters.audience) count++;
  var badge = document.getElementById('filterBadge');
  if (badge) badge.textContent = count > 0 ? count : '';
}

// ── 全局暴露（供 HTML onclick 字符串调用）────────────
window.openDetail         = openDetail;
window.closeDetail        = closeDetail;
window.onCardClick        = onCardClick;
window.openFilterDrawer   = openFilterDrawer;
window.closeFilterDrawer  = closeFilterDrawer;

// ── 启动 ──────────────────────────────────────────
window.addEventListener('load', function () {
  if (typeof AMap !== 'undefined') {
    init();
  } else {
    const check = setInterval(function () {
      if (typeof AMap !== 'undefined') {
        clearInterval(check);
        init();
      }
    }, 100);
  }
});
