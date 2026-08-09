using SafeSchoolApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Đăng ký các dịch vụ MVC và Session
builder.Services.AddControllersWithViews();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Đăng ký Dependency Injection (DI) cho các Services nghiệp vụ
builder.Services.AddSingleton<INewsService, NewsService>();
builder.Services.AddSingleton<IReportService, ReportService>();
builder.Services.AddSingleton<IForumService, ForumService>();
builder.Services.AddSingleton<IAiSupportService, AiSupportService>();

var app = builder.Build();

// Cấu hình Middleware Pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSession();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
