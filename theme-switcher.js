// 主题切换器
class ThemeSwitcher {
    constructor() {
        this.currentTheme = localStorage.getItem('currentTheme') || 'warm-earth';
        this.themes = [];
        this.cacheBuster = Date.now().toString(36);
        this.init();
    }

    async init() {
        // 加载主题配置
        try {
            const response = await fetch(`themes.json?v=${this.cacheBuster}`);
            this.themes = await response.json();
            this.renderThemeSelector();
            this.applyTheme(this.currentTheme);
        } catch (error) {
            console.error('加载主题配置失败:', error);
            // 使用默认主题
            this.themes = {
                themes: [{
                    id: 'warm-earth',
                    name: '暖色大地',
                    path: 'themes/warm-earth'
                }],
                defaultTheme: 'warm-earth'
            };
            this.renderThemeSelector();
            this.applyTheme(this.currentTheme);
        }
    }

    renderThemeSelector() {
        const selector = document.getElementById('theme-selector');
        if (!selector) return;

        const themes = this.themes.themes || this.themes;
        
        themes.forEach(theme => {
            const option = document.createElement('div');
            option.className = `theme-option ${theme.id === this.currentTheme ? 'active' : ''}`;
            option.dataset.theme = theme.id;
            option.innerHTML = `
                <div class="theme-preview" style="background: ${theme.preview?.backgroundColor || '#F5F3F0'}">
                    <div class="theme-color-dot" style="background: ${theme.preview?.primaryColor || '#351D14'}"></div>
                    <div class="theme-color-dot" style="background: ${theme.preview?.accentColor || '#876635'}"></div>
                </div>
                <div class="theme-info">
                    <div class="theme-name">${theme.name}</div>
                    <div class="theme-desc">${theme.description || ''}</div>
                </div>
            `;
            option.addEventListener('click', () => this.switchTheme(theme.id));
            selector.appendChild(option);
        });
    }

    switchTheme(themeId) {
        if (themeId === this.currentTheme) return;
        
        this.currentTheme = themeId;
        localStorage.setItem('currentTheme', themeId);
        this.applyTheme(themeId);
        this.updateActiveState();
    }

    applyTheme(themeId) {
        const theme = (this.themes.themes || this.themes).find(t => t.id === themeId);
        if (!theme) return;

        // 更新所有 iframe 的 src
        const iframes = document.querySelectorAll('iframe');
        const pages = ['home', 'category', 'detail', 'cart', 'search', 'profile', 'orders'];
        
        iframes.forEach((iframe, index) => {
            if (pages[index]) {
                iframe.src = `${theme.path}/${pages[index]}.html?v=${this.cacheBuster}`;
            }
        });

        // 更新手机框架颜色（如果有主题特定的颜色）
        if (theme.preview?.primaryColor) {
            const phoneFrames = document.querySelectorAll('.phone-frame');
            phoneFrames.forEach(frame => {
                frame.style.background = theme.preview.primaryColor;
            });
            
            const notches = document.querySelectorAll('.notch');
            notches.forEach(notch => {
                notch.style.background = theme.preview.primaryColor;
            });
        }

        // 更新主题选择器的激活状态
        this.updateActiveState();
    }

    updateActiveState() {
        const options = document.querySelectorAll('.theme-option');
        options.forEach(option => {
            if (option.dataset.theme === this.currentTheme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
}

// 初始化主题切换器
let themeSwitcher;
document.addEventListener('DOMContentLoaded', () => {
    themeSwitcher = new ThemeSwitcher();
});

