# Project Plan: Enhance Client Dashboard with Chat History and Deploy

**Goal:** Modify the existing dashboard to display a client's chat history *in a conversational format* upon clicking their name and make the dashboard publicly accessible via GitHub Pages.

**Data Source:** Supabase
*   **Client Table:** `dados_cliente`
*   **Chat History Table:** `chat_messages`
*   **Linking:** `dados_cliente.sessionid` = `chat_messages.conversation_id`
*   **Relevant Columns:**
    *   `dados_cliente`: `Nombre`, `telefone`, `tipo_cliente`, `estado`, `sessionid`
    *   `chat_messages`: `user_message`, `bot_message`, `created_at`, `conversation_id`

**Plan:**

1.  **Modify Frontend HTML (`index.html`):**
    *   Add a new section (`div id="chat-history-panel"`) below the client table, initially hidden.
    *   Inside, add a header for the client's name and a container (`div id="chat-messages-container"`) for messages.
    *   Add a "Close" button.

2.  **Modify Frontend CSS (`style.css`):**
    *   Style the `#chat-history-panel` (position, background, border, padding, initial `display: none;`).
    *   Style `#chat-messages-container` (height, `overflow-y: scroll;` for scrolling through messages).
    *   **Chat UX Styling:**
        *   Define base styles for individual message bubbles (padding, margins, border-radius).
        *   Create distinct styles for user messages (e.g., `class="user-message"`) and bot messages (e.g., `class="bot-message"`).
        *   Apply different background colors to user and bot messages.
        *   Apply different alignments (e.g., `text-align: right; margin-left: auto;` for user messages, `text-align: left; margin-right: auto;` for bot messages) to mimic a chat flow.
        *   Style the timestamp display within each message bubble (e.g., smaller font size, subtle color).
    *   Style client names in the table to indicate clickability (`cursor: pointer;`, hover effect).

3.  **Modify Frontend JavaScript (`script.js`):**
    *   **Store `sessionid`:** Store `sessionid` using a `data-sessionid` attribute on table rows (`<tr>`) or name cells (`<td>`).
    *   **Add Click Listener:** Add an event listener to `#table-body` for clicks on client names.
    *   **Handle Click Event:** Get `sessionid`, display client name, clear previous chat, show loading message, call `fetchChatHistory(sessionId)`.
    *   **`fetchChatHistory(sessionId)` Function:**
        *   Query `chat_messages` table via Supabase, filter by `conversation_id`, select relevant columns, order by `created_at` ascending.
        *   Handle fetch errors.
        *   If successful, iterate through messages:
            *   **Chat UX Implementation:** For each row, create a message `div`. Add the appropriate class (`user-message` or `bot-message`) based on whether `user_message` or `bot_message` has content.
            *   Inside the message `div`, add the message text and the formatted `created_at` timestamp.
            *   Append the styled message `div` to `#chat-messages-container`.
        *   Handle the case where no messages are found for the `sessionId` (display a "No chat history found" message).
        *   Hide loading message, show `#chat-history-panel`.
    *   **Add Close Functionality:** Add listener to the "Close" button to hide the panel.

4.  **Deployment Preparation:** `git init`, `.gitignore`, `git add .`, `git commit`, create GitHub repo, `git remote add`, `git push`.
5.  **Deploy to GitHub Pages:** Configure GitHub Pages in repo settings.

**Diagram:**

```mermaid
graph LR
    subgraph Frontend Changes
        A[HTML: Add Chat Panel] --> B(CSS: Style Panel & Clickables & Chat UX);
        B --> C(JS: Store sessionid);
        C --> D(JS: Add Click Listener);
        D --> E{JS: On Click};
        E -- Get sessionid --> F[JS: fetchChatHistory(sessionid)];
        F -- Query Supabase --> G(Supabase: chat_messages);
        G -- Return Messages --> F;
        F --> H[JS: Format & Display Messages w/ Chat UX];
        H --> I[JS: Show Chat Panel];
        J[JS: Add Close Button Logic] --> I;
    end

    subgraph Deployment
        K[Git Init & Commit] --> L[Push to GitHub Repo];
        L --> M[Configure GitHub Pages];
        M --> N[Access Public URL];
    end

    Frontend_Changes --> Deployment;