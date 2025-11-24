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

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            // Detecta se está em mobile (até 768px)
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            const overlayId = 'sidebar-overlay';

            if (isMobile) {
                // Se sidebar está escondida, remove -translate-x-full para mostrar
                const isClosed = sidebar.classList.contains('-translate-x-full');
                if (isClosed) {
                    sidebar.classList.remove('-translate-x-full');
                    // Cria overlay escuro
                    let overlay = document.getElementById(overlayId);
                    if (!overlay) {
                        overlay = document.createElement('div');
                        overlay.id = overlayId;
                        overlay.className = 'fixed inset-0 bg-black/40 md:hidden';
                        overlay.addEventListener('click', () => {
                            // Fecha sidebar e remove overlay ao clicar fora
                            sidebar.classList.add('-translate-x-full');
                            overlay.remove();
                        });
                        document.body.appendChild(overlay);
                    }
                } else {
                    // Fecha menu e remove overlay
                    sidebar.classList.add('-translate-x-full');
                    document.getElementById(overlayId)?.remove();
                }
            } else {
                // (opcional) para desktop, pode alternar colapso se quiser
                sidebar.classList.toggle('collapsed');
            }
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
    if (document.getElementById('leadsChart')) {
        renderCharts();
    }

    function renderCharts() {
        // Cores baseadas na variável CSS (precisam ser definidas aqui para o Chart.js)
        const primaryColor = '#2692f0';
        const secondaryColor = '#f39c12';
        const successColor = '#2ecc71';

        // Gráfico de Linhas: Leads de Clientes
        new Chart(document.getElementById('leadsChart'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Novos Leads',
                    data: [120, 150, 90, 210, 180, 300, 250],
                    borderColor: primaryColor,
                    backgroundColor: 'rgba(38, 146, 240, 0.1)',
                    tension: 0.3,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        // Gráfico de Pizza: Leads por Fonte
        new Chart(document.getElementById('sourceChart'), {
            type: 'pie',
            data: {
                labels: ['Orgânico', 'Pago', 'Referência', 'Direto'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: [
                        primaryColor,
                        secondaryColor,
                        successColor,
                        '#9b59b6'
                    ],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });

        // Gráfico de Barras: Taxa de Conversão Mensal
        new Chart(document.getElementById('conversionChart'), {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Taxa de Conversão (%)',
                    data: [2.5, 3.1, 1.8, 4.0, 3.5, 5.2, 4.5],
                    backgroundColor: 'rgba(38, 146, 240, 0.7)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, max: 10 }
                }
            }
        });

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