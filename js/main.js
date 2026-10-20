
(function () {
  "use strict";
  var D = window.PORTFOLIO, F = window.Flora, P = D.profile, G = window.Diagrams;
  
  var WORKS = D.projects.filter(function (p) { return !p.draft; });
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  var UI = {
    zh: {
      view: "点击查看 ↗",
      navHome: "首页", aboutMore: "关于我 & 简历 →",
      worksLead: "每个项目都完整记录了从问题到成果的过程。点击卡片查看详情。", viewAll: "查看全部作品 →", explore: "继续了解", readMore: "阅读 →", contactCta: "写信给我 →",
      navPhilosophy: "设计理念", philosophyTitle: "设计理念", imgMissing: "图片待添加", videoMissing: "视频待添加",
      skip: "跳到正文", language: "语言", navWorks: "作品集", navAbout: "关于我", navResume: "简历", navContact: "联系",
      ctaWorks: "查看作品集", ctaAbout: "了解我", resumeDownload: "下载简历", contents: "目 录",
      worksTitle: "精选作品", all: "全部", directions: "我的方向", resumeTitle: "教育与经历",
      education: "教育背景", experience: "经历与活动", skills: "专业技能", certifications: "证书与认证",
      copy: "复制邮箱", copied: "已复制 ", copyFail: "已选中邮箱，按 Ctrl/⌘ + C 复制",
      backTop: "回到顶部 ↑", readCase: "查看作品 →", allWorks: "← 全部作品", onThisPage: "本页目录",
      photoHint: "放置你的个人照片",
      overview: "作品介绍", problem: "问题背景", research: "用户研究", ideation: "概念发想", design: "设计迭代", testing: "测试与验证", outcome: "最终成果",
      preview: "作品预览", web: "网站 / 原型", pdf: "PDF", openFull: "打开完整页面 ↗", loadPreview: "点击加载预览",
      pdfOpen: "在新窗口打开 ↗", pdfFull: "全屏查看", pages: "页", pdfMissing: "在 data.js 里给 pdf.src 填上 PDF 链接后，这里会显示文件。",
      prev: "上一个", next: "下一个", latest: "新作 · "
    },
    zht: {
      view: "點擊查看 ↗",
      navHome: "首頁", aboutMore: "關於我 & 簡歷 →",
      worksLead: "每個項目都完整記錄了從問題到成果的過程。點擊卡片查看詳情。", viewAll: "查看全部作品 →", explore: "繼續了解", readMore: "閱讀 →", contactCta: "寫信給我 →",
      navPhilosophy: "設計理念", philosophyTitle: "設計理念", imgMissing: "圖片待添加", videoMissing: "影片待添加",
      skip: "跳到正文", language: "語言", navWorks: "作品集", navAbout: "關於我", navResume: "簡歷", navContact: "聯絡",
      ctaWorks: "查看作品集", ctaAbout: "了解我", resumeDownload: "下載簡歷", contents: "目 錄",
      worksTitle: "精選作品", all: "全部", directions: "我的方向", resumeTitle: "教育與經歷",
      education: "教育背景", experience: "經歷與活動", skills: "專業技能", certifications: "證書與認證",
      copy: "複製郵箱", copied: "已複製 ", copyFail: "已選中郵箱，按 Ctrl/⌘ + C 複製",
      backTop: "回到頂部 ↑", readCase: "查看作品 →", allWorks: "← 全部作品", onThisPage: "本頁目錄",
      photoHint: "放置你的個人照片",
      overview: "作品介紹", problem: "問題背景", research: "用戶研究", ideation: "概念發想", design: "設計迭代", testing: "測試與驗證", outcome: "最終成果",
      preview: "作品預覽", web: "網站 / 原型", pdf: "PDF", openFull: "開啟完整頁面 ↗", loadPreview: "點擊載入預覽",
      pdfOpen: "在新視窗打開 ↗", pdfFull: "全屏查看", pages: "頁", pdfMissing: "在 data.js 裡給 pdf.src 填上 PDF 連結後，這裡會顯示檔案。",
      prev: "上一個", next: "下一個", latest: "新作 · "
    },
    en: {
      view: "View live ↗",
      navHome: "Home", aboutMore: "About & résumé →",
      worksLead: "Each project documents the journey from problem to outcome. Select a card to read the full case study.", viewAll: "View all works →", explore: "Keep exploring", readMore: "Read more →", contactCta: "Write to me →",
      navPhilosophy: "Philosophy", philosophyTitle: "Design Philosophy", imgMissing: "Image to come", videoMissing: "Video to come",
      skip: "Skip to content", language: "Language", navWorks: "Works", navAbout: "About", navResume: "Résumé", navContact: "Contact",
      ctaWorks: "View works", ctaAbout: "About me", resumeDownload: "Résumé PDF", contents: "Contents",
      worksTitle: "Selected Works", all: "All", directions: "What I work on", resumeTitle: "Education & Experience",
      education: "Education", experience: "Experience & Leadership", skills: "Skills", certifications: "Certifications",
      copy: "Copy email", copied: "Copied ", copyFail: "Email selected. Press Ctrl/⌘ + C to copy.",
      backTop: "Back to top ↑", readCase: "View project →", allWorks: "← All works", onThisPage: "On this page",
      photoHint: "Your photo here",
      overview: "Overview", problem: "Problem & Background", research: "User Research", ideation: "Ideation", design: "Design Iterations", testing: "Testing & Validation", outcome: "Final Outcome",
      preview: "Preview", web: "Website / Prototype", pdf: "PDF", openFull: "Open full page ↗", loadPreview: "Click to load preview",
      pdfOpen: "Open in new tab ↗", pdfFull: "Full screen", pages: "pages", pdfMissing: "Add a PDF link to pdf.src in data.js and the file will show here.",
      prev: "Previous", next: "Next", latest: "New · "
    },
    ja: {
      view: "サイトを見る ↗",
      navHome: "ホーム", aboutMore: "私について・履歴書 →",
      worksLead: "各プロジェクトは課題から成果までのプロセスをまとめています。カードを選ぶと詳細が見られます。", viewAll: "すべての作品 →", explore: "もっと知る", readMore: "続きを読む →", contactCta: "連絡する →",
      navPhilosophy: "デザイン理念", philosophyTitle: "デザイン理念", imgMissing: "画像は準備中", videoMissing: "動画は準備中",
      skip: "作品へ移動", language: "言語", navWorks: "作品集", navAbout: "私について", navResume: "履歴書", navContact: "連絡先",
      ctaWorks: "作品を見る", ctaAbout: "私について", resumeDownload: "履歴書 PDF", contents: "目 次",
      worksTitle: "作品セレクション", all: "すべて", directions: "取り組んでいる分野", resumeTitle: "学歴と経験",
      education: "学歴", experience: "経験・課外活動", skills: "スキル", certifications: "資格・認定",
      copy: "メールをコピー", copied: "コピーしました ", copyFail: "メールを選択しました。Ctrl/⌘ + C でコピー",
      backTop: "トップへ ↑", readCase: "作品を見る →", allWorks: "← すべての作品", onThisPage: "このページ",
      photoHint: "写真をここに",
      overview: "概要", problem: "問題と背景", research: "ユーザーリサーチ", ideation: "アイデア発想", design: "デザイン反復", testing: "テストと検証", outcome: "最終成果",
      preview: "プレビュー", web: "サイト / プロトタイプ", pdf: "PDF", openFull: "全画面で開く ↗", loadPreview: "クリックして読み込む",
      pdfOpen: "新しいタブで開く ↗", pdfFull: "全画面表示", pages: "ページ", pdfMissing: "data.js の pdf.src に PDF のリンクを入れると、ここに表示されます。",
      prev: "前へ", next: "次へ", latest: "新作 · "
    },
    fr: {
      view: "Voir le site ↗",
      navHome: "Accueil", aboutMore: "À propos & CV →",
      worksLead: "Chaque projet retrace le parcours du problème au résultat. Choisissez une carte pour lire l'étude de cas.", viewAll: "Tous les projets →", explore: "Continuer", readMore: "Lire la suite →", contactCta: "M'écrire →",
      navPhilosophy: "Philosophie", philosophyTitle: "Philosophie de design", imgMissing: "Image à venir", videoMissing: "Vidéo à venir",
      skip: "Aller aux projets", language: "Langue", navWorks: "Projets", navAbout: "À propos", navResume: "CV", navContact: "Contact",
      ctaWorks: "Voir les projets", ctaAbout: "À propos", resumeDownload: "CV en PDF", contents: "Sommaire",
      worksTitle: "Projets choisis", all: "Tous", directions: "Mes domaines", resumeTitle: "Formation & Expérience",
      education: "Formation", experience: "Expérience & engagement", skills: "Compétences", certifications: "Certifications",
      copy: "Copier l'email", copied: "Copié ", copyFail: "Email sélectionné. Ctrl/⌘ + C pour copier.",
      backTop: "Haut de page ↑", readCase: "Voir le projet →", allWorks: "← Tous les projets", onThisPage: "Sur cette page",
      photoHint: "Votre photo ici",
      overview: "Présentation", problem: "Problème et contexte", research: "Recherche utilisateur", ideation: "Idéation", design: "Itérations de design", testing: "Tests et validation", outcome: "Résultat final",
      preview: "Aperçu", web: "Site / Prototype", pdf: "PDF", openFull: "Ouvrir en entier ↗", loadPreview: "Cliquer pour charger",
      pdfOpen: "Ouvrir dans un onglet ↗", pdfFull: "Plein écran", pages: "pages", pdfMissing: "Ajoutez le lien du PDF dans pdf.src (data.js) pour l'afficher ici.",
      prev: "Précédent", next: "Suivant", latest: "Nouveau · "
    },
    ko: {
      view: "바로 보기 ↗",
      navHome: "홈", aboutMore: "소개 & 이력서 →",
      worksLead: "각 프로젝트는 문제에서 결과까지의 과정을 담고 있습니다. 카드를 선택해 자세히 보세요.", viewAll: "전체 작품 →", explore: "더 알아보기", readMore: "더 보기 →", contactCta: "연락하기 →",
      navPhilosophy: "디자인 철학", philosophyTitle: "디자인 철학", imgMissing: "이미지 준비 중", videoMissing: "영상 준비 중",
      skip: "작품으로 이동", language: "언어", navWorks: "작품", navAbout: "소개", navResume: "이력서", navContact: "연락처",
      ctaWorks: "작품 보기", ctaAbout: "소개 보기", resumeDownload: "이력서 PDF", contents: "목 차",
      worksTitle: "대표 작품", all: "전체", directions: "나의 분야", resumeTitle: "학력과 경력",
      education: "학력", experience: "경험 · 리더십", skills: "스킬", certifications: "자격 · 인증",
      copy: "이메일 복사", copied: "복사됨 ", copyFail: "이메일을 선택했습니다. Ctrl/⌘ + C로 복사하세요.",
      backTop: "맨 위로 ↑", readCase: "작품 보기 →", allWorks: "← 전체 작품", onThisPage: "이 페이지",
      photoHint: "사진을 넣어 주세요",
      overview: "개요", problem: "문제 및 배경", research: "사용자 리서치", ideation: "아이디어 발상", design: "디자인 반복", testing: "테스트 및 검증", outcome: "최종 결과물",
      preview: "미리보기", web: "웹사이트 / 프로토타입", pdf: "PDF", openFull: "전체 페이지 열기 ↗", loadPreview: "클릭해서 불러오기",
      pdfOpen: "새 탭에서 열기 ↗", pdfFull: "전체 화면", pages: "페이지", pdfMissing: "data.js의 pdf.src에 PDF 링크를 넣으면 여기에 표시됩니다.",
      prev: "이전", next: "다음", latest: "신작 · "
    }
  };
  var PROCESS_KEYS = ["problem", "research", "ideation", "design", "testing", "outcome"];
  var HTML_LANG = { zh: "zh-CN", zht: "zh-TW", en: "en", ja: "ja", fr: "fr", ko: "ko" };

  var lang = null;
  try { lang = localStorage.getItem("portfolioLang"); } catch (e) { lang = null; }
  if (!UI[lang]) lang = "en";

  function t(v) {
    if (v == null) return "";
    if (typeof v === "string" || typeof v === "number") return String(v);
    if (v[lang]) return v[lang];
    if (lang === "zht" && v.zh) return v.zh;
    return v.en || v.zh || "";
  }
  function u(key) { return UI[lang][key] || UI.en[key] || key; }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function setAll(sel, html) { $$(sel).forEach(function (n) { n.innerHTML = html; }); }
  function textAll(sel, text) { $$(sel).forEach(function (n) { n.textContent = text; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function catLabel(id) {
    for (var i = 0; i < D.categories.length; i++) if (D.categories[i].id === id) return t(D.categories[i]);
    return id || "";
  }
  function findProject(id) {
    for (var i = 0; i < WORKS.length; i++) if (WORKS[i].id === id) return WORKS[i];
    return null;
  }

  var painters = [];
  var ro = "ResizeObserver" in window ? new ResizeObserver(function (entries) {
    entries.forEach(function (e) {
      var cv = e.target;
      if (Math.abs((cv._w || 0) - e.contentRect.width) < 2 && Math.abs((cv._h || 0) - e.contentRect.height) < 2) return;
      cv._w = e.contentRect.width; cv._h = e.contentRect.height;
      clearTimeout(cv._t);
      cv._t = setTimeout(function () { repaint(cv); }, 140);
    });
  }) : null;
  function register(canvas, fn) {
    painters.push({ canvas: canvas, fn: fn });
    requestAnimationFrame(function () { canvas._w = canvas.clientWidth; canvas._h = canvas.clientHeight; fn(canvas); });
    if (ro) ro.observe(canvas);
  }
  function repaint(canvas) {
    for (var i = 0; i < painters.length; i++) if (painters[i].canvas === canvas) painters[i].fn(canvas);
  }
  function prune() {
    painters = painters.filter(function (p) {
      var keep = document.contains(p.canvas);
      if (!keep && ro) ro.unobserve(p.canvas);
      return keep;
    });
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { prune(); painters.forEach(function (p) { p.fn(p.canvas); }); });
  }

  function media(container, image, theme, seed, alt) {
    container.innerHTML = "";
    if (image) {
      var img = el("img");
      img.src = image; img.alt = alt || ""; img.loading = "lazy";
      container.appendChild(img);
    } else {
      var cv = el("canvas");
      cv.setAttribute("aria-hidden", "true");
      container.appendChild(cv);
      register(cv, function (c) { F.collage(c, theme || "rose", seed, { letter: P.sealLetter }); });
    }
  }

  if (P.heroImage) $(".hero").style.backgroundImage = "url(" + JSON.stringify(P.heroImage) + ")";
  $$(".page-head__art").forEach(function (cv, i) {
    register(cv, function (c) { F.banner(c, cv.dataset.theme || "rose", "banner" + i, { transparent: true }); });
  });
  $$(".contact__scene").forEach(function (cv, i) {
    register(cv, function (c) { F.corners(c, "contact-" + i); });
  });
  $$(".garland").forEach(function (g, i) {
    register(g, function (c) { F.garland(c, g.dataset.theme || "rose", "garland" + i); });
  });

  $$(".js-photo").forEach(function (box, i) {
    if (P.photo) {
      var img = el("img"); img.src = P.photo; img.alt = P.nameZh + " · " + P.nameEn[1]; img.loading = "lazy";
      box.appendChild(img);
    } else {
      var cv = el("canvas"); cv.setAttribute("aria-hidden", "true"); box.appendChild(cv);
      register(cv, function (c) { F.specimen(c, "rose", "portrait"); });
      box.appendChild(el("span", "photo-frame__hint", ""));
    }
  });
  textAll(".js-photo-cap", P.nameZh + " · " + P.nameEn[1]);

  D.directions.forEach(function (s, i) {
    var li = el("li");
    li.innerHTML =
      '<a class="stamp" href="' + (s.project && findProject(s.project) ? "#case-" + esc(s.project) : "#works") + '"><div class="stamp__in"><div class="stamp__art"><canvas aria-hidden="true"></canvas><span class="stamp__val">' + (i + 1) * 5 + '¢</span></div>' +
      '<span class="stamp__en">' + esc(s.en || t(s.name)) + '</span><span class="stamp__cn"></span><p></p></div></a>';
    $("#directionsList").appendChild(li);
    register(li.querySelector("canvas"), function (c) { F.specimen(c, s.theme || "rose", "dir" + i); });
  });

  function renderText() {
    document.documentElement.lang = HTML_LANG[lang] || lang;
    $("#langSelect").value = lang;
    $$("[data-i18n]").forEach(function (n) { n.innerHTML = u(n.dataset.i18n); });

    $("#monogram").setAttribute("aria-label", P.monogram + " — " + u("navHome"));
    $("#monogram").innerHTML = '<img class="brand-logo" src="images/cathy-zq-logo-v3.png" alt="Z.Q — Cathy" width="76" height="60">';
    $("#heroTag").textContent = t(P.tag);
    $("#heroName").innerHTML = '<span class="hero-greeting">Hi, I\'m</span><span class="hero-person-name">' + esc(P.nameEn[0]) + "</span>";
    $("#heroTagline").textContent = t({en:"Designing connections between people, screens and the physical world.",zh:"探索人与屏幕、实体世界之间的交互。",zht:"探索人與螢幕、實體世界之間的互動。"});
    $("#heroBio").textContent = t(P.bio).replace(/[（(]Cathy[）)]/g, "").replace(/\s+,/g, ",");
    $$(".resume-link").forEach(function (a) {
      if (P.resume) { a.href = P.resume; a.hidden = false; } else a.hidden = true;
    });
    
    var ph = P.philosophy || {};
    textAll(".js-phil-lead", t(ph.lead));
    setAll(".js-principles", (ph.principles || []).map(function (x) {
      return '<li class="principle"><h3>' + esc(t(x.title)) + "</h3><p>" + esc(t(x.text)) + "</p></li>";
    }).join(""));

    setAll(".js-home-philosophy", "<h3>" + esc(t(ph.lead)) + "</h3><p>" + esc(t(ph.principles[0].text)) + "</p>");

    textAll(".hero-photo-label", t({en:"Your photo",zh:"照片位置",zht:"照片位置",ja:"写真",fr:"Votre photo",ko:"사진"}));
    textAll(".js-portrait-label", t({en:"Portrait photo",zh:"个人照片",zht:"個人照片",ja:"ポートレート",fr:"Portrait",ko:"프로필 사진"}));
    
    setAll(".js-about-heading", t(P.aboutHeading));
    setAll(".js-about-paras", P.about.map(function (p) { return '<p class="about__p">' + esc(t(p)) + "</p>"; }).join(""));
    var chips = D.skills[0].items.slice(0, 3).concat(D.skills[1].items.slice(0, 3)).concat(["HTML / CSS"]);
    setAll(".js-about-chips", chips.map(function (c) { return "<li>" + esc(t(c)) + "</li>"; }).join(""));
    textAll(".photo-frame__hint", u("photoHint"));
    $$("#directionsList li").forEach(function (li, i) {
      var s = D.directions[i];
      var cn = li.querySelector(".stamp__cn");
      cn.textContent = t(s.name);
      cn.hidden = t(s.name) === (s.en || "");   
      li.querySelector(".stamp p").textContent = t(s.desc);
    });

    function detailHtml(d) {
      if (!d) return "";
      if (Array.isArray(d)) return '<ul class="detail-list">' + d.map(function (b) { return "<li>" + esc(t(b)) + "</li>"; }).join("") + "</ul>";
      return '<p class="detail">' + esc(t(d)) + "</p>";
    }
    setAll(".js-edu", D.education.map(function (x) {
      return '<li><span class="years">' + esc(t(x.years)) + '</span><div><div class="place">' + esc(t(x.school)) + '</div><div class="role">' + esc(t(x.major)) + '</div>' + detailHtml(x.detail) + "</div></li>";
    }).join(""));
    setAll(".js-exp", D.experience.map(function (x) {
      return '<li><span class="years">' + esc(t(x.years)) + '</span><div><div class="place">' + esc(t(x.title)) + '</div><div class="role">' + esc(t(x.org)) + '</div>' + detailHtml(x.detail) + "</div></li>";
    }).join(""));
    setAll(".js-certs", (D.certifications || []).map(function (x) {
      return '<li><span class="years">' + esc(t(x.years)) + '</span><div><div class="place">' + esc(t(x.title)) + '</div><div class="role">' + esc(t(x.org)) + '</div>' + detailHtml(x.detail) + "</div></li>";
    }).join(""));
    setAll(".js-skills", D.skills.map(function (g) {
      return '<div class="skill-group"><p class="type">' + esc(t(g.group)) + '</p><ul class="chips">' +
        g.items.map(function (c) { return "<li>" + esc(t(c)) + "</li>"; }).join("") + "</ul></div>";
    }).join(""));

    textAll(".js-seal", P.sealLetter || "C");
    setAll(".js-contact-heading", t(P.contactHeading));
    textAll(".js-contact-sub", t(P.contactSub));
    textAll(".js-email", P.email);
    textAll(".js-contact-note", t(P.contactNote));
    var ICON = { email: "✉", linkedin: "in", behance: "Bē", instagram: "◎", resume: "PDF", other: "↗" };
    setAll(".js-contact-cards", P.contacts.map(function (c) {
      var inner = '<span class="contact-card__icon contact-card__icon--' + esc(c.type) + '">' + (ICON[c.type] || "↗") + '</span>' +
        '<span class="contact-card__label type">' + esc(t(c.label)) + '</span><span class="contact-card__value">' + esc(t(c.value)) + "</span>";
      return c.url
        ? '<li><a class="contact-card" href="' + esc(c.url) + '" target="_blank" rel="noopener">' + inner + "</a></li>"
        : '<li><div class="contact-card">' + inner + "</div></li>";
    }).join(""));

    $("#footName").textContent = "© " + new Date().getFullYear() + " " + P.nameEn[0] + " · " + P.nameZh;
    $("#footLinks").innerHTML = P.contacts.filter(function (c) { return c.url; }).map(function (c) {
      return '<a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(t(c.label)) + "</a>";
    }).join("");

    setAll('.page[data-page="home"] .js-about-paras', "<p>" + esc(t(P.about[0])) + "</p>");
    renderCourseCard();
    renderFilters();
    updateTileText();
  }

  var current = "all";
  var filtersEl = $("#filters"), grid = $("#worksGrid"), homeGrid = $("#homeGrid");

  function renderFilters() {
    filtersEl.innerHTML = "";
    filtersEl.hidden = true;
    var list = [{ id: "all" }].concat(D.categories);
    list.forEach(function (y) {
      var count = y.id === "all" ? WORKS.length : WORKS.filter(function (p) { return p.category === y.id; }).length;
      if (!count && D.hideEmptyCategories) return;
      var b = el("button", "filter", esc(y.id === "all" ? u("all") : t(y)) + "<sup>" + count + "</sup>");
      b.type = "button"; b.setAttribute("role", "tab"); b.dataset.cat = y.id;
      b.setAttribute("aria-selected", y.id === current ? "true" : "false");
      if (!count) b.disabled = true;
      b.addEventListener("click", function () { current = y.id; renderWorks(); });
      filtersEl.appendChild(b);
    });
  }

  var ROWS_12 = [[6, 3, 3], [4, 4, 4], [3, 3, 6], [7, 5]];
  var ROWS_6 = [[6], [3, 3], [3, 3]];
  function spansFor(n) {
    var wide = window.matchMedia("(min-width: 901px)").matches;
    var rows = wide ? ROWS_12 : ROWS_6, total = wide ? 12 : 6;
    var out = [], i = 0, ri = 0;
    while (i < n) {
      var row = rows[ri % rows.length], left = n - i;
      if (left < row.length) {
        var even = total / left;
        if (Number.isInteger(even)) { for (var k = 0; k < left; k++) out.push(even); }
        else { out.push(total - Math.floor(total / left) * (left - 1)); for (var m = 1; m < left; m++) out.push(Math.floor(total / left)); }
        break;
      }
      row.forEach(function (s) { out.push(s); });
      i += row.length; ri++;
    }
    return out;
  }
  
  function applySpans() {
    [grid, homeGrid].forEach(function (g) {
      for (var i = 0; i < g.children.length; i++) g.children[i].style.gridColumn = "";
    });
  }

  function viewUrl(p) { return p.demo && p.demo.url ? p.demo.url : (p.view && p.view.url ? p.view.url : ""); }
  function viewLabel(p) { return t((p.demo && p.demo.url ? p.demo : p.view).label) || u("view"); }
  function fillGrid(g, list) {
    g.innerHTML = "";
    list.forEach(function (p, i) {
      var tile = el("article", "tile");
      tile.dataset.id = p.id;
      tile.style.animationDelay = (i * 40) + "ms";
      var link = el("a", "tile__link", '<span class="sr"></span>');
      link.href = "#case-" + p.id;
      tile.appendChild(link);
      var m = el("div", "tile__media");
      var holder = el("div"); holder.style.cssText = "position:absolute;inset:0";
      m.appendChild(holder);
      m.appendChild(el("span", "tile__no", "№ " + pad(WORKS.indexOf(p) + 1)));
      tile.appendChild(m);
      var url = viewUrl(p);
      tile.appendChild(el("div", "tile__cap",
        '<h3 class="tile__title"></h3><span class="tile__year"></span>' +
        '<span class="tile__meta"><b></b><span></span></span><p class="tile__intro"></p>' +
        '<div class="tile__actions"><span class="tile__read" aria-hidden="true"></span>' +
        (url ? '<a class="tile__view" href="' + esc(url) + '" target="_blank" rel="noopener"></a>' : "") + "</div>"));
      g.appendChild(tile);
      media(holder, p.image, p.theme, p.id, t(p.title));
    });
  }
  function renderWorks() {
    Array.prototype.forEach.call(filtersEl.children, function (b) {
      b.setAttribute("aria-selected", b.dataset.cat === current ? "true" : "false");
    });
    prune();
    grid.innerHTML = "";
    applySpans();
    updateTileText();
    renderCourseCard();
  }
  function updateTileText() {
    $$(".tile").forEach(function (tile) {
      var p = findProject(tile.dataset.id);
      if (!p) return;
      tile.querySelector(".tile__title").textContent = t(p.title);
      tile.querySelector(".tile__year").textContent = catLabel(p.category);
      tile.querySelector(".tile__meta b").textContent = t(p.course);
      tile.querySelector(".tile__meta span").textContent = t(p.subtitle);
      tile.querySelector(".tile__intro").textContent = t(p.cardIntro || p.intro || p.summary);
      tile.querySelector(".tile__read").textContent = u("readCase");
      tile.querySelector(".tile__link .sr").textContent = t(p.title) + " — " + u("readCase");
      var v = tile.querySelector(".tile__view");
      if (v) { v.textContent = viewLabel(p); v.setAttribute("aria-label", t(p.title) + " — " + viewLabel(p) + " (new tab)"); }
    });
  }
  window.matchMedia("(min-width: 901px)").addEventListener("change", applySpans);

  var lbList = [], lbIndex = 0;

  function renderCase(p) {
    var i = WORKS.indexOf(p);
    document.title = t(p.title) + " — " + P.nameEn.join(" · ");

    $("#caseEyebrow").textContent = [catLabel(p.category), t(p.course)].filter(Boolean).join(" · ");
    $("#caseTitle").textContent = t(p.title);
    $("#caseSub").textContent = t(p.subtitle);
    $("#caseSummary").textContent = t(p.intro || p.summary);
    $("#caseTags").innerHTML = (p.tags || []).map(function (g) { return "<li>" + esc(t(g)) + "</li>"; }).join("");

    var act = "";
    if (p.demo && p.demo.url) act += '<a class="btn btn--ink" href="' + esc(p.demo.url) + '" target="_blank" rel="noopener">' + esc(t(p.demo.label)) + "</a>";
    if (p.view && p.view.url) act += '<a class="btn ' + (p.demo && p.demo.url ? "btn--line" : "btn--ink") + '" href="' + esc(p.view.url) + '" target="_blank" rel="noopener">' + esc(t(p.view.label) || u("view")) + "</a>";
    if (p.website && p.website.url) act += '<a class="btn btn--ink" href="' + esc(p.website.url) + '" target="_blank" rel="noopener">' + esc(t(p.website.label) || u("openFull")) + " ↗</a>";
    if (p.pdf && p.pdf.src) act += '<a class="btn btn--line" href="' + esc(p.pdf.src) + '" target="_blank" rel="noopener">PDF ↗</a>';
    (p.links || []).forEach(function (l) { act += '<a class="btn btn--line" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(t(l.label)) + "</a>"; });
    $("#caseActions").innerHTML = act;
    $("#caseActions").hidden = !act;

    prune();
    media($("#caseHero"), p.image, p.theme, p.id, t(p.title));

    $("#caseGlance").innerHTML = (p.specs || []).map(function (s) {
      return "<div><dt>" + esc(t(s.k)) + "</dt><dd>" + esc(t(s.v)) + "</dd></div>";
    }).join("");
    $("#caseGlance").hidden = !(p.specs && p.specs.length);

    var sections = [];
    lbList = [];
    if (p.outline && p.outline.length) {
      p.outline.forEach(function (st) {
        var html = (st.text || []).map(function (x) { return "<p>" + esc(t(x)) + "</p>"; }).join("");
        html += (st.media || []).map(mediaBlock).join("");
        sections.push({ key: st.key, title: t(st.title), html: html });
      });
    }
    var proc = p.outline ? {} : (p.process || {});
    PROCESS_KEYS.forEach(function (k) {
      var st = proc[k];
      if (!st || (!t(st.text) && !(st.images && st.images.length))) return;
      var html = t(st.text) ? "<p>" + esc(t(st.text)) + "</p>" : "";
      if (st.images && st.images.length) {
        html += '<div class="photo-grid">' + st.images.map(function (src) {
          lbList.push(src);
          return '<button type="button" class="photo-grid__item" data-lb="' + (lbList.length - 1) + '"><img src="' + esc(src) + '" alt="" loading="lazy"></button>';
        }).join("") + "</div>";
      }
      sections.push({ key: k, html: html });
    });
    if (!sections.length) sections.push({ key: "overview", html: "<p>" + esc(t(p.summary) || t(p.intro)) + "</p>" });

    var hasWeb = p.website && p.website.url, hasPdf = !!p.pdf;
    if (hasWeb || hasPdf) sections.push({ key: "preview", html: previewHtml(p, hasWeb, hasPdf) });

    $("#caseContent").innerHTML = sections.map(function (s, n) {
      return '<section class="case__section" id="cs-' + s.key + '" aria-labelledby="h-' + s.key + '"><h2 id="h-' + s.key + '"><span class="type" aria-hidden="true">' + pad(n + 1) + "</span>" + esc(s.title || u(s.key)) + "</h2>" + s.html + "</section>";
    }).join("");
    $("#caseToc").innerHTML = sections.map(function (s) {
      return '<li><a href="#case-' + p.id + '" data-jump="cs-' + s.key + '">' + esc(s.title || u(s.key)) + "</a></li>";
    }).join("");
    
    var prev = WORKS[(i - 1 + WORKS.length) % WORKS.length];
    var next = WORKS[(i + 1) % WORKS.length];
    
    var pager = "";
    if (WORKS.length > 2) pager += '<a class="pager pager--prev" href="#case-' + prev.id + '"><span class="type">← ' + u("prev") + "</span><strong>" + esc(t(prev.title)) + "</strong></a>";
    else pager += "<span></span>";
    if (WORKS.length > 1) pager += '<a class="pager pager--next" href="#case-' + next.id + '"><span class="type">' + u("next") + " →</span><strong>" + esc(t(next.title)) + "</strong></a>";
    $("#casePager").innerHTML = pager;
    $("#casePager").hidden = WORKS.length < 2;
  }

  function imageFigure(im, wide) {
    var cap = t(im.caption), inner;
    if (im.src) {
      lbList.push(im.src);
      inner = '<button type="button" class="fig__zoom" data-lb="' + (lbList.length - 1) + '" aria-label="' + esc(t(im.alt)) + '">' +
        '<img src="' + esc(im.src) + '" alt="' + esc(t(im.alt)) + '" loading="lazy" decoding="async"' +
        (im.width ? ' width="' + im.width + '" height="' + im.height + '"' : "") + "></button>";
    } else {
      inner = '<div class="fig__empty" role="img" aria-label="' + esc(t(im.alt)) + '"><span>' + esc(u("imgMissing")) + "</span><small>" + esc(t(im.alt)) + "</small></div>";
    }
    return '<figure class="fig' + (wide ? " fig--wide" : "") + '">' + inner + (cap ? "<figcaption>" + esc(cap) + "</figcaption>" : "") + "</figure>";
  }
  function mediaBlock(m) {
    if(m.type==="soundgallery" || m.type==="experimentgallery") {
      var items=m.images.map(function(im){
        var media=im.video?'<video controls loop muted playsinline preload="none" src="'+esc(im.src)+'"></video>':imageFigure(im);
        if(m.type==="soundgallery") media+='<audio controls preload="none" aria-label="'+esc(t(im.alt))+'" src="'+esc(im.audio)+'"></audio>';
        return '<div class="activity-item">'+media+(im.video?'<p class="activity-caption">'+esc(t(im.caption))+'</p>':'')+'</div>';
      });
      return '<div class="fig-row">'+items.slice(0,6).join('')+'</div><details class="activity-more"><summary>'+esc(t({en:"View all activity records",zh:"展开全部 Activity 记录",zht:"展開全部 Activity 紀錄",ja:"すべての活動記録",fr:"Voir toutes les activités",ko:"모든 활동 기록"}))+' ('+items.length+')</summary><div class="fig-row">'+items.slice(6).join('')+'</div></details>';
    }

    if (m.type === "image") return imageFigure(m, m.wide);
    if (m.type === "gallery") {
      var first = m.images.slice(0,6).map(function(im){return imageFigure(im);}).join("");
      var rest = m.images.slice(6).map(function(im){return imageFigure(im);}).join("");
      return '<div class="fig-row">'+first+'</div>'+(rest?'<details class="activity-more"><summary>'+esc(t({en:"View all activity images",zh:"展开全部 Activity 图片",zht:"展開全部 Activity 圖片",ja:"すべての活動画像",fr:"Voir toutes les images",ko:"활동 이미지 모두 보기"}))+' ('+m.images.length+')</summary><div class="fig-row">'+rest+'</div></details>':'');
    }
    if (m.type === "video") {
      var cap = t(m.caption);
      var v = m.src
        ? '<video controls preload="none" playsinline' + (m.poster ? ' poster="' + esc(m.poster) + '"' : "") + '><source src="' + esc(m.src) + '" type="video/mp4">' +
          (m.captions ? '<track kind="captions" src="' + esc(m.captions) + '" default>' : "") + "</video>"
        : '<div class="fig__empty fig__empty--video" role="img" aria-label="' + esc(cap) + '"><span>▶ ' + esc(u("videoMissing")) + "</span></div>";
      return '<figure class="fig fig--wide">' + v + (cap ? "<figcaption>" + esc(cap) + "</figcaption>" : "") + "</figure>";
    }
    if (m.type === "diagram") {
      return '<figure class="fig fig--diagram">' + (G ? G.render(m.kind, m.data, t) : "") + (m.caption ? "<figcaption>" + esc(t(m.caption)) + "</figcaption>" : "") + "</figure>";
    }
    if (m.type === "stats") {
      return '<dl class="stats">' + m.items.map(function (x) { return "<div><dt>" + esc(t(x.label)) + "</dt><dd>" + esc(x.value) + "</dd></div>"; }).join("") + "</dl>";
    }
    if (m.type === "list") {
      return '<ul class="case__list case__list--outcomes">' + m.items.map(function (x) { return "<li>" + esc(t(x)) + "</li>"; }).join("") + "</ul>";
    }
    if (m.type === "quotes") {
      return '<div class="quotes">' + m.items.map(function (q) { return "<blockquote><p>" + esc(t(q)) + "</p></blockquote>"; }).join("") + "</div>";
    }
    return "";
  }

  function previewHtml(p, hasWeb, hasPdf) {
    var tabs = [];
    if (hasWeb) tabs.push("web");
    if (hasPdf) tabs.push("pdf");
    var head = '<div class="preview__tabs" role="tablist">' + tabs.map(function (k, n) {
      return '<button type="button" role="tab" class="preview__tab" data-tab="' + k + '" aria-selected="' + (n === 0) + '">' + u(k) + "</button>";
    }).join("") + "</div>";
    var body = "";
    if (hasWeb) {
      body += '<div class="preview__panel" data-panel="web">' +
        '<div class="preview__bar"><span class="type">' + esc(p.website.url) + '</span><a href="' + esc(p.website.url) + '" target="_blank" rel="noopener">' + u("openFull") + "</a></div>" +
        '<div class="preview__frame" data-src="' + esc(p.website.url) + '"><button type="button" class="btn btn--ink preview__load">' + u("loadPreview") + "</button></div></div>";
    }
    if (hasPdf) {
      var pages = p.pdf.pages || 1, label = t(p.pdf.label) || "PDF";
      body += '<div class="preview__panel" data-panel="pdf"' + (hasWeb ? " hidden" : "") + ">" +
        '<div class="preview__bar"><span class="type">' + esc(label) + " · " + pages + " " + u("pages") + "</span>" +
        (p.pdf.src ? '<span class="preview__links"><button type="button" class="linkish" data-pdf-full="' + esc(p.pdf.src) + '" data-pdf-label="' + esc(label) + '">' + u("pdfFull") + '</button><a href="' + esc(p.pdf.src) + '" target="_blank" rel="noopener">' + u("pdfOpen") + "</a></span>" : "") +
        "</div>";
      if (p.pdf.src) {
        body += '<div class="preview__frame preview__frame--pdf"><iframe src="' + esc(p.pdf.src) + '" title="' + esc(label) + '" loading="lazy"></iframe></div>';
      } else {
        var thumbs = "";
        for (var n = 1; n <= Math.min(pages, 12); n++) thumbs += '<span class="pdf-page"><b>' + n + "</b></span>";
        body += '<div class="pdf-empty"><div class="pdf-pages">' + thumbs + '</div><p>' + u("pdfMissing") + "</p></div>";
      }
      body += "</div>";
    }
    return '<div class="preview">' + head + body + "</div>";
  }

  $("#case").addEventListener("click", function (e) {
    var a = e.target.closest("a[data-jump]");
    if (a) {
      e.preventDefault();
      var target = document.getElementById(a.dataset.jump);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    var tab = e.target.closest(".preview__tab");
    if (tab) {
      var box = tab.closest(".preview");
      box.querySelectorAll(".preview__tab").forEach(function (b) { b.setAttribute("aria-selected", b === tab ? "true" : "false"); });
      box.querySelectorAll(".preview__panel").forEach(function (pn) { pn.hidden = pn.dataset.panel !== tab.dataset.tab; });
      return;
    }
    var load = e.target.closest(".preview__load");
    if (load) {
      var frame = load.closest(".preview__frame");
      var ifr = el("iframe"); ifr.src = frame.dataset.src; ifr.title = "Prototype";
      frame.innerHTML = ""; frame.appendChild(ifr);
      return;
    }
    var ph = e.target.closest("[data-lb]");
    if (ph) { openLightbox(+ph.dataset.lb); return; }
    var pf = e.target.closest("[data-pdf-full]");
    if (pf) {
      $("#pdfFullFrame").src = pf.dataset.pdfFull;
      $("#pdfFullLabel").textContent = pf.dataset.pdfLabel;
      $("#pdfFull").hidden = false; document.body.style.overflow = "hidden";
    }
  });

  function openLightbox(n) {
    if (!lbList.length) return;
    lbIndex = (n + lbList.length) % lbList.length;
    $("#lbImg").src = lbList[lbIndex];
    $("#lbCount").textContent = (lbIndex + 1) + " / " + lbList.length;
    $("#lbPrev").hidden = $("#lbNext").hidden = lbList.length < 2;
    $("#lightbox").hidden = false; document.body.style.overflow = "hidden";
  }
  function closeOverlays() {
    $("#lightbox").hidden = true;
    if (!$("#pdfFull").hidden) { $("#pdfFull").hidden = true; $("#pdfFullFrame").src = "about:blank"; }
    document.body.style.overflow = "";
  }
  $("#lbClose").addEventListener("click", closeOverlays);
  $("#pdfFullClose").addEventListener("click", closeOverlays);
  $("#lbPrev").addEventListener("click", function () { openLightbox(lbIndex - 1); });
  $("#lbNext").addEventListener("click", function () { openLightbox(lbIndex + 1); });
  $("#lightbox").addEventListener("click", function (e) { if (e.target.id === "lightbox") closeOverlays(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeOverlays();
    if ($("#lightbox").hidden) return;
    if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
    if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
  });

  var selectedModule = "module-1";
  function projectWebsiteLinks(p) {
    return (p.projectSite?'<a class="btn btn--line" href="'+esc(p.projectSite)+'" target="_blank" rel="noopener">'+esc(t({en:"Project website",zh:"项目网站",zht:"專案網站",ja:"プロジェクトサイト",fr:"Site du projet",ko:"프로젝트 웹사이트"}))+'</a>':'')+(p.displaySite?'<a class="btn btn--line" href="'+esc(p.displaySite)+'" target="_blank" rel="noopener">'+esc(t({en:"Project showcase",zh:"项目展示",zht:"專案展示",ja:"作品デモ",fr:"Démonstration",ko:"프로젝트 시연"}))+'</a>':'');
  }
  function renderCourseCard() {
    var box = $("#worksGrid");
    box.querySelectorAll(".course-tile, .placeholder-tile").forEach(function(card){card.remove();});
    var card = el("article", "tile course-tile");
    card.innerHTML = '<a class="tile__link" href="#course-mmb"><span class="sr">Media, Motion &amp; Body</span></a><div class="tile__media"><div style="position:absolute;inset:0"><img src="images/projects/p3/cover.webp" alt="Media, Motion &amp; Body" loading="lazy"></div></div><div class="tile__cap"><h3 class="tile__title">Media, Motion &amp; Body</h3><p class="tile__intro">' + esc(t({en:"Three modules of activities and final projects: circuits, sound, and physical interaction.",zh:"按三个模块整理 Activity 与最终作品：电路、声音和实体交互。",zht:"按三個模組整理 Activity 與最終作品：電路、聲音與實體互動。",ja:"回路・音・身体的なインタラクションの三つのモジュール。",fr:"Trois modules d’activités et de projets : circuits, son et interaction physique.",ko:"회로, 소리, 물리적 인터랙션의 세 모듈과 활동을 정리합니다."})) + '</p></div>';
    box.appendChild(card);
    homeGrid.innerHTML = ""; homeGrid.appendChild(card.cloneNode(true));
    var visual = el("article", "tile course-tile visual-course-tile");
    visual.innerHTML = '<a class="tile__link" href="#course-vdc"><span class="sr">Visual Design and Computation</span></a><div class="tile__media"><div style="position:absolute;inset:0"><img src="images/projects/vdc/p1-cover.webp" alt="Visual Design and Computation" loading="lazy"></div></div><div class="tile__cap"><h3 class="tile__title">Visual Design and Computation</h3><p class="tile__intro">'+esc(t({en:"A collection of course projects exploring visual design and computation.",zh:"探索视觉设计与计算的课程项目合集。",zht:"探索視覺設計與計算的課程專案合集。",ja:"ビジュアルデザインと計算を探究する授業プロジェクト集。",fr:"Une collection de projets de cours explorant le design visuel et la computation.",ko:"시각 디자인과 컴퓨테이션을 탐구하는 수업 프로젝트 모음."}))+'</p><p class="visual-course-status">'+esc(t({en:"Three projects · 2025",zh:"三个项目 · 2025",zht:"三個專案 · 2025",ja:"3つのプロジェクト · 2025",fr:"Trois projets · 2025",ko:"프로젝트 3개 · 2025"}))+'</p></div>';
    box.appendChild(visual); homeGrid.appendChild(visual.cloneNode(true));
    var art = el("article", "tile course-tile art-tile");
    art.innerHTML = '<a class="tile__link" href="#art-discovery"><span class="sr">Art Discovery Club</span></a><div class="tile__media"><img src="images/projects/art/website-cover.webp" alt="Art Discovery Club" loading="lazy"></div><div class="tile__cap"><h3 class="tile__title">Art Discovery Club</h3><p class="tile__intro">'+esc(t({en:"A website concept bringing art, club activities and learning resources together.",zh:"汇集艺术作品、社团活动与学习资源的网站设计。"}))+'</p><p class="visual-course-status">2024</p></div>';
    box.appendChild(art);
    homeGrid.innerHTML = "";
    var featured = el("article", "tile featured-tile");
    featured.innerHTML = '<a class="tile__link" href="#case-mmb-p3-living-systems"><span class="sr">Monet’s Garden</span></a><div class="tile__media"><img src="images/projects/p3/cover.webp" alt="Monet’s Garden physical rhythm game" loading="lazy"></div><div class="tile__cap"><p class="project-kicker">01 / '+esc(t({en:"Physical interaction",zh:"实体交互"}))+'</p><h3 class="tile__title">Monet’s Garden</h3><p class="tile__intro">'+esc(t({en:"A handmade touch board turns music into a playful interaction with falling flower notes.",zh:"用手工触摸控制板连接音乐与花朵音符，探索身体参与的游戏体验。"}))+'</p><p class="project-tags">Interaction design · Prototyping · Creative coding</p><span class="project-read">'+esc(t({en:"Explore project ↗",zh:"查看项目 ↗"}))+'</span></div>';
    homeGrid.appendChild(featured);
    var featuredArt = art.cloneNode(true); featuredArt.classList.add("featured-tile");
    featuredArt.querySelector(".visual-course-status").outerHTML='<p class="project-tags">Information architecture · Web design</p><span class="project-read">'+esc(t({en:"Explore project ↗",zh:"查看项目 ↗"}))+'</span>';
    homeGrid.appendChild(featuredArt);

    for (var n = 1; n <= 2; n++) {
      var placeholder = el("article", "tile placeholder-tile");
      placeholder.innerHTML = '<a class="tile__link" href="#upcoming-' + n + '-project-1"><span class="sr">' + esc(t({en:"Open upcoming collection",zh:"打开待补充合集"})) + ' ' + n + '</span></a><div class="tile__media placeholder-media"><span aria-hidden="true">＋</span></div><div class="tile__cap"><h3 class="tile__title">' + esc(t({en:"Upcoming project",zh:"待补充项目",zht:"待補充專案"})) + ' ' + n + '</h3><p class="tile__intro">' + esc(t({en:"Project details will be added here.",zh:"后续将在这里加入新的项目内容。",zht:"後續將在這裡加入新的專案內容。"})) + '</p></div>';
      box.appendChild(placeholder);
    }

    box.querySelectorAll(".visual-course-status").forEach(function(status) { status.remove(); });
    document.querySelectorAll("#worksGrid .course-tile, #homeGrid .tile").forEach(function(tile) {
      var link = tile.querySelector(".tile__link");
      var href = link ? link.getAttribute("href") : "";
      var year = href === "#course-vdc" ? "2025" : href === "#art-discovery" ? "2024" : "2026";
      var existing = tile.querySelector(".card-year");
      if (existing) existing.remove();
      var time = document.createElement("time"); time.className = "card-year";
      time.dateTime = year; time.textContent = year;
      tile.querySelector(".tile__cap").appendChild(time);
    });

  }
  function renderArtDiscovery() {
    var page = document.querySelector('.page[data-page="art-discovery"]');
    if (!page) { page=el("article","page art-case");page.dataset.page="art-discovery";page.hidden=true;document.querySelector("main").appendChild(page); }
    page.innerHTML='<div class="wrap"><header class="course-head"><a class="more-link" href="#works">'+esc(t({en:"All work",zh:"全部作品"}))+'</a><p class="eyebrow">2024 · DESN 19428 Interaction Design: Methods</p><h1 tabindex="-1">Art Discovery Club</h1><p>'+esc(t({en:"A virtual art-community website concept.",zh:"虚拟艺术社区网站设计。"}))+'</p><dl class="project-facts"><div><dt>'+esc(t({en:"Focus",zh:"设计重点"}))+'</dt><dd>'+esc(t({en:"Information architecture & web design",zh:"信息架构与网站设计"}))+'</dd></div><div><dt>'+esc(t({en:"Audience",zh:"面向人群"}))+'</dt><dd>'+esc(t({en:"Beginners & experienced art enthusiasts",zh:"初学者与有经验的艺术爱好者"}))+'</dd></div></dl><a class="btn btn--ink" href="projects/art-discovery/index.html" target="_blank" rel="noopener">'+esc(t({en:"Project website",zh:"项目网站"}))+'</a></header><div class="course-layout"><nav class="course-toc" aria-label="On this page"><p>On this page</p>'+D.artDiscovery.sections.map(function(st,i){return '<a href="#art-section-'+i+'">'+esc(t({en:st[0],zh:st[1]}))+'</a>';}).join('')+'</nav><div class="course-modules">'+D.artDiscovery.sections.map(function(st,i){return '<section class="module-section" id="art-section-'+i+'"><h2>'+esc(t({en:st[0],zh:st[1]}))+'</h2><p>'+esc(t({en:st[2],zh:st[3]}))+'</p><div class="art-gallery art-gallery-'+i+'">'+st[4].map(function(img){return '<figure><a href="images/projects/art/page-'+img[0]+'.webp" target="_blank" rel="noopener"><img src="images/projects/art/page-'+img[0]+'.webp" alt="'+esc(t({en:img[1],zh:img[2]}))+'" loading="lazy"></a><figcaption>'+esc(t({en:img[1],zh:img[2]}))+'</figcaption></figure>';}).join('')+'</div></section>';}).join('')+'</div></div></div>';
    document.title="Art Discovery Club — "+P.nameEn[0];
  }
  function renderUpcoming(collection, project) {
    var page = document.querySelector('.page[data-page="upcoming"]');
    if (!page) { page = el("article", "page"); page.dataset.page = "upcoming"; page.hidden = true; document.querySelector("main").appendChild(page); }
    var title = t({en:"Upcoming collection",zh:"待补充合集",zht:"待補充合集"}) + " " + collection;
    var tabs = [1,2,3].map(function(n) { return '<a class="upcoming-tab" href="#upcoming-'+collection+'-project-'+n+'" '+(n===project?'aria-current="page"':'')+'>Project '+n+'</a>'; }).join("");
    page.innerHTML = '<div class="wrap"><header class="course-head"><a class="more-link" href="#works">'+esc(t({en:"All work",zh:"全部作品"}))+'</a><h1 tabindex="-1">'+esc(title)+'</h1><p>'+esc(t({en:"A space for future course projects.",zh:"这里将整理后续的课程项目。"}))+'</p></header><div class="course-layout"><nav class="course-toc" aria-label="Projects"><p>On this page</p>'+tabs+'</nav><section class="module-section"><span class="eyebrow">PROJECT 0'+project+'</span><h2>Project '+project+'</h2><p>'+esc(t({en:"Project content coming soon.",zh:"项目内容待补充。"}))+'</p><div class="upcoming-image" aria-hidden="true">＋</div><div class="upcoming-sections">'+[t({en:"Overview & goals",zh:"项目背景与目标"}),t({en:"Research & ideas",zh:"研究与初步想法"}),t({en:"Sketches & prototypes",zh:"草图与原型"}),t({en:"Feedback & iteration",zh:"反馈与修改"}),t({en:"Outcomes & reflection",zh:"最终成果与反思"})].map(function(label){return '<section><h3>'+esc(label)+'</h3><p>'+esc(t({en:"To be added",zh:"待补充"}))+'</p></section>';}).join('')+'</div></section></div></div>';
    document.title = title + " · Project " + project + " — " + P.nameEn[0];
  }
  var selectedVisualProject = "vdc-project-1";
  function selectVisualProject(id) {
    selectedVisualProject=id;
    $$("#visualCourseContent .module-section").forEach(function(p){p.hidden=p.id!==id;});
    $$("[data-visual-project]").forEach(function(b){var active=b.dataset.visualProject===id;b.setAttribute("aria-selected",active?"true":"false");b.tabIndex=active?0:-1;});
  }
  function renderVisualCourse() {
    lbList=[];
    var course=D.visualCourse, projects=course.projects;
    var back=t({en:"All work",zh:"全部作品",zht:"全部作品",ja:"作品一覧",fr:"Tous les projets",ko:"전체 작품"});
    var outcomes=t({en:"Project outcomes",zh:"项目成果",zht:"專案成果",ja:"プロジェクト成果",fr:"Résultats des projets",ko:"프로젝트 결과"});
    var pdfLabel=t({en:"Project PDF",zh:"项目 PDF",zht:"專案 PDF",ja:"プロジェクト PDF",fr:"PDF du projet",ko:"프로젝트 PDF"});
    var yearLabel=t({en:"Year",zh:"年份",zht:"年份",ja:"年",fr:"Année",ko:"연도"});
    var buttons=projects.map(function(p,i){return '<button role="tab" type="button" id="vdc-tab-'+(i+1)+'" aria-controls="vdc-project-'+(i+1)+'" data-visual-project="vdc-project-'+(i+1)+'">Project '+(i+1)+'</button>';}).join('')+'<button role="tab" type="button" id="vdc-tab-4" aria-controls="vdc-project-4" data-visual-project="vdc-project-4">'+esc(outcomes)+'</button>';
    var html='<header class="course-head"><a class="more-link" href="#works">'+esc(back)+'</a><p class="eyebrow">2025 · '+esc(course.code)+' '+esc(course.title)+'</p><h1 tabindex="-1">'+esc(course.title)+'</h1><p>'+esc(t({en:"Book cover design, augmented reality, and a three-dimensional animated Doodle.",zh:"书籍封面设计、增强现实与三维 Doodle 动画。",zht:"書籍封面設計、擴增實境與三維 Doodle 動畫。",ja:"ブックカバー、AR、3D Doodle アニメーション。",fr:"Couverture de livre, réalité augmentée et Doodle animé en 3D.",ko:"책 표지 디자인, 증강 현실, 3D Doodle 애니메이션."}))+'</p></header><div class="course-layout"><nav class="course-toc" role="tablist" aria-label="On this page" aria-orientation="vertical"><p>'+esc(u("onThisPage"))+'</p>'+buttons+'</nav><div class="course-modules">';
    projects.forEach(function(p,i){
      html+='<section class="module-section" id="vdc-project-'+(i+1)+'" role="tabpanel" aria-labelledby="vdc-tab-'+(i+1)+'"><span class="eyebrow">'+esc(p.year)+' · '+esc(course.code)+' '+esc(course.title)+'</span><h2>'+esc(p.title)+'</h2><p>'+esc(t(p.intro))+'</p><div class="case__actions"><a class="btn btn--ink" href="'+esc(p.pdf)+'" target="_blank" rel="noopener">'+esc(pdfLabel)+'</a>'+projectWebsiteLinks(p)+'</div>'+imageFigure({src:p.image,alt:biTitle(p),caption:biTitle(p)})+'<dl class="module-specs"><div><dt>'+esc(yearLabel)+'</dt><dd>'+esc(p.year)+'</dd></div><div><dt>'+esc(t({en:"Course",zh:"课程"}))+'</dt><dd>'+esc(course.code)+'</dd></div></dl>'+p.outline.map(function(st){return '<section class="module-process"><h3>'+esc(t(st.title))+'</h3>'+st.text.map(function(x){return '<p>'+esc(t(x))+'</p>';}).join('')+(st.media||[]).map(mediaBlock).join('')+'</section>';}).join('')+'</section>';
    });
    html+='<section class="module-section" id="vdc-project-4" role="tabpanel" aria-labelledby="vdc-tab-4"><h2>'+esc(outcomes)+'</h2>'+projects.map(function(p,i){return '<section class="result-project"><h3>Project '+(i+1)+' · '+esc(p.title)+'</h3><p class="project-year">'+esc(p.year)+'</p><p>'+esc(t(p.resultText))+'</p>'+(p.resultMedia||[]).map(mediaBlock).join('')+'<div class="case__actions"><a class="btn btn--line" href="'+esc(p.pdf)+'" target="_blank" rel="noopener">PDF</a>'+projectWebsiteLinks(p)+'</div></section>';}).join('')+'</section></div></div>';
    $("#visualCourseContent").innerHTML=html;selectVisualProject(selectedVisualProject);document.title=course.title+" — "+P.nameEn[0];
  }
  function biTitle(p){return {en:p.title,zh:p.title};}
  $("#visualCourseContent").addEventListener("click",function(e){var tab=e.target.closest("[data-visual-project]");if(tab){selectVisualProject(tab.dataset.visualProject);return;}var ph=e.target.closest("[data-lb]");if(ph)openLightbox(+ph.dataset.lb);});
  $("#visualCourseContent").addEventListener("keydown",function(e){var tab=e.target.closest("[data-visual-project]");if(!tab)return;var tabs=$$("[data-visual-project]"),i=tabs.indexOf(tab),next=i;if(e.key==="ArrowDown"||e.key==="ArrowRight")next=(i+1)%tabs.length;else if(e.key==="ArrowUp"||e.key==="ArrowLeft")next=(i+tabs.length-1)%tabs.length;else if(e.key==="Home")next=0;else if(e.key==="End")next=tabs.length-1;else return;e.preventDefault();selectVisualProject(tabs[next].dataset.visualProject);tabs[next].focus();});
  function selectCourseModule(id) {
    selectedModule = id;
    $$("#courseContent .module-section").forEach(function(panel){panel.hidden = panel.id !== id;});
    $$("[data-course-module]").forEach(function(button){var active=button.dataset.courseModule===id;button.setAttribute("aria-selected",active?"true":"false");button.tabIndex=active?0:-1;});
  }
  function renderCourse() {
    lbList = [];
    var labels = [t({en:"Module 1 · Circuits",zh:"Module 1 · 电路",zht:"Module 1 · 電路",ja:"Module 1 · 回路",fr:"Module 1 · Circuits",ko:"Module 1 · 회로"}),t({en:"Module 2 · Sound",zh:"Module 2 · 声音",zht:"Module 2 · 聲音",ja:"Module 2 · 音",fr:"Module 2 · Son",ko:"Module 2 · 소리"}),t({en:"Module 3 · Touch",zh:"Module 3 · 触摸",zht:"Module 3 · 觸摸",ja:"Module 3 · 触覚",fr:"Module 3 · Toucher",ko:"Module 3 · 촉각"})];
    labels.push(t({en:"Project outcomes",zh:"项目成果",zht:"專案成果",ja:"プロジェクト成果",fr:"Résultats des projets",ko:"프로젝트 결과"}));
    var html = '<header class="course-head"><a class="more-link" href="#works">' + esc(t({en:"All work",zh:"全部作品",zht:"全部作品",ja:"作品一覧",fr:"Tous les projets",ko:"전체 작품"})) + '</a><p class="eyebrow">2026 · DESN 22848 Interaction Design: Media, Motion and the Body</p><h1>Media, Motion &amp; Body</h1><p>' + esc(t({en:"Activities, experiments, and final projects, organized by module.",zh:"按模块整理活动、实验与最终作品。",zht:"按模組整理活動、實驗與最終作品。",ja:"モジュール別の活動、実験、最終作品。",fr:"Activités, expériences et projets finaux, organisés par module.",ko:"모듈별 활동, 실험, 최종 프로젝트."})) + '</p></header><div class="course-layout"><nav class="course-toc" role="tablist" aria-label="On this page" aria-orientation="vertical"><p>' + esc(u("onThisPage")) + '</p>' + labels.map(function(x,i){return '<button type="button" role="tab" aria-controls="module-'+(i+1)+'" id="module-tab-'+(i+1)+'" data-course-module="module-'+(i+1)+'">'+esc(x)+'</button>';}).join('') + '</nav><div class="course-modules">';
    [D.module1].concat(WORKS).forEach(function(p,i){
      var n=i+1;
      html += '<section class="module-section" id="module-'+n+'" role="tabpanel" aria-labelledby="module-tab-'+n+'"><span class="eyebrow">2026 · DESN 22848 Interaction Design: Media, Motion and the Body</span><h2>'+esc(t(p.title))+'</h2><p class="module-subtitle">'+esc(t(p.subtitle))+'</p><p>'+esc(t(p.intro))+'</p><div class="case__actions"><a class="btn btn--ink" href="'+esc(p.pdf.src)+'" target="_blank" rel="noopener">'+esc(t({en:"Project PDF",zh:"项目 PDF",zht:"專案 PDF",ja:"プロジェクト PDF",fr:"PDF du projet",ko:"프로젝트 PDF"}))+'</a>'+projectWebsiteLinks(p)+(p.links||[]).map(function(l){return '<a class="btn btn--line" href="'+esc(l.url)+'" target="_blank" rel="noopener">'+esc(t(l.label))+'</a>';}).join('')+'</div>'+imageFigure({src:p.image,alt:p.subtitle,caption:p.subtitle})+'<dl class="module-specs">'+(p.specs||[]).map(function(x){return '<div><dt>'+esc(t(x.k))+'</dt><dd>'+esc(t(x.v))+'</dd></div>';}).join('')+'</dl>'+(p.outline||[]).filter(function(st){return st.key!=="outcomes";}).map(function(st){return '<section class="module-process"><h3>'+esc(t(st.title))+'</h3>'+(st.text||[]).map(function(x){return '<p>'+esc(t(x))+'</p>';}).join('')+(st.media||[]).map(mediaBlock).join('')+'</section>';}).join('')+'</section>';
    });
    html += '<section class="module-section" id="module-4" role="tabpanel" aria-labelledby="module-tab-4"><span class="eyebrow">'+esc(labels[3])+'</span><h2>'+esc(labels[3])+'</h2>'+[D.module1].concat(WORKS).map(function(p){var results=p.outline.find(function(st){return st.key==="outcomes";});var visuals=p.id==="mmb-p2-time-data"?p.outline.find(function(st){return st.key==="design";}):null;return '<section class="result-project"><h3>'+esc(t(p.title))+'</h3><p>'+esc(t(p.cardIntro))+'</p>'+imageFigure({src:p.image,alt:p.subtitle,caption:p.subtitle})+(p.resultText||[]).map(function(x){return '<p>'+esc(t(x))+'</p>';}).join('')+(p.resultMedia||[]).map(mediaBlock).join('')+(visuals?(visuals.media||[]).map(mediaBlock).join(''):'')+'<a class="btn btn--line" href="'+esc(p.pdf.src)+'" target="_blank" rel="noopener">PDF</a>'+projectWebsiteLinks(p)+(results?'<h3>'+esc(t(results.title))+'</h3>'+(results.text||[]).map(function(x){return '<p>'+esc(t(x))+'</p>';}).join('')+(results.media||[]).map(mediaBlock).join(''):'')+'</section>';}).join('')+'</section>';
    html += '</div></div>';$("#courseContent").innerHTML=html;selectCourseModule(selectedModule);document.title="Media, Motion & Body — "+P.nameEn[0];
  }
  $("#courseContent").addEventListener("click",function(e){var tab=e.target.closest("[data-course-module]");if(tab){selectCourseModule(tab.dataset.courseModule);return;}var ph=e.target.closest("[data-lb]");if(ph)openLightbox(+ph.dataset.lb);});

  $("#courseContent").addEventListener("keydown",function(e){var tab=e.target.closest("[data-course-module]");if(!tab)return;var tabs=$$("[data-course-module]"),i=tabs.indexOf(tab),next=i;if(e.key==="ArrowDown"||e.key==="ArrowRight")next=(i+1)%tabs.length;else if(e.key==="ArrowUp"||e.key==="ArrowLeft")next=(i+tabs.length-1)%tabs.length;else if(e.key==="Home")next=0;else if(e.key==="End")next=tabs.length-1;else return;e.preventDefault();selectCourseModule(tabs[next].dataset.courseModule);tabs[next].focus();});
  
  var PAGES = ["home", "works", "about", "contact"];
  
  var SUBSECTIONS = { philosophy: "about", resume: "about" };
  var pageTitles = { works: "worksTitle", about: "navAbout", contact: "navContact" };
  var firstRoute = true, currentPage = null;
  function showPage(name, anchor) {
    var changed = name !== currentPage;
    currentPage = name;
    $$(".page").forEach(function (pg) { pg.hidden = pg.dataset.page !== name; });
    $$(".nav__links a").forEach(function (a) {
      if (a.dataset.page === name || ((name === "case" || name === "course" || name === "visual-course" || name === "upcoming" || name === "art-discovery") && a.dataset.page === "works")) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    if (anchor) {
      requestAnimationFrame(function () { var t2 = document.getElementById(anchor); if (t2) t2.scrollIntoView({ block: "start" }); });
    } else {
      window.scrollTo(0, 0);
      
      if (!firstRoute && changed) {
        var h = document.querySelector('.page[data-page="' + name + '"] h1');
        if (h) h.focus({ preventScroll: true });
      }
    }
    firstRoute = false;
  }
  function route() {
    closeOverlays();
    var h = (location.hash || "").slice(1), anchor = null;
    if (h === "art-discovery" || h.indexOf("art-section-") === 0) { renderArtDiscovery(); showPage("art-discovery", h.indexOf("art-section-")===0?h:null); return; }
    var upcoming = /^upcoming-([12])-project-([123])$/.exec(h);
    if (upcoming) { renderUpcoming(+upcoming[1], +upcoming[2]); showPage("upcoming"); return; }
    if (h === "work") h = "works";
    if (h === "course-vdc") { renderVisualCourse(); showPage("visual-course"); return; }
    if (h === "course-mmb") { renderCourse(); showPage("course"); return; }
    if (h.indexOf("case-") === 0) {
      var p = findProject(h.slice(5));
      if (p) { selectedModule = "module-" + (WORKS.indexOf(p)+2); renderCourse(); showPage("course"); return; }
      h = "works";
    }
    if (SUBSECTIONS[h]) { anchor = h; h = SUBSECTIONS[h]; }
    if (PAGES.indexOf(h) < 0) h = "home";
    document.title = (h === "home" ? "" : u(pageTitles[h]) + " — ") + P.nameEn.join(" · ") + " · Portfolio";
    showPage(h, anchor);
  }
  window.addEventListener("hashchange", route);
  $("#toTop").addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  $("#langSelect").addEventListener("change", function () {
    lang = this.value;
    try { localStorage.setItem("portfolioLang", lang); } catch (e) {  }
    renderText();
    if (currentPage === "course") renderCourse();
    if (currentPage === "visual-course") renderVisualCourse();
    if (currentPage === "upcoming" || currentPage === "art-discovery") route();
    var caseEl = document.getElementById("case");
    if (caseEl && !caseEl.hidden) { var p = findProject(location.hash.slice(6)); if (p) renderCase(p); }
  });

  $$(".js-copy").forEach(function (btn) {
    var letter = btn.closest(".letter"), toast = letter.querySelector(".js-toast"), email = letter.querySelector(".js-email");
    btn.addEventListener("click", function () {
      var done = function () { toast.textContent = u("copied") + P.email; };
      var fail = function () {
        var range = document.createRange(); range.selectNodeContents(email);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        toast.textContent = u("copyFail");
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(P.email).then(done, fail);
        else fail();
      } catch (e) { fail(); }
      setTimeout(function () { toast.textContent = ""; }, 4000);
    });
  });

  homeGrid.innerHTML = "";
  renderWorks();
  renderText();
  route();
})();

(function () {
  var grid = document.getElementById("homeGrid");
  if (!grid || !window.IntersectionObserver || !Element.prototype.animate) return;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var seen = new WeakSet();
  var active = new Set();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var card = entry.target;
      observer.unobserve(card);
      if (reduced.matches || seen.has(card)) return;
      seen.add(card);
      var cards = Array.prototype.slice.call(grid.children);
      var animation = card.animate([
        { opacity: 0, transform: "translateY(32px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], {
        duration: 760,
        delay: Math.max(0, cards.indexOf(card)) * 120,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "backwards"
      });
      active.add(animation);
      animation.onfinish = animation.oncancel = function () { active.delete(animation); };
    });
  }, { threshold: 0.12 });
  function observeCards() {
    observer.disconnect();
    grid.querySelectorAll(".tile").forEach(function (card) {
      if (!seen.has(card)) observer.observe(card);
    });
  }
  new MutationObserver(observeCards).observe(grid, { childList: true });
  function stopMotion() {
    if (reduced.matches) active.forEach(function (animation) { animation.cancel(); });
  }
  reduced.addEventListener("change", stopMotion);
  observeCards();
})();
