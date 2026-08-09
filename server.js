const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 5050;
const WWWROOT = path.join(__dirname, 'wwwroot');

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
        title: "Làm sao vượt qua cảm giác sợ hãi khi bị cô lập?",
        category: "Tâm sự học đường",
        content: "Mình bị một nhóm bạn trong lớp thêu dệt chuyện sai sự thật rồi rủ cả lớp không ai nói chuyện với mình. Mỗi ngày đến trường với mình là một cơn ác mộng. Có bạn nào từng trải qua cảm giác này và vượt qua được không?",
        authorName: "Học sinh ẩn danh (Lớp 11)",
        isAnonymous: true,
        likesCount: 142,
        imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        comments: [
            {
                id: 1,
                authorName: "Nguyễn Minh Tuấn",
                isAnonymous: false,
                content: "Chào bạn! Mình từng ở trong hoàn cảnh tương tự năm lớp 9. Bạn đừng giấu một mình nhé, hãy tâm sự với thầy cô chủ nhiệm hoặc gọi cho Tổng đài 111.",
                createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
            }
        ]
    },
    {
        id: 2,
        title: "Quy định xử lý hành vi đe dọa đánh bạn học?",
        category: "Hỏi đáp pháp lý",
        content: "Em muốn hỏi theo Luật Trẻ em 2016 và Bộ luật Hình sự, những học sinh cấp 3 có hành vi bạo lực học đường tống tiền hoặc gây thương tích sẽ bị xử lý như thế nào?",
        authorName: "Trần Đức Anh",
        isAnonymous: false,
        likesCount: 89,
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        comments: []
    },
    {
        id: 3,
        title: "Bí quyết giúp con mở lòng khi bị bắt nạt (Dành cho Phụ huynh)",
        category: "Góc tư vấn phụ huynh",
        content: "Là cha mẹ, thấy con đi học về lầm lì, bỏ ăn và thương tích nhẹ trên tay nhưng hỏi con không nói. Sau đây là bài chia sẻ kinh nghiệm gia đình tôi đã kiên nhẫn đồng hành cùng con vượt qua.",
        authorName: "Phụ huynh giấu tên",
        isAnonymous: true,
        likesCount: 215,
        imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
        createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
        comments: []
    }
];

let newsList = [
    {
        id: 101,
        title: "5 Kỹ năng tự vệ an toàn khi đối mặt với bạo lực học đường",
        summary: "Hướng dẫn chi tiết các bước thoát hiểm, giữ bình tĩnh, ứng xử thông minh và tìm kiếm trợ giúp ngay lập tức khi bị nhóm bạn đe dọa.",
        category: "Kỹ năng phòng vệ",
        author: "Chuyên gia An ninh Học đường",
        readTime: "5 phút đọc",
        likesCount: 128,
        imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
        content: `Bắt nạt học đường không chỉ ảnh hưởng đến thể xác mà còn gây tổn thương tâm lý lâu dài. Sau đây là 5 nguyên tắc vàng giúp em tự bảo vệ bản thân:\n\n1. Giữ khoảng cách an toàn và bình tĩnh.\n2. Hét to và di chuyển về nơi đông người.\n3. Không chịu đựng một mình - Gửi Báo cáo Ẩn danh trên SafeSchool.\n4. Lưu lại bằng chứng.\n5. Gọi ngay hotline 111 khi khẩn cấp.`,
        comments: []
    },
    {
        id: 102,
        title: "Nhận diện Cyberbullying (Bắt nạt trên mạng) và cách chặn đứng tức thì",
        summary: "Cách xử lý khi bị lập group antifan, bôi nhọ ảnh cá nhân hoặc nhắn tin đe dọa trên Facebook, TikTok, Zalo.",
        category: "Tư vấn tâm lý",
        author: "ThS. Tâm lý Nguyễn Thanh Hà",
        readTime: "4 phút đọc",
        likesCount: 95,
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
        content: `Bắt nạt trên không gian mạng (Cyberbullying) có thể diễn ra 24/7 khiến học sinh căng thẳng tột độ.\n\nCác bước hành động ngay lập tức:\n- Không đáp trả.\n- Sử dụng công cụ Chặn & Báo cáo.\n- Thông báo với Ban tư vấn nhà trường qua SafeSchool.`,
        comments: []
    },
    {
        id: 103,
        title: "Luật Trẻ em 2016 và Quyền được bảo vệ của Học sinh trong Nhà trường",
        summary: "Những quy định pháp lý quan trọng mọi học sinh và phụ huynh cần biết để bảo vệ quyền lợi hợp pháp khi bị xâm hại hoặc bạo lực.",
        category: "Pháp lý học đường",
        author: "Luật sư Học đường Việt Nam",
        readTime: "6 phút đọc",
        likesCount: 156,
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
        content: `Theo Điều 37 Luật Trẻ em 2016, trẻ em có quyền được bảo vệ dưới mọi hình thức để không bị bạo lực, bỏ mặc. Mọi hành vi bao che bạo lực học đường đều vi phạm pháp luật.`,
        comments: []
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

    if (pathname.startsWith('/css/') || pathname.startsWith('/js/')) {
        const filePath = path.join(WWWROOT, pathname);
        if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath);
            const contentType = ext === '.css' ? 'text/css' : 'text/javascript';
            res.writeHead(200, { 'Content-Type': contentType });
            return fs.createReadStream(filePath).pipe(res);
        }
    }

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
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ sender: 'ai', message: aiText }));
        });
        return;
    }

    if (pathname === '/Forum' || pathname === '/' || pathname === '/News') {
        res.writeHead(302, { 'Location': '/docs/index.html' });
        return res.end();
    }

    if (pathname === '/docs/index.html' || pathname === '/docs') {
        const filePath = path.join(__dirname, 'docs', 'index.html');
        if (fs.existsSync(filePath)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            return fs.createReadStream(filePath).pipe(res);
        }
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
});

server.listen(PORT, () => {
    console.log(`SafeSchool Dev Web Server running at http://localhost:${PORT}`);
});
