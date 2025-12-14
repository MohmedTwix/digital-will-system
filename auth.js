// Central authentication and simple storage helpers (for demo purposes)
const AuthSystem = (function() {
	const USERS_KEY = 'dws_users'; // demo users
	const CURRENT_KEY = 'currentUser';

	function loadUsers() {
		const raw = localStorage.getItem(USERS_KEY);
		return raw ? JSON.parse(raw) : [];
	}

	function saveUsers(users) {
		localStorage.setItem(USERS_KEY, JSON.stringify(users));
	}

	return {
		isAuthenticated() {
			return !!localStorage.getItem(CURRENT_KEY);
		},

		getUser() {
			const raw = localStorage.getItem(CURRENT_KEY);
			return raw ? JSON.parse(raw) : null;
		},

		login(email, password) {
			// demo: accept any credential or match registered users
			const users = loadUsers();
			const found = users.find(u => u.email === email && (u.password === password || password === ''));
			if (found) {
				localStorage.setItem(CURRENT_KEY, JSON.stringify({ name: found.name || found.email.split('@')[0], email: found.email }));
				return { success: true };
			}

			// fallback: allow login with any email/password (demo mode)
			localStorage.setItem(CURRENT_KEY, JSON.stringify({ name: email.split('@')[0], email }));
			return { success: true };
		},

		logout() {
			localStorage.removeItem(CURRENT_KEY);
		},

		register(name, email, password) {
			const users = loadUsers();
			if (users.find(u => u.email === email)) {
				return { success: false, message: 'البريد مسجل سابقاً' };
			}
			users.push({ name, email, password });
			saveUsers(users);
			// auto-login
			localStorage.setItem(CURRENT_KEY, JSON.stringify({ name, email }));
			return { success: true };
		},

		// helpers to store per-user records
		storageKey(suffix) {
			const u = this.getUser();
			const email = u ? u.email : 'guest';
			return `${email}_${suffix}`;
		}
	};
})();

// simple guard for pages
function requireAuth(redirect = 'login.html') {
	if (!AuthSystem.isAuthenticated()) {
		window.location.href = redirect;
	}
}

// export for old pages that may call AuthSystem directly
window.AuthSystem = AuthSystem;
