const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 5050;
const WWWROOT = path.join(__dirname, 'wwwroot');

// Mock state for interactive preview
let reports = [
    {
        id: 1,
        trackingCode: "SS-89A12B",
        isAnonymous: true,
        schoolName: "THPT Nguyễn Trãi",
        locationDetail: "Căn tin & Sân thể thao",
        bullyingType: "Bắt nạt mạng & Lăng mạ",
        description: "Có nhóm học sinh lập group mạng xã hội ghép ảnh chế giễu và đe dọa đánh sau giờ học.",
        severityLevel: "Khẩn cấp vừa",
        status: "Đã tiếp nhận & Đang xác minh",
        adminNotes: "Ban Giám hiệu và Chuyên gia tâm lý đã gửi thư làm việc với GVCN lớp.",
        createdAt: new Date().toISOString()
    }
];

let forumPosts = [
    {
        id: 1,
        title: "Làm sao để vượt qua cảm giác sợ hãi khi bị cô lập ở lớp?",
        category: "Tâm sự học đường",
        content: "Mình bị một nhóm bạn trong lớp thêu dệt chuyện sai sự thật rồi rủ cả lớp không ai nói chuyện với mình. Mỗi ngày đến trường với mình là một cơn ác mộng. Có bạn nào từng trải qua cảm giác này và vượt qua được không?",
        authorName: "Học sinh ẩn danh (Lớp 11)",
        isAnonymous: true,
        likesCount: 24,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        comments: [
            {
                id: 1,
                authorName: "Nguyễn Minh Tuấn",
                isAnonymous: false,
                content: "Chào bạn! Mình từng ở trong hoàn cảnh tương tự năm lớp 9. Bạn đừng giấu một mình nhé, hãy tâm sự với thầy cô chủ nhiệm hoặc gọi cho Tổng đài 111. Bạn không có lỗi gì cả!",
                createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
            }
        ]
    },
    {
        id: 2,
        title: "Quy định pháp luật xử lý hành vi đe dọa, đánh đập bạn học thế nào?",
        category: "Hỏi đáp pháp lý",
        content: "Em muốn hỏi theo Luật Trẻ em 2016 và Bộ luật Hình sự, những học sinh cấp 3 có hành vi bạo lực học đường tống tiền hoặc gây thương tích sẽ bị xử lý như thế nào?",
        authorName: "Trần Đức Anh",
        isAnonymous: false,
        likesCount: 42,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        comments: []
    }
];

let newsList = [
    {
        id: 1,
        title: "5 Kỹ năng tự vệ an toàn khi đối mặt với hành vi bạo lực học đường",
        summary: "Hướng dẫn chi tiết các bước thoát hiểm, giữ bình tĩnh, ứng xử thông minh và tìm kiếm trợ giúp ngay lập tức khi bị nhóm bạn đe dọa.",
        category: "Kỹ năng phòng vệ",
        author: "Chuyên gia An ninh Học đường",
        readTime: "5 phút đọc",
        content: `Bắt nạt học đường không chỉ ảnh hưởng đến thể xác mà còn gây tổn thương tâm lý lâu dài. Sau đây là 5 nguyên tắc vàng giúp em tự bảo vệ bản thân:\n\n1. Giữ khoảng cách an toàn và bình tĩnh.\n2. Hét to và di chuyển về nơi đông người.\n3. Không chịu đựng một mình - Gửi Báo cáo Ẩn danh trên SafeSchool.\n4. Lưu lại bằng chứng.\n5. Gọi ngay hotline 111 khi khẩn cấp.`
    },
    {
        id: 2,
        title: "Nhận diện Cyberbullying (Bắt nạt trên mạng) và cách chặn đứng tức thì",
        summary: "Cách xử lý khi bị lập group antifan, bôi nhọ ảnh cá nhân hoặc nhắn tin đe dọa trên Facebook, TikTok, Zalo.",
        category: "Tư vấn tâm lý",
        author: "ThS. Tâm lý Nguyễn Thanh Hà",
        readTime: "4 phút đọc",
        content: `Bắt nạt trên không gian mạng (Cyberbullying) có thể diễn ra 24/7 khiến học sinh căng thẳng tột độ.\n\nCác bước hành động ngay lập tức:\n- Không đáp trả.\n- Sử dụng công cụ Chặn & Báo cáo.\n- Thông báo với Ban tư vấn nhà trường qua SafeSchool.`
    },
    {
        id: 3,
        title: "Luật Trẻ em 2016 và Quyền được bảo vệ của Học sinh trong Nhà trường",
        summary: "Những quy định pháp lý quan trọng mọi học sinh và phụ huynh cần biết để bảo vệ quyền lợi hợp pháp khi bị xâm hại hoặc bạo lực.",
        category: "Pháp lý học đường",
        author: "Luật sư Học đường Việt Nam",
        readTime: "6 phút đọc",
        content: `Theo Điều 37 Luật Trẻ em 2016, trẻ em có quyền được bảo vệ dưới mọi hình thức để không bị bạo lực, bỏ mặc. Mọi hành vi bao che bạo lực học đường đều vi phạm pháp luật.`
    }
];

