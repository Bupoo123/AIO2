// 全局变量
let currentUser = null;
let currentCategory = 'all';
let currentSearch = '';

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', async () => {
    await initApp();
});

// 初始化应用
async function initApp() {
    // 检查登录状态
    const user = await checkAuth();
    if (user) {
        currentUser = user;
        showMainPage();
        await loadMainPageData();
    } else {
        showLoginPage();
    }

    // 绑定事件
    bindEvents();
}

// 显示登录页
function showLoginPage() {
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('mainPage').style.display = 'none';
}

// 显示主页面
function showMainPage() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'block';
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.username;
        if (currentUser.role === 'admin') {
            document.getElementById('adminBtn').style.display = 'block';
        }
    }
}

// 加载主页面数据
async function loadMainPageData() {
    try {
        // 加载工具列表
        await loadTools();
        
        // 加载分类列表
        const categories = await getCategories();
        renderCategories(categories);

        // 检查版本更新
        checkVersionUpdates().then(data => {
            if (data.updates && data.updates.length > 0) {
                showUpdateNotification(data.updates);
            }
        });
    } catch (error) {
        console.error('加载数据失败:', error);
    }
}

// 加载工具列表
async function loadTools() {
    try {
        const tools = await getTools(currentCategory === 'all' ? null : currentCategory, currentSearch || null);
        renderToolCards(tools);
    } catch (error) {
        console.error('加载工具失败:', error);
    }
}

// 绑定事件
function bindEvents() {
    // 登录/注册标签切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });

    // 登录表单
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const user = await login(username, password);
            currentUser = user;
            showMainPage();
            await loadMainPageData();
            showMessage('authMessage', '登录成功', 'success');
        } catch (error) {
            showMessage('authMessage', error.message, 'error');
        }
    });

    // 注册表单
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (password !== confirmPassword) {
            showMessage('authMessage', '两次输入的密码不一致', 'error');
            return;
        }

        try {
            const user = await register(username, email, password, confirmPassword);
            currentUser = user;
            showMainPage();
            await loadMainPageData();
            showMessage('authMessage', '注册成功', 'success');
        } catch (error) {
            showMessage('authMessage', error.message, 'error');
        }
    });

    // 搜索
    document.getElementById('searchInput').addEventListener('input', (e) => {
        currentSearch = e.target.value;
        loadTools();
    });

    // 分类筛选
    document.getElementById('categoryList').addEventListener('click', (e) => {
        if (e.target.classList.contains('category-item')) {
            e.preventDefault();
            document.querySelectorAll('.category-item').forEach(item => {
                item.classList.remove('active');
            });
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            loadTools();
        }
    });

    // 用户菜单
    document.getElementById('userMenuBtn').addEventListener('click', () => {
        const dropdown = document.getElementById('userDropdown');
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });

    // 个人信息
    document.getElementById('userInfoLink').addEventListener('click', (e) => {
        e.preventDefault();
        showUserInfo();
    });

    // 修改密码
    document.getElementById('changePasswordLink').addEventListener('click', (e) => {
        e.preventDefault();
        showChangePasswordModal();
    });

    // 退出登录
    document.getElementById('logoutLink').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    // 管理后台
    document.getElementById('adminBtn').addEventListener('click', () => {
        showAdminModal();
    });

    // 修改密码表单
    document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmPassword) {
            showMessage('passwordMessage', '两次输入的新密码不一致', 'error');
            return;
        }

        try {
            await changePassword(oldPassword, newPassword, confirmPassword);
            showMessage('passwordMessage', '密码修改成功', 'success');
            setTimeout(() => {
                closeChangePasswordModal();
            }, 1500);
        } catch (error) {
            showMessage('passwordMessage', error.message, 'error');
        }
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            document.getElementById('userDropdown').style.display = 'none';
        }
    });
}

// 切换标签
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    if (tab === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
    } else {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    }
}

// 显示用户信息
async function showUserInfo() {
    try {
        const user = await getCurrentUser();
        document.getElementById('infoUsername').textContent = user.username;
        document.getElementById('infoEmail').textContent = user.email;
        document.getElementById('infoRole').textContent = user.role === 'admin' ? '管理员' : '普通用户';
        document.getElementById('infoCreatedAt').textContent = new Date(user.created_at).toLocaleString('zh-CN');
        document.getElementById('infoLastLogin').textContent = user.last_login 
            ? new Date(user.last_login).toLocaleString('zh-CN')
            : '从未登录';
        document.getElementById('userInfoModal').style.display = 'flex';
    } catch (error) {
        alert('获取用户信息失败: ' + error.message);
    }
}

// 关闭用户信息模态框
function closeUserInfoModal() {
    document.getElementById('userInfoModal').style.display = 'none';
}

