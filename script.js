// 1) DATA: define all modules & their tasks
const modules = [
    {
      title: 'Module 1: HTML & CSS Fundamentals',
      tasks: [
        'Build a static homepage (header, nav, footer)',
        'Create a local-business landing page with semantic HTML',
        'Add responsive viewport meta and test on mobile',
        'Bonus: Build a responsive “hamburger” nav (CSS or JS)',
      ]
    },
    {
      title: 'Module 2: Advanced CSS & Responsive Layouts',
      tasks: [
        'Use Flexbox for header & service cards',
        'Import a Google Font and style buttons with CSS transitions',
        'Build a 2×2 responsive grid for portfolio cards',
        'Bonus: Create a CSS-only accordion/dropdown'
      ]
    },
    {
      title: 'Module 3: JavaScript Fundamentals & Interactivity',
      tasks: [
        'Add a button that shows an alert or changes text',
        'Build an image slideshow (Next/Prev controls)',
        'Implement simple form validation (email "@" check)',
        'Create a dynamic menu toggle (slide-down nav)',
        'Bonus: Build a quiz widget or filterable gallery'
      ]
    },
    {
      title: 'Module 4: Dev Tools & Workflow',
      tasks: [
        'Initialize a Git repo & push to GitHub',
        'Practice branching & merging',
        'Install a package via npm & import it',
        'Set up Live Server (VS Code) or CLI server',
        'Deploy mini-project to GitHub Pages or Netlify',
        'Bonus: Configure Sass/SCSS or try a React “Hello World”'
      ]
    },
    {
        title: 'Module 5: WordPress Fundamentals',
        tasks: [
        'Install WordPress locally (Local/MAMP/XAMPP)',
        'Explore the dashboard: pages, posts, customizer',
        'Build Home/About/Services/Contact with Elementor or Gutenberg',
        'Install a contact-form & an SEO plugin',
        ]
      },
      {
        title: 'Module 6: WordPress Advanced Customization',
        tasks: [
        'Create & activate a child theme',
        'Modify header/footer layout (child theme CSS/PHP)',
         'Add custom templates (front-page.php, page-landing.php)',
        'Write 1–2 sample blog posts & add Google Analytics',
        'Deploy live with SSL (HTTPS)'
      ]
    },
    {
      title: 'Module 7: Web Design Best Practices',
      tasks: [
        'Improve contrast & typography on a past project',
        'Run a performance audit & optimize images',
        'Install an accessibility plugin & fix issues',
        'Cross-browser & mobile testing'
      ]
    },
    {
      title: 'Module 8: Freelancing & Portfolio',
      tasks: [
        'Build your portfolio site (3–5 projects)',
        'Draft a client proposal template',
        'Update social profiles & branding',
        'Outreach: offer a site to a real client'
      ]
    },
    {
      title: 'Capstone Project',
      tasks: [
        'Plan & wireframe full client site',
        'Prototype homepage in HTML/CSS',
        'Build in WordPress with custom features',
        'Optimize SEO, performance & accessibility',
        'Deploy live & add write-up to your portfolio'
      ]
    }
];
  
  // 2) UI BUILDER: create <div.module> wrappers with headings, lock msgs, and <ul.checklist>
  function buildChecklist() {
    const container = document.getElementById('modules');
    modules.forEach((module, moduleIndex) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'module';
      wrapper.dataset.moduleIndex = moduleIndex;
      if (moduleIndex > 0) wrapper.dataset.locked = 'true';
  
      // Heading
      const h2 = document.createElement('h2');
      h2.textContent = module.title;
      wrapper.appendChild(h2);
  
      // Locked message
      const msg = document.createElement('p');
      msg.className = 'locked-msg';
      msg.textContent = '🔒 Next module unlocks after you finish the previous one.';
      wrapper.appendChild(msg);
  
      // Task list
      const ul = document.createElement('ul');
      ul.className = 'checklist';
  
      module.tasks.forEach(text => {
        const li = document.createElement('li');
        li.className = 'task';
        li.dataset.state = '0'; // default To-Do
  
        // Task label
        const span = document.createElement('span');
        span.textContent = text;
        li.appendChild(span);
  
        // State button
        const btn = document.createElement('button');
        btn.className = 'state-btn';
        btn.dataset.state = '0';
        btn.textContent = 'To-Do';
        li.appendChild(btn);
  
        ul.appendChild(li);
      });
  
      wrapper.appendChild(ul);
      container.appendChild(wrapper);
    });
  }
  
  // 3) STATE LOGIC: apply CSS classes & auto-advance Up-Next
  function applyState(task, state) {
    task.classList.remove('state-0','state-1','state-2','state-3');
    task.classList.add(`state-${state}`);
  }
  
  function updateUpNext(tasks) {
    // clear existing Up-Next
    tasks.forEach(t => {
      if (t.dataset.state === '1') {
        t.dataset.state = '0';
        applyState(t, '0');
        t.querySelector('.state-btn').textContent = 'To-Do';
      }
    });
    // promote first To-Do
    const next = tasks.find(t => t.dataset.state === '0');
    if (next) {
      next.dataset.state = '1';
      applyState(next, '1');
      next.querySelector('.state-btn').textContent = 'Up-Next';
    }
  }
  
  // 4) MODULE UNLOCK LOGIC: hide/show modules based on completion
  function checkModuleUnlocks() {
    const wrappers = Array.from(document.querySelectorAll('.module'));
    wrappers.forEach(wrapper => {
      const idx = parseInt(wrapper.dataset.moduleIndex, 10);
      if (idx === 0) {
        wrapper.dataset.locked = 'false';
        return;
      }
      const prev = document.querySelector(`.module[data-module-index="${idx-1}"]`);
      const allDone = Array.from(prev.querySelectorAll('.task'))
        .every(t => t.dataset.state === '3');
      wrapper.dataset.locked = allDone ? 'false' : 'true';
    });
  }
  
  // Helper: update a button’s text to match its state
  function updateBtnLabel(btn) {
    switch (btn.dataset.state) {
      case '0': btn.textContent = 'To-Do';        break;
      case '1': btn.textContent = 'Up-Next';      break;
      case '2': btn.textContent = 'In-Progress';  break;
      case '3': btn.textContent = 'Finished';     break;
    }
  }
  
  // 5) INITIALIZATION: build DOM, restore state, wire handlers, unlock modules
  document.addEventListener('DOMContentLoaded', () => {
    buildChecklist();
    const tasks = Array.from(document.querySelectorAll('.task'));
  
    // Restore & hook up each task
    tasks.forEach(task => {
      const btn   = task.querySelector('.state-btn');
      const label = task.querySelector('span').textContent.trim();
      const key   = `task-state-${label}`;
      const saved = localStorage.getItem(key);
  
      // Restore saved state if any
      if (saved !== null) {
        task.dataset.state = saved;
        btn.dataset.state  = saved;
      }
  
      applyState(task, btn.dataset.state);
      updateBtnLabel(btn);
  
      // Click cycles 0→1→2→3→0…
      btn.addEventListener('click', () => {
        let s = (parseInt(btn.dataset.state, 10) + 1) % 4;
        btn.dataset.state = s;
        task.dataset.state = s;
        localStorage.setItem(key, s);
  
        applyState(task, s);
        updateBtnLabel(btn);
  
        // Advance Up-Next & unlock modules when moving into 2 or 3
        if (s === 2 || s === 3) {
          updateUpNext(tasks);
          checkModuleUnlocks();
        }
      });
    });
  
    // On first load, ensure there’s exactly one Up-Next
    if (!tasks.some(t => t.dataset.state === '1')) {
      updateUpNext(tasks);
    }
    checkModuleUnlocks();
  
    // Clear Progress button
const clearBtn = document.getElementById('clear-progress');
clearBtn.addEventListener('click', () => {
  if (!confirm('Reset all progress? This cannot be undone.')) return;

  tasks.forEach(task => {
    const label = task.querySelector('span').textContent.trim();
    // remove saved state
    localStorage.removeItem(`task-state-${label}`);

    // reset data-state on the <li>
    task.dataset.state = '0';
    
    // reset the big state button
    const btn = task.querySelector('.state-btn');
    btn.dataset.state = '0';
    applyState(task, '0');
    updateBtnLabel(btn);
  });

  // re-init Up-Next and module locks
  updateUpNext(tasks);
  checkModuleUnlocks();
});
});