// API 基础配置
// 开发环境使用 localhost，生产环境会自动使用相对路径或环境变量
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// 获取 token
function getToken() {
    return localStorage.getItem('token');
}

// 设置 token
function setToken(token) {
    localStorage.setItem('token', token);
}

// 移除 token
function removeToken() {
    localStorage.removeItem('token');
}

// API 请求封装
async function apiRequest(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '请求失败');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// 显示消息
function showMessage(elementId, message, type = 'success') {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `message ${type}`;
        element.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                element.style.display = 'none';
            }, 3000);
        }
    }
}

// 用户注册
async function register(employeeId, email, userType, password, confirmPassword) {
    try {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                employee_id: employeeId,
                username: employeeId, // 兼容后端旧的用户名校验
                email,
                user_type: userType,
                password,
                confirmPassword
            })
        });

        if (response.success) {
            setToken(response.data.token);
            return response.data.user;
        }
    } catch (error) {
        throw error;
    }
}

// 用户登录
async function login(username, password) {
    try {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        });

        if (response.success) {
            setToken(response.data.token);
            return response.data.user;
        }
    } catch (error) {
        throw error;
    }
}

// 获取当前用户信息
async function getCurrentUser() {
    try {
        const response = await apiRequest('/auth/me');
        if (response.success) {
            return response.data.user;
        }
    } catch (error) {
        removeToken();
        throw error;
    }
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

