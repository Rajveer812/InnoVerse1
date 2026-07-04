document.addEventListener('DOMContentLoaded', () => {
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Toggle forms
    showRegisterBtn.addEventListener('click', () => {
        loginFormContainer.classList.remove('active-form');
        loginFormContainer.classList.add('hidden-form');
        setTimeout(() => {
            registerFormContainer.classList.remove('hidden-form');
            registerFormContainer.classList.add('active-form');
        }, 300);
    });

    showLoginBtn.addEventListener('click', () => {
        registerFormContainer.classList.remove('active-form');
        registerFormContainer.classList.add('hidden-form');
        setTimeout(() => {
            loginFormContainer.classList.remove('hidden-form');
            loginFormContainer.classList.add('active-form');
        }, 300);
    });

    // Helper functions
    function setLoading(isLoading) {
        if (isLoading) {
            loadingOverlay.classList.remove('hidden');
            loadingOverlay.classList.add('flex');
            loadingOverlay.classList.add('flex');
        } else {
            loadingOverlay.classList.add('hidden');
            loadingOverlay.classList.remove('flex');
        }
    }



    // Login Submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                window.showToast('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                window.showToast(data.error || 'Login failed.', 'error');
                setLoading(false);
            }
        } catch (err) {
            window.showToast('Network error. Please try again later.', 'error');
            setLoading(false);
        }
    });

    // Register Submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;

        setLoading(true);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();

            if (res.ok) {
                window.showToast('Account created! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                window.showToast(data.error || 'Registration failed.', 'error');
                setLoading(false);
            }
        } catch (err) {
            window.showToast('Network error. Please try again later.', 'error');
            setLoading(false);
        }
    });
});
