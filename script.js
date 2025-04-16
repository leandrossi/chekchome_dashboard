document.addEventListener('DOMContentLoaded', function() {
    const supabaseUrl = 'https://gjbiwuhipsorguxxrmir.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqYml3dWhpcHNvcmd1eHhybWlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwOTI1ODAsImV4cCI6MjA1NjY2ODU4MH0.Ri3UKthDcoagCMtVemVhaNzRLCRWy8neurrIO9U2Z1M';

    let supabaseClient;

    // Initialize Supabase client
    try {
        if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
            supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
        } else {
            throw new Error('Supabase client library not loaded or initialized correctly.');
        }
    } catch (error) {
        console.error('Error initializing Supabase client:', error);
        alert('Error initializing Supabase. Check console for details.');
        const tableBodyError = document.getElementById('table-body');
        if (tableBodyError) {
            tableBodyError.innerHTML = '<tr><td colspan="4">Error initializing Supabase. Check console.</td></tr>';
        }
        return;
    }

    const tableBody = document.getElementById('table-body');

    if (!tableBody) {
        console.error("Table body element not found!");
        return;
    }

    async function fetchData() {
        console.log("Fetching data from Supabase table 'dados_cliente'...");
        tableBody.innerHTML = '<tr><td colspan="4">Loading data...</td></tr>';

        try {
            const { data, error } = await supabaseClient
                .from('dados_cliente')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching data from Supabase:', error);
                alert(`Error fetching data: ${error.message}`);
                tableBody.innerHTML = '<tr><td colspan="4">Error loading data. Check console.</td></tr>';
                return;
            }

            console.log("Data fetched successfully:", data);

            tableBody.innerHTML = '';

            if (!data || data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4">No data found in dados_cliente table.</td></tr>';
                return;
            }

            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.dataset.sessionid = row.sessionid || '';

                const tdName = document.createElement('td');
                tdName.textContent = row.Nombre || 'N/A';
                tdName.style.cursor = 'pointer';
                tdName.style.color = '#007bff';
                tdName.style.textDecoration = 'underline';
                tr.appendChild(tdName);

                const tdPhone = document.createElement('td');
                tdPhone.textContent = row.telefone || 'N/A';
                tr.appendChild(tdPhone);

                const tdType = document.createElement('td');
                tdType.textContent = row.tipo_cliente || 'N/A';
                tr.appendChild(tdType);

                const tdStatus = document.createElement('td');
                tdStatus.textContent = row.estado || 'N/A';
                tr.appendChild(tdStatus);

                tableBody.appendChild(tr);
            });
        } catch (err) {
            console.error('An unexpected error occurred during fetch or processing:', err);
            alert('An unexpected error occurred. Check console for details.');
            tableBody.innerHTML = '<tr><td colspan="4">An unexpected error occurred. Check console.</td></tr>';
        }
    }

    fetchData();

    tableBody.addEventListener('click', async (event) => {
        const target = event.target;
        if (target.tagName === 'TD' && target.cellIndex === 0) {
            const tr = target.parentElement;
            const sessionId = tr.dataset.sessionid;
            if (!sessionId) {
                alert('No session ID found for this client.');
                return;
            }
            const clientName = target.textContent || 'Unknown Client';
            showChatHistoryPanel(clientName);
            await fetchChatHistory(sessionId);
        }
    });

    const closeChatBtn = document.getElementById('close-chat');
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            hideChatHistoryPanel();
        });
    }

    function showChatHistoryPanel(clientName) {
        const panel = document.getElementById('chat-history-panel');
        const nameSpan = document.getElementById('client-name');
        if (nameSpan) {
            nameSpan.textContent = clientName;
        }
        if (panel) {
            panel.style.display = 'flex';
        }
    }

    function hideChatHistoryPanel() {
        const panel = document.getElementById('chat-history-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    async function fetchChatHistory(sessionId) {
        const container = document.getElementById('chat-messages-container');
        if (!container) return;

        container.innerHTML = '<p>Loading chat history...</p>';

        try {
            const { data, error } = await supabaseClient
                .from('chat_messages')
                .select('user_message, bot_message, created_at')
                .eq('conversation_id', sessionId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching chat history:', error);
                container.innerHTML = '<p>Error loading chat history.</p>';
                return;
            }

            if (!data || data.length === 0) {
                container.innerHTML = '<p>No chat history found for this client.</p>';
                return;
            }

            container.innerHTML = '';

            data.forEach(msg => {
                if (msg.user_message) {
                    const userMsgDiv = document.createElement('div');
                    userMsgDiv.className = 'user-message';
                    userMsgDiv.textContent = msg.user_message;

                    const userTimestamp = document.createElement('div');
                    userTimestamp.className = 'message-timestamp';
                    const userDate = new Date(msg.created_at);
                    userTimestamp.textContent = userDate.toLocaleString();
                    userMsgDiv.appendChild(userTimestamp);

                    container.appendChild(userMsgDiv);
                }
                if (msg.bot_message) {
                    const botMsgDiv = document.createElement('div');
                    botMsgDiv.className = 'bot-message';
                    botMsgDiv.textContent = msg.bot_message;

                    const botTimestamp = document.createElement('div');
                    botTimestamp.className = 'message-timestamp';
                    const botDate = new Date(msg.created_at);
                    botTimestamp.textContent = botDate.toLocaleString();
                    botMsgDiv.appendChild(botTimestamp);

                    container.appendChild(botMsgDiv);
                }
            });
            container.scrollTop = container.scrollHeight;
        } catch (err) {
            console.error('Unexpected error fetching chat history:', err);
            container.innerHTML = '<p>Unexpected error loading chat history.</p>';
        }
    }
});