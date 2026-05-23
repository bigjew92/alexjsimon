// Main Application Controller (Above-the-Fold Tabbed Card Design)
// Handles tab switching, lazy loading of animations, and interactive simulator initialization.

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Navigation Tabs
    initTabs();

    // 2. Initialize CD Pipeline Simulator
    if (window.initPipeline) window.initPipeline();
});

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.content-panel');
    let terminalAnimated = false;

    function switchTab(tabName) {
        // Remove active class from buttons and panels
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
        });

        panels.forEach(panel => {
            panel.classList.toggle('active', panel.id === `panel-${tabName}`);
        });

        // Lazy load typing animation only when visitor opens the Terminal tab
        if (tabName === 'info' && !terminalAnimated) {
            terminalAnimated = true;
            setTimeout(initHeroTerminal, 200);
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.getAttribute('data-tab'));
        });
    });

    // Default select Experience
    switchTab('experience');
}

function initHeroTerminal() {
    const termBody = document.getElementById('hero-terminal-body');
    const termOutput = document.getElementById('hero-terminal-output');
    if (!termBody || !termOutput) return;

    const commandText = "curl -s alexjsimon.com/info";
    const typedContainer = termBody.querySelector('.typed-cmd');
    
    if (typedContainer) typedContainer.textContent = "";
    
    let charIdx = 0;
    
    function typeCommand() {
        if (charIdx < commandText.length) {
            typedContainer.textContent += commandText.charAt(charIdx);
            charIdx++;
            setTimeout(typeCommand, 60);
        } else {
            setTimeout(showTerminalOutput, 300);
        }
    }

    const responseHTML = `{
  <span class="key-highlight">"name"</span>: <span class="val-highlight">"Alex Simon"</span>,
  <span class="key-highlight">"role"</span>: <span class="val-highlight">"Senior Cloud DevOps Engineer"</span>,
  <span class="key-highlight">"status"</span>: <span class="val-highlight">"Deploying systems globally"</span>,
  <span class="key-highlight">"location"</span>: <span class="val-highlight">"Los Angeles, CA"</span>,
  <span class="key-highlight">"core_stack"</span>: [
    <span class="val-highlight">"AWS"</span>, <span class="val-highlight">"GCP"</span>, <span class="val-highlight">"Azure"</span>,
    <span class="val-highlight">"Kubernetes"</span>, <span class="val-highlight">"Terraform"</span>,
    <span class="val-highlight">"GitOps"</span>, <span class="val-highlight">"CDN (Fastly/Akamai)"</span>
  ],
  <span class="key-highlight">"interests"</span>: [
    <span class="val-highlight">"Movies"</span>,
    <span class="val-highlight">"Star Wars"</span>,
    <span class="val-highlight">"3D Printing"</span>,
    <span class="val-highlight">"Traveling"</span>
  ]
}`;

    function showTerminalOutput() {
        termOutput.innerHTML = responseHTML;
        
        // Add final prompt line indicating finished command
        const nextPrompt = document.createElement('div');
        nextPrompt.className = 'terminal-line';
        nextPrompt.style.marginTop = '8px';
        nextPrompt.innerHTML = '<span class="prompt">alex@simon-dev:~$</span> <span class="cursor">_</span>';
        
        termBody.appendChild(nextPrompt);
        
        // Blink cursor
        let visible = true;
        const cursor = nextPrompt.querySelector('.cursor');
        setInterval(() => {
            if (cursor) {
                cursor.style.opacity = visible ? '0' : '1';
                visible = !visible;
            }
        }, 500);
    }

    typeCommand();
}
