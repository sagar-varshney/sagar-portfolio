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
    <h3>The approach</h3><p>The assistant combines text mining, summarization, K-Means clustering, and Logistic Regression to organize related tasks and generate scheduling insights.</p>
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

// Shared motion state also controls the independently loaded 3D scene.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = motionPreference.matches;
const motionButton = document.querySelector('.motion-toggle');
function applyMotion() {
  document.documentElement.dataset.motion = motionPaused ? 'paused' : 'running';
  motionButton.setAttribute('aria-pressed', String(motionPaused));
  motionButton.setAttribute('aria-label', motionPaused ? 'Resume animations' : 'Pause animations');
  motionButton.querySelector('.pause-symbol').textContent = motionPaused ? '▷' : 'Ⅱ';
  document.querySelector('#robot-hint').textContent = motionPaused ? 'SV—01 / MOTION PAUSED' : 'INTERACTIVE / MOVE YOUR CURSOR';
  window.dispatchEvent(new CustomEvent('portfolio:motion', {detail:{paused:motionPaused}}));
}
applyMotion();
motionButton.addEventListener('click', () => { motionPaused = !motionPaused; applyMotion(); });
motionPreference.addEventListener('change', event => {motionPaused=event.matches;applyMotion();});

// A real, timezone-specific clock; never announces every second to screen readers.
const clockFormatter = new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
function updateClock() { document.querySelectorAll('.live-clock').forEach(clock=>{ clock.textContent=clockFormatter.format(new Date())+' IST'; }); }
updateClock();setInterval(updateClock,1000);
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#main-nav');
function closeMenu(){navigation.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';navigation.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.header'))closeMenu();});
const navObserver = new IntersectionObserver(entries=>{
  const active=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!active)return;
  navigation.querySelectorAll('a').forEach(link=>{const current=link.hash==='#'+active.target.id;link.classList.toggle('active',current);if(current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
},{rootMargin:'-15% 0px -60% 0px',threshold:0});
document.querySelectorAll('main>section[id]').forEach(section=>navObserver.observe(section));
let progressScheduled=false;
function updateProgress(){const total=document.documentElement.scrollHeight-innerHeight;document.querySelector('.scroll-progress').style.transform='scaleX('+Math.max(0,Math.min(1,scrollY/Math.max(1,total)))+')';progressScheduled=false;}
addEventListener('scroll',()=>{if(!progressScheduled){progressScheduled=true;requestAnimationFrame(updateProgress);}},{passive:true});addEventListener('resize',updateProgress);updateProgress();
const words=['connected','intelligent','useful'];let wordIndex=0;
setInterval(()=>{if(motionPaused||document.hidden)return;const word=document.querySelector('#rotating-word');word.classList.add('word-out');setTimeout(()=>{if(!motionPaused&&!document.hidden){wordIndex=(wordIndex+1)%words.length;word.textContent=words[wordIndex];}word.classList.remove('word-out');},240);},4200);

// Lightweight procedural starfield, rendered locally with no tracking or assets.
const starsCanvas=document.querySelector('#starfield');
const starsContext=starsCanvas.getContext('2d');let stars=[],starsFrame=0,starsRunning=false,starsLastFrame=0;
function resizeStars(){const ratio=Math.min(devicePixelRatio||1,1.5);starsCanvas.width=Math.floor(innerWidth*ratio);starsCanvas.height=Math.floor(innerHeight*ratio);starsContext?.setTransform(ratio,0,0,ratio,0,0);const count=Math.min(130,Math.floor(innerWidth*innerHeight/9000));stars=Array.from({length:count},(_,i)=>({x:((Math.sin(i*127.1+42)*43758.5453)%1+1)%1*innerWidth,y:((Math.sin(i*311.7+11)*9758.5453)%1+1)%1*innerHeight,r:i%8===0?1.1:.55,phase:i*2.41}));drawStars(0);}
function drawStars(time){if(!starsContext)return;starsContext.clearRect(0,0,innerWidth,innerHeight);for(const star of stars){const alpha=.2+(Math.sin(time*.00025+star.phase)+1)*.17;starsContext.fillStyle='rgba(170,206,217,'+alpha+')';starsContext.beginPath();starsContext.arc(star.x,star.y,star.r,0,Math.PI*2);starsContext.fill();}}
function starsLoop(time){if(!starsRunning)return;if(time-starsLastFrame>100){drawStars(time);starsLastFrame=time;}starsFrame=requestAnimationFrame(starsLoop);}
function syncStars(){const shouldRun=!motionPaused&&!document.hidden;if(shouldRun&&!starsRunning){starsRunning=true;starsFrame=requestAnimationFrame(starsLoop);}else if(!shouldRun){starsRunning=false;cancelAnimationFrame(starsFrame);drawStars(0);}}
resizeStars();syncStars();addEventListener('resize',resizeStars);addEventListener('portfolio:motion',syncStars);document.addEventListener('visibilitychange',syncStars);

const atomIcon='<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><ellipse cx="50" cy="50" rx="42" ry="15"/><ellipse cx="50" cy="50" rx="42" ry="15" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="42" ry="15" transform="rotate(120 50 50)"/><circle cx="50" cy="50" r="5" fill="currentColor" stroke="none"/></svg>';
const dataIcon='<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5"><ellipse cx="50" cy="23" rx="30" ry="12"/><path d="M20 23v52c0 16 60 16 60 0V23M20 40c0 16 60 16 60 0M20 57c0 16 60 16 60 0"/></svg>';
const graphIcon='<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M27 25l46 25-46 25V25M27 25l12 25-12 25M39 50h34"/><circle cx="27" cy="25" r="8" fill="#101b24"/><circle cx="27" cy="75" r="8" fill="#101b24"/><circle cx="73" cy="50" r="8" fill="#101b24"/><circle cx="39" cy="50" r="5" fill="currentColor"/></svg>';
const stackItems=[
{name:'JavaScript',category:'LANGUAGE',subtitle:'THE CONNECTIVE TISSUE',description:'From React interfaces to Express APIs, JavaScript connects the frontend and backend of my full-stack projects.',context:'FULL-STACK APPLICATIONS',icon:'JS',color:'#d9c875'},
{name:'React / Next.js',category:'FRONTEND',subtitle:'INTERFACES THAT CONNECT',description:'TaskBoard’s frontend is built with React 19 and Next.js 15, bringing projects, sprints, tickets, and attachments into one interface.',context:'TASKBOARD / FRONTEND',icon:atomIcon,color:'#80e5ec'},
{name:'Node.js / Express',category:'BACKEND',subtitle:'BEHIND THE INTERFACE',description:'More than 40 REST API operations for TaskBoard’s project, sprint, team, ticket, attachment, and admin workflows.',context:'TASKBOARD / REST API',icon:'<span class="icon-small">{ API }</span>',color:'#99ce9b'},
{name:'LangGraph',category:'AI AGENTS',subtitle:'INTELLIGENCE IN THE WORKFLOW',description:'A tool-using assistant connected to ticket updates, comments, and attachment analysis, integrating Gemini and Groq.',context:'TASKBOARD / 9 CONTROLLED TOOLS',icon:graphIcon,color:'#b4a3df'},
{name:'MySQL',category:'DATABASE',subtitle:'STRUCTURE WITH INTENT',description:'TaskBoard’s 12-table relational schema, indexed relationships, and eight SQL migrations support company scoping and role-based authorization.',context:'TASKBOARD / RELATIONAL DATA',icon:dataIcon,color:'#78b5d8'},
{name:'PostgreSQL',category:'DATABASE',subtitle:'FINDING THE RIGHT INFORMATION',description:'HRIS and payroll queries across employee records, job history, time off, earnings, and taxes during my UZIO internship.',context:'UZIO / 19 TABLES',icon:dataIcon,color:'#8daed7'},
{name:'Machine Learning',category:'ML / NLP',subtitle:'FROM TEXT TO NEXT STEPS',description:'Text mining, summarization, K-Means clustering, and Logistic Regression for turning meeting transcripts into organized action items.',context:'PRODUCTIVITY FLOW ENGINE',icon:'✳',color:'#c1a1dc'},
{name:'Python',category:'LANGUAGE',subtitle:'PART OF THE TOOLKIT',description:'A language in my technical toolkit, alongside JavaScript, SQL, and C, as I study Computer Science and Artificial Intelligence.',context:'CS / ARTIFICIAL INTELLIGENCE',icon:'<span class="icon-small">Py</span>',color:'#e5c989'}
];
let stackIndex=0,stackPaused=motionPreference.matches,stackVisible=false;
const stackPauseButton=document.querySelector('#stack-pause');
const pagination=document.querySelector('.stack-pagination');
stackItems.forEach((item,index)=>{const button=document.createElement('button');button.setAttribute('aria-label','Show '+item.name);button.setAttribute('aria-pressed',String(index===0));button.addEventListener('click',()=>showStack(index));pagination.append(button);});
function showStack(index){stackIndex=(index+stackItems.length)%stackItems.length;const item=stackItems[stackIndex];document.querySelector('#stack-counter').textContent=String(stackIndex+1).padStart(2,'0')+' / 08';document.querySelector('#stack-art-number').textContent=String(stackIndex+1).padStart(2,'0');document.querySelector('#stack-category').textContent=item.category;document.querySelector('#stack-name').textContent=item.name;document.querySelector('#stack-subtitle').textContent=item.subtitle;document.querySelector('#stack-description').textContent=item.description;document.querySelector('#stack-context').innerHTML='<span class="status-dot"></span> '+item.context;const icon=document.querySelector('#stack-icon');icon.innerHTML=item.icon;icon.style.color=item.color;pagination.querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===stackIndex)));}
showStack(0);
document.querySelector('#stack-next').addEventListener('click',()=>showStack(stackIndex+1));document.querySelector('#stack-prev').addEventListener('click',()=>showStack(stackIndex-1));
function updateStackPause(){const effectivePause=stackPaused||motionPaused;stackPauseButton.disabled=motionPaused;stackPauseButton.title=motionPaused?'Resume animations in the header to enable the slideshow':'';stackPauseButton.setAttribute('aria-pressed',String(effectivePause));stackPauseButton.setAttribute('aria-label',motionPaused?'Technology slideshow paused with all animations':stackPaused?'Resume technology slideshow':'Pause technology slideshow');stackPauseButton.textContent=effectivePause?'▷':'Ⅱ';}
addEventListener('portfolio:motion',updateStackPause);
updateStackPause();stackPauseButton.addEventListener('click',()=>{stackPaused=!stackPaused;updateStackPause();});
new IntersectionObserver(entries=>{stackVisible=entries[0].isIntersecting;},{threshold:.2}).observe(document.querySelector('.stack-showcase'));
setInterval(()=>{const focusInside=document.querySelector('.stack-showcase').contains(document.activeElement);if(!stackPaused&&!motionPaused&&stackVisible&&!document.hidden&&!focusInside)showStack(stackIndex+1);},6000);
document.querySelector('#copy-email').addEventListener('click',async()=>{const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText('sagarvarshney05@gmail.com');status.textContent='EMAIL COPIED. SAY HELLO ↗';}catch{status.textContent='sagarvarshney05@gmail.com';}});
