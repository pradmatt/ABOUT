let expenses = [];
        let currentFilter = 'all';

        function addExpense() {
            const description = document.getElementById('description').value.trim();
            const amount = parseFloat(document.getElementById('amount').value);
            const category = document.getElementById('category').value;

            if (!description || !amount || amount <= 0) {
                alert('Zəhmət olmasa, bütün sahələri düzgün doldurun!');
                return;
            }

            const expense = {
                id: Date.now(),
                description,
                amount,
                category,
                date: new Date().toLocaleDateString('az-AZ'),
                timestamp: new Date()
            };

            expenses.push(expense);
            
            // Clear form
            document.getElementById('description').value = '';
            document.getElementById('amount').value = '';
            
            updateStats();
            renderExpenses();
        }

        function deleteExpense(id) {
            if (confirm('Bu xərci silmək istədiyinizə əminsiniz?')) {
                expenses = expenses.filter(expense => expense.id !== id);
                updateStats();
                renderExpenses();
            }
        }

        function updateStats() {
            const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            const count = expenses.length;
            const average = count > 0 ? total / count : 0;
            
            const today = new Date().toLocaleDateString('az-AZ');
            const todayTotal = expenses
                .filter(expense => expense.date === today)
                .reduce((sum, expense) => sum + expense.amount, 0);

            document.getElementById('totalExpenses').textContent = total.toFixed(2) + ' ₼';
            document.getElementById('totalCount').textContent = count;
            document.getElementById('avgExpense').textContent = average.toFixed(2) + ' ₼';
            document.getElementById('todayExpenses').textContent = todayTotal.toFixed(2) + ' ₼';
        }

        function renderExpenses() {
            const expensesList = document.getElementById('expensesList');
            let filteredExpenses = expenses;

            if (currentFilter !== 'all') {
                filteredExpenses = expenses.filter(expense => expense.category === currentFilter);
            }

            if (filteredExpenses.length === 0) {
                expensesList.innerHTML = `
                    <div class="no-expenses">
                        <p>${currentFilter === 'all' ? 'Hələ heç bir xərc əlavə edilməyib.' : 'Bu kateqoriyada xərc tapılmadı.'}</p>
                    </div>
                `;
                return;
            }

            const expensesHTML = filteredExpenses
                .sort((a, b) => b.timestamp - a.timestamp)
                .map(expense => {
                    const categoryIcon = getCategoryIcon(expense.category);
                    return `
                        <div class="expense-item">
                            <span>${categoryIcon} ${expense.description}</span>
                            <span>${expense.category}</span>
                            <span>${expense.date}</span>
                            <span class="amount">${expense.amount.toFixed(2)} ₼</span>
                            <button class="btn btn-danger" onclick="deleteExpense(${expense.id})">Sil</button>
                        </div>
                    `;
                })
                .join('');

            expensesList.innerHTML = expensesHTML;
        }

        function getCategoryIcon(category) {
            const icons = {
                'Yemək': '🍽️',
                'Nəqliyyat': '🚗',
                'Alış-veriş': '🛍️',
                'Əyləncə': '🎮',
                'Sağlamlıq': '🏥',
                'Təhsil': '📚',
                'Kommunal': '🏠',
                'Digər': '📦'
            };
            return icons[category] || '📦';
        }

        function filterExpenses(category) {
            currentFilter = category;
            
            // Update filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            renderExpenses();
        }

        // Allow adding expense with Enter key
        document.getElementById('amount').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addExpense();
            }
        });

        document.getElementById('description').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addExpense();
            }
        });

        // Initialize
        updateStats();
        renderExpenses();