function renderLayout(title, contentHtml) {
    return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - SafeSchool | Hỗ Trợ & Báo Cáo Bắt Nạt Học Đường Ẩn Danh</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="/css/site.css" />
</head>
<body>
    <div class="emergency-top-bar">
        <div style="display: flex; align-items: center; gap: 8px;">
            <div class="pulse-dot"></div>
            <span>TỔNG ĐÀI KHẨN CẤP HOẠT ĐỘNG 24/7 (MIỄN PHÍ CUỘC GỌI)</span>
        </div>
        <div class="emergency-hotlines">
            <a href="tel:111" class="hotline-badge" title="Tổng đài Quốc gia Bảo vệ Trẻ em">
                <i class="bi bi-shield-fill-check"></i> 111 (Bảo Vệ Trẻ Em)
            </a>
            <a href="tel:113" class="hotline-badge" title="Cảnh sát Phản ứng nhanh">
                <i class="bi bi-telephone-fill"></i> 113 (Cảnh Sát)
            </a>
            <a href="tel:115" class="hotline-badge" title="Cấp cứu Y tế">
                <i class="bi bi-hospital"></i> 115 (Cấp Cứu)
            </a>
        </div>
    </div>

    <header class="main-header">
        <div class="navbar-container">
            <a href="/" class="brand-logo">
                <i class="bi bi-shield-heart-fill"></i>
                <span>SafeSchool</span>
            </a>
            <nav>
                <ul class="nav-links">
                    <li><a href="/">Trang Chủ</a></li>
                    <li><a href="/News">Tin Tức & Kỹ Năng</a></li>
                    <li><a href="/Forum">Diễn Đàn</a></li>
                    <li><a href="/Report">Báo Cáo Ẩn Danh</a></li>
                    <li><a href="/Report/Track">Tra Cứu Mã</a></li>
                </ul>
            </nav>
            <div class="nav-right-actions">
                <button class="btn btn-secondary" id="openLoginModalBtn">
                    <i class="bi bi-box-arrow-in-right"></i> Đăng Nhập
                </button>
                <a href="/Report" class="btn btn-danger">
                    <i class="bi bi-exclamation-triangle-fill"></i> Gửi Báo Cáo
                </a>
            </div>
        </div>
    </header>

    <main role="main" class="container">
        ${contentHtml}
    </main>

    <div class="ai-chat-fab" id="aiChatFab" title="Mở Trợ lý AI Support Tâm lý & Khẩn cấp 24/7">
        <i class="bi bi-robot"></i>
    </div>

    <div class="ai-chat-drawer" id="aiChatDrawer">
        <div class="chat-header">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="bi bi-robot" style="font-size: 1.4rem;"></i>
                <div>
                    <strong style="display: block; font-size: 1rem;">AI Support SafeSchool</strong>
                    <small style="opacity: 0.85; font-size: 0.78rem;">Tư vấn tâm lý & Hướng dẫn cấp cứu 24/7</small>
                </div>
            </div>
            <button id="closeAiChat" style="background: none; border: none; color: #fff; font-size: 1.4rem; cursor: pointer;">&times;</button>
        </div>
        <div class="chat-messages" id="chatMessages">
            <div class="msg-bubble msg-ai">
                👋 Chào em! Tôi là **AI Support SafeSchool**.<br />
                Nếu em đang gặp nguy hiểm, bị đe dọa hoặc bị cô lập ở trường, hãy nhắn cho tôi. Thông tin hoàn toàn ẩn danh và bảo mật! 🛡️
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="aiMsgInput" placeholder="Nhập câu hỏi hoặc tâm sự tại đây..." />
            <button class="btn btn-primary" id="sendAiMsgBtn" style="border-radius: 50px; padding: 10px 16px;">
                <i class="bi bi-send-fill"></i>
            </button>
        </div>
    </div>

    <div class="modal-overlay" id="authModal">
        <div class="modal-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-main);">Đăng Nhập SafeSchool</h3>
                <button id="closeAuthModalBtn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">&times;</button>
            </div>
            <div class="auth-tabs">
                <button class="tab-btn active" id="btn-tab-phone" onclick="switchAuthTab('phone')">Số điện thoại</button>
                <button class="tab-btn" id="btn-tab-user" onclick="switchAuthTab('user')">Username</button>
                <button class="tab-btn" id="btn-tab-gmail" onclick="switchAuthTab('gmail')">Gmail</button>
            </div>
            <div class="auth-tab-content" id="tab-phone">
                <form onsubmit="handlePhoneLogin(event)">
                    <div class="form-group">
                        <label>Số điện thoại học sinh / phụ huynh</label>
                        <input type="tel" id="authPhone" class="form-control" placeholder="Ví dụ: 0987654321" required />
                    </div>
                    <div class="form-group">
                        <label>Mật khẩu</label>
                        <input type="password" id="authPhonePass" class="form-control" placeholder="••••••••" required />
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
                        <i class="bi bi-phone"></i> Đăng nhập bằng Số điện thoại
                    </button>
                </form>
            </div>
            <div class="auth-tab-content" id="tab-user" style="display: none;">
                <form onsubmit="handleUsernameLogin(event)">
                    <div class="form-group">
                        <label>Tên đăng nhập (Username)</label>
                        <input type="text" id="authUser" class="form-control" placeholder="Nhập tên tài khoản" required />
                    </div>
                    <div class="form-group">
                        <label>Mật khẩu</label>
                        <input type="password" id="authUserPass" class="form-control" placeholder="••••••••" required />
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
                        <i class="bi bi-person"></i> Đăng nhập bằng Tài khoản
                    </button>
                </form>
            </div>
            <div class="auth-tab-content" id="tab-gmail" style="display: none; text-align: center;">
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 20px;">
                    Đăng nhập nhanh an toàn bằng tài khoản Google / Gmail cá nhân hoặc Email trường học.
                </p>
                <button onclick="handleGmailLogin()" class="btn btn-secondary" style="width: 100%; padding: 12px; font-size: 1rem; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    Tiếp tục với Google / Gmail
                </button>
            </div>
        </div>
    </div>

    <footer class="main-footer">
        <div class="footer-container">
            <div class="footer-col">
                <div class="brand-logo" style="color: #fff; margin-bottom: 12px;">
                    <i class="bi bi-shield-heart-fill" style="color: var(--primary);"></i>
                    <span>SafeSchool</span>
                </div>
                <p style="font-size: 0.9rem; line-height: 1.6;">
                    Nền tảng hỗ trợ học sinh, phụ huynh và nhà trường phòng chống bạo lực & bắt nạt học đường. Bảo vệ 100% danh tính người báo cáo.
                </p>
            </div>
            <div class="footer-col">
                <h4>Đường Dây Nóng Khẩn Cấp</h4>
                <p><strong style="color: #fff;">111:</strong> Tổng đài Quốc gia Bảo vệ Trẻ em (Trực 24/7)</p>
                <p><strong style="color: #fff;">113:</strong> Cảnh sát Phản ứng nhanh</p>
                <p><strong style="color: #fff;">115:</strong> Cấp cứu y tế khẩn cấp</p>
            </div>
            <div class="footer-col">
                <h4>Chức Năng Chính</h4>
                <p><a href="/Report" style="color: #94a3b8;">Báo cáo bắt nạt ẩn danh</a></p>
                <p><a href="/Forum" style="color: #94a3b8;">Diễn đàn chia sẻ tâm sự</a></p>
                <p><a href="/News" style="color: #94a3b8;">Kỹ năng ứng phó & Pháp lý</a></p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} SafeSchool Vietnam - Nền tảng An toàn Học đường Việt Nam. Phát triển bằng C# ASP.NET Core.</p>
        </div>
    </footer>

    <script src="/js/site.js"></script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Serve static files
    if (pathname.startsWith('/css/') || pathname.startsWith('/js/')) {
        const filePath = path.join(WWWROOT, pathname);
        if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath);
            const contentType = ext === '.css' ? 'text/css' : 'text/javascript';
            res.writeHead(200, { 'Content-Type': contentType });
            return fs.createReadStream(filePath).pipe(res);
        }
    }

    // API ENDPOINTS
    if (pathname === '/api/AiSupport/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const data = JSON.parse(body || '{}');
            const msg = (data.message || '').toLowerCase();
            let aiText = "👋 Chào em! Tôi là AI Support SafeSchool.\n\nTôi có thể giúp em:\n1. 🚨 Hướng dẫn khẩn cấp khi bị đe dọa / đánh đập.\n2. 🔒 Hướng dẫn gửi Báo cáo Ẩn danh.\n3. 🤝 Tư vấn giải tỏa áp lực tâm lý.";

            if (msg.includes('đánh') || msg.includes('bạo lực') || msg.includes('chặn đường') || msg.includes('tống tiền') || msg.includes('nguy hiểm')) {
                aiText = "🛡️ **CẢNH BÁO NGUY HIỂM KHẨN CẤP!**\n\nNếu em đang bị đe dọa hoặc bị đánh đập:\n1. Hãy di chuyển ngay về phía văn phòng thầy cô, phòng bảo vệ hoặc nơi đông người.\n2. Gọi ngay hotline **111** (Bảo vệ Trẻ em 24/7) hoặc **113** (Cảnh sát phản ứng nhanh).\n3. Nhấn 'Báo cáo Ẩn danh' trên SafeSchool để Ban Giám Hiệu can thiệp xử lý!";
            } else if (msg.includes('cô lập') || msg.includes('buồn') || msg.includes('sợ') || msg.includes('áp lực')) {
                aiText = "🤝 **SafeSchool luôn đồng hành cùng em!**\n\nCảm giác bị cô lập rất đau đớn, nhưng **em không hề có lỗi**. Hãy dũng cảm chia sẻ với người em tin tưởng hoặc viết bài ẩn danh trên **Diễn đàn SafeSchool** để nhận lời khuyên!";
            } else if (msg.includes('báo cáo') || msg.includes('ẩn danh')) {
                aiText = "🔒 **Báo cáo Ẩn danh SafeSchool:**\n\nHệ thống KHÔNG lưu tên, SĐT hay địa chỉ IP của em. Em sẽ nhận được **Mã Tra Cứu Bí Mật** (Ví dụ: `SS-89A12B`) để theo dõi tiến độ xử lý an toàn!";
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ sender: 'ai', message: aiText }));
        });
        return;
    }

    if (pathname === '/Auth/LoginByPhone' || pathname === '/Auth/LoginByUsername' || pathname === '/Auth/LoginWithGmail') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Đăng nhập hệ thống SafeSchool thành công!', userName: 'Học sinh SafeSchool' }));
        return;
    }

    if (pathname.startsWith('/Forum/LikePost/') && req.method === 'POST') {
        const id = parseInt(pathname.split('/').pop());
        const post = forumPosts.find(p => p.id === id);
        if (post) post.likesCount++;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
    }

    if (pathname === '/Forum/CreatePost' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const params = new url.URLSearchParams(body);
            const isAnon = params.get('IsAnonymous') === 'true';
            forumPosts.unshift({
                id: forumPosts.length + 1,
                title: params.get('Title') || 'Bài viết mới',
                category: params.get('Category') || 'Tâm sự học đường',
                content: params.get('Content') || '',
                authorName: isAnon ? 'Học sinh ẩn danh' : (params.get('AuthorName') || 'Học sinh'),
                isAnonymous: isAnon,
                likesCount: 0,
                createdAt: new Date().toISOString(),
                comments: []
            });
            res.writeHead(302, { 'Location': '/Forum' });
            res.end();
        });
        return;
    }

    if (pathname === '/Report/Submit' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const params = new url.URLSearchParams(body);
            const trackingCode = "SS-" + Math.random().toString(36).substr(2, 6).toUpperCase();
            reports.unshift({
                id: reports.length + 1,
                trackingCode: trackingCode,
                isAnonymous: params.get('IsAnonymous') === 'true',
                schoolName: params.get('SchoolName') || 'Trường học',
                bullyingType: params.get('BullyingType') || 'Bắt nạt thể xác',
                locationDetail: params.get('LocationDetail') || '',
                severityLevel: params.get('SeverityLevel') || 'Khẩn cấp vừa',
                description: params.get('Description') || '',
                status: 'Đã tiếp nhận & Đang xác minh',
                adminNotes: 'Ban tư vấn SafeSchool đang phối hợp với Ban giám hiệu nhà trường xác minh khẩn cấp.',
                createdAt: new Date().toISOString()
            });
            res.writeHead(302, { 'Location': `/Report/Success?code=${trackingCode}` });
            res.end();
        });
        return;
    }

    // PAGE ROUTING
    if (pathname === '/' || pathname === '/Home') {
        const newsHtml = newsList.map(item => `
            <div class="card">
                <span class="badge badge-success" style="margin-bottom: 12px; background: var(--primary-light); color: var(--primary-hover); border: none;">${item.category}</span>
                <h3 class="card-title" style="font-size: 1.1rem;"><a href="/News/Detail/${item.id}" style="color: var(--text-main);">${item.title}</a></h3>
                <p class="card-summary">${item.summary}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 12px;">
                    <span><i class="bi bi-clock"></i> ${item.readTime}</span>
                    <a href="/News/Detail/${item.id}" style="font-weight: 700;">Đọc tiếp &rarr;</a>
                </div>
            </div>
        `).join('');

        const pageHtml = `
            <section class="hero-section">
                <div class="hero-content">
                    <span class="badge badge-success" style="margin-bottom: 16px; font-size: 0.85rem; padding: 6px 14px;">
                        <i class="bi bi-shield-check"></i> Bảo Mật Danh Tính 100% • Tư Vấn 24/7
                    </span>
                    <h1 class="hero-title">Bạn Không Độc Hành. Hãy Để SafeSchool Lắng Nghe & Bảo Vệ!</h1>
                    <p class="hero-subtitle">
                        Hệ thống hỗ trợ nạn nhân bắt nạt học đường ẩn danh đầu tiên. Kết nối trực tiếp với Tổng đài 111, Cảnh sát 113, Chuyên gia Tâm lý và AI Trợ lý Khẩn cấp.
                    </p>
                    <div class="hero-actions">
                        <a href="/Report" class="btn btn-danger" style="padding: 14px 28px; font-size: 1.05rem;">
                            <i class="bi bi-shield-lock-fill"></i> Báo Cáo Ẩn Danh Ngay
                        </a>
                        <a href="tel:111" class="btn btn-secondary" style="padding: 14px 24px; font-size: 1.05rem; background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.3);">
                            <i class="bi bi-telephone-fill"></i> Gọi 111 Khẩn Cấp
                        </a>
                    </div>
                </div>
                <i class="bi bi-shield-shaded hero-illustration"></i>
            </section>

            <section style="margin-bottom: 40px;">
                <div style="background: linear-gradient(135deg, #fff 0%, #fef2f2 100%); border: 2px solid #fca5a5; border-radius: 20px; padding: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="background: #ef4444; color: #fff; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                            <i class="bi bi-shield-fill-exclamation"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.25rem; font-weight: 800; color: #991b1b; margin-bottom: 4px;">Đang gặp nguy hiểm thể xác hoặc tống tiền?</h3>
                            <p style="color: #7f1d1d; font-size: 0.95rem;">Đừng chần chừ! Gọi trực tiếp cho cơ quan Công an & Tổng đài Khẩn cấp để được giải cứu tức thì.</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <a href="tel:111" class="btn btn-danger" style="padding: 12px 20px; font-size: 1rem;"><i class="bi bi-telephone-outbound-fill"></i> Gọi 111 (Quốc Gia)</a>
                        <a href="tel:113" class="btn btn-secondary" style="border-color: #ef4444; color: #dc2626; padding: 12px 20px; font-size: 1rem;"><i class="bi bi-shield-shaded"></i> Gọi 113 (Cảnh Sát)</a>
                    </div>
                </div>
            </section>

            <section style="margin-bottom: 48px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <h2 style="font-size: 1.6rem; font-weight: 800; color: var(--text-main);">Tin Tức & Kỹ Năng Phòng Thần</h2>
                        <p style="color: var(--text-muted); font-size: 0.95rem;">Kiến thức tự vệ, giải tỏa tâm lý và tư vấn pháp lý dành cho học sinh & phụ huynh.</p>
                    </div>
                    <a href="/News" class="btn btn-secondary">Xem tất cả bài viết <i class="bi bi-arrow-right"></i></a>
                </div>
                <div class="grid-3">${newsHtml}</div>
            </section>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(renderLayout('Trang Chủ', pageHtml));
    }

    if (pathname === '/News') {
        const newsHtml = newsList.map(item => `
            <div class="card" style="display: flex; flex-direction: column;">
                <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                    <span class="badge badge-success">${item.category}</span>
                    <small style="color: var(--text-muted);"><i class="bi bi-clock"></i> ${item.readTime}</small>
                </div>
                <h3 class="card-title" style="font-size: 1.2rem;"><a href="/News/Detail/${item.id}" style="color: var(--text-main);">${item.title}</a></h3>
                <p class="card-summary" style="flex: 1;">${item.summary}</p>
                <div style="border-top: 1px solid var(--border-color); padding-top: 12px; display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
                    <small style="color: var(--text-muted);"><i class="bi bi-person"></i> ${item.author}</small>
                    <a href="/News/Detail/${item.id}" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.85rem;">Xem chi tiết</a>
                </div>
            </div>
        `).join('');

        const pageHtml = `
            <div style="margin-bottom: 32px;">
                <h1 style="font-size: 2.2rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px;">Cẩm Nang & Kỹ Năng Bảo Vệ Học Đường</h1>
                <p style="color: var(--text-muted); font-size: 1.05rem;">Tổng hợp bài viết hướng dẫn ứng phó bạo lực, tư vấn giải tỏa stress và kiến thức pháp lý bảo vệ bản thân.</p>
            </div>
            <div class="grid-3">${newsHtml}</div>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(renderLayout('Tin Tức & Kỹ Năng', pageHtml));
    }

    if (pathname.startsWith('/News/Detail/')) {
        const id = parseInt(pathname.split('/').pop());
        const item = newsList.find(n => n.id === id) || newsList[0];
        const pageHtml = `
            <div style="max-width: 840px; margin: 0 auto;">
                <a href="/News" style="display: inline-flex; align-items: center; gap: 6px; margin-bottom: 24px; font-weight: 700; color: var(--primary);"><i class="bi bi-arrow-left"></i> Quay lại tin tức</a>
                <article class="card" style="padding: 40px; margin-bottom: 40px;">
                    <span class="badge badge-success" style="margin-bottom: 16px;">${item.category}</span>
                    <h1 style="font-size: 2.2rem; font-weight: 800; color: var(--text-main); margin-bottom: 16px;">${item.title}</h1>
                    <div style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 28px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px;">
                        <span>Tác giả: ${item.author}</span> • <span>Thời gian đọc: ${item.readTime}</span>
                    </div>
                    <div style="font-size: 1.1rem; line-height: 1.8; color: #334155; white-space: pre-line;">${item.content}</div>
                </article>
            </div>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(renderLayout(item.title, pageHtml));
    }

    if (pathname === '/Forum') {
        const postsHtml = forumPosts.map(post => `
            <div class="card" style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span class="badge ${post.isAnonymous ? 'badge-anon' : 'badge-success'}"><i class="bi ${post.isAnonymous ? 'bi-incognito' : 'bi-person-check-fill'}"></i> ${post.authorName}</span>
                    <span class="badge badge-emergency" style="background: var(--primary-light); color: var(--primary-hover);">${post.category}</span>
                </div>
                <h2 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 10px;">${post.title}</h2>
                <p style="color: var(--text-muted); margin-bottom: 20px; line-height: 1.6;">${post.content}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 14px;">
                    <button onclick="likePost(${post.id}, this)" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.88rem;">
                        <i class="bi bi-heart-fill" style="color: #ef4444;"></i> <span class="like-count">${post.likesCount}</span> Thích
                    </button>
                    <span style="color: var(--text-muted); font-size: 0.9rem;">${post.comments.length} bình luận</span>
                </div>
            </div>
        `).join('');

        const pageHtml = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
                <div>
                    <h1 style="font-size: 2.2rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px;">
                        <i class="bi bi-chat-heart-fill" style="color: var(--primary);"></i> Diễn Đàn Tâm Sự Học Đường
                    </h1>
                    <p style="color: var(--text-muted); font-size: 1.05rem;">Không gian an toàn chia sẻ tâm sự, hỏi đáp kinh nghiệm vượt qua khó khăn & lắng nghe lời khuyên.</p>
                </div>
                <button onclick="document.getElementById('createPostModal').style.display='flex'" class="btn btn-primary" style="padding: 12px 24px; font-size: 1rem;">
                    <i class="bi bi-pencil-square"></i> Đăng Bài Tâm Sự (Có Ẩn Danh)
                </button>
            </div>

            <div>${postsHtml}</div>

            <div class="modal-overlay" id="createPostModal" style="display: none;">
                <div class="modal-card" style="width: 580px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="font-size: 1.3rem; font-weight: 800;">Tạo Bài Viết Tâm Sự / Hỏi Đáp</h3>
                        <button onclick="document.getElementById('createPostModal').style.display='none'" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                    </div>
                    <form method="post" action="/Forum/CreatePost">
                        <div class="form-group">
                            <label>Chủ đề thảo luận</label>
                            <select name="Category" class="form-control" required>
                                <option value="Tâm sự học đường">Tâm sự học đường</option>
                                <option value="Hỏi đáp pháp lý">Hỏi đáp pháp lý</option>
                                <option value="Góc tư vấn phụ huynh">Góc tư vấn phụ huynh</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Tiêu đề bài viết</label>
                            <input type="text" name="Title" class="form-control" placeholder="Tóm tắt vấn đề của bạn..." required />
                        </div>
                        <div class="form-group">
                            <label>Nội dung chia sẻ</label>
                            <textarea name="Content" rows="5" class="form-control" placeholder="Viết chi tiết câu chuyện..." required></textarea>
                        </div>
                        <div class="form-group" style="display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 12px; border-radius: var(--radius-md);">
                            <input type="checkbox" name="IsAnonymous" value="true" id="forumAnonCheck" checked style="width: 18px; height: 18px;" />
                            <label for="forumAnonCheck" style="margin: 0; cursor: pointer; font-weight: 700; color: var(--primary-hover);">
                                <i class="bi bi-incognito"></i> Đăng bài dạng Học sinh Ẩn danh (Bảo mật 100%)
                            </label>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px;">
                            <i class="bi bi-send-fill"></i> Đăng Bài Viết
                        </button>
                    </form>
                </div>
            </div>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(renderLayout('Diễn Đàn', pageHtml));
    }

    if (pathname === '/Report') {
        const pageHtml = `
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <span class="badge badge-emergency" style="margin-bottom: 12px; padding: 6px 16px; font-size: 0.9rem;">
                        <i class="bi bi-shield-lock-fill"></i> Bảo Mật Danh Tính 100% • Không Thu Thập IP
                    </span>
                    <h1 style="font-size: 2.2rem; font-weight: 800; color: var(--text-main); margin-bottom: 10px;">Gửi Đơn Báo Cáo Bắt Nạt Học Đường</h1>
                    <p style="color: var(--text-muted); font-size: 1rem;">
                        Thông tin của bạn sẽ được chuyển ngay lập tức tới Ban tư vấn tâm lý SafeSchool, Ban giám hiệu nhà trường và cơ quan chức năng để bảo vệ bạn an toàn.
                    </p>
                </div>

                <div class="card" style="padding: 40px; box-shadow: var(--shadow-lg);">
                    <form method="post" action="/Report/Submit">
                        <div style="background: linear-gradient(135deg, #e0e7ff 0%, #e0f2fe 100%); padding: 20px; border-radius: var(--radius-md); border: 1px solid #c7d2fe; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <strong style="color: var(--primary-hover); font-size: 1.1rem; display: block;">
                                    <i class="bi bi-incognito"></i> Chế độ Báo Cáo Ẩn Danh
                                </strong>
                                <span style="color: var(--text-muted); font-size: 0.88rem;">Hệ thống sẽ che giấu toàn bộ tên, SĐT và thông tin cá nhân của bạn.</span>
                            </div>
                            <input type="checkbox" name="IsAnonymous" value="true" id="isAnonymousCheckbox" checked style="width: 24px; height: 24px;" />
                        </div>

                        <div class="form-group">
                            <label>Tên trường học xảy ra sự việc (*)</label>
                            <input type="text" name="SchoolName" class="form-control" placeholder="Ví dụ: THPT Nguyễn Trãi - Hà Nội" required />
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
                            <div class="form-group">
                                <label>Loại hình bắt nạt (*)</label>
                                <select name="BullyingType" class="form-control" required>
                                    <option value="Bạo lực thể xác">Bạo lực thể xác / Đánh đập</option>
                                    <option value="Lăng mạ/Tâm lý">Lăng mạ / Cô lập / Quấy rối tâm lý</option>
                                    <option value="Bắt nạt mạng">Bắt nạt trên mạng (Cyberbullying)</option>
                                    <option value="Tống tiền">Tống tiền / Trấn lột đồ đạc</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Địa điểm cụ thể xảy ra sự việc</label>
                                <input type="text" name="LocationDetail" class="form-control" placeholder="Căn tin, lớp 10A2, cổng trường..." />
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Mô tả chi tiết sự việc (*)</label>
                            <textarea name="Description" rows="5" class="form-control" placeholder="Hãy mô tả chi tiết sự việc..." required></textarea>
                        </div>

                        <button type="submit" class="btn btn-danger" style="width: 100%; padding: 16px; font-size: 1.1rem; margin-top: 12px; border-radius: var(--radius-md);">
                            <i class="bi bi-send-check-fill"></i> GỬI ĐƠN BÁO CÁO ẨN DANH NGAY
                        </button>
                    </form>
                </div>
            </div>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(renderLayout('Báo Cáo Ẩn Danh', pageHtml));
    }

    if (pathname === '/Report/Success') {
        const code = parsedUrl.query.code || 'SS-UNKNOWN';
        const pageHtml = `
            <div style="max-width: 680px; margin: 40px auto; text-align: center;">
                <div class="card" style="padding: 48px; border-top: 6px solid var(--emerald);">
                    <div style="width: 80px; height: 80px; background: var(--emerald-light); color: var(--emerald); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; margin: 0 auto 24px;">
                        <i class="bi bi-check-circle-fill"></i>
                    </div>
                    <h1 style="font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 12px;">Đã Gửi Báo Cáo Thành Công!</h1>
                    <p style="color: var(--text-muted); font-size: 1.05rem; margin-bottom: 28px;">
                        Đơn báo cáo của bạn đã được mã hóa an toàn và chuyển tới Ban tiếp nhận khẩn cấp SafeSchool.
                    </p>
                    <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 24px; border-radius: var(--radius-lg); border: 2px dashed var(--primary); margin-bottom: 32px;">
                        <span style="font-size: 0.9rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 8px;">MÃ TRA CỨU BẢO MẬT BÍ MẬT CỦA BẠN:</span>
                        <div style="font-size: 2.2rem; font-weight: 800; color: var(--primary-hover); letter-spacing: 2px;">
                            ${code}
                        </div>
                        <small style="color: var(--rose); font-weight: 600; display: block; margin-top: 8px;">
                            ⚠️ Vui lòng chụp màn hình hoặc lưu lại Mã này. Bạn dùng mã này để theo dõi tiến độ xử lý mà KHÔNG LỘ danh tính!
                        </small>
                    </div>
                    <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                        <a href="/Report/Track?code=${code}" class="btn btn-primary"><i class="bi bi-search"></i> Kiểm Tra Tiến Độ Ngay</a>
                        <a href="/" class="btn btn-secondary">Quay lại Trang Chủ</a>
                    </div>
                </div>
            </div>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(renderLayout('Gửi Báo Cáo Thành Công', pageHtml));
    }

    if (pathname === '/Report/Track') {
        const code = (parsedUrl.query.code || '').trim();
        let resultHtml = '';
        if (code) {
            const report = reports.find(r => r.trackingCode.toLowerCase() === code.toLowerCase());
            if (report) {
                resultHtml = `
                    <div class="card" style="padding: 36px; border-top: 4px solid var(--emerald); margin-top: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px;">
                            <div>
                                <span style="font-size: 0.85rem; color: var(--text-muted);">MÃ TRA CỨU:</span>
                                <strong style="font-size: 1.4rem; color: var(--primary-hover); display: block;">${report.trackingCode}</strong>
                            </div>
                            <span class="badge badge-success" style="font-size: 1rem; padding: 6px 16px;">${report.status}</span>
                        </div>
                        <p><strong>Trường học:</strong> ${report.schoolName}</p>
                        <p><strong>Loại hình bắt nạt:</strong> ${report.bullyingType}</p>
                        <p style="margin-top: 12px; background: #f8fafc; padding: 16px; border-radius: 8px;"><strong>Mô tả:</strong> ${report.description}</p>
                        <div style="background: var(--emerald-light); padding: 20px; border-radius: 12px; margin-top: 20px; color: #047857;">
                            <strong>Thông báo từ Ban Giám Hiệu & Chuyên gia SafeSchool:</strong>
                            <p style="margin-top: 6px;">${report.adminNotes}</p>
                        </div>
                    </div>
                `;
            } else {
                resultHtml = `
                    <div class="card" style="text-align: center; padding: 48px; border-top: 4px solid var(--rose); margin-top: 24px;">
                        <h3>Không tìm thấy báo cáo với mã "${code}"</h3>
                        <p style="color: var(--text-muted);">Vui lòng kiểm tra lại Mã bí mật được cấp.</p>
                    </div>
                `;
            }
        }

        const pageHtml = `
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="font-size: 2.2rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px;">
                        <i class="bi bi-shield-check" style="color: var(--primary);"></i> Tra Cứu Tiến Độ Báo Cáo
                    </h1>
                    <p style="color: var(--text-muted); font-size: 1.05rem;">
                        Nhập Mã Tra Cứu bí mật (VD: SS-89A12B) được cấp khi bạn gửi đơn để xem phản hồi & tiến trình can thiệp.
                    </p>
                </div>
                <div class="card" style="padding: 32px;">
                    <form method="get" action="/Report/Track" style="display: flex; gap: 12px;">
                        <input type="text" name="code" value="${code}" placeholder="Nhập Mã Tra Cứu (VD: SS-89A12B)..." class="form-control" style="flex: 1; font-size: 1.1rem; padding: 14px;" required />
                        <button type="submit" class="btn btn-primary" style="padding: 14px 28px;"><i class="bi bi-search"></i> Tra Cứu Ngay</button>
                    </form>
                </div>
                ${resultHtml}
            </div>
        `;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(renderLayout('Tra Cứu Báo Cáo', pageHtml));
    }

    // 404 Fallback
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
});

server.listen(PORT, () => {
    console.log(`SafeSchool Dev Web Server running at http://localhost:${PORT}`);
});
