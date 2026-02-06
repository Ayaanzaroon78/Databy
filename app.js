// ============================================
// QueryOptim - JavaScript Application
// ============================================

class QueryOptimizer {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.initializeDemo();
    }

    initializeElements() {
        // Navigation
        this.navItems = document.querySelectorAll('.nav-item');
        this.views = document.querySelectorAll('.view');

        // Query Input
        this.queryInput = document.getElementById('query-input');
        this.analyzeBtn = document.getElementById('analyze-btn');
        
        // Results
        this.emptyResults = document.getElementById('empty-results');
        this.resultsContent = document.getElementById('results-content');
        
        // Metrics
        this.execTime = document.getElementById('exec-time');
        this.rowsScanned = document.getElementById('rows-scanned');
        this.bufferHits = document.getElementById('buffer-hits');
        this.costEstimate = document.getElementById('cost-estimate');
        
        // Other elements
        this.optimizedQuery = document.getElementById('optimized-query');
        this.planTree = document.getElementById('plan-tree');
    }

    attachEventListeners() {
        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Query input tracking
        this.queryInput.addEventListener('input', () => this.updateQueryStats());

        // Analyze button
        this.analyzeBtn.addEventListener('click', () => this.analyzeQuery());

        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.copyToClipboard(e));
        });

        // Enter key in textarea (Ctrl+Enter to analyze)
        this.queryInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.analyzeQuery();
            }
        });
    }

    handleNavigation(e) {
        const targetView = e.currentTarget.dataset.view;
        
        // Update active nav item
        this.navItems.forEach(item => item.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Update active view
        this.views.forEach(view => view.classList.remove('active'));
        document.getElementById(`${targetView}-view`).classList.add('active');
    }

    updateQueryStats() {
        const text = this.queryInput.value;
        const lines = text.split('\n').length;
        const chars = text.length;
        
        const lineCount = document.querySelector('.info-value:nth-of-type(1)');
        const charCount = document.querySelector('.info-value:nth-of-type(2)');
        
        if (lineCount) lineCount.textContent = lines;
        if (charCount) charCount.textContent = chars;
        
        // Update line numbers
        this.updateLineNumbers(lines);
    }

    updateLineNumbers(count) {
        const gutter = document.querySelector('.editor-gutter');
        if (!gutter) return;
        
        const currentCount = gutter.querySelectorAll('.line-number').length;
        
        if (count > currentCount) {
            for (let i = currentCount + 1; i <= count; i++) {
                const lineNum = document.createElement('span');
                lineNum.className = 'line-number';
                lineNum.textContent = i;
                gutter.appendChild(lineNum);
            }
        } else if (count < currentCount) {
            const lineNumbers = gutter.querySelectorAll('.line-number');
            for (let i = count; i < currentCount; i++) {
                lineNumbers[i].remove();
            }
        }
    }

    analyzeQuery() {
        const query = this.queryInput.value.trim();
        
        if (!query) {
            this.showNotification('Please enter a SQL query', 'warning');
            return;
        }

        // Show loading state
        this.analyzeBtn.innerHTML = '<span class="btn-text">Analyzing...</span>';
        this.analyzeBtn.disabled = true;

        // Simulate analysis (in real app, this would call backend API)
        setTimeout(() => {
            this.displayResults();
            this.analyzeBtn.innerHTML = '<span class="btn-text">Analyze Query</span><span class="btn-arrow">→</span>';
            this.analyzeBtn.disabled = false;
            this.showNotification('Analysis complete!', 'success');
        }, 1500);
    }

    displayResults() {
        // Hide empty state, show results
        this.emptyResults.style.display = 'none';
        this.resultsContent.style.display = 'block';

        // Populate metrics with demo data
        this.animateMetric(this.execTime, '142ms');
        this.animateMetric(this.rowsScanned, '2.3M');
        this.animateMetric(this.bufferHits, '95.2%');
        this.animateMetric(this.costEstimate, '1,247');

        // Display optimized query
        const query = this.queryInput.value;
        this.optimizedQuery.textContent = this.generateOptimizedQuery(query);

        // Generate query plan visualization
        this.renderQueryPlan();
    }

    animateMetric(element, finalValue) {
        element.textContent = '--';
        
        setTimeout(() => {
            element.style.transform = 'scale(1.1)';
            element.textContent = finalValue;
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }, 300);
    }

    generateOptimizedQuery(originalQuery) {
        // Simple optimization example (in real app, backend would do this)
        return `-- Optimized with indexes
-- Estimated improvement: 45% faster

${originalQuery}

-- Recommended indexes:
-- CREATE INDEX idx_users_created_at ON users(created_at);
-- CREATE INDEX idx_orders_user_id ON orders(user_id);`;
    }

    renderQueryPlan() {
        const planHTML = `
            <div class="plan-node" style="animation: fadeIn 0.6s ease-out">
                <div class="plan-node-header" style="padding: 12px; background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 6px; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 700; color: var(--accent-primary);">→ Limit</span>
                        <span style="font-size: 12px; color: var(--text-muted);">Cost: 1,247 | Rows: 100</span>
                    </div>
                </div>
                
                <div style="margin-left: 24px; border-left: 2px solid var(--border-primary); padding-left: 16px;">
                    <div class="plan-node-header" style="padding: 12px; background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 6px; margin-bottom: 16px; animation: fadeIn 0.6s ease-out 0.1s both;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 700; color: var(--accent-secondary);">→ Sort</span>
                            <span style="font-size: 12px; color: var(--text-muted);">Cost: 1,189 | Rows: 2,340</span>
                        </div>
                        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Sort Key: order_count DESC</div>
                    </div>
                    
                    <div style="margin-left: 24px; border-left: 2px solid var(--border-primary); padding-left: 16px;">
                        <div class="plan-node-header" style="padding: 12px; background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 6px; margin-bottom: 16px; animation: fadeIn 0.6s ease-out 0.2s both;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="font-weight: 700; color: var(--accent-warning);">→ Hash Aggregate</span>
                                <span style="font-size: 12px; color: var(--text-muted);">Cost: 987 | Rows: 2,340</span>
                            </div>
                            <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Group Key: users.id, users.name</div>
                        </div>
                        
                        <div style="margin-left: 24px; border-left: 2px solid var(--border-primary); padding-left: 16px;">
                            <div class="plan-node-header" style="padding: 12px; background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 6px; margin-bottom: 16px; animation: fadeIn 0.6s ease-out 0.3s both;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-weight: 700;">→ Hash Left Join</span>
                                    <span style="font-size: 12px; color: var(--text-muted);">Cost: 756 | Rows: 45,890</span>
                                </div>
                                <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Hash Cond: (users.id = orders.user_id)</div>
                            </div>
                            
                            <div style="margin-left: 24px; display: grid; gap: 12px;">
                                <div class="plan-node-header" style="padding: 12px; background: var(--bg-tertiary); border: 1px solid var(--accent-error); border-radius: 6px; animation: fadeIn 0.6s ease-out 0.4s both;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-weight: 700; color: var(--accent-error);">⚠ Seq Scan on users</span>
                                        <span style="font-size: 12px; color: var(--text-muted);">Cost: 523 | Rows: 2,340,000</span>
                                    </div>
                                    <div style="font-size: 12px; color: var(--accent-error); margin-top: 4px;">Filter: (created_at > '2024-01-01')</div>
                                </div>
                                
                                <div class="plan-node-header" style="padding: 12px; background: var(--bg-tertiary); border: 1px solid var(--border-primary); border-radius: 6px; animation: fadeIn 0.6s ease-out 0.5s both;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-weight: 700;">→ Index Scan on orders</span>
                                        <span style="font-size: 12px; color: var(--text-muted);">Cost: 189 | Rows: 45,890</span>
                                    </div>
                                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Index: idx_orders_user_id</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.planTree.innerHTML = planHTML;
    }

    copyToClipboard(e) {
        const codeBlock = e.target.closest('.code-block');
        const code = codeBlock.querySelector('code').textContent;
        
        navigator.clipboard.writeText(code).then(() => {
            const btn = e.target.closest('.copy-btn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>✓</span>';
            btn.style.color = 'var(--accent-primary)';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.color = '';
            }, 2000);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        const colors = {
            success: 'var(--accent-primary)',
            warning: 'var(--accent-warning)',
            error: 'var(--accent-error)',
            info: 'var(--accent-secondary)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 24px;
            padding: 16px 24px;
            background: var(--bg-card);
            border: 1px solid ${colors[type]};
            border-radius: 6px;
            color: ${colors[type]};
            font-family: var(--font-mono);
            font-size: 14px;
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    initializeDemo() {
        // Add demo query for testing
        const demoQuery = `SELECT users.name, COUNT(orders.id) as order_count
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE users.created_at > '2024-01-01'
GROUP BY users.id, users.name
ORDER BY order_count DESC
LIMIT 100;`;
        
        // Uncomment to auto-fill demo query
        // this.queryInput.value = demoQuery;
        // this.updateQueryStats();
    }
}

// Additional CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new QueryOptimizer();
    
    // Add welcome message
    console.log('%c[QueryOptim] Application initialized', 'color: #00ff9f; font-weight: bold;');
    console.log('%cPostgreSQL Query Optimizer v1.0.0', 'color: #8b949e;');
});

// Service Worker registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker registration can be added here
    });
}
