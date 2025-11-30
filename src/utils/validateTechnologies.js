export default function validateTechnologies(arr) {
  const errors = [];
  const allowedStatuses = ['not-started', 'in-progress', 'completed'];
  const allowedCategories = ['frontend', 'backend', 'database', 'tools', 'other'];
  const ids = new Set();

  if (!Array.isArray(arr)) {
    return { valid: false, errors: ['technologies должен быть массивом'] };
  }

  arr.forEach((item, idx) => {
    const path = `technologies[${idx}]`;
    if (typeof item !== 'object' || item === null) {
      errors.push(`${path} должен быть объектом`);
      return;
    }

    // id must be integer-like
    if (item.id === undefined || item.id === null || Number.isNaN(Number(item.id))) {
      errors.push(`${path}.id должен быть числом`);
    } else {
      const idNum = Number(item.id);
      if (ids.has(idNum)) errors.push(`${path}.id дублируется: ${idNum}`);
      ids.add(idNum);
    }

    // title
    if (typeof item.title !== 'string' || !item.title.trim()) {
      errors.push(`${path}.title должен быть непустой строкой`);
    }

    // description optional
    if (item.description !== undefined && typeof item.description !== 'string') {
      errors.push(`${path}.description должен быть строкой`);
    }

    // status
    if (typeof item.status !== 'string' || !allowedStatuses.includes(item.status)) {
      errors.push(`${path}.status должен быть одним из: ${allowedStatuses.join(', ')}`);
    }

    // notes
    if (item.notes !== undefined && typeof item.notes !== 'string') {
      errors.push(`${path}.notes должен быть строкой`);
    }

    // category strict
    if (typeof item.category !== 'string' || !allowedCategories.includes(item.category)) {
      errors.push(`${path}.category должен быть одним из: ${allowedCategories.join(', ')}`);
    }

    // deadline (optional) - must be a valid date string if provided
    if (item.deadline !== undefined && item.deadline !== null && item.deadline !== '') {
      const d = new Date(item.deadline);
      if (isNaN(d.getTime())) {
        errors.push(`${path}.deadline должен быть корректной датой (ISO)`);
      }
    }

    // optional vid/вид check: if present must equal 'hdhsusid'
    if ('vid' in item && item.vid !== 'hdhsusid') {
      errors.push(`${path}.vid должен иметь значение "hdhsusid"`);
    }
    if ('вид' in item && item['вид'] !== 'hdhsusid') {
      errors.push(`${path}."вид" должен иметь значение "hdhsusid"`);
    }
  });

  return { valid: errors.length === 0, errors };
}
