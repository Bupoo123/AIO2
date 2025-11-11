// 获取工具列表
async function getTools(category = null, search = null) {
    try {
        let url = '/tools';
        const params = new URLSearchParams();
        if (category && category !== 'all') {
            params.append('category', category);
        }
        if (search) {
            params.append('search', search);
        }
        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await apiRequest(url);
        if (response.success) {
            return response.data.tools;
        }
    } catch (error) {
        console.error('获取工具列表失败:', error);
        throw error;
    }
}

// 获取工具分类
async function getCategories() {
    try {
        const response = await apiRequest('/tools/categories');
        if (response.success) {
            return response.data.categories;
        }
    } catch (error) {
        console.error('获取分类失败:', error);
        throw error;
    }
}

// 获取工具详情
async function getToolById(toolId) {
    try {
        const response = await apiRequest(`/tools/${toolId}`);
        if (response.success) {
            return response.data.tool;
        }
    } catch (error) {
        console.error('获取工具详情失败:', error);
        throw error;
    }
}

// 创建工具（管理员）
async function createTool(toolData) {
    try {
        const response = await apiRequest('/tools', {
            method: 'POST',
            body: JSON.stringify(toolData)
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// 更新工具（管理员）
async function updateTool(toolId, toolData) {
    try {
        const response = await apiRequest(`/tools/${toolId}`, {
            method: 'PUT',
            body: JSON.stringify(toolData)
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// 删除工具（管理员）
async function deleteTool(toolId) {
    try {
        const response = await apiRequest(`/tools/${toolId}`, {
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        throw error;
    }
}

// 检查版本更新
async function checkVersionUpdates(toolId = null) {
    try {
        let url = '/version/check';
        if (toolId) {
            url += `?toolId=${toolId}`;
        }
        const response = await apiRequest(url);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        console.error('检查版本失败:', error);
        throw error;
    }
}

// 渲染工具卡片
function renderToolCards(tools) {
    const container = document.getElementById('toolCards');
    const emptyState = document.getElementById('emptyState');

    if (!tools || tools.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    container.innerHTML = tools.map(tool => `
        <div class="tool-card" onclick="openTool('${tool._id}')">
            <div class="tool-icon">${tool.icon || '🔧'}</div>
            <div class="tool-name">${escapeHtml(tool.name)}</div>
            <div class="tool-description">${escapeHtml(tool.description || '暂无描述')}</div>
            <div class="tool-meta">
                <span class="tool-category">${escapeHtml(tool.category)}</span>
                <span class="tool-version">v${escapeHtml(tool.version)}</span>
            </div>
        </div>
    `).join('');
}

// 渲染分类列表
function renderCategories(categories) {
    const container = document.getElementById('categoryList');
    const allItem = '<li><a href="#" data-category="all" class="category-item active">全部</a></li>';
    const categoryItems = categories.map(cat => 
        `<li><a href="#" data-category="${escapeHtml(cat)}" class="category-item">${escapeHtml(cat)}</a></li>`
    ).join('');
    container.innerHTML = allItem + categoryItems;
}

// 打开工具（在新标签页打开）
function openTool(toolId) {
    getToolById(toolId).then(tool => {
        // 直接在新标签页打开工具
        window.open(tool.github_url, '_blank');
    }).catch(error => {
        alert('加载工具失败: ' + error.message);
    });
}

// 关闭工具模态框（保留函数以防需要，但不再使用）
function closeToolModal() {
    const modal = document.getElementById('toolModal');
    const iframe = document.getElementById('toolIframe');
    modal.style.display = 'none';
    iframe.src = '';
}

// HTML 转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

