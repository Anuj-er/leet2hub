; (() => {
  // Constants
  const BASE_URL = "https://api.github.com/repos"
  const FILE_EXTENSIONS = {
    C: ".c",
    "C++": ".cpp",
    "C#": ".cs",
    Dart: ".dart",
    Elixir: ".ex",
    Erlang: ".erl",
    Go: ".go",
    Java: ".java",
    JavaScript: ".js",
    Kotlin: ".kt",
    PHP: ".php",
    Python: ".py",
    Python3: ".py",
    Racket: ".rkt",
    Ruby: ".rb",
    Rust: ".rs",
    Scala: ".scala",
    Swift: ".swift",
    TypeScript: ".ts",
    MySQL: ".sql",
    PostgreSQL: ".sql",
    Oracle: ".sql",
    "MS SQL Server": ".tsql",
    Pandas: ".py",
  }

  const LOCAL_STORAGE_KEYS = {
    C: "c",
    "C++": "cpp",
    "C#": "csharp",
    Dart: "dart",
    Elixir: "elixir",
    Erlang: "erlang",
    Go: "golang",
    Java: "java",
    JavaScript: "javascript",
    Kotlin: "kotlin",
    PHP: "php",
    Python: "python",
    Python3: "python3",
    Racket: "racket",
    Ruby: "ruby",
    Rust: "rust",
    Scala: "scala",
    Swift: "swift",
    TypeScript: "typeScript",
    MySQL: "mysql",
    Oracle: "oraclesql",
    PostgreSQL: "postgresql",
    "MS SQL Server": "mssql",
    Pandas: "pythondata",
  }

  const DATABASE_LANGUAGES = ["MySQL", "Oracle", "PostgreSQL", "MS SQL Server", "Pandas"]

  // Platform detection
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)

  // Proxy fetch through background script to bypass CSP
  async function fetchViaProxy(url, options = {}) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { action: "fetchProxy", url, options },
        (response) => {
          if (chrome.runtime.lastError) {
            return reject(new Error(chrome.runtime.lastError.message));
          }
          if (response && response.error) {
            return reject(new Error(response.error));
          }
          resolve({
            ok: response.ok,
            status: response.status,
            headers: {
              get: (name) => response.headers[name] || response.headers[name.toLowerCase()]
            },
            json: async () => {
              if (typeof response.body === 'string') {
                try { return JSON.parse(response.body); } catch(e) { return response.body; }
              }
              return response.body;
            },
            text: async () => {
              if (typeof response.body === 'string') return response.body;
              return JSON.stringify(response.body);
            }
          });
        }
      );
    });
  }

  // Storage helpers
  function storageGet(keys) {
    return new Promise(resolve => {
      chrome.storage.local.get(keys, resolve);
    });
  }
  function storageSet(items) {
    return new Promise(resolve => {
      chrome.storage.local.set(items, resolve);
    });
  }
  function storageRemove(keys) {
    return new Promise(resolve => {
      chrome.storage.local.remove(keys, resolve);
    });
  }

  // Default keyboard shortcuts based on platform
  const DEFAULT_SHORTCUT = isMac
    ? { key: "p", modifier: "meta" }
    : {
      key: "p",
      modifier: "ctrl",
    }

  // Shortcut display text
  const getShortcutDisplayText = (shortcut) => {
    const modifierSymbol =
      shortcut.modifier === "meta"
        ? "⌘"
        : shortcut.modifier === "alt"
          ? "⌥"
          : shortcut.modifier === "shift"
            ? "⇧"
            : shortcut.modifier === "ctrl"
              ? "Ctrl+"
              : ""
    return `${modifierSymbol}${shortcut.key.toUpperCase()}`
  }

  let KEYBOARD_SHORTCUT = DEFAULT_SHORTCUT;
  let SHORTCUT_DISPLAY = getShortcutDisplayText(KEYBOARD_SHORTCUT);

  // Initialize keyboard shortcut from chrome.storage
  chrome.storage.local.get(["keyboard-shortcut"], (result) => {
    if (result["keyboard-shortcut"]) {
      try {
        KEYBOARD_SHORTCUT = JSON.parse(result["keyboard-shortcut"]);
        SHORTCUT_DISPLAY = getShortcutDisplayText(KEYBOARD_SHORTCUT);
      } catch (e) {}
    }
  });

  // DOM Selectors
  const SELECTORS = {
    problemName: "a[href^='/problems/']", // Fallbacks will handle the rest
    solutionLanguage: "button.rounded.items-center.whitespace-nowrap", 
    accepted: "[data-e2e-locator='submission-result']", // We'll also use a robust text search
    parentDiv:
      "div.flex.justify-between.py-1.pl-3.pr-1 > div.relative.flex.overflow-hidden > div.flex-none.flex > div:nth-child(2), div.flex.justify-between.py-1.pl-3.pr-1",
    parentDivCodeEditor: "#ide-top-btns > div:nth-child(1) > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div:last-child",
    codeBlock: "pre > code, .monaco-editor", 
    performanceMetrics: ".font-semibold",
  }

  // Main initialization
  document.addEventListener("DOMContentLoaded", initLeet2Hub)

  function initLeet2Hub() {
    // Only run on submission pages with accepted solutions
    if (isSubmissionPage() && hasAcceptedSolution()) {
      injectButtons()
      extractProblemInfo()
      registerKeyboardShortcut()
    }
  }

  // Helper functions
  function isSubmissionPage() {
    return window.location.href.includes("submissions")
  }

  function hasAcceptedSolution() {
    if (document.querySelector(SELECTORS.accepted)?.textContent?.includes("Accepted")) return true;
    
    // Robust fallback: Find any span/div with "Accepted" text that is green
    const elements = document.querySelectorAll("span, div");
    for (const el of elements) {
      if (el.textContent === "Accepted" && (el.className.includes("text-green") || el.style.color === "green" || el.className.includes("success"))) {
        return true;
      }
    }
    return false;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // Register keyboard shortcut
  function registerKeyboardShortcut() {
    document.addEventListener("keydown", (event) => {
      // Check if the shortcut matches the configured one
      if (
        (KEYBOARD_SHORTCUT.modifier === "meta" && event.metaKey) ||
        (KEYBOARD_SHORTCUT.modifier === "alt" && event.altKey) ||
        (KEYBOARD_SHORTCUT.modifier === "shift" && event.shiftKey) ||
        (KEYBOARD_SHORTCUT.modifier === "ctrl" && event.ctrlKey)
      ) {
        if (event.key.toLowerCase() === KEYBOARD_SHORTCUT.key.toLowerCase()) {
          event.preventDefault()
          handlePushClick()
        }
      }
    })
  }

  // Button injection
  function injectButtons() {
    const parentDiv = document.querySelector(SELECTORS.parentDiv)
    const parentDivCodeEditor = document.querySelector(SELECTORS.parentDivCodeEditor)

    if (parentDiv) {
      injectButtonsToParent(
        parentDiv,
        "leet2hub-div-edit",
        "leet2hub-btn-edit",
        "",
        "leet2hub-div",
        "leet2hub-btn",
        "Push",
        false,
        "Settings",
        `Push (${SHORTCUT_DISPLAY})`
      )
    }

    if (parentDivCodeEditor) {
      injectButtonsToParent(
        parentDivCodeEditor,
        "leet2hub-div-edit-CodeEditor",
        "leet2hub-btn-edit-CodeEditor",
        "",
        "leet2hub-div-CodeEditor",
        "leet2hub-btn-CodeEditor",
        "Push",
        true,
        "Settings",
        `Push (${SHORTCUT_DISPLAY})`
      )
    }
  }

  function injectButtonsToParent(
    parent,
    editContainerId,
    editButtonId,
    editText,
    pushContainerId,
    pushButtonId,
    pushText,
    isCodeEditor,
    editTooltip = "",
    pushTooltip = ""
  ) {
    // Don't inject if already present
    if (document.getElementById(editContainerId) || document.getElementById(pushContainerId)) {
      return
    }

    const editButton = createButton(editContainerId, editButtonId, editText, async () => {
      await storageRemove(["repo", "token"]);
      handlePushClick();
    }, editTooltip)

    const pushButton = createButton(pushContainerId, pushButtonId, pushText, handlePushClick, pushTooltip)

    // Check if this is CodeEditor layout
    if (isCodeEditor) {
      // For CodeEditor layout, ADD dividers and icons
      const divider1 = document.createElement("div")
      divider1.style.backgroundColor = "#0f0f0f"
      divider1.style.width = "1px"
      divider1.style.height = "100%"
      divider1.style.flexShrink = "0"

      const divider2 = document.createElement("div")
      divider2.style.backgroundColor = "#0f0f0f"
      divider2.style.width = "1px"
      divider2.style.height = "100%"
      divider2.style.flexShrink = "0"

      parent.appendChild(divider1)
      parent.appendChild(pushButton)
      parent.appendChild(divider2)
      parent.appendChild(editButton)
    } else {
      // For toolbar layout, don't add dividers
      parent.appendChild(pushButton)
      parent.appendChild(editButton)
    }
  }

  function createButton(containerId, buttonId, text, clickHandler, tooltip = "") {
    const container = document.createElement("div")
    container.id = containerId

    const button = document.createElement("button")
    button.id = buttonId
    button.textContent = text
    if (tooltip) {
      button.title = tooltip
    }
    button.addEventListener("click", clickHandler)

    container.appendChild(button)
    return container
  }

  // Problem info extraction
  async function extractProblemInfo() {
    try {
      // Prioritize Page Title as it is the most robust (if it happens to contain the number)
      let probNameText = "";
      const titleMatch = document.title.match(/^(\d+)\.\s*(.+?)\s*-/);
      if (titleMatch) {
        probNameText = `${titleMatch[1]}. ${titleMatch[2]}`;
      }
      
      // Fallback 1: Fuzzy Search for problem name "1. Two Sum" in leaf nodes
      if (!probNameText) {
        const elements = document.querySelectorAll("a, div, span, h1, h2, h3");
        for (const el of elements) {
          const text = el.textContent?.trim() || "";
          if (text.length > 3 && text.length < 100 && text.match(/^\d+\.\s+[A-Za-z0-9]/)) {
            // Ensure we're grabbing the most specific text node (not a giant wrapper div)
            if (el.children.length === 0 || el.tagName === "A") {
              probNameText = text;
              break;
            }
          }
        }
      }

      // Fallback 2: Next.js internal data (Modern LeetCode UI)
      if (!probNameText) {
        const nextDataScript = document.getElementById('__NEXT_DATA__');
        if (nextDataScript) {
          try {
            const nextData = JSON.parse(nextDataScript.textContent);
            // Quick string search for questionFrontendId to avoid strict deep pathing
            const dataStr = nextDataScript.textContent;
            const idMatch = dataStr.match(/"questionFrontendId":"(\d+)"/);
            const titleMatch = dataStr.match(/"title":"([^"]+)"/);
            if (idMatch && titleMatch) {
              probNameText = `${idMatch[1]}. ${titleMatch[1]}`;
            }
          } catch(e) {
             // Silently fail if JSON parse errors
          }
        }
      }

      // Ultimate Fallback: URL slug (Guaranteed to work, defaults number to 0000)
      if (!probNameText) {
        const urlSlug = window.location.pathname.split('/')[2];
        if (urlSlug) {
           const formattedName = urlSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
           probNameText = `0000. ${formattedName}`;
        }
      }

      // Fallback 2: Meta tags or other headers
      if (!probNameText) {
        const metaTitle = document.querySelector('meta[property="og:title"]');
        if (metaTitle && metaTitle.content) {
          const titleMatch = metaTitle.content.match(/^(\d+)\.\s*(.+?)\s*-/);
          if (titleMatch) probNameText = `${titleMatch[1]}. ${titleMatch[2]}`;
        }
      }

      if (!probNameText) {
        throw new Error("Could not extract problem name. LeetCode may have updated their UI.");
      }

      const probNum = probNameText.split(".")[0]?.trim() || ""
      const rawName = probNameText.replace(/^\d+\./, "").trim();
      const probName = rawName.replaceAll(" ", "-") || ""
      
      // Store the formatted readable name for later use (e.g. "Intersection of Two Arrays II")
      const readableName = rawName;

      // Extract accurate title slug from URL
      const titleSlug = window.location.pathname.split('/')[2] || probName.toLowerCase();

      if (!probNum || !probName) {
        throw new Error(`Invalid problem number (${probNum}) or name (${probName}).`);
      }

      // Get solution language
      let solutionLangText = ""
      const langElement = document.querySelector(SELECTORS.solutionLanguage)
      if (langElement) {
        const text = langElement.textContent?.trim() || "";
        if (FILE_EXTENSIONS[text]) solutionLangText = text;
      }
      
      if (!solutionLangText) {
        // Fallback 1: Active language in code editor
        const monacoEditor = document.querySelector('.monaco-editor');
        if (monacoEditor) {
          const langBtn = document.querySelector('button.rounded.items-center.whitespace-nowrap');
          if (langBtn) {
            const text = langBtn.textContent?.trim() || "";
            if (FILE_EXTENSIONS[text]) solutionLangText = text;
          }
        }
      }

      // Fallback 2: Fuzzy search for exact language match in any UI button or leaf node
      if (!solutionLangText) {
        const elements = document.querySelectorAll("a, div, span, button");
        for (const el of elements) {
          const text = el.textContent?.trim().toLowerCase() || "";
          if (text && (el.children.length === 0 || el.tagName === "BUTTON")) {
             for (const key of Object.keys(FILE_EXTENSIONS)) {
                if (key.toLowerCase() === text) {
                   solutionLangText = key;
                   break;
                }
             }
          }
          if (solutionLangText) break;
        }
      }

      // Fallback 3: Next.js internal data
      if (!solutionLangText) {
        const nextDataScript = document.getElementById('__NEXT_DATA__');
        if (nextDataScript) {
          try {
            const dataStr = nextDataScript.textContent;
            const langMatch = dataStr.match(/"lang(?:uage)?(?:":|":\{"name":")([^"}]+)"/i);
            if (langMatch) {
              const parsedLang = langMatch[1].toLowerCase();
              for (const [key, val] of Object.entries(LOCAL_STORAGE_KEYS)) {
                if (val.toLowerCase() === parsedLang || key.toLowerCase() === parsedLang) {
                  solutionLangText = key;
                  break;
                }
              }
            }
          } catch(e) {}
        }
      }
      
      // Fallback 4: local storage (user's global default)
      if (!solutionLangText) {
         let storedLang = localStorage.getItem("global_lang") || localStorage.getItem("global_code_default_lang") || "";
         for (const [key, val] of Object.entries(LOCAL_STORAGE_KEYS)) {
           if (val === storedLang) {
             storedLang = key;
             break;
           }
         }
         if (FILE_EXTENSIONS[storedLang]) solutionLangText = storedLang;
      }

      if (!solutionLangText || !FILE_EXTENSIONS[solutionLangText]) {
        throw new Error(`Could not determine solution language. Found: "${solutionLangText}".`);
      }

      const fileExt = FILE_EXTENSIONS[solutionLangText]
      const fileName = `${probName}${fileExt}`
      
      // Use readable formatted file name if needed
      const flatFileName = `${probNum}. ${readableName}${fileExt}`

      // Get solution code
      let solution = "";

      // Fallback 1: Next.js state (Perfect for submissions tab)
      const nextDataScript = document.getElementById('__NEXT_DATA__');
      if (nextDataScript) {
        try {
          const dataStr = nextDataScript.textContent;
          const codeMatch = dataStr.match(/"submissionCode":"((?:[^"\\]|\\.)*)"/);
          if (codeMatch) {
             solution = JSON.parse(`"${codeMatch[1]}"`);
          }
        } catch(e) {}
      }

      // Fallback 2: Local Storage (Perfect for code editor tab, completely bypasses virtual DOM truncation)
      if (!solution) {
         const expectedSuffix = LOCAL_STORAGE_KEYS[solutionLangText] || solutionLangText.toLowerCase();
         for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.endsWith(`_${expectedSuffix}`)) {
               if (key.includes(titleSlug) || (probNum && key.startsWith(`${probNum}_`))) {
                  const storedSolution = localStorage.getItem(key);
                  // Double check it's not a generic template, must have some length
                  if (storedSolution && storedSolution.length > solution.length) {
                     solution = storedSolution;
                  }
               }
            }
         }
      }

      // Legacy fallback: Grab the largest pre > code block
      if (!solution) {
        const codeElements = Array.from(document.querySelectorAll('pre > code, code'));
        if (codeElements.length > 0) {
           let longestCode = "";
           for (const el of codeElements) {
              if (el.textContent.length > longestCode.length) {
                 longestCode = el.textContent;
              }
           }
           if (longestCode.length > 20) solution = longestCode;
        }
      }

      if (solution) {
        // Clean up escaped newlines if they came through stringified
        solution = solution.replace(/\\n/g, "\n").replace(/ {2}/g, "  ").replace(/"/g, "")
      }

      if (!solution) {
        throw new Error("Could not find the code solution in the page or storage.");
      }

      // Store in sessionStorage with proper values
      sessionStorage.setItem("fileName", fileName)
      sessionStorage.setItem("solution", solution)
      sessionStorage.setItem("flatFileName", flatFileName)
      sessionStorage.setItem("probNum", probNum)
      sessionStorage.setItem("readableName", readableName)

      // Get performance metrics and create commit message
      let commitMsg = "";
      const percentSpans = Array.from(document.querySelectorAll("span")).filter(s => s.textContent.includes("%") && s.textContent.match(/^\d+(\.\d+)?%$/));
      
      if (DATABASE_LANGUAGES.includes(solutionLangText)) {
        const queryRuntimeText = percentSpans.length >= 1 ? percentSpans[0].textContent : "N/A";
        commitMsg = `[${probNum}] [Time Beats: ${queryRuntimeText}] - Leet2Hub`;
      } else {
        const runtimeText = percentSpans.length >= 1 ? percentSpans[0].textContent : "N/A";
        const memoryText = percentSpans.length >= 2 ? percentSpans[1].textContent : "N/A";
        commitMsg = `[${probNum}] [Time Beats: ${runtimeText}] [Memory Beats: ${memoryText}] - Leet2Hub`;
      }

      sessionStorage.setItem("commitMsg", commitMsg)

      // Log successful extraction
      console.log("Problem info extracted successfully:", {
        probNum,
        probName,
        fileName,
        solution: solution.substring(0, 50) + "...",
        commitMsg,
        language: solutionLangText,
      })

      // Get problem description HTML (to preserve images, bolding, and code tags)
      let descriptionHTML = "";
      const descElement = document.querySelector('[data-track-load="description_content"]');
      if (descElement) {
        descriptionHTML = descElement.innerHTML;
      } else {
        const altDesc = document.querySelector('div.elfjS');
        if (altDesc) descriptionHTML = altDesc.innerHTML;
      }
      
      // Fallback: When on the Submissions tab, the description div is often unmounted by React.
      // We can grab the full HTML description cleanly from the Next.js state.
      if (!descriptionHTML) {
        const nextDataScript = document.getElementById('__NEXT_DATA__');
        if (nextDataScript) {
          try {
            const nextData = JSON.parse(nextDataScript.textContent);
            let foundContent = null;
            const findContent = (obj) => {
               if (foundContent || !obj || typeof obj !== 'object') return;
               if (obj.content && typeof obj.content === 'string' && obj.content.includes('<p>')) {
                  foundContent = obj.content;
                  return;
               }
               Object.values(obj).forEach(findContent);
            };
            findContent(nextData);
            if (foundContent) descriptionHTML = foundContent;
          } catch(e) {}
        }
      }
      
      // Ultimate Fallback: Meta tag (No images, plaintext only)
      if (!descriptionHTML) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) descriptionHTML = metaDesc.content;
      }

      return {
        probNum,
        probName,
        titleSlug,
        fileName,
        flatFileName,
        readableName,
        solution,
        commitMsg,
        descriptionHTML,
        language: solutionLangText,
      }
    } catch (error) {
      console.error("Error extracting problem info:", error)
      throw error; // Rethrow to be caught by handlePushClick
    }
  }

  // Modal creation and handling
  function createConfigModal() {
    const modal = document.createElement("div")
    modal.id = "lp-modal"
    modal.innerHTML = `
    <div id="lp-container">
      <div id="lp-close-btn"><button>×</button></div>
      <h3>Leet2<span>Hub</span></h3>
      <form id="lp-form">
        
        <div class="lp-section">
          <div class="lp-section-title">GitHub Integration</div>
          <div class="lp-div">
            <label>Repository URL:</label>
            <input type="text" id="repo-url" name="repo-url" placeholder="https://github.com/username/repository" required>
          </div>
          <div class="lp-div">
            <label>GitHub Token: <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic" target="_blank">Generate Token?</a></label>
            <input type="password" id="token" name="token" placeholder="ghp_..." required>
          </div>
        </div>

        <div class="lp-section">
          <div class="lp-section-title">AI Explanations</div>
          <div class="lp-div">
            <label>AI Provider:</label>
            <select id="ai-provider" name="ai-provider" class="lp-select">
              <option value="gemini">Google Gemini</option>
              <option value="groq">Groq (Llama 3)</option>
            </select>
          </div>
          <div class="lp-div">
            <label>API Key: <a href="https://aistudio.google.com/app/apikey" target="_blank" id="api-key-link">Get Key</a></label>
            <input type="password" id="api-key" name="api-key" placeholder="API Key...">
          </div>
          <div class="lp-div">
            <label>Generate AI README.md:</label>
            <div class="lp-radios-group">
              <label class="lp-radio-label">
                <input type="radio" id="ai-generate-yes" name="ai-generate" value="yes" checked>
                <span class="lp-radio-custom">Yes</span>
              </label>
              <label class="lp-radio-label">
                <input type="radio" id="ai-generate-no" name="ai-generate" value="no">
                <span class="lp-radio-custom">No</span>
              </label>
            </div>
          </div>
          <div class="lp-div">
            <label>Custom AI Prompt (Optional):</label>
            <textarea id="ai-prompt" name="ai-prompt" class="lp-textarea" placeholder="E.g., Explain this as if I'm 5 years old..."></textarea>
          </div>
        </div>

        <div class="lp-section">
          <div class="lp-section-title">Preferences</div>
          <div class="lp-div">
            <label>Target directory push:</label>
            <input type="text" id="custom-dir" name="custom-dir" placeholder="Leave empty for root/DSA categorization">
          </div>
          <div class="lp-div">
            <label>Daily problems on a separate folder:</label>
            <div class="lp-radios-group">
              <label class="lp-radio-label">
                <input type="radio" id="separate-folder-yes" name="daily-challenge" value="yes">
                <span class="lp-radio-custom">Yes</span>
              </label>
              <label class="lp-radio-label">
                <input type="radio" id="separate-folder-no" name="daily-challenge" value="no" checked>
                <span class="lp-radio-custom">No</span>
              </label>
            </div>
          </div>
          <div class="lp-keyboard-shortcut">
            <label>Keyboard shortcut:</label>
            <div class="shortcut-config">
              <select id="shortcut-modifier">
                <option value="meta">${isMac ? "⌘ Command" : "⊞ Windows"}</option>
                <option value="ctrl">Ctrl</option>
                <option value="alt">${isMac ? "⌥ Option" : "Alt"}</option>
                <option value="shift">⇧ Shift</option>
              </select>
              <span>+</span>
              <input type="text" id="shortcut-key" maxlength="1" placeholder="Key">
            </div>
          </div>
        </div>

        <button id="lp-submit-btn" type="submit">Save & Close</button>
      </form>
    </div>
  `

    // Add event listeners
    modal.querySelector("#lp-close-btn button")?.addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    // Dynamic link for API Key based on provider
    const aiProviderSelect = modal.querySelector("#ai-provider");
    const apiKeyLink = modal.querySelector("#api-key-link");
    if (aiProviderSelect && apiKeyLink) {
      aiProviderSelect.addEventListener("change", (e) => {
        if (e.target.value === "groq") {
          apiKeyLink.href = "https://console.groq.com/keys";
        } else {
          apiKeyLink.href = "https://aistudio.google.com/app/apikey";
        }
      });
    }

    // Close modal when clicking outside the modal container
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        document.body.removeChild(modal)
      }
    })

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.contains(modal)) {
        document.body.removeChild(modal)
      }
    })

    modal.querySelector("#lp-form")?.addEventListener("submit", async (event) => {
      event.preventDefault()
      await saveConfig(modal)
    })

    return modal
  }

  async function saveConfig(modal) {
    const repoUrlInput = modal.querySelector("#repo-url")
    const tokenInput = modal.querySelector("#token")
    const separateFolderInput = modal.querySelector('input[name="daily-challenge"]:checked')
    const aiGenerateInput = modal.querySelector('input[name="ai-generate"]:checked')
    const customDirInput = modal.querySelector("#custom-dir")
    const shortcutModifierInput = modal.querySelector("#shortcut-modifier")
    const shortcutKeyInput = modal.querySelector("#shortcut-key")
    const apiKeyInput = modal.querySelector("#api-key")
    const aiProviderInput = modal.querySelector("#ai-provider")
    const aiPromptInput = modal.querySelector("#ai-prompt")

    if (!repoUrlInput || !tokenInput || !separateFolderInput) return

    // Validate GitHub URL format
    const githubUrlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+$/
    if (!githubUrlPattern.test(repoUrlInput.value)) {
      alert("Please enter a valid GitHub repository URL (https://github.com/username/repository).")
      return
    }

    // Validate GitHub token (basic format check)
    if (!tokenInput.value.startsWith("ghp_") && !tokenInput.value.startsWith("github_pat_")) {
      alert('Please enter a valid GitHub token. It should start with "ghp_" or "github_pat_".')
      return
    }

    const repoUrl = repoUrlInput.value.endsWith(".git") ? repoUrlInput.value.slice(0, -4) : repoUrlInput.value
    const token = tokenInput.value
    const branch = "main" // Hardcoded to main
    const separateFolder = separateFolderInput.value
    const aiGenerate = aiGenerateInput ? aiGenerateInput.value : "yes"
    const customDir = customDirInput?.value || ""
    const apiKey = apiKeyInput?.value || ""
    const aiProvider = aiProviderInput?.value || "gemini"
    const aiPrompt = aiPromptInput?.value || ""

    // Save shortcut if provided
    if (shortcutModifierInput && shortcutKeyInput && shortcutKeyInput.value) {
      const shortcutKey = shortcutKeyInput.value.toLowerCase()
      const shortcutModifier = shortcutModifierInput.value

      KEYBOARD_SHORTCUT = { key: shortcutKey, modifier: shortcutModifier }
      SHORTCUT_DISPLAY = getShortcutDisplayText(KEYBOARD_SHORTCUT)

      await storageSet({ "keyboard-shortcut": JSON.stringify(KEYBOARD_SHORTCUT) });

      // Update button labels with new shortcut
      updateButtonLabels()
    }

    // Save to chrome.storage
    await storageSet({
      "repo": repoUrl,
      "token": token,
      "separate-folder": separateFolder,
      "ai-generate": aiGenerate,
      "custom-dir": customDir,
      "api-key": apiKey,
      "ai-provider": aiProvider,
      "ai-prompt": aiPrompt
    });

    document.body.removeChild(modal)

    // Update README and description
    try {
      await updateRepoDescription(token, repoUrl, branch)
    } catch (error) {
      console.error("Error setting up repository metadata:", error)
      showError("Initial repository setup failed. You may need to check your repository permissions.")
    }
  }

  function updateButtonLabels() {
    const buttons = [document.querySelector("#leet2hub-btn"), document.querySelector("#leet2hub-btn-CodeEditor")]

    buttons.forEach((button) => {
      if (button) {
        button.title = `Push (${SHORTCUT_DISPLAY})`
      }
    })
  }

  async function showConfigModal() {
    const modal = createConfigModal()

    // Pre-fill with existing values if available
    const data = await storageGet([
      "token", "repo", "separate-folder", "ai-generate", "custom-dir", "api-key", "gemini-key", "ai-provider", "ai-prompt"
    ]);

    const token = data["token"];
    const repo = data["repo"];
    const separateFolder = data["separate-folder"];
    const aiGenerate = data["ai-generate"];
    const customDir = data["custom-dir"];
    const apiKey = data["api-key"] || data["gemini-key"]; // fallback
    const aiProvider = data["ai-provider"] || "gemini";
    const aiPrompt = data["ai-prompt"] || "";

    // Pre-fill shortcut values
    const shortcutModifierInput = modal.querySelector("#shortcut-modifier")
    const shortcutKeyInput = modal.querySelector("#shortcut-key")

    if (shortcutModifierInput) {
      shortcutModifierInput.value = KEYBOARD_SHORTCUT.modifier
    }

    if (shortcutKeyInput) {
      shortcutKeyInput.value = KEYBOARD_SHORTCUT.key.toUpperCase()
    }

    if (token) modal.querySelector("#token").value = token
    if (repo) modal.querySelector("#repo-url").value = repo
    if (separateFolder) modal.querySelector(`#separate-folder-${separateFolder}`).checked = true
    if (aiGenerate) modal.querySelector(`#ai-generate-${aiGenerate}`).checked = true
    if (customDir) modal.querySelector("#custom-dir").value = customDir
    if (apiKey) modal.querySelector("#api-key").value = apiKey
    if (aiPrompt) modal.querySelector("#ai-prompt").value = aiPrompt
    if (aiProvider) {
      const select = modal.querySelector("#ai-provider");
      if (select) {
        select.value = aiProvider;
        select.dispatchEvent(new Event('change'));
      }
    }

    document.body.appendChild(modal)
  }

  // Function to show error messages to the user
  function showError(message) {
    alert(`Leet2Hub Error: ${message}`)
  }

  // GitHub API interactions
  async function handlePushClick() {
    const config = await getGithubConfig()

    if (!isConfigComplete(config)) {
      await showConfigModal()
      return
    }

    const pushBtn = getPushButton()
    if (!pushBtn) {
      console.error("Push button not found")
      showError("Interface error: Push button not found. Please refresh the page and try again.")
      return
    }

    // Force a refresh of problem info
    let problemInfo;
    try {
      problemInfo = await extractProblemInfo();
    } catch (e) {
      showError(e.message);
      pushBtn.disabled = false;
      pushBtn.textContent = "Push";
      pushBtn.classList.remove("loading");
      return;
    }

    const fileName = problemInfo.fileName
    const solution = problemInfo.solution
    const commitMsg = problemInfo.commitMsg

    if (!fileName || !solution || !commitMsg) {
      console.error("Missing required data:", {
        fileName,
        hasSolution: !!solution,
        hasCommitMsg: !!commitMsg,
      })

      if (!fileName) {
        showError("Failed to generate a valid file name for your solution.")
      } else if (!solution) {
        showError("Failed to extract your solution code. Please try again.")
      } else {
        showError("Failed to generate commit message. Please try again.")
      }
      return
    }

    const [userName, repoName] = config.repo.split("/").slice(3, 5)
    if (!userName || !repoName) {
      console.error("Invalid repository URL:", config.repo)
      showError(
        "Invalid repository URL format. Please check your settings and provide a valid GitHub repository URL (e.g., https://github.com/username/repository).",
      )
      await showConfigModal()
      return
    }

    pushBtn.disabled = true
    pushBtn.textContent = "Loading..."
    pushBtn.classList.add("loading")

    try {
      const result = await pushToGithub(
        userName,
        repoName,
        config,
        problemInfo
      );

      pushBtn.classList.remove("loading");
      if (result && result.aiFailed) {
        pushBtn.classList.add("warning");
        pushBtn.textContent = "Pushed (No AI)";
        await sleep(3000);
        pushBtn.classList.remove("warning");
      } else {
        pushBtn.classList.add("success");
        pushBtn.textContent = "Done";
        await sleep(2000);
        pushBtn.classList.remove("success");
      }
      pushBtn.disabled = false;
      pushBtn.textContent = "Push";

      // Update statistics
      const statsData = await storageGet(["solutions-pushed", "daily-challenges"]);
      const solutionsPushed = Number.parseInt(statsData["solutions-pushed"] || "0") + 1;
      await storageSet({ "solutions-pushed": solutionsPushed.toString() });

      // Check if it's a daily challenge
      try {
        const [, dailyProblemNum] = await getDailyChallenge()

        if (problemInfo && dailyProblemNum === problemInfo.probNum) {
          const dailyChallenges = Number.parseInt(statsData["daily-challenges"] || "0") + 1;
          await storageSet({ "daily-challenges": dailyChallenges.toString() });
        }
      } catch (error) {
        console.error("Error checking daily challenge:", error)
        // Non-critical error, don't show to user
      }
    } catch (error) {
      console.error("Failed to push solution:", error)
      showError(error.message || "Unknown error occurred while pushing solution")

      pushBtn.classList.remove("loading")
      pushBtn.classList.add("error")
      pushBtn.textContent = "Error"
      await sleep(2000)
      pushBtn.disabled = false
      pushBtn.classList.remove("error")
      pushBtn.textContent = "Push"
    }
  }

  async function getGithubConfig() {
    const data = await storageGet([
      "repo", "token", "separate-folder", "ai-generate", "custom-dir", "api-key", "gemini-key", "ai-provider", "ai-prompt"
    ]);
    return {
      repo: data["repo"] || "",
      token: data["token"] || "",
      branch: "main", // We'll dynamically determine the true branch inside pushToGithub
      separateFolder: data["separate-folder"] || null,
      aiGenerate: data["ai-generate"] || "yes",
      customDir: data["custom-dir"] || "",
      apiKey: data["api-key"] || data["gemini-key"] || "",
      aiProvider: data["ai-provider"] || "gemini",
      aiPrompt: data["ai-prompt"] || "",
    }
  }

  function isConfigComplete(config) {
    return !!(config.token && config.repo && config.branch && config.separateFolder !== null)
  }

  function getPushButton() {
    return document.querySelector("#leet2hub-btn") || document.querySelector("#leet2hub-btn-CodeEditor")
  }

  async function pushToGithub(
    userName,
    repoName,
    config,
    problemInfo
  ) {
    try {
      const { fileName, flatFileName, readableName, solution, commitMsg, titleSlug, probName, probNum, descriptionHTML } = problemInfo;

      // Check if fileName is valid
      if (!fileName || fileName.trim() === "") {
        console.error("Invalid file name:", fileName)
        throw new Error("Invalid file name. Please try again with a different solution.")
      }

      // Check if content is valid
      if (!solution || solution.trim() === "") {
        console.error("Invalid content:", solution)
        throw new Error("No solution content found. Please make sure your solution is visible on the page.")
      }

      // 1. Determine Category Folder from Tags
      let categoryFolder = "";
      try {
        const tags = await getProblemTags(titleSlug);
        categoryFolder = getCategoryFolder(tags);
      } catch (e) {
        console.error("Error fetching tags, skipping category folder logic", e);
      }

      // 2. Determine Base Path
      let basePath = "";
      if (config.customDir) {
        basePath = config.customDir;
      } else if (categoryFolder) {
        basePath = categoryFolder;
      } else if (config.separateFolder === "yes") {
        try {
          const [date, dailyProblemNum] = await getDailyChallenge()
          if (dailyProblemNum === problemInfo.probNum) {
            const splitDate = date.split("-")
            basePath = `DCP-${splitDate[1]}-${splitDate[0].slice(2)}`
          }
        } catch (error) {
          console.error("Error processing daily challenge folder:", error)
        }
      }

      // 3. Create full folder path for this specific problem (Reverted to nested folder per user request)
      const problemFolderName = `${probNum}. ${readableName}`;
      const folderPath = basePath ? `${basePath}/${problemFolderName}` : problemFolderName;
      const codeFilePath = `${folderPath}/${flatFileName}`;

      console.log("Debug - final codeFilePath:", codeFilePath)

      // 3.5. Determine default branch dynamically
      let targetBranch = config.branch;
      try {
        const repoInfoRes = await fetchViaProxy(`${BASE_URL}/${userName}/${repoName}`, {
          headers: { Authorization: `Bearer ${config.token}` }
        });
        if (repoInfoRes.ok) {
          const repoInfo = await repoInfoRes.json();
          targetBranch = repoInfo.default_branch || "main";
        }
      } catch (e) {
        console.warn("Could not determine default branch dynamically, falling back to main.");
      }

      // 4. Push the Code File
      await pushFileToRepo(userName, repoName, codeFilePath, targetBranch, solution, commitMsg, config.token)

      // 5. Generate and Push AI Explanation (if enabled)
      if (config.aiGenerate === "yes") {
        if (!config.apiKey && !config.geminiKey) {
          console.warn("AI Generation is enabled but no API Key is provided. Skipping README.md generation.");
        } else {
          try {
            console.log("Generating AI Explanation...");
            const aiExplanation = await generateAIExplanation(solution, probName, config.apiKey, config.aiProvider, config.aiPrompt);
            
            // Combine Problem Description and AI Explanation
            const problemUrl = `https://leetcode.com/problems/${titleSlug}`;
            const fullReadmeContent = `<h2><a href="${problemUrl}">${probNum}. ${readableName}</a></h2>\n\n${descriptionHTML || "*Description not available*"}\n\n---\n\n${aiExplanation}`;

            const readmePath = `${folderPath}/README.md`;
            const readmeCommitMsg = `Docs: Added Problem Description and AI Explanation for ${probNum}. ${readableName} - Leet2Hub`;
            await pushFileToRepo(userName, repoName, readmePath, targetBranch, fullReadmeContent, readmeCommitMsg, config.token);
            console.log("AI Explanation pushed successfully!");
          } catch (e) {
            console.error("Failed to generate/push AI Explanation", e);
            // We don't throw here because the main code was already successfully pushed.
            return { success: true, aiFailed: true };
          }
        }
      }

      return { success: true, aiFailed: false };
    } catch (error) {
      console.error("Error in pushToGithub:", error)
      throw error // Propagate the error to be handled by the caller
    }
  }

  async function pushFileToRepo(userName, repoName, filePath, branch, content, commitMsg, token) {
    if (!filePath || !content || !commitMsg) {
      console.error("Missing required parameters:", {
        filePath,
        hasContent: !!content,
        hasCommitMsg: !!commitMsg,
      })
      throw new Error("Missing required file information. Please try again.")
    }

    const apiUrl = `${BASE_URL}/${userName}/${repoName}/contents/${filePath}`
    console.log("API URL:", apiUrl)

    try {
      // Check if repo exists
      const repoCheckResponse = await fetchViaProxy(`${BASE_URL}/${userName}/${repoName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("Repo check response:", repoCheckResponse)

      if (!repoCheckResponse.ok) {
        const errorData = await repoCheckResponse.json()
        console.error("Repository check error:", errorData)

        // Handle different error cases with specific messages
        if (repoCheckResponse.status === 404) {
          throw new Error(
            `Repository not found: ${userName}/${repoName}. Please check if the repository exists and your token has access to it.`,
          )
        } else if (repoCheckResponse.status === 401) {
          throw new Error(
            "Authentication failed. Your GitHub token may be invalid or expired. Please generate a new token.",
          )
        } else if (repoCheckResponse.status === 403) {
          throw new Error("Access forbidden. Your token may not have sufficient permissions to access this repository.")
        } else {
          throw new Error(`Repository access error: ${errorData.message || "Unknown error"}`)
        }
      }

      // Prepare request body with proper content encoding
      const encodedContent = btoa(unescape(encodeURIComponent(content)))
      const requestBody = {
        message: commitMsg,
        content: encodedContent,
        branch: branch,
      }

      // Check if file exists and get the latest SHA
      let fileExistsRes
      try {
        fileExistsRes = await fetchViaProxy(`${apiUrl}?ref=${branch}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log("File exists response:", fileExistsRes)
      } catch (error) {
        console.error("Error checking if file exists:", error)
        throw new Error("Network error while checking if file already exists in repository.")
      }

      if (fileExistsRes.ok) {
        try {
          const existingFileData = await fileExistsRes.json()
          if (existingFileData && existingFileData.sha) {
            requestBody.sha = existingFileData.sha
            console.log("Found existing file SHA:", existingFileData.sha)
          }
        } catch (error) {
          console.error("Error parsing existing file data:", error)
          throw new Error("Error processing existing file data from GitHub.")
        }
      } else if (fileExistsRes.status !== 404) {
        // 404 is expected if file doesn't exist yet
        const errorData = await fileExistsRes.json()
        console.error("Error checking file existence:", errorData)

        if (fileExistsRes.status === 403) {
          throw new Error(
            'Permission denied. Make sure your token has "contents: write" permission on this repository.',
          )
        } else if (fileExistsRes.status === 401) {
          throw new Error("Authentication failed. Your GitHub token may be invalid or expired.")
        } else {
          throw new Error(`Error checking file: ${errorData.message || "Unknown error"}`)
        }
      }

      // Make the API call to push the file
      let response = await fetchViaProxy(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      })
      console.log("Response status:", response.status)

      // Handle SHA mismatch (409 conflict) error - retry up to 3 times
      let retryCount = 0
      const maxRetries = 3

      while (response.status === 409 && retryCount < maxRetries) {
        console.log(
          `SHA mismatch detected (attempt ${retryCount + 1}/${maxRetries}), fetching updated SHA and retrying...`,
        )
        retryCount++

        try {
          // Get the latest SHA again
          const latestShaRes = await fetchViaProxy(`${apiUrl}?ref=${branch}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!latestShaRes.ok) {
            console.error(`Failed to get latest SHA on retry ${retryCount}, status: ${latestShaRes.status}`)
            continue // Skip to next retry attempt
          }

          const latestFileData = await latestShaRes.json()
          if (latestFileData && latestFileData.sha) {
            // Update the SHA in the request body
            requestBody.sha = latestFileData.sha
            console.log(`Using updated SHA on retry ${retryCount}: ${latestFileData.sha}`)

            // Retry the request with the updated SHA
            response = await fetchViaProxy(apiUrl, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(requestBody),
            })
            console.log(`Retry ${retryCount} response status:`, response.status)

            if (response.ok) {
              break // Success, exit the retry loop
            }
          } else {
            console.error("Failed to get valid SHA from response:", latestFileData)
            break
          }
        } catch (retryError) {
          console.error(`Error during retry ${retryCount}:`, retryError)
          break // Exit retry loop on error
        }

        // Small delay between retries to avoid rate limiting
        await sleep(500)
      }

      if (!response.ok) {
        let errorMessage = `GitHub API Error: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage += ` - ${errorData.message || "Unknown error"}`
          console.error("GitHub API error details:", errorData)
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError)
        }
        throw new Error(errorMessage)
      }

      const responseData = await response.json()
      console.log("File successfully pushed:", responseData.content.html_url)
      return true
    } catch (error) {
      console.error("Error pushing file to repo:", error)
      // Don't show alert here, just propagate the error to be handled by the caller
      throw error
    }
  }

  async function updateRepoDescription(token, repo, branch) {
    const [userName, repoName] = repo.split("/").slice(3, 5)
    const description = "This repository is managed by Leet2Hub extension"

    try {
      await fetchViaProxy(`${BASE_URL}/${userName}/${repoName}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      })
    } catch (error) {
      console.error("Error updating repo metadata:", error)
    }
  }

  async function getDailyChallenge() {
    const response = await fetchViaProxy("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `{
        activeDailyCodingChallengeQuestion {
          date
          question {
            frontendQuestionId: questionFrontendId
          }
        }
      }`,
      }),
    })

    const data = await response.json()
    return [
      data.data.activeDailyCodingChallengeQuestion.date,
      data.data.activeDailyCodingChallengeQuestion.question.frontendQuestionId,
    ]
  }

  async function getProblemTags(titleSlug) {
    const query = `
      query singleQuestionTopicTags($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          topicTags {
            name
          }
        }
      }
    `;
    try {
      const response = await fetchViaProxy("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { titleSlug } }),
      });
      const data = await response.json();
      return data.data?.question?.topicTags?.map(tag => tag.name) || [];
    } catch (e) {
      console.error("Error fetching tags:", e);
      return [];
    }
  }

  function getCategoryFolder(tags) {
    if (!tags || tags.length === 0) return "";
    const tagSet = new Set(tags.map(t => t.toLowerCase()));
    
    if (tagSet.has("array") || tagSet.has("hash table")) return "01-Arrays-and-Hashing";
    if (tagSet.has("two pointers")) return "02-Two-Pointers";
    if (tagSet.has("stack") || tagSet.has("queue") || tagSet.has("monotonic stack")) return "03-Stack-and-Queue";
    if (tagSet.has("string")) return "04-String-Manipulation";
    if (tagSet.has("sorting") || tagSet.has("binary search")) return "05-Sorting-and-Searching";
    if (tagSet.has("sliding window")) return "06-Sliding-Window";
    if (tagSet.has("greedy")) return "07-Greedy-Algorithms";
    if (tagSet.has("linked list")) return "08-Linked-List";
    if (tagSet.has("tree") || tagSet.has("binary tree") || tagSet.has("binary search tree") || tagSet.has("trie")) return "09-Trees";
    if (tagSet.has("graph") || tagSet.has("breadth-first search") || tagSet.has("depth-first search")) return "10-Graphs";
    if (tagSet.has("backtracking")) return "11-Backtracking";
    if (tagSet.has("heap (priority queue)")) return "12-Heap-Priority-Queue";
    if (tagSet.has("math") || tagSet.has("geometry")) return "13-Math";
    if (tagSet.has("dynamic programming") || tagSet.has("memoization")) return "14-Dynamic-Programming";
    
    return "";
  }

  async function generateAIExplanation(code, problemName, apiKey, aiProvider, customPrompt) {
    const prompt = `
You are an expert DSA programmer. I have just solved the LeetCode problem "${problemName}". 
Here is my code solution:

\`\`\`
${code}
\`\`\`

Please write a detailed explanation of this solution in Markdown format. 
IMPORTANT: If you detect multiple different approaches in my code (e.g., older approaches commented out, and one active approach), you MUST document ALL of them separately. Explain the intuition, approach, and complexity for each distinct approach, and include the specific code snippet for that approach within its section. If there is only one approach, just explain that one.

Format it EXACTLY like this structure, using emojis and a professional, clear, conversational tone.

Format required:
# 🛍️ ${problemName} | Explained

## Approach 1 (e.g., Brute Force)
### Intuition
[Explain the core idea using a real-world analogy]
### Approach
[Step-by-step breakdown of how the algorithm works]
### Code
\`\`\`
[Insert the specific code snippet for this approach here]
\`\`\`
### Complexity
- Time: [Time complexity]
- Space: [Space complexity]

## Approach 2 (e.g., Optimized)
[If applicable, document the next approach in the exact same structure. Repeat for as many approaches as found in the code.]

## 🕵️‍♂️ Follow-up Questions (Optional)
[If applicable, what are 1-2 common interviewer follow-up questions for this pattern and brief answers]
${customPrompt ? `\nUser's custom instructions for the explanation:\n${customPrompt}\n` : ""}
`;

    try {
      if (aiProvider === "groq") {
        const response = await fetchViaProxy(`https://api.groq.com/openai/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }]
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.choices?.[0]?.message?.content || "Failed to generate explanation.";
      } else {
        const response = await fetchViaProxy(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate explanation.";
      }
    } catch (e) {
      console.error("AI Generation Error:", e);
      return "Error connecting to AI API: " + e.message;
    }
  }

  // Initialize on page load
  initLeet2Hub()

  // Re-initialize on DOM changes (for single-page apps)
  const observer = new MutationObserver((mutations) => {
    if (isSubmissionPage() && hasAcceptedSolution()) {
      const hasButtons = document.getElementById("leet2hub-btn") || document.getElementById("leet2hub-btn-CodeEditor")
      if (!hasButtons) {
        initLeet2Hub()
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
})()
