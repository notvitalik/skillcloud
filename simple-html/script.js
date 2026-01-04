const initialRows = [
  { skill: '.NET', exp: 5 },
  { skill: 'C#', exp: 5 },
  { skill: 'SQL', exp: 7 }
];

let state = {
  rows: cloneRows(initialRows),
  screen: 'input'
};

let resizeHandler = null;
let resizeTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  render();
});

function cloneRows(rows) {
  return rows.map((row) => ({ skill: row.skill, exp: row.exp }));
}

function setState(partial) {
  state = { ...state, ...partial };
  render();
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  if (state.screen === 'input') {
    teardownResize();
    renderInputScreen(app);
  } else {
    renderCloudScreen(app);
  }
}

function renderInputScreen(container) {
  const card = document.createElement('div');
  card.className = 'card';

  const header = document.createElement('div');
  header.className = 'header';

  const titleBlock = document.createElement('div');
  const title = document.createElement('h1');
  title.className = 'title';
  title.textContent = 'Skill Cloud Generator';
  const subtitle = document.createElement('p');
  subtitle.className = 'subtitle';
  subtitle.textContent = 'Add your skills and experience to create an exportable word cloud.';
  titleBlock.append(title, subtitle);
  header.append(titleBlock);

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'table-wrapper';

  const table = document.createElement('table');
  table.className = 'table';

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['Skill', 'Experience (years)', 'Actions'].forEach((label) => {
    const th = document.createElement('th');
    th.textContent = label;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);

  const tbody = document.createElement('tbody');
  const validation = validateRows(state.rows);

  state.rows.forEach((row, index) => {
    const tr = document.createElement('tr');

    const skillCell = document.createElement('td');
    const skillLabel = document.createElement('label');
    skillLabel.className = 'sr-only';
    skillLabel.setAttribute('for', `skill-${index}`);
    skillLabel.textContent = `Skill ${index + 1}`;
    const skillInput = document.createElement('input');
    skillInput.id = `skill-${index}`;
    skillInput.type = 'text';
    skillInput.className = `input ${validation.errorMap[index]?.skill ? 'error' : ''}`;
    skillInput.value = row.skill;
    skillInput.placeholder = 'e.g. JavaScript';
    skillInput.addEventListener('input', (e) => {
      updateRow(index, { skill: e.target.value });
    });
    skillCell.append(skillLabel, skillInput);

    const expCell = document.createElement('td');
    const expLabel = document.createElement('label');
    expLabel.className = 'sr-only';
    expLabel.setAttribute('for', `exp-${index}`);
    expLabel.textContent = `Experience for ${row.skill || 'skill ' + (index + 1)}`;
    const expInput = document.createElement('input');
    expInput.id = `exp-${index}`;
    expInput.type = 'number';
    expInput.min = '0';
    expInput.step = '1';
    expInput.className = `input ${validation.errorMap[index]?.exp ? 'error' : ''}`;
    expInput.value = row.exp;
    expInput.addEventListener('input', (e) => {
      updateRow(index, { exp: e.target.value });
    });
    expCell.append(expLabel, expInput);

    const actionCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'icon-button';
    deleteButton.title = 'Delete row';
    deleteButton.textContent = '×';
    deleteButton.disabled = state.rows.length <= 1;
    deleteButton.addEventListener('click', () => removeRow(index));
    actionCell.appendChild(deleteButton);

    tr.append(skillCell, expCell, actionCell);

    const errorRow = document.createElement('tr');
    const errorCell = document.createElement('td');
    errorCell.colSpan = 3;

    const skillError = validation.errorMap[index]?.skill;
    const expError = validation.errorMap[index]?.exp;
    if (skillError || expError) {
      const errorText = document.createElement('div');
      errorText.className = 'error-text';
      errorText.textContent = skillError || expError;
      errorCell.appendChild(errorText);
    }
    errorRow.appendChild(errorCell);

    tbody.append(tr, errorRow);
  });

  table.append(thead, tbody);
  tableWrapper.appendChild(table);

  const buttonRow = document.createElement('div');
  buttonRow.className = 'button-row';

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'button secondary';
  addButton.textContent = '+ Add row';
  addButton.disabled = state.rows.length >= 10;
  addButton.addEventListener('click', addRow);

  const helper = document.createElement('p');
  helper.className = 'helper-text';
  helper.textContent = state.rows.length >= 10 ? 'Maximum of 10 skills reached.' : '';

  const generateButton = document.createElement('button');
  generateButton.type = 'button';
  generateButton.className = 'button primary';
  generateButton.textContent = 'Generate Cloud';
  generateButton.disabled = !validation.isValid;
  generateButton.addEventListener('click', () => {
    if (validation.isValid) {
      setState({ screen: 'cloud' });
    }
  });

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'button ghost';
  resetBtn.textContent = 'Reset';
  resetBtn.addEventListener('click', () => setState({ rows: cloneRows(initialRows), screen: 'input' }));

  buttonRow.append(addButton, generateButton, resetBtn);

  card.append(header, tableWrapper, buttonRow, helper);
  container.appendChild(card);
}

function renderCloudScreen(container) {
  const card = document.createElement('div');
  card.className = 'card screen-cloud';

  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'button secondary';
  backButton.textContent = '← Back';
  backButton.addEventListener('click', () => setState({ screen: 'input' }));

  const exportSvgButton = document.createElement('button');
  exportSvgButton.type = 'button';
  exportSvgButton.className = 'button primary';
  exportSvgButton.textContent = 'Export SVG';
  exportSvgButton.addEventListener('click', exportSVG);

  const exportPngButton = document.createElement('button');
  exportPngButton.type = 'button';
  exportPngButton.className = 'button primary';
  exportPngButton.textContent = 'Export PNG';
  exportPngButton.addEventListener('click', exportPNG);

  const infoLine = document.createElement('div');
  infoLine.className = 'info-line';
  infoLine.textContent = `Generated from ${state.rows.length} skill${state.rows.length === 1 ? '' : 's'}`;

  toolbar.append(backButton, exportSvgButton, exportPngButton, infoLine);

  const cloudFrame = document.createElement('div');
  cloudFrame.className = 'cloud-frame';

  const cloudContainer = document.createElement('div');
  cloudContainer.className = 'cloud-container';
  cloudFrame.appendChild(cloudContainer);

  card.append(toolbar, cloudFrame);
  container.appendChild(card);

  renderCloudSVG(cloudContainer);
  setupResize(cloudContainer);
}

function updateRow(index, changes) {
  const updatedRows = cloneRows(state.rows);
  updatedRows[index] = { ...updatedRows[index], ...changes };
  setState({ rows: updatedRows });
}

function addRow() {
  if (state.rows.length >= 10) return;
  const updatedRows = [...state.rows, { skill: '', exp: '' }];
  setState({ rows: updatedRows });
}

function removeRow(index) {
  if (state.rows.length <= 1) return;
  const updatedRows = state.rows.filter((_, i) => i !== index);
  setState({ rows: updatedRows });
}

function validateRows(rows) {
  const errorMap = rows.map(() => ({}));
  rows.forEach((row, index) => {
    const skill = (row.skill || '').trim();
    const expValue = row.exp;

    if (!skill) {
      errorMap[index].skill = 'Skill cannot be empty.';
    }

    if (expValue === '' || expValue === null || expValue === undefined) {
      errorMap[index].exp = 'Experience is required.';
    } else {
      const num = Number(expValue);
      const isInteger = Number.isInteger(num);
      if (!isInteger || num < 0) {
        errorMap[index].exp = 'Experience must be an integer 0 or above.';
      }
    }
  });

  const hasErrors = errorMap.some((entry) => entry.skill || entry.exp);
  const isValid = rows.length > 0 && !hasErrors;

  return { errorMap, isValid };
}

function renderCloudSVG(container) {
  const normalizedRows = state.rows
    .map((row) => ({ skill: row.skill.trim(), exp: Number(row.exp) }))
    .filter((row) => row.skill !== '' && Number.isFinite(row.exp));

  container.innerHTML = '';

  if (!normalizedRows.length) {
    const empty = document.createElement('p');
    empty.className = 'helper-text';
    empty.textContent = 'No skills to display.';
    container.appendChild(empty);
    return;
  }

  const width = container.clientWidth || 900;
  const height = container.clientHeight || 600;
  const viewBoxWidth = 900;
  const viewBoxHeight = 600;
  const cx = viewBoxWidth / 2;
  const cy = viewBoxHeight / 2;
  const goldenAngle = 137.5 * (Math.PI / 180);
  const baseRadius = 30;
  const radiusStep = 45;

  const sortedRows = [...normalizedRows].sort((a, b) => {
    if (b.exp === a.exp) return a.skill.localeCompare(b.skill);
    return b.exp - a.exp;
  });

  const exps = sortedRows.map((r) => r.exp);
  const minExp = Math.min(...exps);
  const maxExp = Math.max(...exps);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());
  svg.setAttribute('aria-label', 'Skill word cloud');
  svg.setAttribute('data-cloud-svg', 'true');

  sortedRows.forEach((row, index) => {
    const angle = index * goldenAngle;
    const radius = baseRadius + index * radiusStep;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    let fontSize = calculateFontSize(row.exp, minExp, maxExp);
    const maxWordWidth = viewBoxWidth * 0.7;

    while (estimateTextWidth(row.skill, fontSize) > maxWordWidth && fontSize > 12) {
      fontSize -= 1;
    }

    const opacity = mapNumber(row.exp, minExp, maxExp, 0.65, 1);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x.toFixed(2));
    text.setAttribute('y', y.toFixed(2));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', fontSize.toString());
    text.setAttribute('fill', `rgba(56, 189, 248, ${opacity.toFixed(2)})`);
    text.textContent = row.skill;

    svg.appendChild(text);
  });

  container.appendChild(svg);
}

