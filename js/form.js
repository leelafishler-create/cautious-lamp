const config = JSON.parse(document.getElementById('site-config-data').textContent);
const titleEl = document.getElementById('site-title');
const taglineEl = document.getElementById('site-tagline');
const navEl = document.getElementById('site-nav');
const formEl = document.getElementById('preferences-form');
const outputPanel = document.getElementById('output-panel');
const jsonOutput = document.getElementById('json-output');
const copyButton = document.getElementById('copy-json');

if (titleEl) titleEl.textContent = config.title;
if (taglineEl) taglineEl.textContent = config.tagline;
if (navEl) {
  config.navigation.form.forEach((item) => {
    const link = document.createElement('a');
    link.textContent = item.label;
    link.href = item.href;
    link.style.backgroundColor = config.palette[item.color]?.hex || '#252525';
    navEl.appendChild(link);
  });
}

const formSections = [
  {
    id: 'genres',
    title: 'Genres',
    description: 'Choose the comedy styles that make you laugh the most.',
    fields: [
      { type: 'checkbox', name: 'genres', value: 'standup', label: 'Stand-up snippets' },
      { type: 'checkbox', name: 'genres', value: 'improv', label: 'Improv moments' },
      { type: 'checkbox', name: 'genres', value: 'sketch', label: 'Sketch comedy' },
      { type: 'checkbox', name: 'genres', value: 'absurd', label: 'Absurd storytelling' },
      { type: 'checkbox', name: 'genres', value: 'satire', label: 'Satire & commentary' }
    ]
  },
  {
    id: 'habits',
    title: 'Habits',
    description: 'Tell us how you scroll, how long you stay, and what makes you skip.',
    fields: [
      { type: 'select', name: 'watchFrequency', label: 'How often do you watch reels?', options: ['Daily', 'Several times a week', 'Weekly', 'Occasionally'] },
      { type: 'radio', name: 'clipLength', label: 'Preferred clip length', options: ['Under 30 seconds', '30–60 seconds', '1–2 minutes', 'Longer than 2 minutes'] },
      { type: 'radio', name: 'skipBehavior', label: 'What do you do when a clip doesn’t hook you?', options: ['Swipe immediately', 'Give it a few seconds', 'Replay for context'] }
    ]
  },
  {
    id: 'discovery',
    title: 'Discovery',
    description: 'Where you find comedy and how much the algorithm earns your trust.',
    fields: [
      { type: 'select', name: 'source', label: 'Favorite discovery source', options: ['Reel feed', 'Shared by friends', 'Curated channels', 'Search / topics'] },
      { type: 'range', name: 'trust', label: 'Trust the algorithm to recommend comedy', min: 0, max: 10, step: 1, defaultValue: 7 }
    ]
  },
  {
    id: 'mood',
    title: 'Mood',
    description: 'Capture the tone you want from your next reel session.',
    fields: [
      { type: 'radio', name: 'mood', label: 'Mood', options: ['Light-hearted', 'Dark humor', 'High-energy', 'Quiet absurdity'] },
      { type: 'textarea', name: 'notes', label: 'Optional notes', placeholder: 'What should a curator know about your comedy taste?' }
    ]
  }
];

