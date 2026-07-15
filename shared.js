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

    // Modern styling setup: import Fonts and Tailwind custom directives if needed
    // However, Tailwind CDN is already loaded in HTML.

    // Inject sidebar
    const sidebarEl = document.getElementById("sidebar");
    if (sidebarEl) {
        const isOwner = user.role === "owner";

        let menuItems = [
            { id: "dashboard", label: "Dashboard", href: "dashboard.html", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { id: "kasir", label: "Kasir", href: "kasir.html", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" }
        ];

        // Owner only menu
        if (isOwner) {
            menuItems.push({ id: "produk", label: "Produk", href: "produk.html", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" });
        }

        menuItems.push({ id: "hutang", label: "Customer", href: "hutang.html", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" });

        // Owner only: Riwayat Transaksi
        if (isOwner) {
            menuItems.push({ id: "riwayat", label: "Riwayat Transaksi", href: "riwayat.html", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" });
        }

        let listHtml = menuItems.map(item => {
            const isActive = item.id === activePage;
            const bgClass = isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
            return `
                <a href="${item.href}" class="flex items-center gap-4 px-4 py-3 rounded-xl transition duration-200 font-medium ${bgClass}">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="${item.icon}" />
                    </svg>
                    <span>${item.label}</span>
                </a>
            `;
        }).join("");

        sidebarEl.innerHTML = `
            <div class="h-full flex flex-col justify-between py-6 px-4">
                <div>
                    <!-- Logo / Brand -->
                    <div class="flex items-center gap-3 px-3 mb-8">
                        <img src="logo.png" alt="Logo Toko Arrahma" class="h-12 w-12 rounded-xl object-contain">
                        <div>
                            <h2 class="font-bold text-slate-800 text-lg leading-tight">Arrahma POS</h2>
                            <span class="text-xs text-gray-500 font-medium">Sistem Kasir Toko</span>
                        </div>
                    </div>

                    <!-- Navigation Links -->
                    <nav class="space-y-1">
                        ${listHtml}
                    </nav>
                </div>

                <!-- Footer: User Profile & Logout -->
                <div class="border-t pt-4">
                    <div class="flex items-center gap-3 px-3 mb-4">
                        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                            ${user.nama.substring(0, 2).toUpperCase()}
                        </div>
                        <div class="overflow-hidden">
                            <h4 class="font-semibold text-slate-800 truncate">${user.nama}</h4>
                            <span class="text-xs text-slate-400 capitalize font-medium">${user.role}</span>
                        </div>
                    </div>
                    <button onclick="logout()" class="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition duration-200 font-semibold">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        `;
    }

    // Populate standard user profile greeting inside current page banner if container exists
    const greetingEl = document.getElementById("profile-greeting");
    if (greetingEl) {
        const hour = new Date().getHours();
        let waktu = "Pagi";
        if (hour >= 12 && hour < 15) waktu = "Siang";
        else if (hour >= 15 && hour < 18) waktu = "Sore";
        else if (hour >= 18 || hour < 4) waktu = "Malam";
        greetingEl.innerHTML = `Selamat ${waktu}, <span class="font-bold text-slate-800">${user.nama}</span>!`;
    }
}

// Log out user
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}