// 显示修改密码模态框
function showChangePasswordModal() {
    document.getElementById('changePasswordModal').style.display = 'flex';
    document.getElementById('changePasswordForm').reset();
    document.getElementById('passwordMessage').style.display = 'none';
}

// 关闭修改密码模态框
function closeChangePasswordModal() {
    document.getElementById('changePasswordModal').style.display = 'none';
    document.getElementById('changePasswordForm').reset();
}

// 显示版本更新通知
function showUpdateNotification(updates) {
    const notification = document.getElementById('updateNotification');
    const message = document.getElementById('updateMessage');
    const toolNames = updates.map(u => u.tool_name).join('、');
    message.textContent = `${toolNames} 有版本更新可用`;
    notification.style.display = 'flex';
}

// 显示管理后台
async function showAdminModal() {
    document.getElementById('adminModal').style.display = 'flex';
    await loadAdminTools();
}

// 关闭管理后台
function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
}

// 加载管理后台工具列表
async function loadAdminTools() {
    try {
        const tools = await getTools();
        const container = document.getElementById('adminToolsList');
        container.innerHTML = tools.map(tool => `
            <tr>
                <td>${escapeHtml(tool.name)}</td>
                <td>${escapeHtml(tool.category)}</td>
                <td>${escapeHtml(tool.version)}</td>
                <td>${tool.access === 'admin' ? '仅管理员' : '所有用户'}</td>
                <td>
                    <button class="btn btn-secondary" onclick="editTool('${tool._id}')">编辑</button>
                    <button class="btn btn-secondary" onclick="deleteToolConfirm('${tool._id}')">删除</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('加载工具列表失败:', error);
    }
}

// 显示添加工具表单
function showAddToolForm() {
    document.getElementById('toolFormTitle').textContent = '添加工具';
    document.getElementById('toolForm').reset();
    document.getElementById('toolForm').dataset.toolId = '';
    document.getElementById('toolFormModal').style.display = 'flex';
}

// 编辑工具
async function editTool(toolId) {
    try {
        const tool = await getToolById(toolId);
        document.getElementById('toolFormTitle').textContent = '编辑工具';
        document.getElementById('toolName').value = tool.name;
        document.getElementById('toolCategory').value = tool.category;
        document.getElementById('toolGithubUrl').value = tool.github_url;
        document.getElementById('toolIcon').value = tool.icon || '';
        document.getElementById('toolVersion').value = tool.version;
        document.getElementById('toolDescription').value = tool.description || '';
        document.getElementById('toolAccess').value = tool.access;
        document.getElementById('toolForm').dataset.toolId = toolId;
        document.getElementById('toolFormModal').style.display = 'flex';
    } catch (error) {
        alert('加载工具信息失败: ' + error.message);
    }
}

// 关闭工具表单模态框
function closeToolFormModal() {
    document.getElementById('toolFormModal').style.display = 'none';
    document.getElementById('toolForm').reset();
}

// 保存工具
document.getElementById('toolForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const toolId = e.target.dataset.toolId;
    const toolData = {
        name: document.getElementById('toolName').value,
        category: document.getElementById('toolCategory').value,
        github_url: document.getElementById('toolGithubUrl').value,
        icon: document.getElementById('toolIcon').value || '🔧',
        version: document.getElementById('toolVersion').value || '1.0.0',
        description: document.getElementById('toolDescription').value,
        access: document.getElementById('toolAccess').value
    };

    try {
        if (toolId) {
            await updateTool(toolId, toolData);
            showMessage('toolFormMessage', '工具更新成功', 'success');
        } else {
            await createTool(toolData);
            showMessage('toolFormMessage', '工具创建成功', 'success');
        }
        setTimeout(() => {
            closeToolFormModal();
            loadAdminTools();
            loadTools();
        }, 1500);
    } catch (error) {
        showMessage('toolFormMessage', error.message, 'error');
    }
});

// 删除工具确认
async function deleteToolConfirm(toolId) {
    if (!confirm('确定要删除这个工具吗？')) {
        return;
    }

    try {
        await deleteTool(toolId);
        alert('工具删除成功');
        loadAdminTools();
        loadTools();
    } catch (error) {
        alert('删除失败: ' + error.message);
    }
}

// 管理后台标签切换
document.querySelectorAll('#adminModal .tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        document.querySelectorAll('#adminModal .tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        if (tab === 'tools') {
            document.getElementById('adminTools').style.display = 'block';
            document.getElementById('adminUsers').style.display = 'none';
        } else {
            document.getElementById('adminTools').style.display = 'none';
            document.getElementById('adminUsers').style.display = 'block';
            // TODO: 加载用户列表
        }
    });
});

