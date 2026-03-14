/**
 * 攀帅的线上会客厅 - 访客身份识别系统 (V7)
 * 功能：检测微信环境，引导访客登记，并同步至 Microsoft Clarity
 */

(function () {
    const CLARITY_ID = "vqbv0pg17i";

    // 1. 初始化 Clarity (如果尚未初始化)
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments) };

    // 2. 环境检测
    const isWechat = /MicroMessenger/i.test(navigator.userAgent);

    // 3. 核心逻辑
    window.addEventListener('load', () => {
        const savedName = localStorage.getItem('visitor_name');

        if (savedName) {
            // 已有登记，直接同步
            syncToClarity(savedName);
        } else if (isWechat) {
            // 微信环境且未登记，暂时根据用户需求注释掉自动弹窗逻辑
            // setTimeout(showIdentityModal, 3000);
        }
    });

    function showIdentityModal() {
        // 创建 HTML 结构
        const modal = document.createElement('div');
        modal.className = 'identity-modal active';
        modal.id = 'identityModal';
        modal.innerHTML = `
            <div class="identity-card">
                <div class="identity-title">攀帅的线上会客厅</div>
                <div class="identity-desc">欢迎光临！为了方便回访交流，<br>请问该如何称呼您？</div>
                <input type="text" id="visitorNameInput" class="identity-input" placeholder="输入您的昵称或真实姓名" maxlength="15">
                <button id="submitIdentity" class="identity-submit">进入会客厅</button>
                <p style="margin-top:16px; font-size:12px; color:#999; cursor:pointer;" onclick="closeIdentityModal()">暂不登记，直接进入</p>
            </div>
        `;
        document.body.appendChild(modal);

        // 绑定事件
        document.getElementById('submitIdentity').addEventListener('click', () => {
            const name = document.getElementById('visitorNameInput').value.trim();
            if (name) {
                localStorage.setItem('visitor_name', name);
                syncToClarity(name);
                closeIdentityModal();
            } else {
                alert('请输入称呼后再进入哦~');
            }
        });
    }

    window.closeIdentityModal = function () {
        const m = document.getElementById('identityModal');
        if (m) m.remove();
    };

    function syncToClarity(name) {
        // 调用 Clarity Identify API
        // 参数依次为：用户ID (自定), 会话ID (可选), 页面ID (可选), 友好展示名称
        window.clarity("identify", name, undefined, undefined, name);
        console.log(`[Identity] Visitor identified as: ${name}`);
    }
})();

/* ============================================================
   Lightbox — 博文图片点击放大
   ============================================================ */
(function () {
    window.addEventListener('load', () => {
        // 只对博文正文中的图片生效
        const images = document.querySelectorAll('.blog-body img, .blog-image');
        if (!images.length) return;

        // 创建 Lightbox DOM
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-img" src="" alt="">
        `;
        document.body.appendChild(overlay);

        const lbImg = overlay.querySelector('.lightbox-img');
        const lbClose = overlay.querySelector('.lightbox-close');

        // 给每张图添加点击事件
        images.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                lbImg.src = img.src;
                lbImg.alt = img.alt || '';
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // 关闭 Lightbox
        function closeLightbox() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        overlay.addEventListener('click', (e) => {
            if (e.target !== lbImg) closeLightbox();
        });
        lbClose.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    });
})();
