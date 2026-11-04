const projectContent = {
  taskboard: `
    <p class="eyebrow muted">FULL-STACK APPLICATION · MAY–JUL 2026</p>
    <h2 id="dialog-title">TaskBoard</h2>
    <p class="dialog-intro">A Jira-inspired project management platform that brings project workflows, a relational data model, and a tool-using AI assistant into one application.</p>
    <div class="dialog-stats"><div><b>40+</b><span>REST API operations</span></div><div><b>12</b><span>relational tables</span></div><div><b>9</b><span>controlled AI tools</span></div></div>
    <h3>The application</h3><p>Built and deployed with Next.js 15, React 19, Node.js, Express, and MySQL. The platform supports projects, sprints, teams, tickets, attachments, and admin workflows.</p>
    <h3>An assistant inside the workflow</h3><p>A LangGraph assistant integrates Gemini and Groq with nine controlled tools for retrieving and updating tickets, adding comments, and analyzing attachments.</p>
    <h3>Under the surface</h3><ul><li>A 12-table schema, indexed relationships, and eight SQL migrations support multi-company data scoping and authorization across three user roles.</li><li>JWT authentication, bcrypt password hashing, session revocation, rate limiting, CSRF and CORS validation, request tracing, and activity auditing secure and instrument the backend.</li><li>Cloudflare R2 stores attachments with presigned uploads, versioning, category and tag metadata, comments, and saved AI analysis history.</li></ul>
    <div class="tags"><span>Next.js 15</span><span>React 19</span><span>Express</span><span>MySQL</span><span>LangGraph</span><span>Gemini</span><span>Groq</span><span>Cloudflare R2</span><span>Vercel</span></div>
    <div class="project-links"><a class="text-link" href="https://taskboard-frontend-ochre.vercel.app" target="_blank" rel="noopener">Visit live site ↗<span class="sr-only"> (new tab)</span></a><a class="text-link" href="https://github.com/sagar-varshney/TaskBoard-Project-Management" target="_blank" rel="noopener">Explore source code ↗<span class="sr-only"> (new tab)</span></a></div>`,
  flow: `
    <p class="eyebrow muted">MACHINE LEARNING & NLP · NOV 2025</p>
    <h2 id="dialog-title">Productivity Flow Engine</h2>
    <p class="dialog-intro">A machine-learning-based productivity assistant that turns unstructured meeting transcripts into grouped, prioritized, and scheduled action items.</p>
    <h3>From conversation to structure</h3><p>Meeting transcripts contain useful tasks inside unstructured text. The assistant uses text mining and summarization to surface action items, then organizes related tasks and generates scheduling insights.</p>
    <h3>The approach</h3><ul><li>Text mining and summarization process the transcript content.</li><li>K-Means clustering groups related tasks.</li><li>Logistic Regression contributes to prioritization and scheduling insights.</li></ul>
    <div class="tags"><span>Machine Learning</span><span>NLP</span><span>Text mining</span><span>K-Means clustering</span><span>Logistic Regression</span></div>`
};
const dialog = document.querySelector('#project-dialog');
const dialogContent = document.querySelector('#dialog-content');
let opener;
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    opener = button;
    dialogContent.innerHTML = projectContent[button.dataset.project];
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('dialog-open');
    dialog.querySelector('.close-dialog').focus();
  });
});
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  opener?.focus();
});
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('[data-category]').forEach(project => {
      project.hidden = button.dataset.filter !== 'all' && !project.dataset.category.split(' ').includes(button.dataset.filter);
    });
  });
});