function createFormField(field) {
  const group = document.createElement('div');
  group.className = 'field-group';
  const label = document.createElement('label');
  label.textContent = field.label;
  if (field.type === 'select') {
    const select = document.createElement('select');
    select.name = field.name;
    field.options.forEach((option) => {
      const opt = document.createElement('option');
      opt.value = option.toLowerCase().replace(/\s+/g, '-');
      opt.textContent = option;
      select.appendChild(opt);
    });
    group.appendChild(label);
    group.appendChild(select);
  } else if (field.type === 'radio' || field.type === 'checkbox') {
    const row = document.createElement('div');
    row.className = 'field-row field-row--multi';
    field.options.forEach((option) => {
      const optionLabel = document.createElement('label');
      const input = document.createElement('input');
      input.type = field.type;
      input.name = field.name;
      input.value = option.toLowerCase().replace(/\s+/g, '-');
      input.required = field.type === 'radio';
      optionLabel.appendChild(input);
      optionLabel.appendChild(document.createTextNode(option));
      row.appendChild(optionLabel);
    });
    group.appendChild(label);
    group.appendChild(row);
  } else if (field.type === 'range') {
    const valueLabel = document.createElement('span');
    valueLabel.className = 'field-note';
    valueLabel.textContent = field.defaultValue ?? field.min;
    const input = document.createElement('input');
    input.type = 'range';
    input.name = field.name;
    input.min = field.min;
    input.max = field.max;
    input.step = field.step;
    input.value = field.defaultValue ?? field.min;
    input.addEventListener('input', () => {
      valueLabel.textContent = input.value;
    });
    group.appendChild(label);
    group.appendChild(input);
    group.appendChild(valueLabel);
  } else if (field.type === 'textarea') {
    const textarea = document.createElement('textarea');
    textarea.name = field.name;
    textarea.rows = 4;
    textarea.placeholder = field.placeholder || '';
    group.appendChild(label);
    group.appendChild(textarea);
  }
  return group;
}

formSections.forEach((section) => {
  const sectionEl = document.createElement('section');
  sectionEl.id = section.id;
  sectionEl.className = 'form-section';

  const heading = document.createElement('h2');
  heading.className = 'section-headline';
  heading.textContent = section.title;

  const copy = document.createElement('p');
  copy.className = 'section-copy';
  copy.textContent = section.description;

  sectionEl.appendChild(heading);
  sectionEl.appendChild(copy);

  section.fields.forEach((field) => {
    sectionEl.appendChild(createFormField(field));
  });

  formEl.appendChild(sectionEl);
});

const submitGroup = document.createElement('div');
submitGroup.className = 'form-section';
const submitButton = document.createElement('button');
submitButton.className = 'btn';
submitButton.type = 'submit';
submitButton.textContent = 'Generate JSON';
submitGroup.appendChild(submitButton);
formEl.appendChild(submitGroup);

function collectFormData() {
  const formData = new FormData(formEl);
  const output = {
    genres: [],
    habits: {},
    discovery: {},
    mood: {},
  };

  formData.forEach((value, key) => {
    if (key === 'genres') {
      output.genres.push(value);
    } else if (['watchFrequency', 'clipLength', 'skipBehavior'].includes(key)) {
      output.habits[key] = value;
    } else if (['source', 'trust'].includes(key)) {
      output.discovery[key] = key === 'trust' ? Number(value) : value;
    } else if (key === 'mood') {
      output.mood.choice = value;
    } else if (key === 'notes') {
      output.mood.notes = value;
    }
  });

  if (!output.mood.notes) {
    delete output.mood.notes;
  }
  if (!output.genres.length) {
    output.genres = ['none selected'];
  }
  return output;
}

function renderOutput() {
  const result = collectFormData();
  jsonOutput.textContent = JSON.stringify(result, null, 2);
  outputPanel.hidden = false;
}

formEl.addEventListener('submit', (event) => {
  event.preventDefault();
  renderOutput();
  const firstButton = formEl.querySelector('button');
  firstButton?.blur();
});

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(jsonOutput.textContent);
    copyButton.textContent = 'Copied';
    setTimeout(() => (copyButton.textContent = 'Copy JSON'), 1200);
  } catch (error) {
    copyButton.textContent = 'Copy failed';
    console.error(error);
    setTimeout(() => (copyButton.textContent = 'Copy JSON'), 1200);
  }
});

const paletteStrip = document.getElementById('palette-strip');
if (paletteStrip) {
  Object.values(config.palette).forEach((color) => {
    const dot = document.createElement('span');
    dot.className = 'palette-dot';
    dot.style.backgroundColor = color.hex;
    dot.setAttribute('title', `${color.name} ${color.pantone}`);
    paletteStrip.appendChild(dot);
  });
}
