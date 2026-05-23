// CI/CD Pipeline Simulator Logic (Minimalist Design)
// Animates pipeline flow steps and streams deployment logs

const lintLogs = [
    "[INFO] Initializing pipeline run in GitLab-CI context...",
    "[INFO] Checking workspace files: index.html, css/style.css, js/app.js",
    "[LINT] Running yamllint on Helm charts and Kubernetes manifests...",
    "[LINT] k8s/deployment.yaml -> Checked (OK)",
    "[LINT] helmfile.yaml -> Checked (OK)",
    "[LINT] Running ESLint on static scripts...",
    "[LINT] Verified 2 JS files, 0 errors, 0 warnings.",
    "[LINT] Syntax validation completed successfully."
];

const buildLogs = [
    "[BUILD] Triggering Docker build context...",
    "[BUILD] docker build --pull -t artifactory.simon-infra.net/resume:latest .",
    "[BUILD] Step 1/5 : FROM nginx:1.25-alpine",
    "[BUILD]  ---> 4768393fd848",
    "[BUILD] Step 2/5 : COPY ./index.html /usr/share/nginx/html/index.html",
    "[BUILD] Step 3/5 : COPY ./css/ /usr/share/nginx/html/css/",
    "[BUILD] Step 4/5 : COPY ./js/ /usr/share/nginx/html/js/",
    "[BUILD] Step 5/5 : COPY ./Alex_Simon_Resume.pdf /usr/share/nginx/html/Alex_Simon_Resume.pdf",
    "[BUILD] Successfully built 9e32ff881a2e",
    "[BUILD] Successfully tagged artifactory.simon-infra.net/resume:latest",
    "[BUILD] Pushing Docker image to secure Artifactory repository..."
];

const testLogs = [
    "[TEST] Spawning test containers in sandbox cluster...",
    "[TEST] Running curl validation against mock HTTP endpoints...",
    "[TEST] GET /index.html -> HTTP 200 OK (Validated)",
    "[TEST] GET /Alex_Simon_Resume.pdf -> HTTP 200 OK (Validated size: 65150 bytes)",
    "[TEST] All integration tests passed! (2/2 test files successful)"
];

const deployLogs = [
    "[DEPLOY] Executing Terraform apply (workspace: production)...",
    "[DEPLOY] aws_route53_record.resume: Modifying... [ID: Z1D153...]",
    "[DEPLOY] fastly_service_vcl.resume_cdn: Purging cache...",
    "[DEPLOY] akamai_property.resume_cdn: Syncing edges...",
    "[DEPLOY] Syncing Kubernetes resources via ArgoCD gitops controller...",
    "[DEPLOY] ArgoCD synchronized: revision main-6d2c49a0 (Healthy)",
    "[DEPLOY] Deployment completed. Site is LIVE at https://alexjsimon.com",
    "[SUCCESS] Job pipeline-deploy finished successfully. Uptime = 100%."
];

function initPipeline() {
    const runBtn = document.getElementById('run-pipeline-btn');
    const logConsole = document.getElementById('pipeline-logs');
    
    if (!runBtn || !logConsole) return;

    // Reset pipeline elements to idle state
    function resetPipeline() {
        const stages = ['lint', 'build', 'test', 'deploy'];
        stages.forEach(stage => {
            const stepEl = document.getElementById(`stage-${stage}`);
            if (stepEl) {
                stepEl.className = 'flow-step';
            }
        });
        for (let i = 1; i <= 3; i++) {
            const connector = document.getElementById(`connector-${i}`);
            if (connector) {
                connector.className = 'flow-line';
            }
        }
    }

    async function appendLogs(logs, delay = 150) {
        for (const log of logs) {
            const span = document.createElement('span');
            span.className = 'log-line';
            
            // Format log colors
            if (log.startsWith('[LINT]') || log.startsWith('[BUILD]') || log.startsWith('[TEST]') || log.startsWith('[DEPLOY]')) {
                span.className += ' running';
            } else if (log.startsWith('[SUCCESS]') || log.includes('LIVE')) {
                span.className += ' success';
            } else if (log.startsWith('[INFO]')) {
                span.className += ' system';
            }
            
            // Add Timestamp
            const now = new Date();
            const timestamp = `[${now.toISOString().split('T')[1].slice(0, 8)}] `;
            span.textContent = timestamp + log;
            
            logConsole.appendChild(span);
            logConsole.scrollTop = logConsole.scrollHeight;
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    runBtn.addEventListener('click', async () => {
        runBtn.disabled = true;
        logConsole.innerHTML = '<span class="log-line system">[SYSTEM] Starting deployment job pipeline...</span>';
        resetPipeline();
        
        // 1. Lint Stage
        const lintStep = document.getElementById('stage-lint');
        lintStep.className = 'flow-step running';
        await appendLogs(lintLogs, 100);
        lintStep.className = 'flow-step success';
        
        // Connect Lint -> Build
        const conn1 = document.getElementById('connector-1');
        conn1.className = 'flow-line active';
        await new Promise(resolve => setTimeout(resolve, 600));
        conn1.className = 'flow-line success';

        // 2. Build Stage
        const buildStep = document.getElementById('stage-build');
        buildStep.className = 'flow-step running';
        await appendLogs(buildLogs, 100);
        buildStep.className = 'flow-step success';

        // Connect Build -> Test
        const conn2 = document.getElementById('connector-2');
        conn2.className = 'flow-line active';
        await new Promise(resolve => setTimeout(resolve, 600));
        conn2.className = 'flow-line success';

        // 3. Test Stage
        const testStep = document.getElementById('stage-test');
        testStep.className = 'flow-step running';
        await appendLogs(testLogs, 150);
        testStep.className = 'flow-step success';

        // Connect Test -> Deploy
        const conn3 = document.getElementById('connector-3');
        conn3.className = 'flow-line active';
        await new Promise(resolve => setTimeout(resolve, 600));
        conn3.className = 'flow-line success';

        // 4. Deploy Stage
        const deployStep = document.getElementById('stage-deploy');
        deployStep.className = 'flow-step running';
        await appendLogs(deployLogs, 200);
        deployStep.className = 'flow-step success';

        // Finish
        runBtn.disabled = false;
    });
}

// Add to window scope
window.initPipeline = initPipeline;
