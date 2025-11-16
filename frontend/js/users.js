// 获取用户列表（管理员）
async function getUsers() {
    try {
        const response = await apiRequest('/users');
        if (response.success) {
            return response.data.users;
        }
    } catch (error) {
        console.error('获取用户列表失败:', error);
        throw error;
    }
}

// 更新用户角色（管理员）
async function updateUserRole(userId, role) {
    try {
        const response = await apiRequest(`/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role })
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// 重置用户登录尝试（管理员）
async function resetUserLogin(userId) {
    try {
        const response = await apiRequest(`/users/${userId}/reset-login`, {
            method: 'PUT'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// 删除用户（管理员）
async function deleteUser(userId) {
    try {
        const response = await apiRequest(`/users/${userId}`, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// 渲染用户列表
function renderUserList(users, currentUserId) {
    const container = document.getElementById('adminUsersList');
    
    if (!users || users.length === 0) {
        container.innerHTML = '<tr><td colspan="6" style="text-align: center;">暂无用户</td></tr>';
        return;
    }

    container.innerHTML = users.map(user => {
        const isCurrentUser = user._id === currentUserId;
        const roleText = user.role === 'admin' ? '管理员' : '普通用户';
        const roleClass = user.role === 'admin' ? 'role-admin' : 'role-user';
        const createdDate = new Date(user.created_at).toLocaleString('zh-CN');
        const lastLogin = user.last_login 
            ? new Date(user.last_login).toLocaleString('zh-CN')
            : '从未登录';
        
        return `
            <tr>
                <td>${escapeHtml(user.username || user.employee_id || '')}</td>
                <td>${escapeHtml(user.email)}</td>
                <td>
                    <select class="role-select" data-user-id="${user._id}" ${isCurrentUser ? 'disabled' : ''}>
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>普通用户</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>管理员</option>
                    </select>
                </td>
                <td>${user.user_type || '非研发'}</td>
                <td>${createdDate}</td>
                <td>
                    ${isCurrentUser 
                        ? '<span style="color: #999;">当前用户</span>' 
                        : `
                            <button class="btn btn-secondary" onclick="resetUserLoginConfirm('${user._id}')">重置登录</button>
                            <button class="btn btn-secondary" onclick="deleteUserConfirm('${user._id}', '${escapeHtml(user.username)}')">删除</button>
                        `
                    }
                </td>
            </tr>
        `;
    }).join('');

    // 绑定角色选择事件
    container.querySelectorAll('.role-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const userId = e.target.dataset.userId;
            const newRole = e.target.value;
            
            if (!confirm(`确定要将用户角色修改为"${newRole === 'admin' ? '管理员' : '普通用户'}"吗？`)) {
                // 恢复原值
                e.target.value = users.find(u => u._id === userId).role;
                return;
            }

            try {
                await updateUserRole(userId, newRole);
                alert('用户角色更新成功');
                await loadAdminUsers();
            } catch (error) {
                alert('更新失败: ' + error.message);
                // 恢复原值
                e.target.value = users.find(u => u._id === userId).role;
            }
        });
    });
}

// 重置用户登录确认
async function resetUserLoginConfirm(userId) {
    if (!confirm('确定要重置该用户的登录尝试次数吗？这将解除账户锁定。')) {
        return;
    }

    try {
        await resetUserLogin(userId);
        alert('登录尝试次数已重置');
        await loadAdminUsers();
    } catch (error) {
        alert('重置失败: ' + error.message);
    }
}

// 删除用户确认
async function deleteUserConfirm(userId, username) {
    if (!confirm(`确定要删除用户"${username}"吗？此操作不可恢复！`)) {
        return;
    }

    try {
        await deleteUser(userId);
        alert('用户删除成功');
        await loadAdminUsers();
    } catch (error) {
        alert('删除失败: ' + error.message);
    }
}

// HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

