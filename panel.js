(() => {
  'use strict';
  (function lockZoom() {
    const d = document.documentElement;
    d.style.touchAction = 'manipulation';
    d.style.webkitTextSizeAdjust = '100%';
    d.style.textSizeAdjust = '100%';
    const stop = (e) => e.preventDefault();
    ['gesturestart', 'gesturechange', 'gestureend'].forEach((name) => document.addEventListener(name, stop, { passive: false }));
    document.addEventListener('touchmove', (e) => {
      if ((e.touches && e.touches.length > 1) || (typeof e.scale === 'number' && e.scale !== 1)) e.preventDefault();
    }, { passive: false });
  })();
  const $ = (id) => document.getElementById(id);
  const NAV = [
    ['overview', 'نظرة عامة', '◫', null],
    ['users', 'الحسابات', '♙', 'users'],
    ['codes', 'أكواد الاشتراك', '▦', 'codes'],
    ['subs', 'الاشتراكات', '≡', 'subs'],
    ['plans', 'الباقات والأسعار', '▤', 'plans'],
    ['settings', 'الإعدادات', '⚙', 'settings'],
    ['services', 'الخدمات والجلسات', '◎', 'services'],
    ['links', 'الروابط المختصرة', '⇲', 'links'],
    ['activity', 'سجل النشاط', '◉', 'security'],
    ['protection', 'الحماية والإيقاف', '⛨', 'security'],
    ['staff', 'فريق الإدارة', '☷', 'owner'],
    ['audit', 'سجل الإدارة', '↺', 'owner'],
    ['security', 'أمان حسابي', '◇', null]
  ];
  const titles = Object.fromEntries(NAV.map((n) => [n[0], n[1]]));
  const DELETE_PERM = { users: 'users', codes: 'codes', subs: 'subs', plans: 'plans', sessions: 'services', apiKeys: 'services', wa: 'services', limits: 'services', bans: 'security', unlocks: 'security', secLog: 'security', activity: 'security', links: 'links', clicks: 'links', audit: 'owner' };
  const PERM_INFO = {
    users: ['الحسابات', 'عرض حسابات المستخدمين وإنشاؤها وتعديلها وإنهاء جلساتها'],
    subs: ['الاشتراكات', 'تعيين باقة لأي حساب وتحديد مدتها'],
    codes: ['أكواد الاشتراك', 'إنشاء أكواد الاشتراك وتعطيلها'],
    plans: ['الباقات والأسعار', 'تعديل حدود الباقات وأسعارها ووصفها'],
    settings: ['الإعدادات', 'تعديل إعدادات الموقع والبريد'],
    security: ['الحماية وسجل النشاط', 'الإيقاف وفكه وأكواد الفك ومتابعة سجل النشاط'],
    links: ['الروابط المختصرة', 'إيقاف الروابط المخالفة وإعادة تفعيلها'],
    services: ['الخدمات', 'فحص الخدمات والجلسات ومفاتيح API وربط واتساب'],
    delete: ['الحذف', 'حذف البيانات، فقط داخل الأقسام المسموح له بها']
  };
  const signalName = { devtools: 'أدوات المطوّر', devtools_refresh: 'تحديث مع أدوات المطوّر', tamper: 'تلاعب بالصفحة', automation: 'متصفح آلي', forged_ticket: 'تذكرة مزيفة', forged_token: 'جلسات مزيفة', malformed: 'طلبات مشوهة', inject: 'محاولة حقن', flood: 'إغراق بالطلبات', probe: 'فحص المسارات', scan: 'فحص ملفات حساسة', api_bruteforce: 'تخمين مفاتيح API', unlock: 'فك بكود', admin_lift: 'فك من الإدارة', admin_ban: 'إيقاف من الإدارة', link_bruteforce: 'تخمين كلمات سر الروابط' };
  const EVENT = { admin_login: 'دخول لوحة الإدارة', admin_login_failed: 'محاولة دخول فاشلة للوحة', login: 'تسجيل دخول', login_failed: 'كلمة مرور خاطئة', logout: 'تسجيل خروج', register_request: 'طلب إنشاء حساب', register_request_failed: 'فشل طلب إنشاء حساب', register_done: 'تأكيد حساب جديد', register_done_failed: 'رمز تأكيد خاطئ', reset_request: 'طلب استعادة كلمة المرور', reset_request_failed: 'إجابات استعادة خاطئة', reset_done: 'تغيير كلمة المرور', reset_done_failed: 'رمز استعادة خاطئ', code_redeem: 'تفعيل كود اشتراك', code_redeem_failed: 'كود اشتراك خاطئ', api_key_create: 'إنشاء مفتاح API', api_key_create_failed: 'فشل إنشاء مفتاح', api_key_revoke: 'إلغاء مفتاح API', api_key_ips: 'تقييد مفتاح بعناوين IP', api_key_rename: 'إعادة تسمية مفتاح', api_key_transfer: 'نقل مفاتيح لباقة', api_call: 'طلب API', api_repeated: 'طلبات API متكررة بسرعة', api_api_rate: 'تجاوز حدود API', api_key: 'مفتاح API غير صحيح', api_ip: 'مفتاح من عنوان غير مسموح', api_rate: 'تخمين مفاتيح API', api_cooldown: 'طلب API أثناء الانتظار', tool_use: 'استخدام أداة', tool_refused: 'رفض استخدام أداة', short_create: 'إنشاء رابط مختصر', short_edit: 'تعديل رابط مختصر', short_delete: 'حذف رابط مختصر', unlock: 'فك إيقاف بكود', unlock_failed: 'كود فك خاطئ', admin_plans: 'تعديل الباقات والأسعار', admin_plan: 'تعديل باقة', admin_settings: 'تعديل الإعدادات', admin_setting: 'تعديل إعداد', admin_codes: 'إنشاء أكواد اشتراك', admin_code_disable: 'تعطيل كود', admin_sub: 'تعيين اشتراك', admin_user_create: 'إنشاء حساب', admin_user_edit: 'تعديل حساب', admin_sessions_clear: 'إنهاء جلسات حساب', admin_api_revoke: 'إبطال مفاتيح حساب', admin_wa_delete: 'فصل واتساب حساب', admin_ban_lift: 'فك إيقاف', admin_ban_user: 'إيقاف حساب', admin_unlock_codes: 'إنشاء أكواد فك', admin_unlock_disable: 'تعطيل كود فك', admin_link: 'تغيير حالة رابط', admin_password: 'تغيير كلمة مرور الإدارة', admin_staff_create: 'إضافة موظف', admin_staff_edit: 'تعديل موظف', admin_staff_remove: 'حذف موظف' };
  const LEVEL = { safe: ['آمن', 'safe'], normal: ['عادي', 'normal'], suspicious: ['مريب', 'suspicious'], admin: ['دخول الإدارة', 'admin'] };
  const SOURCE = { site: 'الموقع', api: 'API', panel: 'اللوحة' };
  const banKind = (s) => s.startsWith('u:') ? 'حساب' : s.startsWith('d:') ? 'جهاز' : 'عنوان IP';
  const banWho = (s) => s.startsWith('u:') ? `<span class="ltr">${esc(s.slice(2))}</span>` : `<span class="ltr">${esc(s.slice(2, 12))}…</span>`;
  const banState = (b) => b.status === 'active' ? `<span class="badge bad">${b.lifetime ? 'دائم' : 'نشط'}</span>` : b.status === 'lifted' ? '<span class="badge">مفكوك</span>' : '<span class="badge">منتهٍ</span>';
  const toolName = { wa: 'واتساب', leads: 'مستخرج البيانات', short: 'مختصر الروابط', api: 'API' };
  const planLabel = { free: 'Free', pro: 'Pro', max: 'Max', unlimited: 'Unlimited', dev: 'Dev', '*': 'معلومات الأداة' };
  const linkState = { active: ['يعمل', ''], paused: ['موقوف من صاحبه', ''], expired: ['منتهي', 'bad'], blocked: ['أوقفته الإدارة', 'bad'] };
  const siteBase = () => String(window.POP_PANEL.site || window.POP_PANEL.api || '').replace(/\/$/, '');
  const serviceName = { worker: 'الوركر', sheet: 'الشيت', whatsapp: 'سيرفر واتساب', email: 'إعدادات البريد' };
  let token = '', data = null, tab = 'overview', timer, editor = null, health = null, planTool = '', actFilter = 'all', actQuery = '';
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const date = (v) => v ? new Date(v).toLocaleString('ar-EG') : '—';
  const day = (v) => v ? new Date(v).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  const badge = (status) => `<span class="badge ${status === 'disabled' ? 'bad' : ''}">${status === 'disabled' ? 'معطل' : status === 'new' ? 'متاح' : status === 'used' ? 'مستخدم' : 'نشط'}</span>`;
  const can = (p) => !p || (data && (data.role === 'owner' || (p !== 'owner' && (data.perms || []).includes(p))));
  const canDel = (kind) => can('delete') && can(DELETE_PERM[kind]);
  function notice(text, bad = false) { $('notice').textContent = text; $('notice').classList.toggle('bad', bad); $('notice').hidden = false; clearTimeout(timer); timer = setTimeout(() => $('notice').hidden = true, 6000); }
  const messages = { invalid_login: 'اسم المستخدم أو كلمة المرور غير صحيحة.', invalid_session: 'انتهت جلسة الإدارة. سجّل الدخول مجددًا.', rate: 'محاولات كثيرة. انتظر قليلًا ثم حاول مجددًا.', exists: 'هذا الاسم أو البريد مسجل بالفعل.', weak_password: 'استخدم كلمة مرور قوية: 12 حرفًا على الأقل، حرفان كبيران ورقم ورمز، دون تكرار أو اسم الحساب.', invalid_request: 'تحقق من القيم التي أدخلتها.', unavailable: 'تعذر الاتصال بالخدمة. حاول مجددًا.', duplicate: 'تم إرسال الطلب نفسه للتو. انتظر لحظة.', busy: 'هناك طلب آخر قيد التنفيذ. انتظر حتى ينتهي.', forbidden: 'ليست لديك صلاحية لتنفيذ هذا الإجراء. اطلبها من مالك اللوحة.' };
  async function api(path, body = {}) {
    const res = await fetch(window.POP_PANEL.api.replace(/\/$/, '') + '/api/admin/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: JSON.stringify(body), signal: AbortSignal.timeout(100000) });
    const r = await res.json();
    if (!res.ok || !r.ok) { if (r.error === 'invalid_session') signout(); if (res.status === 429 && r.retry && r.error === 'rate') throw new Error('طلبات كثيرة في وقت قصير. انتظر ' + r.retry + ' ثانية ثم حاول مجددًا.'); throw new Error(messages[r.error] || 'تعذر إتمام الطلب. تحقق من البيانات وحاول مجددًا.'); }
    return r;
  }
  async function run(path, body = {}) {
    const r = await api(path, { ...body, refresh: true });
    if (r.data && r.data.ok) { data = r.data; render(); } else await load();
    return r;
  }
  function signout() { token = ''; data = null; $('app').hidden = true; $('login').hidden = false; $('login-form').reset(); $('content').replaceChildren(); }
  async function load() { data = await api('data'); afterLoad(); }
  function afterLoad() {
    $('admin-name').textContent = data.username + (data.role === 'owner' ? ' · المالك' : ' · موظف');
    $('login').hidden = true; $('app').hidden = false;
    if (!NAV.some((n) => n[0] === tab && can(n[3]))) tab = 'overview';
    render();
  }
  const kindName = { users: 'الحسابات', codes: 'أكواد الاشتراك', subs: 'الاشتراكات', plans: 'صفوف الباقات', sessions: 'جلسات الحسابات', apiKeys: 'مفاتيح API', wa: 'روابط واتساب', bans: 'حالات الإيقاف', unlocks: 'أكواد فك الإيقاف', secLog: 'سجل الأمان', audit: 'سجل الإدارة', limits: 'عدادات الحدود', links: 'الروابط المختصرة', clicks: 'تفاصيل زيارات الروابط', activity: 'سجل النشاط' };
  const kindWarn = { users: 'سيُحذف كل حساب مع اشتراكاته ومفاتيح API وجلساته وربط واتساب الخاص به.', plans: 'حذف صفوف الباقات يزيل حدودها من الموقع فورًا. تشغيل update في الشيت يعيد الصفوف الأساسية فقط.', bans: 'حذف حالة الإيقاف يرفعها فورًا ويصفّر مستوى التصعيد لهذا المعرّف.', wa: 'سيُفصل رقم واتساب ويُمسح الربط.', links: 'سيتوقف كل رابط محذوف عن العمل فورًا وتُحذف زياراته.', clicks: 'تبقى الروابط وأعداد ضغطاتها، وتُحذف تفاصيل الدولة والجهاز والوقت فقط.', activity: 'يُمسح سجل النشاط كله الآن، ويبدأ التسجيل من جديد تلقائيًا.' };
  function table(headers, rows, kind = '', ids = null, rowClass = null) {
    const pick = !!(kind && ids && canDel(kind));
    const body = rows.length ? rows.map((r, i) => { let x = rowClass ? r.replace('<tr>', `<tr class="${rowClass[i]}">`) : r; return pick ? x.replace(/<tr( class="[^"]*")?>/, (m) => m + `<td class="pick"><input type="checkbox" data-pick="${kind}" value="${esc(ids[i])}" aria-label="تحديد"></td>`) : x; }).join('') : `<tr><td colspan="${headers.length + (pick ? 1 : 0)}" class="empty">لا توجد بيانات حتى الآن.</td></tr>`;
    const grid = `<div class="table-wrap"><table><thead><tr>${pick ? '<th class="pick"></th>' : ''}${headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`;
    if (!pick) return grid;
    return `<div class="table-block" data-block="${kind}"><div class="bulk"><label class="bulk-all"><input type="checkbox" data-all="${kind}" ${rows.length ? '' : 'disabled'}> تحديد الكل</label><span class="bulk-count" data-count="${kind}">لم يتم تحديد شيء</span><div class="bulk-actions"><button type="button" class="danger" data-action="del-sel" data-kind="${kind}" disabled>حذف المحدد</button><button type="button" class="danger" data-action="del-all" data-kind="${kind}" ${rows.length ? '' : 'disabled'}>حذف الكل</button></div></div>${grid}</div>`;
  }
  async function removeItems(kind, ids, all, button) {
    const n = all ? 'كل' : String(ids.length);
    const warn = kindWarn[kind] ? '\n' + kindWarn[kind] : '';
    if (all) { const typed = prompt(`سيتم حذف كل ${kindName[kind]} نهائيًا ولا يمكن التراجع.${warn}\nاكتب كلمة حذف للتأكيد:`); if ((typed || '').trim() !== 'حذف') return; }
    else if (!confirm(`حذف ${n} من ${kindName[kind]} نهائيًا؟ لا يمكن التراجع.${warn}`)) return;
    await busy(button, async () => {
      let total = 0;
      if (all) total = (await run('delete', { kind, all: true })).deleted;
      else { for (let i = 0; i < ids.length; i += 100) { const last = i + 100 >= ids.length; const r = last ? await run('delete', { kind, ids: ids.slice(i, i + 100) }) : await api('delete', { kind, ids: ids.slice(i, i + 100) }); total += r.deleted; } }
      notice(total ? `تم حذف ${total} من ${kindName[kind]}.` : 'لم يتم العثور على عناصر للحذف. ربما حُذفت بالفعل.');
    });
  }
  function syncPick(kind) { const boxes = [...document.querySelectorAll(`[data-pick="${kind}"]`)]; const on = boxes.filter((b) => b.checked).length; const c = document.querySelector(`[data-count="${kind}"]`); if (c) c.textContent = on ? `${on} محدد` : 'لم يتم تحديد شيء'; const del = document.querySelector(`[data-action="del-sel"][data-kind="${kind}"]`); if (del) { del.disabled = !on; del.textContent = on ? `حذف المحدد (${on})` : 'حذف المحدد'; } const all = document.querySelector(`[data-all="${kind}"]`); if (all) { all.checked = !!boxes.length && on === boxes.length; all.indeterminate = on > 0 && on < boxes.length; } }
  const btn = (label, action, index, extra = '') => `<button class="secondary" data-action="${action}" data-index="${index}" ${extra}>${label}</button>`;
  function toolbar(button, search = false) { return `<div class="toolbar">${search ? '<input id="search" type="search" aria-label="بحث" placeholder="ابحث بالاسم أو البريد…">' : '<span></span>'}${button || ''}</div>`; }
  const PLAN_FIELDS = {
    title: { label: 'اسم الأداة كما يظهر للعميل', type: 'text', noDesc: true },
    about: { label: 'شرح قصير يظهر أعلى باقات الأداة', type: 'area', noDesc: true },
    price: { label: 'السعر', type: 'decimal', hint: 'اتركه فارغًا ليختفي السعر من صفحة الباقات.', noDesc: true },
    perSend: { label: 'أقصى عدد أرقام في كل عملية إرسال', type: 'int', zero: true },
    vars: { label: 'أقصى عدد متغيرات في الرسالة', type: 'int', min: 0, max: 6 },
    cooldown: { label: 'الانتظار بين كل عملية والتالية (بالدقائق)', type: 'int', min: 5, hint: 'أقل قيمة مسموحة 5 دقائق.' },
    perDay: { label: 'أقصى رسائل يوميًا لكل رقم', apiLabel: 'أقصى طلبات API في اليوم للحساب', type: 'int', zero: true },
    speed: { label: 'السرعات المسموحة', type: 'select', options: [['safe', 'الآمنة فقط'], ['all', 'الآمنة والعادية']] },
    results: { label: 'أقصى نتائج في كل بحث', type: 'int', zero: true },
    links: { label: 'أقصى عدد روابط محفوظة', type: 'int', zero: true },
    custom: { label: 'اسم مختصر يختاره العميل', type: 'toggle' },
    password: { label: 'حماية الرابط بكلمة سر', type: 'toggle' },
    expiry: { label: 'تاريخ انتهاء للرابط', type: 'toggle' },
    stats: { label: 'التحليلات', type: 'select', options: [['basic', 'أساسية: العدد وآخر ضغطة'], ['full', 'كاملة: الدولة والجهاز والوقت']] },
    tier: { label: 'حدود الأدوات التي يحصل عليها مفتاح API', type: 'select', options: [['free', 'حدود Free'], ['pro', 'حدود Pro'], ['max', 'حدود Max'], ['unlimited', 'حدود Unlimited']] },
    factor: { label: 'نسبة حدود الأدوات مقارنة بالموقع (%)', type: 'int', min: 1, max: 100 },
    perMinute: { label: 'أقصى طلبات API في الدقيقة', type: 'int', min: 1 },
    note: { label: 'سطر إضافي يظهر للعميل', type: 'note' }
  };
  const PLAN_ORDER = ['*', 'free', 'pro', 'max', 'unlimited', 'dev'];
  const KEY_ORDER = ['title', 'about', 'price', 'perSend', 'results', 'links', 'vars', 'perDay', 'perMinute', 'cooldown', 'speed', 'custom', 'password', 'expiry', 'stats', 'tier', 'factor', 'note'];
  const SETTING_GROUPS = [
    ['acc', 'الحسابات وتسجيل الدخول'],
    ['sales', 'الاشتراكات والأسعار'],
    ['mail', 'البريد ورابط الموقع'],
    ['links', 'الروابط المختصرة'],
    ['sec', 'الأمان وواجهة API'],
    ['other', 'إعدادات أخرى']
  ];
  const SETTING_META = {
    emailDomains: { t: 'نطاقات البريد المسموح بالتسجيل بها', type: 'list', g: 'acc', ph: 'gmail.com' },
    otpMinutes: { t: 'صلاحية رمز تأكيد الحساب', unit: 'دقيقة', type: 'num', min: 2, max: 30, g: 'acc' },
    resetMinutes: { t: 'صلاحية رمز استعادة كلمة المرور', unit: 'دقيقة', type: 'num', min: 3, max: 30, g: 'acc' },
    resetNeeded: { t: 'الإجابات الصحيحة المطلوبة للاستعادة', unit: 'من 5', type: 'num', min: 3, max: 5, g: 'acc' },
    rememberDays: { t: 'مدة الجلسة عند تذكّر الجهاز', unit: 'يوم', type: 'num', min: 1, max: 60, g: 'acc' },
    sessionHours: { t: 'مدة الجلسة العادية', unit: 'ساعة', type: 'num', min: 1, max: 72, g: 'acc' },
    storeUrl: { t: 'رابط متجر شراء الأكواد', type: 'url', g: 'sales' },
    currency: { t: 'العملة بجانب الأسعار', type: 'text', max: 12, g: 'sales' },
    pricePeriod: { t: 'ما يظهر بعد السعر', type: 'text', max: 30, g: 'sales' },
    codeTries: { t: 'محاولات إدخال كود الاشتراك كل 15 دقيقة', unit: 'محاولة', type: 'num', min: 3, max: 50, g: 'sales' },
    freeTools: { t: 'الأدوات المجانية بالكامل', type: 'list', g: 'sales', ph: 'clean' },
    siteUrl: { t: 'رابط الموقع', type: 'url', g: 'mail' },
    mailLogo: { t: 'رابط الشعار في البريد', type: 'url', g: 'mail' },
    mailLogoFallback: { t: 'رابط الشعار البديل', type: 'url', g: 'mail' },
    clickDays: { t: 'مدة حفظ تفاصيل زيارات الروابط', unit: 'يوم', type: 'num', min: 1, max: 3650, g: 'links' },
    expiredDays: { t: 'حذف الرابط المنتهي بعد', unit: 'يوم', type: 'num', min: 0, max: 3650, g: 'links' },
    shortBlock: { t: 'مواقع ممنوع اختصار روابطها', type: 'list', g: 'links', ph: 'bit.ly' },
    activityDays: { t: 'مدة حفظ سجل النشاط', unit: 'يوم', type: 'num', min: 1, max: 90, g: 'sec' },
    apiKeysMax: { t: 'أقصى عدد مفاتيح API للحساب', unit: 'مفتاح', type: 'num', min: 1, max: 10, g: 'sec' }
  };
  const planRows = (tool) => data.plans.filter((r) => r[0] === tool);
  function planInput(r) {
    const f = PLAN_FIELDS[r[2]] || { label: r[2], type: 'text' };
    const id = `pf-${esc(r[0])}-${esc(r[1])}-${esc(r[2])}`.replace(/[^\w-]/g, '_');
    const v = String(r[3] ?? '');
    const attrs = `id="${id}" data-row="${esc(r[0] + '|' + r[1] + '|' + r[2])}" data-field="value" data-orig="${esc(v)}"`;
    const label = r[0] === 'api' && f.apiLabel ? f.apiLabel : f.label;
    let input = '';
    if (f.type === 'int') input = `<input type="number" inputmode="numeric" step="1" min="${f.min ?? 0}" ${f.max ? `max="${f.max}"` : ''} ${attrs} value="${esc(v)}">`;
    else if (f.type === 'decimal') input = `<input type="text" inputmode="decimal" data-num="decimal" maxlength="10" placeholder="بدون سعر" ${attrs} value="${esc(v)}">`;
    else if (f.type === 'select') input = `<select ${attrs}>${f.options.map(([o, l]) => `<option value="${o}" ${o === v ? 'selected' : ''}>${l}</option>`).join('')}</select>`;
    else if (f.type === 'toggle') input = `<span class="switch"><input type="checkbox" ${attrs} ${v === '1' ? 'checked' : ''}><i></i><b>${v === '1' ? 'مفعّل' : 'غير مفعّل'}</b></span>`;
    else if (f.type === 'area') input = `<textarea rows="3" maxlength="600" ${attrs}>${esc(v)}</textarea>`;
    else if (f.type === 'note') input = '';
    else input = `<input type="text" maxlength="120" ${attrs} value="${esc(v)}">`;
    const textAttrs = `data-row="${esc(r[0] + '|' + r[1] + '|' + r[2])}" data-field="text" data-orig="${esc(r[4] ?? '')}"`;
    const preview = String(r[4] ?? '').split('{v}').join(v || '—');
    const zero = f.zero ? '<small class="tip">اكتب 0 لجعلها بلا حد.</small>' : '';
    const hint = f.hint ? `<small class="tip">${esc(f.hint)}</small>` : '';
    const desc = f.noDesc ? (r[2] === 'title' || r[2] === 'about' ? `<input type="hidden" ${textAttrs} value="${esc(r[4] ?? '')}">` : `<input type="hidden" ${textAttrs} value="${esc(r[4] ?? '')}">`) : `<div class="desc"><span class="preview" data-preview>${preview ? '«' + esc(preview) + '»' : '<em>لا يظهر سطر للعميل</em>'}</span><button type="button" class="linkish" data-toggle-desc>تعديل النص الظاهر للعميل</button><input type="text" maxlength="600" ${textAttrs} value="${esc(r[4] ?? '')}" hidden placeholder="استخدم {v} مكان الرقم"></div>`;
    if (r[2] === 'title' || r[2] === 'about') return `<label class="pfield wide">${esc(label)}<textarea rows="${r[2] === 'about' ? 3 : 1}" maxlength="600" data-row="${esc(r[0] + '|' + r[1] + '|' + r[2])}" data-field="text" data-orig="${esc(r[4] ?? '')}">${esc(r[4] ?? '')}</textarea><input type="hidden" ${attrs} value="${esc(v)}"></label>`;
    if (f.type === 'note') return `<label class="pfield wide">${esc(label)}<input type="hidden" ${attrs} value="${esc(v)}"><input type="text" maxlength="600" ${textAttrs} value="${esc(r[4] ?? '')}"></label>`;
    return `<div class="pfield"><label for="${id}">${esc(label)}</label>${input}${zero}${hint}${desc}</div>`;
  }
  function plansView() {
    const tools = data.catalog.order.filter((t) => planRows(t).length);
    if (!tools.length) return '<p class="empty">لا توجد باقات. شغّل update من قائمة POP في الشيت.</p>';
    if (!tools.includes(planTool)) planTool = tools[0];
    const chips = `<div class="chips" role="tablist">${tools.map((t) => `<button type="button" class="chip ${t === planTool ? 'on' : ''}" data-action="plan-tool" data-tool="${t}">${esc(toolName[t] || data.catalog.tools[t]?.title || t)}</button>`).join('')}</div>`;
    const rows = planRows(planTool);
    const plans = PLAN_ORDER.filter((p) => rows.some((r) => r[1] === p));
    const cards = plans.map((p) => {
      const list = rows.filter((r) => r[1] === p).sort((a, b) => (KEY_ORDER.indexOf(a[2]) + 99) % 99 - (KEY_ORDER.indexOf(b[2]) + 99) % 99);
      return `<section class="pcard ${p === '*' ? 'wide' : ''}" data-plan-card="${esc(p)}"><h3>${esc(planLabel[p] || p)}</h3><div class="pgrid">${list.map(planInput).join('')}</div><div class="pcard-foot"><span class="dirty" data-dirty hidden>تغييرات غير محفوظة</span><button type="button" data-action="plan-save" data-plan="${esc(p)}">حفظ ${esc(planLabel[p] || p)}</button></div></section>`;
    }).join('');
    return `<p class="lead">اختر الأداة، ثم عدّل الحدود والأسعار لكل باقة. تتغير الحدود على الموقع وواجهة API فور الحفظ. الأرقام فقط مسموحة في خانات الأرقام.</p>${chips}<div class="pcards">${cards}</div>${canDel('plans') ? `<details class="advanced"><summary>عرض جدول الصفوف الخام (متقدم)</summary>${table(['الأداة', 'الباقة', 'الحد', 'القيمة', 'الوصف'], data.plans.map((r) => `<tr><td>${toolName[r[0]] || esc(r[0])}</td><td>${esc(r[1])}</td><td class="ltr">${esc(r[2])}</td><td>${esc(r[3])}</td><td>${esc(r[4])}</td></tr>`), 'plans', data.plans.map((r) => r[0] + '|' + r[1] + '|' + r[2]))}</details>` : ''}`;
  }
  function settingInput(r) {
    const m = SETTING_META[r[0]] || { t: r[0], type: 'text', max: 4000 };
    const v = String(r[1] ?? '');
    const attrs = `data-setting="${esc(r[0])}" data-orig="${esc(v)}"`;
    let input;
    if (m.type === 'num') input = `<div class="unit"><input type="number" inputmode="numeric" step="1" min="${m.min}" max="${m.max}" ${attrs} value="${esc(v)}"><span>${esc(m.unit || '')}</span></div><small class="tip">من ${m.min} إلى ${m.max}</small>`;
    else if (m.type === 'url') input = `<input type="url" dir="ltr" inputmode="url" maxlength="500" placeholder="https://" ${attrs} value="${esc(v)}">`;
    else if (m.type === 'list') { const items = v.split(/[\s,]+/).filter(Boolean); input = `<textarea dir="ltr" rows="${Math.min(6, Math.max(2, Math.ceil(items.length / 4)))}" placeholder="${esc(m.ph || '')}" data-setting="${esc(r[0])}" data-orig="${esc(items.join(', '))}">${esc(items.join(', '))}</textarea><small class="tip">افصل بين العناصر بفاصلة أو سطر جديد. العدد الحالي: ${items.length}</small>`; }
    else input = `<input type="text" maxlength="${m.max || 4000}" ${attrs} value="${esc(v)}">`;
    return `<div class="sfield"><label>${esc(m.t)}</label>${input}${r[2] ? `<p>${esc(r[2])}</p>` : ''}</div>`;
  }
  function settingsView() {
    const groups = SETTING_GROUPS.map(([g, title]) => {
      const list = data.settings.filter((r) => (SETTING_META[r[0]]?.g || 'other') === g);
      return list.length ? `<section class="sgroup"><h3>${title}</h3><div class="sgrid">${list.map(settingInput).join('')}</div></section>` : '';
    }).join('');
    return `<p class="lead">كل إعداد مكتوب بلغة واضحة مع شرح قصير. عدّل ما تريد ثم اضغط حفظ مرة واحدة.</p><form id="settings-form" novalidate>${groups}<div class="sticky-save"><span class="dirty" data-dirty hidden>تغييرات غير محفوظة</span><button type="submit">حفظ كل التغييرات</button></div></form>`;
  }
  function userTable(list, pick = false) { return table(['الحساب', 'البريد', 'الحالة', 'آخر دخول', 'الإدارة'], list.map((u) => `<tr><td>${esc(u.firstName + ' ' + u.lastName)}</td><td class="ltr">${esc(u.email)}</td><td>${badge(u.status)}</td><td>${date(u.lastLogin)}</td><td class="actions">${can('users') ? btn('تعديل', 'user-edit', data.users.indexOf(u)) + btn('إنهاء الجلسات', 'sessions', data.users.indexOf(u)) : ''}</td></tr>`), pick ? 'users' : '', pick ? list.map((u) => u.email) : null); }
  function linkTable(list) { const all = data.links || []; return table(['الرابط', 'الحساب', 'الوجهة', 'الضغطات', 'الحالة', 'الإدارة'], list.map((l) => { const st = linkState[l.state] || linkState.active; const i = all.indexOf(l); return `<tr><td class="ltr"><a href="${esc(siteBase() + '/' + l.alias)}" target="_blank" rel="noopener noreferrer">/${esc(l.alias)}</a>${l.locked ? ' <small>(بكلمة سر)</small>' : ''}</td><td class="ltr">${esc(l.email || '—')}</td><td class="ltr" title="${esc(l.url)}">${esc(l.url.length > 60 ? l.url.slice(0, 60) + '…' : l.url)}</td><td>${esc(l.clicks)}</td><td><span class="badge ${st[1]}">${st[0]}</span></td><td class="actions">${l.state === 'blocked' ? btn('إعادة التفعيل', 'link-open', i) : btn('إيقاف الرابط', 'link-block', i)}</td></tr>`; }), 'links', list.map((l) => l.alias)); }
  function healthView() { return health ? `<div class="health-grid">${health.checks.map((c) => `<div class="health"><strong>${serviceName[c.service]}</strong><span class="badge ${c.ok ? '' : 'bad'}">${c.ok ? (c.configurationOnly ? 'الإعدادات موجودة' : 'متصل') : 'غير متاح'}</span>${c.configurationOnly ? '<p>لا يؤكد وصول البريد فعليًا.</p>' : ''}${c.ms ? `<p>${c.ms} ms</p>` : ''}</div>`).join('')}</div><p>آخر فحص: ${date(health.checkedAt)}</p>` : '<p>لم يتم فحص الخدمات في هذه الجلسة بعد.</p>'; }
  function activityView() {
    const all = data.activity || [];
    const q = actQuery.toLowerCase();
    const list = all.filter((r) => (actFilter === 'all' || r[1] === actFilter) && (!q || (r[2] + ' ' + (EVENT[r[2]] || '') + ' ' + r[3] + ' ' + r[5] + ' ' + r[6]).toLowerCase().includes(q)));
    const count = (lv) => all.filter((r) => r[1] === lv).length;
    const chips = [['all', 'الكل', all.length], ['suspicious', 'مريب', count('suspicious')], ['admin', 'دخول الإدارة', count('admin')], ['safe', 'آمن', count('safe')], ['normal', 'عادي', count('normal')]].map(([k, l, n]) => `<button type="button" class="chip lv-${k} ${actFilter === k ? 'on' : ''}" data-action="act-filter" data-level="${k}">${l} <b>${n}</b></button>`).join('');
    const legend = '<div class="legend"><span class="lv lv-suspicious">أحمر: نشاط مريب أو متكرر</span><span class="lv lv-admin">أحمر فاقع: دخول لوحة الإدارة</span><span class="lv lv-safe">أخضر: عملية آمنة</span><span class="lv lv-normal">أبيض: نشاط عادي</span></div>';
    const rows = list.map((r) => `<tr><td>${date(r[0])}</td><td><span class="lv lv-${esc(r[1])}">${esc((LEVEL[r[1]] || LEVEL.normal)[0])}</span></td><td>${esc(EVENT[r[2]] || (r[2].startsWith('security_') ? 'تنبيه أمني: ' + (signalName[r[2].slice(9)] || r[2].slice(9)) : r[2].startsWith('admin_') ? 'إجراء إداري: ' + r[2].slice(6) : r[2]))}</td><td class="ltr">${esc(r[3] || '—')}</td><td>${esc(SOURCE[r[4]] || r[4])}</td><td class="ltr">${esc(r[5] || '—')}</td><td class="ltr small">${esc(r[6] || '')}</td></tr>`);
    return `<p class="lead">كل الحركات المهمة على الموقع وواجهة API واللوحة. يُحذف السجل تلقائيًا بعد ${esc(data.activityDays || 7)} أيام، ويظهر هنا آخر 500 حدث.</p>${legend}<div class="toolbar"><div class="chips">${chips}</div><input id="act-search" type="search" placeholder="ابحث بالحساب أو الحدث أو العنوان…" value="${esc(actQuery)}"></div>${canDel('activity') ? `<div class="toolbar"><span></span><button class="danger" data-action="del-all" data-kind="activity" ${all.length ? '' : 'disabled'}>مسح السجل بالكامل</button></div>` : ''}${table(['الوقت', 'المستوى', 'الحدث', 'الحساب', 'المصدر', 'العنوان', 'التفاصيل'], rows, '', null, list.map((r) => 'act act-' + (LEVEL[r[1]] ? r[1] : 'normal')))}`;
  }
  function permBadges(list) { return list.map((p) => `<span class="pill">${esc(PERM_INFO[p]?.[0] || p)}</span>`).join(' ') || '<span class="muted">لا صلاحيات</span>'; }
  function staffView() {
    const rows = (data.admins || []).map((a, i) => `<tr><td class="ltr">${esc(a.username)}</td><td>${a.role === 'owner' ? '<span class="badge">المالك</span>' : 'موظف'}</td><td>${a.role === 'owner' ? 'كل الصلاحيات' : permBadges(a.perms)}</td><td>${badge(a.status)}</td><td>${date(a.lastLogin)}</td><td class="actions">${a.role === 'staff' ? btn('تعديل', 'staff-edit', i) + btn(a.status === 'disabled' ? 'تفعيل' : 'تعطيل', 'staff-toggle', i) + `<button class="danger" data-action="staff-remove" data-index="${i}">حذف</button>` : ''}</td></tr>`);
    return `<p class="lead">أضف حسابات إدارة للموظفين، واختر لكل موظف ما يستطيع رؤيته وتعديله فقط. يتحقق الخادم من الصلاحيات في كل طلب، فلا يستطيع الموظف تجاوزها حتى لو عدّل الصفحة.</p>${toolbar('<button data-action="staff-create">+ إضافة موظف</button>')}${table(['اسم المستخدم', 'الدور', 'الصلاحيات', 'الحالة', 'آخر دخول', 'الإدارة'], rows)}`;
  }
  function render() {
    if (!data) return;
    $('nav').innerHTML = NAV.filter((n) => can(n[3])).map((n) => `<button data-tab="${n[0]}" class="${n[0] === tab ? 'selected' : ''}">${n[2]} <span>${n[1]}</span></button>`).join('');
    $('page-title').textContent = titles[tab];
    let html = '';
    if (tab === 'overview') {
      const m = [];
      if (can('users')) m.push(['الحسابات', data.users.length]);
      if (can('subs')) m.push(['الاشتراكات المدفوعة', data.subs.filter((r) => r[4] !== 'free' && (!r[5] || new Date(r[5]).getTime() > Date.now())).length]);
      if (can('codes')) m.push(['الأكواد المتاحة', data.codes.filter((r) => r[4] === 'new').length]);
      if (can('services')) m.push(['جلسات واتساب', data.wa.length]);
      if (can('links')) m.push(['الروابط المختصرة', (data.links || []).length]);
      if (can('security')) { m.push(['إيقافات نشطة', (data.bans || []).filter((b) => b.status === 'active').length]); m.push(['أحداث مريبة', (data.activity || []).filter((r) => r[1] === 'suspicious').length]); }
      html = `<div class="welcome"><h2>أهلًا ${esc(data.username)}</h2><p>${data.role === 'owner' ? 'أنت مالك اللوحة ولديك كل الصلاحيات.' : 'صلاحياتك: ' + permBadges(data.perms)}</p></div>${m.length ? `<div class="metrics">${m.map(([l, v]) => `<div class="metric"><span>${l}</span><strong>${v}</strong></div>`).join('')}</div>` : ''}${can('services') ? `<div class="toolbar"><h2>الخدمات</h2>${btn('فحص الآن', 'health', 0)}</div>${healthView()}` : ''}${can('users') ? `<section class="section"><h2>أحدث الحسابات</h2>${userTable(data.users.slice(-5).reverse())}</section>` : ''}`;
    }
    if (tab === 'users') html = toolbar('<button data-action="user-create">+ إنشاء حساب</button>', true) + '<div id="users-table">' + userTable(data.users, true) + '</div>';
    if (tab === 'codes') html = toolbar('<button data-action="codes">+ إنشاء أكواد</button>') + table(['الكود', 'النوع', 'الأداة', 'الباقة', 'المدة', 'الحالة', 'المستخدم', 'الإدارة'], data.codes.slice().reverse().map((r) => `<tr><td class="ltr">${esc(r[0])}</td><td>${r[1] === 'api' ? 'API' : 'عادي'}</td><td>${toolName[r[1]] || esc(r[1])}</td><td>${esc(planLabel[r[2]] || r[2])}</td><td>${r[3] ? esc(r[3]) + ' يوم' : 'دائم'}</td><td>${badge(r[4])}</td><td>${esc(r[6])}</td><td>${r[4] === 'new' ? btn('تعطيل', 'code-disable', data.codes.indexOf(r)) : ''}</td></tr>`), 'codes', data.codes.slice().reverse().map((r) => r[0]));
    if (tab === 'subs') html = toolbar('<button data-action="sub">+ تعيين اشتراك</button>') + table(['الحساب', 'الأداة', 'الباقة', 'الانتهاء', 'الإدارة'], data.subs.map((r, i) => `<tr><td class="ltr">${esc(r[2])}</td><td>${toolName[r[3]] || esc(r[3])}</td><td>${esc(planLabel[r[4]] || r[4])}</td><td>${r[4] === 'free' ? '—' : r[5] ? day(r[5]) : 'دائم'}</td><td>${btn('تعديل', 'sub', i)}</td></tr>`), 'subs', data.subs.map((r) => r[0]));
    if (tab === 'plans') html = plansView();
    if (tab === 'settings') html = settingsView();
    if (tab === 'services') html = `<div class="toolbar"><h2>حالة الخدمات</h2>${btn('فحص الآن', 'health', 0)}</div>${healthView()}<section class="section"><h2>جلسات الحسابات</h2>${table(['الحساب', 'الانتهاء'], data.sessions.map((r) => `<tr><td class="ltr">${esc(r.email)}</td><td>${date(r.expires)}</td></tr>`), 'sessions', data.sessions.map((r) => r.ref))}</section><section class="section"><h2>ربط واتساب</h2>${table(['الحساب', 'الانتهاء', 'الإدارة'], data.wa.map((r, i) => `<tr><td>${esc(data.users.find((u) => u.uid === r.uid)?.email || r.uid)}</td><td>${date(r.expires)}</td><td>${btn('فصل ومسح الربط', 'wa-delete', i)}</td></tr>`), 'wa', data.wa.map((r) => r.uid))}</section><section class="section"><h2>مفاتيح API</h2>${table(['الحساب', 'اسم المفتاح', 'باقة المفتاح', 'آخر استخدام', 'الطلبات', 'الإدارة'], data.apiKeys.map((r, i) => `<tr><td class="ltr">${esc(r.email)}</td><td>${esc(r.name || '—')}</td><td>${esc(planLabel[r.plan] || r.plan || '—')}</td><td>${date(r.lastUsed)}</td><td>${esc(r.uses)}</td><td>${btn('إبطال كل مفاتيح الحساب', 'api-revoke', i)}</td></tr>`), 'apiKeys', data.apiKeys.map((r) => r.ref))}</section><section class="section"><h2>عدادات الحدود</h2><div class="config-row"><div>${esc(data.limits || 0)}</div><div><strong>عدادات محاولات الدخول والأكواد والحدود اليومية</strong><p>مسحها يعيد كل العدادات من الصفر، مثل فك قفل محاولات الدخول لكل الحسابات.</p></div>${canDel('limits') ? `<button class="danger" data-action="del-all" data-kind="limits" ${data.limits ? '' : 'disabled'}>مسح العدادات</button>` : ''}</div></section>`;
    if (tab === 'links') { const L = data.links || []; html = `<div class="toolbar"><input id="link-search" type="search" aria-label="بحث" placeholder="ابحث بالاسم أو الحساب أو الوجهة…">${canDel('clicks') ? '<button class="danger" data-action="del-all" data-kind="clicks">مسح تفاصيل الزيارات</button>' : ''}</div><div id="links-table">${linkTable(L)}</div>`; }
    if (tab === 'activity') html = activityView();
    if (tab === 'staff') html = staffView();
    if (tab === 'audit') html = table(['الوقت', 'المدير', 'العملية', 'الهدف'], data.audit.map((r) => `<tr><td>${date(r[0])}</td><td>${esc(r[1])}</td><td class="ltr">${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`), 'audit', data.audit.map((r) => r[4]));
    if (tab === 'protection') html = `<div class="toolbar"><span></span><div class="toolbar-actions"><button data-action="ban-user">+ إيقاف حساب</button><button data-action="unlock-codes" class="secondary">+ أكواد فك الإيقاف</button></div></div><section class="section"><h2>حالات الإيقاف</h2>${table(['النوع', 'المعرّف', 'المستوى', 'ينتهي', 'السبب', 'الحالة', 'الإدارة'], (data.bans || []).map((b, i) => `<tr><td>${banKind(b.subject)}</td><td>${banWho(b.subject)}</td><td>${esc(b.level)}</td><td>${b.lifetime ? 'دائم' : date(b.until)}</td><td>${esc(signalName[b.reason] || b.reason)}</td><td>${banState(b)}</td><td>${b.status === 'active' ? btn('فك الإيقاف', 'ban-lift', i) : ''}</td></tr>`), 'bans', (data.bans || []).map((b) => b.subject))}</section><section class="section"><h2>أكواد فك الإيقاف</h2>${table(['الكود', 'الحالة', 'أُنشئ', 'استخدمه', 'الإدارة'], (data.unlocks || []).map((u, i) => `<tr><td class="ltr">${esc(u.hint)}</td><td>${badge(u.status)}</td><td>${date(u.createdAt)}</td><td class="ltr">${esc(u.usedBy || '—')}</td><td>${u.status === 'new' ? btn('تعطيل', 'unlock-disable', i) : ''}</td></tr>`), 'unlocks', (data.unlocks || []).map((u) => u.id))}</section><section class="section"><h2>سجل الأمان</h2>${table(['الوقت', 'النشاط', 'المعنيون', 'المستوى', 'المسار'], (data.secLog || []).map((r) => `<tr><td>${date(r[0])}</td><td>${esc(signalName[r[1]] || r[1])}</td><td class="ltr">${esc(r[2])}</td><td>${esc(r[3])}</td><td class="ltr">${esc(r[4])}</td></tr>`), 'secLog', (data.secLog || []).map((r) => r[6]))}</section>`;
    if (tab === 'security') html = '<h2>تغيير كلمة مرور حسابك في اللوحة</h2><form id="password-form" class="security-form"><label>كلمة المرور الحالية<input type="password" name="currentPassword" autocomplete="current-password" required maxlength="128"></label><label>كلمة المرور الجديدة<input type="password" name="password" autocomplete="new-password" minlength="12" maxlength="128" required></label><button type="submit">تغيير وإنهاء جلسات الإدارة</button></form>';
    $('content').innerHTML = html;
    $('link-search')?.addEventListener('input', (e) => { const q = e.target.value.toLowerCase(); $('links-table').innerHTML = linkTable((data.links || []).filter((l) => (l.alias + ' ' + l.email + ' ' + l.url).toLowerCase().includes(q))); });
    $('search')?.addEventListener('input', (e) => { $('users-table').innerHTML = userTable(data.users.filter((u) => (u.email + ' ' + u.firstName + ' ' + u.lastName).toLowerCase().includes(e.target.value.toLowerCase())), true); });
    $('act-search')?.addEventListener('input', (e) => { actQuery = e.target.value; const pos = e.target.selectionStart; render(); const s = $('act-search'); s.focus(); try { s.setSelectionRange(pos, pos); } catch (err) {} });
    $('password-form')?.addEventListener('submit', async (e) => { e.preventDefault(); await busy(e.submitter, async () => { await api('password', Object.fromEntries(new FormData(e.target))); signout(); notice('تم تغيير كلمة المرور. سجل الدخول مجددًا.'); }); });
    $('settings-form')?.addEventListener('submit', async (e) => { e.preventDefault(); const rows = [...e.target.querySelectorAll('[data-setting]')].filter((x) => x.value.trim() !== x.dataset.orig).map((x) => ({ key: x.dataset.setting, value: x.value.trim() })); if (!rows.length) return notice('لا توجد تغييرات لحفظها.'); const bad = rows.find((r) => { const m = SETTING_META[r.key]; return m && m.type === 'num' && (!/^\d+$/.test(r.value) || Number(r.value) < m.min || Number(r.value) > m.max); }); if (bad) return notice('القيمة غير صحيحة في: ' + (SETTING_META[bad.key]?.t || bad.key), true); await busy(e.submitter, async () => { await run('settings', { rows }); notice('تم حفظ ' + rows.length + ' من الإعدادات.'); }); });
  }
  function field(name, label, value = '', type = 'text', options = null, extra = '') { return `<label>${label}${options ? `<select name="${name}" ${extra}>${options.map(([v, l]) => `<option value="${esc(v)}" ${String(value) === String(v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>` : type === 'textarea' ? `<textarea name="${name}" maxlength="4000" ${extra}>${esc(value)}</textarea>` : `<input name="${name}" type="${type}" value="${esc(value)}" ${type === 'password' ? 'autocomplete="new-password" maxlength="128"' : 'maxlength="254"'} ${type === 'number' ? 'inputmode="numeric" step="1"' : ''} ${extra}>`}</label>`; }
  function durationField(defDays = 30) { return `<fieldset class="duration"><legend>المدة</legend><div class="seg"><label><input type="radio" name="mode" value="days" checked> عدد أيام</label><label><input type="radio" name="mode" value="date"> حتى تاريخ</label><label><input type="radio" name="mode" value="forever"> دائم</label></div><div class="unit" data-mode="days"><input type="number" name="days" min="1" max="9999" step="1" value="${defDays}" inputmode="numeric" aria-label="عدد الأيام"><span>يوم</span></div><div data-mode="date" hidden><input type="date" name="until" data-future aria-label="تاريخ الانتهاء"><small class="tip">ينتهي في نهاية اليوم المختار.</small></div></fieldset>`; }
  function bindDuration() { const f = $('edit-form'); const sync = () => { const m = f.querySelector('[name="mode"]:checked')?.value || 'days'; f.querySelectorAll('[data-mode]').forEach((x) => x.hidden = x.dataset.mode !== m); }; f.querySelectorAll('[name="mode"]').forEach((x) => x.addEventListener('change', sync)); sync(); }
  function readDays(v) {
    if (v.mode === 'forever') return 0;
    if (v.mode === 'date') { if (!v.until) throw new Error('اختر تاريخ الانتهاء من التقويم.'); const d = Math.ceil((new Date(v.until + 'T23:59:59').getTime() - Date.now()) / 86400000); if (d < 1) throw new Error('اختر تاريخًا بعد اليوم.'); if (d > 9999) throw new Error('التاريخ بعيد جدًا.'); return d; }
    const n = Number(v.days); if (!Number.isInteger(n) || n < 1 || n > 9999) throw new Error('اكتب عدد أيام من 1 إلى 9999.'); return n;
  }
  function permsField(on = []) { return `<fieldset class="perms"><legend>الصلاحيات</legend>${Object.keys(PERM_INFO).map((p) => `<label class="perm"><input type="checkbox" name="perm" value="${p}" ${on.includes(p) ? 'checked' : ''}><span><b>${PERM_INFO[p][0]}</b><small>${PERM_INFO[p][1]}</small></span></label>`).join('')}</fieldset>`; }
  const pickedPerms = () => [...$('edit-form').querySelectorAll('[name="perm"]:checked')].map((x) => x.value);
  function open(title, fields, save, submit = 'حفظ') { $('edit-title').textContent = title; $('fields').innerHTML = fields; editor = save; $('edit-submit').textContent = submit; $('editor').showModal(); }
  function plansFor(tool) { return Object.keys(data.catalog.tools[tool]?.plans || {}).map((p) => [p, planLabel[p] || p]); }
  function choices(type) { return data.catalog.order.filter((t) => type === 'api' ? t === 'api' : t !== 'api' && data.catalog.tools[t]?.plans?.free).map((t) => [t, toolName[t] || t]); }
  function syncPlans(filterFree = false) { const form = $('edit-form'), tool = form.elements.tool, plan = form.elements.plan; if (!tool || !plan) return; const prev = plan.value; plan.innerHTML = plansFor(tool.value).filter(([v]) => !filterFree || v !== 'free').map(([v, l]) => `<option value="${v}">${l}</option>`).join(''); if ([...plan.options].some((o) => o.value === prev)) plan.value = prev; tool.onchange = () => syncPlans(filterFree); }
  async function busy(button, fn) { if (button) button.disabled = true; try { await fn(); } catch (e) { notice(e.message === 'Failed to fetch' ? 'تعذر الاتصال. تحقق من الإنترنت.' : e.message, true); } finally { if (button) button.disabled = false; } }
  function markDirty(el) { const box = el.closest('[data-plan-card], #settings-form'); if (!box) return; const changed = [...box.querySelectorAll('[data-orig]')].some((x) => (x.type === 'checkbox' ? (x.checked ? '1' : '0') : x.value.trim()) !== x.dataset.orig); const d = box.querySelector('[data-dirty]'); if (d) d.hidden = !changed; }
  $('login-form').addEventListener('submit', (e) => { e.preventDefault(); busy(e.submitter, async () => { const r = await api('login', Object.fromEntries(new FormData(e.target))); token = r.token; e.target.reset(); try { await load(); } catch (error) { signout(); throw error; } }); });
  $('logout').onclick = () => busy($('logout'), async () => { try { await api('end'); } finally { signout(); } });
  $('refresh').onclick = () => busy($('refresh'), load);
  $('nav').addEventListener('click', (e) => { const b = e.target.closest('[data-tab]'); if (!b) return; tab = b.dataset.tab; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  $('close').onclick = () => $('editor').close();
  $('editor').addEventListener('close', () => { $('fields').replaceChildren(); editor = null; });
  $('edit-form').onsubmit = (e) => { e.preventDefault(); busy(e.submitter, async () => { const values = Object.fromEntries(new FormData(e.target)); const save = editor; if (save) await save(values); }); };
  $('content').addEventListener('input', (e) => {
    const t = e.target;
    if (t.dataset.field === 'value' && t.dataset.row) { const card = t.closest('.pfield'); const txt = card?.querySelector('[data-field="text"]'); const pv = card?.querySelector('[data-preview]'); if (pv && txt) pv.textContent = txt.value ? '«' + txt.value.split('{v}').join(t.value || '—') + '»' : ''; }
    if (t.dataset.field === 'text' && t.dataset.row) { const card = t.closest('.pfield'); const val = card?.querySelector('[data-field="value"]'); const pv = card?.querySelector('[data-preview]'); if (pv) pv.textContent = t.value ? '«' + t.value.split('{v}').join((val && val.value) || '—') + '»' : ''; }
    if (t.dataset.orig !== undefined) markDirty(t);
  });
  $('content').addEventListener('change', (e) => { const t = e.target; if (t.dataset.all) { document.querySelectorAll(`[data-pick="${t.dataset.all}"]`).forEach((x) => x.checked = t.checked); syncPick(t.dataset.all); } else if (t.dataset.pick) syncPick(t.dataset.pick); if (t.type === 'checkbox' && t.dataset.row) { const b = t.parentNode.querySelector('b'); if (b) b.textContent = t.checked ? 'مفعّل' : 'غير مفعّل'; markDirty(t); } });
  $('content').addEventListener('click', (e) => {
    const tg = e.target.closest('[data-toggle-desc]');
    if (tg) { const inp = tg.parentNode.querySelector('[data-field="text"]'); inp.hidden = !inp.hidden; if (!inp.hidden) inp.focus(); return; }
    const b = e.target.closest('[data-action]'); if (!b) return; const i = Number(b.dataset.index), a = b.dataset.action;
    if (a === 'del-sel') { const k = b.dataset.kind; return removeItems(k, [...document.querySelectorAll(`[data-pick="${k}"]:checked`)].map((x) => x.value), false, b); }
    if (a === 'del-all') return removeItems(b.dataset.kind, [], true, b);
    if (a === 'health') return busy(b, async () => { health = await api('health'); render(); });
    if (a === 'plan-tool') { planTool = b.dataset.tool; return render(); }
    if (a === 'act-filter') { actFilter = b.dataset.level; return render(); }
    if (a === 'plan-save') {
      const card = b.closest('[data-plan-card]');
      const byRow = {};
      card.querySelectorAll('[data-row]').forEach((x) => { const k = x.dataset.row; byRow[k] = byRow[k] || { el: {} }; byRow[k].el[x.dataset.field] = x; });
      const rows = [];
      for (const k of Object.keys(byRow)) {
        const v = byRow[k].el.value, t = byRow[k].el.text;
        const value = v ? (v.type === 'checkbox' ? (v.checked ? '1' : '0') : v.value.trim()) : '';
        const text = t ? t.value : '';
        if (v && value === v.dataset.orig && (!t || text === t.dataset.orig)) continue;
        if (!v && t && text === t.dataset.orig) continue;
        const [tool, plan, key] = k.split('|');
        if (v && v.type === 'number') { const n = Number(value); if (value === '' || !Number.isInteger(n) || n < Number(v.min || 0) || (v.max && n > Number(v.max))) { v.focus(); return notice('رقم غير صحيح في: ' + (v.closest('.pfield')?.querySelector('label')?.textContent || key), true); } }
        if (key === 'price' && value && !/^\d{1,7}(\.\d{1,2})?$/.test(value)) { v.focus(); return notice('اكتب السعر أرقامًا فقط، مثل 199 أو 49.5', true); }
        rows.push({ tool, plan, key, value, text });
      }
      if (!rows.length) return notice('لا توجد تغييرات لحفظها في هذه الباقة.');
      return busy(b, async () => { await run('plans', { rows }); notice('تم حفظ ' + rows.length + ' من التعديلات. تظهر للعملاء فورًا.'); });
    }
    if (a === 'user-create' || a === 'user-edit') { const u = a === 'user-edit' ? data.users[i] : null; open(u ? 'تعديل الحساب' : 'إنشاء حساب دون رمز تحقق', field('email', 'البريد الإلكتروني', u?.email || '', 'email', null, 'required dir="ltr"') + field('firstName', 'الاسم الأول', u?.firstName || '', 'text', null, 'required') + field('lastName', 'اسم العائلة', u?.lastName || '', 'text', null, 'required') + field('password', u ? 'كلمة مرور جديدة (اختياري)' : 'كلمة المرور', '', 'password', null, 'dir="ltr"') + (u ? field('status', 'الحالة', u.status, 'text', [['active', 'نشط'], ['disabled', 'معطل']]) : ''), async (v) => { if (u) v.email = u.email; if (!u && !v.password) throw new Error('أدخل كلمة المرور.'); await run(u ? 'user/edit' : 'user/create', v); $('editor').close(); notice('تم حفظ الحساب.'); }); if (u) $('edit-form').elements.email.readOnly = true; return; }
    if (a === 'codes') { open('إنشاء أكواد اشتراك', field('type', 'نوع الكود', 'normal', 'text', [['normal', 'عادي — اشتراك أداة'], ['api', 'اشتراك API']]) + field('tool', 'الأداة', 'wa', 'text', choices('normal')) + field('plan', 'الباقة', 'pro', 'text', plansFor('wa').filter(([p]) => p !== 'free')) + durationField(30) + field('count', 'عدد الأكواد', 1, 'number', null, 'min="1" max="200" required') + field('note', 'ملاحظة (اختياري)', ''), async (v) => { const days = readDays(v); const count = Number(v.count); if (!Number.isInteger(count) || count < 1 || count > 200) throw new Error('اكتب عدد أكواد من 1 إلى 200.'); const r = await run('codes', { tool: v.tool, plan: v.plan, note: v.note, count, days }); $('editor').close(); open('الأكواد الجديدة', '<textarea class="code-output ltr" readonly aria-label="الأكواد">' + esc(r.codes.join('\n')) + '</textarea><button type="button" class="secondary" id="copy-codes">نسخ كل الأكواد</button>', async () => { $('editor').close(); }, 'تم'); $('copy-codes').onclick = () => navigator.clipboard.writeText(r.codes.join('\n')).then(() => notice('نُسخت الأكواد.'), () => notice('حدد الأكواد وانسخها يدويًا.', true)); }, 'إنشاء'); bindDuration(); syncPlans(true); $('edit-form').elements.type.onchange = (e) => { const f = $('edit-form'); f.elements.tool.innerHTML = choices(e.target.value).map(([v, l]) => `<option value="${v}">${l}</option>`).join(''); syncPlans(true); }; return; }
    if (a === 'sub') { const r = data.subs[i], tool = r?.[3] || 'wa'; open('تعيين اشتراك', `<label>الحساب<input name="email" list="user-list" dir="ltr" required value="${esc(r?.[2] || '')}" placeholder="اكتب البريد أو اختره"></label><datalist id="user-list">${data.users.map((u) => `<option value="${esc(u.email)}">${esc(u.firstName + ' ' + u.lastName)}</option>`).join('')}</datalist>` + field('tool', 'الأداة', tool, 'text', data.catalog.order.map((t) => [t, toolName[t] || t])) + field('plan', 'الباقة', r?.[4] || 'pro', 'text', plansFor(tool)) + durationField(30), async (v) => { const days = v.plan === 'free' ? 0 : readDays(v); await run('sub', { email: v.email.trim().toLowerCase(), tool: v.tool, plan: v.plan, days }); $('editor').close(); notice('تم تحديث الاشتراك.'); }); bindDuration(); syncPlans(); return; }
    if (a === 'ban-user') { open('إيقاف حساب', `<label>الحساب<input name="email" list="user-list" dir="ltr" required placeholder="اكتب البريد أو اختره"></label><datalist id="user-list">${data.users.map((u) => `<option value="${esc(u.email)}"></option>`).join('')}</datalist>` + field('minutes', 'مدة الإيقاف', '1440', 'text', [['60', 'ساعة'], ['1440', 'يوم'], ['10080', 'أسبوع'], ['43200', '30 يومًا'], ['custom', 'حتى تاريخ ووقت محددين'], ['0', 'دائم']]) + '<label data-until hidden>ينتهي الإيقاف في<input type="datetime-local" name="until"></label>' + field('note', 'ملاحظة (اختياري)', ''), async (v) => { let minutes = Number(v.minutes); if (v.minutes === 'custom') { if (!v.until) throw new Error('اختر تاريخ ووقت انتهاء الإيقاف.'); minutes = Math.ceil((new Date(v.until).getTime() - Date.now()) / 60000); if (minutes < 1) throw new Error('اختر وقتًا في المستقبل.'); } await run('ban/user', { email: v.email.trim().toLowerCase(), minutes, note: v.note }); $('editor').close(); notice('تم إيقاف الحساب وإنهاء جلساته.'); }, 'إيقاف'); const f = $('edit-form'); f.elements.minutes.onchange = () => { f.querySelector('[data-until]').hidden = f.elements.minutes.value !== 'custom'; }; return; }
    if (a === 'unlock-codes') { open('إنشاء أكواد فك الإيقاف', field('count', 'عدد الأكواد', 1, 'number', null, 'min="1" max="50" required') + field('note', 'ملاحظة (اختياري)', ''), async (v) => { const count = Number(v.count); if (!Number.isInteger(count) || count < 1 || count > 50) throw new Error('اكتب عددًا من 1 إلى 50.'); const r = await run('unlock/codes', { count, note: v.note }); $('editor').close(); open('أكواد فك الإيقاف — انسخها الآن ولن تظهر مجددًا', '<textarea class="code-output ltr" readonly aria-label="الأكواد">' + esc(r.codes.join('\n')) + '</textarea>', async () => { $('editor').close(); }, 'تم'); }, 'إنشاء'); return; }
    if (a === 'staff-create') { open('إضافة موظف للوحة', field('username', 'اسم المستخدم (أحرف إنجليزية وأرقام)', '', 'text', null, 'required minlength="3" maxlength="40" dir="ltr" pattern="[A-Za-z0-9_.\\-]{3,40}"') + field('password', 'كلمة المرور (12 حرفًا على الأقل)', '', 'password', null, 'required minlength="12" dir="ltr"') + permsField(['codes']), async (v) => { await run('staff/create', { username: v.username.trim(), password: v.password, perms: pickedPerms() }); $('editor').close(); notice('أُضيف الموظف. أرسل له اسم المستخدم وكلمة المرور بطريقة آمنة.'); }, 'إضافة'); return; }
    if (a === 'staff-edit') { const s = data.admins[i]; open('تعديل صلاحيات ' + s.username, permsField(s.perms) + field('password', 'كلمة مرور جديدة (اختياري)', '', 'password', null, 'dir="ltr"'), async (v) => { const body = { username: s.username, perms: pickedPerms() }; if (v.password) body.password = v.password; await run('staff/edit', body); $('editor').close(); notice('تم حفظ الصلاحيات، وتُطبق فورًا.'); }); return; }
    if (a === 'staff-toggle') { const s = data.admins[i]; const off = s.status !== 'disabled'; if (!confirm(off ? `تعطيل ${s.username}؟ ستُنهى جلساته فورًا.` : `إعادة تفعيل ${s.username}؟`)) return; return busy(b, async () => { await run('staff/edit', { username: s.username, status: off ? 'disabled' : 'active' }); notice('تم.'); }); }
    if (a === 'staff-remove') { const s = data.admins[i]; if (!confirm(`حذف حساب الموظف ${s.username} نهائيًا؟`)) return; return busy(b, async () => { await run('staff/remove', { username: s.username }); notice('حُذف حساب الموظف.'); }); }
    const operations = { 'ban-lift': ['فك الإيقاف عن هذا المعرّف الآن؟', 'ban/lift', { subject: data.bans?.[i]?.subject }], 'unlock-disable': ['تعطيل كود الفك هذا؟', 'unlock/disable', { id: data.unlocks?.[i]?.id }], 'code-disable': ['تعطيل هذا الكود؟', 'code/disable', { code: data.codes[i]?.[0] }], sessions: ['إنهاء جميع جلسات هذا الحساب؟', 'sessions/clear', { email: data.users[i]?.email }], 'api-revoke': ['إبطال كل مفاتيح API لهذا الحساب؟', 'api/revoke', { email: data.apiKeys[i]?.email }], 'wa-delete': ['فصل رقم واتساب ومسح بيانات الربط؟', 'wa/delete', { uid: data.wa[i]?.uid }], 'link-block': ['إيقاف هذا الرابط لكل الزوار؟ لن يستطيع صاحبه إعادة تشغيله.', 'link', { alias: data.links?.[i]?.alias, status: 'blocked' }], 'link-open': ['إعادة تفعيل هذا الرابط؟', 'link', { alias: data.links?.[i]?.alias, status: 'active' }] };
    if (operations[a]) { const [question, path, payload] = operations[a]; if (confirm(question)) busy(b, async () => { await run(path, payload); notice('تم تنفيذ الطلب.'); }); }
  });
})();