function calculateFontSize(exp, minExp, maxExp) {
  if (minExp === maxExp) return 36;
  return Math.round(mapNumber(exp, minExp, maxExp, 18, 64));
}

function estimateTextWidth(text, fontSize) {
  const avgWidth = fontSize * 0.6;
  return text.length * avgWidth;
}

function mapNumber(value, inMin, inMax, outMin, outMax) {
  if (inMin === inMax) return (outMin + outMax) / 2;
  const ratio = (value - inMin) / (inMax - inMin);
  return outMin + ratio * (outMax - outMin);
}

function setupResize(container) {
  teardownResize();
  resizeHandler = () => {
    if (resizeTimer) {
      clearTimeout(resizeTimer);
    }
    resizeTimer = window.setTimeout(() => {
      if (state.screen === 'cloud') {
        renderCloudSVG(container);
      }
    }, 150);
  };
  window.addEventListener('resize', resizeHandler);
}

function teardownResize() {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }
  resizeHandler = null;
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  resizeTimer = null;
}

function exportSVG() {
  const svg = document.querySelector('[data-cloud-svg]');
  if (!svg) return;
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'skill-cloud.svg';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportPNG() {
  const svg = document.querySelector('[data-cloud-svg]');
  if (!svg) return;
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const svg64 = btoa(unescape(encodeURIComponent(source)));
  const image64 = `data:image/svg+xml;base64,${svg64}`;

  const canvas = document.createElement('canvas');
  const [, , vbWidth, vbHeight] = (svg.getAttribute('viewBox') || '0 0 900 600').split(' ').map(Number);
  canvas.width = vbWidth || 900;
  canvas.height = vbHeight || 600;
  const ctx = canvas.getContext('2d');

  const image = new Image();
  image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'skill-cloud.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  };
  image.src = image64;
}
