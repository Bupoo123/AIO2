const API_BASE_URL =
    window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api'
        : '/api';

function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
}

async function apiRequest(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "请求失败");
    }

    return data;
}

// 登录
async function login(username, password) {
    const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });

    if (res.success) {
        setToken(res.data.token);
        return res.data.user;
    }
}

// 注册
async function register(employeeId, email, userType, password, confirmPassword) {
    const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            employee_id: employeeId,
            username: employeeId,
            email,
            user_type: userType,
            password,
            confirmPassword
        })
    });

    if (res.success) {
        setToken(res.data.token);
        return res.data.user;
    }
}

async function getCurrentUser() {
    const res = await apiRequest('/auth/me');
    return res.data.user;
}

// 修改密码
async function changePassword(oldPassword, newPassword, confirmPassword) {
    try {
        const response = await apiRequest('/auth/password', {
            method: 'PUT',
            body: JSON.stringify({
                oldPassword,
                newPassword,
                confirmPassword
            })
        });

        return response;
    } catch (error) {
        throw error;
    }
}

// 退出登录
function logout() {
    removeToken();
    window.location.reload();
}

// 修改邮箱
async function updateEmail(newEmail) {
    try {
        const response = await apiRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify({ email: newEmail })
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// 检查登录状态
async function checkAuth() {
    const token = getToken();
    if (!token) {
        return false;
    }

    try {
        const user = await getCurrentUser();
        return user;
    } catch (error) {
        return false;
    }
}
