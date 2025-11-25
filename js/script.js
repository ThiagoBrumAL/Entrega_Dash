document.addEventListener('DOMContentLoaded', () => {

    // ===============================================
    // 0. Funcionalidade de Dark/Light Mode
    // ===============================================
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlEl = document.documentElement; // Usar <html> para o dark mode

    // Função para aplicar o tema e atualizar o ícone
    function applyTheme(isDarkMode) {
        if (isDarkMode) {
            htmlEl.classList.add('dark');
            if (themeToggleBtn) {
                themeToggleBtn.querySelector('i').className = 'fas fa-moon'; // Ícone de lua
            }
        } else {
            htmlEl.classList.remove('dark');
            if (themeToggleBtn) {
                themeToggleBtn.querySelector('i').className = 'fas fa-sun'; // Ícone de sol
            }
        }
    }

    // Carregar preferência ao iniciar
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        // Se houver preferência salva, usa ela
        applyTheme(savedTheme === 'dark');
    } else {
        // Se não houver, usa a preferência do sistema operacional
        applyTheme(prefersDark);
    }

    // Listener para o clique no botão de alternância
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isCurrentlyDark = htmlEl.classList.contains('dark');

            // Alterna o tema
            applyTheme(!isCurrentlyDark);

            // Salva a nova preferência
            localStorage.setItem('theme', !isCurrentlyDark ? 'dark' : 'light');
        });
    }


    // ===============================================
    // 1. Funcionalidade de Colapsar/Expandir a Sidebar
    // ===============================================
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    const overlay = document.getElementById('sidebar-overlay');

    if (toggleBtn && sidebar && overlay) {
        toggleBtn.addEventListener('click', () => {
            const isMobile = window.matchMedia('(max-width: 768px)').matches;

            if (isMobile) {
                sidebar.classList.toggle('-translate-x-full');
                overlay.classList.toggle('hidden');
            }
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        });
    }

    // ===============================================
    // 2. Funcionalidade de Dropdown do Menu (Submenus)
    // ===============================================
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault(); // Previne navegação para o link pai

            const navItem = this.closest('.nav-item');

            // Alterna a classe 'expanded' no item pai
            navItem.classList.toggle('expanded');

            // Nota: a animação do submenu é controlada pelo CSS (max-height)
        });
    });


    // ===============================================
    // 3. Lógica específica para a página de Gráficos (graficos.html)
    // ===============================================
    // ===============================================
    // 3. Lógica específica para a página de Gráficos (graficos.html)
    // ===============================================
    if (document.getElementById('growthChart')) {
        renderCharts();
    }

    function renderCharts() {
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false
        };

        // 1. Gráfico Principal - Linha com Previsão (Futuro)
        new Chart(document.getElementById('growthChart'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: 'Leads Reais',
                    data: [120, 150, 180, 90, 130, 200, null, null, null, null, null, null],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3
                }, {
                    label: 'Previsão',
                    data: [null, null, null, null, null, 200, 230, 260, 290, 320, 350, 380],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderDash: [5, 5],
                    borderWidth: 2
                }]
            },
            options: chartOptions
        });

        // 2. Gráfico de Gauge - Taxa de Conversão
        new Chart(document.getElementById('funnelChart'), {
            type: 'doughnut',
            data: {
                labels: ['Convertidos', 'Restante'],
                datasets: [{
                    data: [27, 73],
                    backgroundColor: ['#10b981', '#e5e7eb'],
                    borderWidth: 0,
                    circumference: 180,
                    rotation: 270
                }]
            },
            options: {
                ...chartOptions,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });

        // 3. Gráfico de Barras com Linha - Leads vs Conversão
        new Chart(document.getElementById('channelChart'), {
            type: 'bar',
            data: {
                labels: ['Site', 'Instagram', 'Facebook', 'LinkedIn', 'Email'],
                datasets: [{
                    label: 'Leads Capturados',
                    data: [350, 280, 190, 120, 210],
                    backgroundColor: '#3b82f6',
                    borderRadius: 6,
                    order: 2
                }, {
                    label: 'Taxa Conversão %',
                    data: [25, 32, 18, 45, 28],
                    type: 'line',
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true,
                    order: 1,
                    yAxisID: 'y1'
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Leads' }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        title: { display: true, text: 'Taxa %' },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });

        // 4. Gráfico de Progresso - Metas Mensais
        new Chart(document.getElementById('regionChart'), {
            type: 'bar',
            data: {
                labels: ['Meta Jan', 'Meta Fev', 'Meta Mar', 'Meta Abr', 'Meta Mai', 'Meta Jun'],
                datasets: [{
                    label: 'Alcançado',
                    data: [120, 150, 180, 90, 130, 200],
                    backgroundColor: '#10b981',
                    borderRadius: 8,
                    borderWidth: 0
                }, {
                    label: 'Meta',
                    data: [150, 150, 150, 150, 150, 150],
                    backgroundColor: '#e5e7eb',
                    borderRadius: 8,
                    borderWidth: 0
                }]
            },
            options: {
                ...chartOptions,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 200
                    }
                }
            }
        });

        // Redimensionar gráficos automaticamente
        window.addEventListener('resize', function () {
            ['growthChart', 'funnelChart', 'channelChart', 'regionChart'].forEach(id => {
                Chart.getChart(id)?.resize();
            });
        });

        // Adicionar texto central no gauge
        const gaugeCtx = document.getElementById('funnelChart').getContext('2d');
        gaugeCtx.textAlign = 'center';
        gaugeCtx.textBaseline = 'middle';
        gaugeCtx.font = 'bold 24px Arial';
        gaugeCtx.fillStyle = '#10b981';
        gaugeCtx.fillText('27%', gaugeCtx.canvas.width / 2, gaugeCtx.canvas.height / 2);
    }
    // ===============================================
    // 4. Lógica de Cadastro de Contato (contatos.html)
    // ===============================================
    const form = document.getElementById('cadastroContatoForm');
    const tabelaBody = document.querySelector('#tabelaContatos tbody');

    // Função para adicionar listener de exclusão
    function addDeleteListener(row) {
        row.querySelector('.delete-btn').addEventListener('click', function () {
            if (confirm('Tem certeza que deseja excluir este contato?')) {
                this.closest('tr').remove();
            }
        });
    }

    if (form && tabelaBody) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const endereco = document.getElementById('endereco').value;
            const telefone = document.getElementById('telefone').value;
            const email = document.getElementById('email').value;

            if (nome && email) {
                // Cria nova linha da tabela
                const newRow = tabelaBody.insertRow();
                newRow.innerHTML = `
                    <td>${nome}</td>
                    <td>${endereco}</td>
                    <td>${telefone}</td>
                    <td>${email}</td>
                    <td>
                        <button class="btn-sm"><i class="fas fa-edit"></i></button> 
                        <button class="btn-sm danger-bg delete-btn"><i class="fas fa-trash"></i></button>
                    </td>
                `;

                // Adiciona listener para o botão de deletar na nova linha
                addDeleteListener(newRow);

                // Limpa o formulário
                form.reset();
                alert('Contato cadastrado com sucesso!');
            }
        });

        // Adiciona listener de deletar para os itens de exemplo existentes
        document.querySelectorAll('.delete-btn').forEach(button => {
            addDeleteListener(button.closest('tr'));
        });
    }

    // ===============================================
    // 5. Lógica de Envio de Mensagem no Chat (atendimento.html)
    // ===============================================
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatMessages = document.getElementById('chatMessages');

    if (chatInput && sendMessageBtn && chatMessages) {
        function sendMessage() {
            const messageText = chatInput.value.trim();

            if (messageText) {
                // Cria o elemento da mensagem (usuário do site)
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message', 'user-msg', 'flex', 'w-full', 'justify-end');

                const now = new Date();
                const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

                messageDiv.innerHTML = `
                    <div class="max-w-[70%] p-3 rounded-xl rounded-br-sm self-end bg-blue-600 text-white dark:bg-blue-700 shadow-sm">
                        <p class="m-0">${messageText}</p>
                        <span class="block text-[0.65rem] mt-1 text-right opacity-80 text-white">${timeString}</span>
                    </div>
                `;

                chatMessages.appendChild(messageDiv);
                chatInput.value = ''; // Limpa o input

                // Rola para a última mensagem
                chatMessages.scrollTop = chatMessages.scrollHeight;

                // Simulação de resposta do cliente
                setTimeout(() => {
                    const clientResponseDiv = document.createElement('div');
                    clientResponseDiv.classList.add('message', 'client-msg', 'flex', 'w-full', 'justify-start');

                    const nowResponse = new Date();
                    const timeStringResponse = `${nowResponse.getHours().toString().padStart(2, '0')}:${nowResponse.getMinutes().toString().padStart(2, '0')}`;

                    clientResponseDiv.innerHTML = `
                        <div class="max-w-[70%] p-3 rounded-xl rounded-bl-sm self-start bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-50 shadow-sm">
                            <p class="m-0">Obrigado! Entendi. A equipe já está verificando o seu problema.</p>
                            <span class="block text-[0.65rem] mt-1 text-right opacity-80 text-gray-600 dark:text-gray-400">${timeStringResponse}</span>
                        </div>
                    `;
                    chatMessages.appendChild(clientResponseDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1500);
            }
        }

        sendMessageBtn.addEventListener('click', sendMessage);

        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Evita quebra de linha no input (se for textarea)
                sendMessage();
            }
        });
    }

});