// Supabase configuration
const SUPABASE_URL = "https://sygkebaaugyoxniuywet.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z2tlYmFhdWd5b3huaXV5d2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMTg3MjMsImV4cCI6MjA5OTU5NDcyM30.hDuck7LodeXbIPjFrnO1KuFbQgcQFAXX0y-V1-XbmMQ";

// Initialize Supabase Client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Auth session checker
function checkAuth() {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
        window.location.href = "index.html";
        return null;
    }
    try {
        const user = JSON.parse(userStr);
        return user;
    } catch (e) {
        window.location.href = "index.html";
        return null;
    }
}

// Format rupiah helper
function formatRupiah(value) {
    if (value === undefined || value === null) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Generate shared navigation and page setup
function initLayout(activePage) {
    const user = checkAuth();
    if (!user) return;

    // Check owner access for products & riwayat
    if ((activePage === "produk" || activePage === "riwayat") && user.role !== "owner") {
        alert("Akses ditolak. Menu ini hanya dapat diakses oleh Owner.");
        window.location.href = "dashboard.html";
        return;
    }

    // Inject mobile styles once
    if (!document.getElementById("shared-mobile-styles")) {
        const style = document.createElement("style");
        style.id = "shared-mobile-styles";
        style.textContent = `
            /* --- Mobile Sidebar --- */
            @media (max-width: 767px) {
                #sidebar {
                    position: fixed !important;
                    left: 0; top: 0; bottom: 0;
                    transform: translateX(-100%);
                    transition: transform 0.28s cubic-bezier(.4,0,.2,1);
                    z-index: 50;
                    width: 260px !important;
                    height: 100dvh !important;
                    overflow-y: auto;
                    box-shadow: 4px 0 24px rgba(0,0,0,.12);
                }
                #sidebar.sidebar-open {
                    display: block !important;
                    transform: translateX(0);
                }
                #sidebar-overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(15,23,42,0.5);
                    z-index: 49;
                    backdrop-filter: blur(2px);
                }
                #sidebar-overlay.sidebar-open {
                    display: block;
                }
                #hamburger-btn {
                    display: flex !important;
                }
                /* Push main content down slightly so hamburger doesn't overlap page title */
                body > main,
                body > div > main {
                    padding-top: 4rem !important;
                }
            }
            @media (min-width: 768px) {
                #hamburger-btn { display: none !important; }
            }
            #hamburger-btn { display: none; }
        `;
        document.head.appendChild(style);
    }

    // Inject dark overlay behind sidebar on mobile
    if (!document.getElementById("sidebar-overlay")) {
        const overlay = document.createElement("div");
        overlay.id = "sidebar-overlay";
        overlay.onclick = closeSidebar;
        document.body.appendChild(overlay);
    }

    // Inject floating hamburger button
    if (!document.getElementById("hamburger-btn")) {
        const btn = document.createElement("button");
        btn.id = "hamburger-btn";
        btn.setAttribute("aria-label", "Buka Menu Navigasi");
        btn.style.cssText = [
            "position:fixed",
            "top:12px",
            "left:12px",
            "z-index:60",
            "background:linear-gradient(135deg,#1e3a8a,#2563eb)",
            "color:white",
            "border:none",
            "border-radius:10px",
            "width:44px",
            "height:44px",
            "align-items:center",
            "justify-content:center",
            "box-shadow:0 4px 14px rgba(37,99,235,.45)",
            "cursor:pointer",
            "transition:transform .2s"
        ].join(";");
        btn.innerHTML = `<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>`;
        btn.onclick = toggleSidebar;
        document.body.appendChild(btn);
    }

    // Inject sidebar HTML content
    const sidebarEl = document.getElementById("sidebar");
    if (sidebarEl) {
        const isOwner = user.role === "owner";

        let menuItems = [
            { id: "dashboard", label: "Dashboard", href: "dashboard.html", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { id: "kasir", label: "Kasir", href: "kasir.html", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" }
        ];

        if (isOwner) {
            menuItems.push({ id: "produk", label: "Produk", href: "produk.html", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" });
        }

        menuItems.push({ id: "hutang", label: "Customer", href: "hutang.html", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" });

        if (isOwner) {
            menuItems.push({ id: "riwayat", label: "Riwayat", href: "riwayat.html", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" });
        }

        const listHtml = menuItems.map(item => {
            const isActive = item.id === activePage;
            const cls = isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
            return `
                <a href="${item.href}" onclick="closeSidebar()" class="flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 font-medium ${cls}">
                    <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="${item.icon}" />
                    </svg>
                    <span>${item.label}</span>
                </a>
            `;
        }).join("");

        sidebarEl.innerHTML = `
            <div class="h-full flex flex-col justify-between py-6 px-4">
                <div>
                    <div class="flex items-center gap-3 px-2 mb-8">
                        <img src="logo.png" alt="Logo" class="h-11 w-11 rounded-xl object-contain flex-shrink-0">
                        <div>
                            <h2 class="font-bold text-slate-800 text-base leading-tight">Arrahma POS</h2>
                            <span class="text-xs text-gray-500 font-medium">Sistem Kasir Toko</span>
                        </div>
                    </div>
                    <nav class="space-y-1">${listHtml}</nav>
                </div>
                <div class="border-t pt-4">
                    <div class="flex items-center gap-3 px-2 mb-4 min-w-0">
                        <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm flex-shrink-0">
                            ${user.nama.substring(0, 2).toUpperCase()}
                        </div>
                        <div class="overflow-hidden min-w-0">
                            <h4 class="font-semibold text-slate-800 text-sm truncate">${user.nama}</h4>
                            <span class="text-xs text-slate-400 capitalize font-medium">${user.role}</span>
                        </div>
                    </div>
                    <button onclick="logout()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition duration-200 font-semibold text-sm">
                        <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        `;
    }

    // Populate greeting banner if present on page
    const greetingEl = document.getElementById("profile-greeting");
    if (greetingEl) {
        const hour = new Date().getHours();
        let waktu = "Pagi";
        if (hour >= 12 && hour < 15) waktu = "Siang";
        else if (hour >= 15 && hour < 18) waktu = "Sore";
        else if (hour >= 18 || hour < 4) waktu = "Malam";
        greetingEl.innerHTML = `Selamat ${waktu}, <span class="font-bold">${user.nama}</span>!`;
    }
}

// Toggle sidebar for mobile
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (!sidebar) return;
    sidebar.classList.toggle("sidebar-open");
    if (overlay) overlay.classList.toggle("sidebar-open");
}

function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    if (sidebar) sidebar.classList.remove("sidebar-open");
    if (overlay) overlay.classList.remove("sidebar-open");
}

// Log out user
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}
