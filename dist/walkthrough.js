/* Guided product screenshots. No simulated product actions or automatic playback. */
(() => {
  'use strict';

  const projectTours = {
    taskboard: {
      name: 'TaskBoard',
      provenance: 'TaskBoard interface · fictional sample workspace.',
      note: 'A guided look at three real screens. Changing steps changes the screenshot; it does not create or edit a ticket.',
      steps: [
        {
          label: 'Plan the work',
          title: 'Give the next task a place to start',
          description: 'Describe the work, choose a project, and give it an owner and sprint.',
          image: 'assets/projects/taskboard-plan.jpg',
          alt: 'TaskBoard create-ticket form in a local sample workspace, ready to describe and organize a piece of work.',
          width: 1440,
          height: 900,
          frame: 'plan',
          position: 'center top'
        },
        {
          label: 'Keep the context',
          title: 'Bring the details into one view',
          description: 'Keep the description, owner, status, and supporting details connected to the ticket.',
          image: 'assets/projects/taskboard-ticket.jpg',
          alt: 'TaskBoard ticket-details screen displaying a fictional task and its project context in the local sample workspace.',
          width: 1440,
          height: 900,
          frame: 'ticket',
          position: 'center center'
        },
        {
          label: 'Follow progress',
          title: 'See how the work is moving',
          description: 'See what’s To do, In progress, or Done, with priorities and owners in view.',
          image: 'assets/projects/taskboard-board.jpg',
          alt: 'TaskBoard sample board showing fictional tickets across To do, In progress, and Done columns.',
          width: 1440,
          height: 900,
          frame: 'board',
          position: 'center top'
        }
      ]
    },
    briefactions: {
      name: 'BriefActions',
      provenance: 'BriefActions interface · invented example meeting.',
      note: 'A guided look at three real screens. Changing steps changes the screenshot; it does not create or edit a plan.',
      steps: [
        {
          label: 'Review the evidence',
          title: 'Check the suggestion against the source',
          description: 'Check each task beside its supporting words, correct the details, and confirm what enters your plan.',
          image: 'assets/projects/briefactions-review.png',
          alt: 'BriefActions review screen with a proposed task, owner and deadline fields, and its highlighted supporting transcript passage.',
          width: 1440,
          height: 1500,
          frame: 'review',
          position: 'center top'
        },
        {
          label: 'Keep the context',
          title: 'Update a task without losing its history',
          description: 'Keep progress, deadlines, and the supporting conversation in one place. Corrections retain their history.',
          image: 'assets/projects/briefactions-task-details.png',
          alt: 'BriefActions task-details panel over the calendar, showing progress, a corrected deadline, and the original supporting conversation.',
          width: 1440,
          height: 1000,
          frame: 'details',
          position: 'center top'
        },
        {
          label: 'Follow through',
          title: 'See when confirmed work is due',
          description: 'See meeting dates and task deadlines separately, with undated work kept in view.',
          image: 'assets/projects/briefactions-calendar.png',
          alt: 'BriefActions calendar with separate meeting and task markers, a selected-day task, and an unscheduled-tasks section.',
          width: 1440,
          height: 1500,
          frame: 'calendar',
          position: 'center top'
        }
      ]
    }
  };

  let tourSequence = 0;

  /**
   * Mount a manual, keyboard-accessible tour into an existing element.
   * Load this classic script before the script that opens project dialogs.
   * Returns a controller with goTo(index) and destroy(), or null for an unknown key.
   */
  function initProjectWalkthrough(mount, projectKey) {
    if (!(mount instanceof Element)) return null;
    const key = projectKey === 'flow' ? 'briefactions' : projectKey;
    const tour = projectTours[key];
    if (!tour) return null;

    const instanceId = `walkthrough-${++tourSequence}`;
    const listeners = [];
    let currentStep = 0;
    let destroyed = false;

    function element(tag, className, text) {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }

    function listen(target, type, handler) {
      target.addEventListener(type, handler);
      listeners.push(() => target.removeEventListener(type, handler));
    }

    const section = element('section', 'walkthrough');
    section.dataset.project = key;
    const header = element('div', 'walkthrough-header');
    const title = element('h3', 'walkthrough-title', 'A quick look inside');
    title.id = `${instanceId}-title`;
    section.setAttribute('aria-labelledby', title.id);
    const status = element('p', 'walkthrough-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    header.append(title, status);

    const steps = element('ol', 'walkthrough-steps');
    steps.setAttribute('aria-label', `${tour.name} walkthrough steps`);
    const stepButtons = tour.steps.map((step, index) => {
      const item = element('li', 'walkthrough-step');
      const button = element('button', 'walkthrough-step-button');
      button.type = 'button';
      button.id = `${instanceId}-step-${index + 1}`;
      button.setAttribute('aria-controls', `${instanceId}-panel`);
      button.setAttribute('aria-label', `Step ${index + 1} of ${tour.steps.length}: ${step.label}`);
      const number = element('span', 'walkthrough-step-number', String(index + 1).padStart(2, '0'));
      number.setAttribute('aria-hidden', 'true');
      const label = element('span', 'walkthrough-step-label', step.label);
      button.append(number, label);
      item.append(button);
      steps.append(item);
      listen(button, 'click', () => goTo(index));
      listen(button, 'keydown', event => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        let next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = Math.min(index + 1, tour.steps.length - 1);
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = Math.max(index - 1, 0);
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tour.steps.length - 1;
        else return;
        event.preventDefault();
        goTo(next);
        stepButtons[next].focus();
      });
      return button;
    });

    const panel = element('div', 'walkthrough-panel');
    panel.id = `${instanceId}-panel`;
    const heading = element('h4', 'walkthrough-heading');
    heading.id = `${instanceId}-heading`;
    heading.tabIndex = -1;
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-labelledby', heading.id);
    const description = element('p', 'walkthrough-description');
    const figure = element('figure', 'walkthrough-figure');
    const imageLink = element('a', 'walkthrough-image-link');
    imageLink.target = '_blank';
    imageLink.rel = 'noopener';
    const image = element('img', 'walkthrough-image');
    image.loading = 'lazy';
    image.decoding = 'async';
    imageLink.append(image);
    const caption = element('figcaption', 'walkthrough-caption', tour.provenance);
    figure.append(imageLink, caption);
    const imageHint = element('p', 'walkthrough-image-hint', 'Open the screenshot for the full-size image in a new tab.');
    panel.append(heading, figure, description, imageHint);

    const footer = element('div', 'walkthrough-footer');
    const previous = element('button', 'walkthrough-previous', '← Previous');
    previous.type = 'button';
    previous.setAttribute('aria-label', 'Previous walkthrough step');
    const next = element('button', 'walkthrough-next', 'Next →');
    next.type = 'button';
    next.setAttribute('aria-label', 'Next walkthrough step');
    footer.append(previous, next);
    function revealStep(index) {
      goTo(index);
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ block: 'start' });
    }
    listen(previous, 'click', () => {
      if (currentStep > 0) revealStep(currentStep - 1);
    });
    listen(next, 'click', () => {
      if (currentStep < tour.steps.length - 1) revealStep(currentStep + 1);
    });

    section.append(header, steps, panel, footer);
    mount.replaceChildren(section);

    function goTo(index) {
      if (destroyed || !Number.isFinite(index)) return;
      currentStep = Math.max(0, Math.min(tour.steps.length - 1, Math.trunc(index)));
      const step = tour.steps[currentStep];
      section.dataset.step = String(currentStep + 1);
      panel.dataset.frame = step.frame;
      status.textContent = `Step ${currentStep + 1} of ${tour.steps.length} · ${step.label}`;
      heading.textContent = step.title;
      description.textContent = step.description;
      imageLink.href = step.image;
      imageLink.setAttribute('aria-label', `Open ${tour.name} screenshot: ${step.label} (full size, new tab)`);
      image.src = step.image;
      image.alt = step.alt;
      image.width = step.width;
      image.height = step.height;
      image.style.objectPosition = step.position;
      stepButtons.forEach((button, position) => {
        button.setAttribute('aria-pressed', String(position === currentStep));
        if (position === currentStep) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
      // Keep the controls focusable at either end to avoid losing keyboard focus.
      previous.setAttribute('aria-disabled', String(currentStep === 0));
      next.setAttribute('aria-disabled', String(currentStep === tour.steps.length - 1));
    }

    goTo(0);

    return {
      goTo,
      destroy() {
        destroyed = true;
        listeners.forEach(remove => remove());
        if (section.parentNode === mount) section.remove();
      }
    };
  }

  window.initProjectWalkthrough = initProjectWalkthrough;
})();
