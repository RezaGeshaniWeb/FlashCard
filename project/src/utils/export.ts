import type { Difficulty, ExportFlashcard, Flashcard } from '@/types';

const CSV_HEADERS = [
  'front',
  'back',
  'hint',
  'example',
  'tags',
  'difficulty',
  'notes',
] as const;

function escapeCsv(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function unescapeCsv(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/""/g, '"');
  }
  return trimmed;
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}

function toExportCard(
  card: Pick<
    Flashcard,
    'front' | 'back' | 'hint' | 'example' | 'tags' | 'difficulty' | 'notes'
  >,
): ExportFlashcard {
  return {
    front: card.front,
    back: card.back,
    hint: card.hint,
    example: card.example,
    tags: card.tags,
    difficulty: card.difficulty,
    notes: card.notes,
  };
}

export function exportToJson(cards: Flashcard[]): string {
  return JSON.stringify(cards.map(toExportCard), null, 2);
}

export function exportToCsv(cards: Flashcard[]): string {
  const rows = cards.map((card) =>
    [
      escapeCsv(card.front),
      escapeCsv(card.back),
      escapeCsv(card.hint ?? ''),
      escapeCsv(card.example ?? ''),
      escapeCsv(card.tags.join(';')),
      escapeCsv(card.difficulty),
      escapeCsv(card.notes ?? ''),
    ].join(','),
  );

  return [CSV_HEADERS.join(','), ...rows].join('\n');
}

export function exportToMarkdown(cards: Flashcard[]): string {
  return cards
    .map((card) => {
      const lines = [
        `## ${card.front}`,
        '',
        `**Back:** ${card.back}`,
      ];

      if (card.hint) lines.push(`**Hint:** ${card.hint}`);
      if (card.example) lines.push(`**Example:** ${card.example}`);
      if (card.tags.length > 0) {
        lines.push(`**Tags:** ${card.tags.join(', ')}`);
      }
      lines.push(`**Difficulty:** ${card.difficulty}`);
      if (card.notes) lines.push(`**Notes:** ${card.notes}`);
      lines.push('');

      return lines.join('\n');
    })
    .join('\n');
}

function parseDifficulty(value: string | undefined): Difficulty | undefined {
  if (
    value === 'beginner' ||
    value === 'intermediate' ||
    value === 'advanced'
  ) {
    return value;
  }
  return undefined;
}

export function importFromJson(raw: string): ExportFlashcard[] {
  const parsed: unknown = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('JSON import must be an array of flashcards');
  }

  return parsed.map((item, index) => {
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof (item as { front?: unknown }).front !== 'string' ||
      typeof (item as { back?: unknown }).back !== 'string'
    ) {
      throw new Error(`Invalid flashcard at index ${index}`);
    }

    const card = item as ExportFlashcard;
    return {
      front: card.front,
      back: card.back,
      hint: card.hint,
      example: card.example,
      tags: Array.isArray(card.tags) ? card.tags.map(String) : [],
      difficulty: parseDifficulty(card.difficulty) ?? 'beginner',
      notes: card.notes,
    };
  });
}

export function importFromCsv(raw: string): ExportFlashcard[] {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = splitCsvLine(lines[0] ?? '').map((h) =>
    unescapeCsv(h).toLowerCase(),
  );
  const frontIdx = headers.indexOf('front');
  const backIdx = headers.indexOf('back');

  if (frontIdx === -1 || backIdx === -1) {
    throw new Error('CSV must include front and back columns');
  }

  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line).map(unescapeCsv);
    const tagsRaw = cells[headers.indexOf('tags')] ?? '';
    const difficulty = parseDifficulty(cells[headers.indexOf('difficulty')]);

    return {
      front: cells[frontIdx] ?? '',
      back: cells[backIdx] ?? '',
      hint: cells[headers.indexOf('hint')] || undefined,
      example: cells[headers.indexOf('example')] || undefined,
      tags: tagsRaw
        ? tagsRaw.split(/[;|]/).map((t) => t.trim()).filter(Boolean)
        : [],
      difficulty: difficulty ?? 'beginner',
      notes: cells[headers.indexOf('notes')] || undefined,
    };
  });
}

/**
 * Parses Markdown in the form:
 * ## Front
 * **Back:** answer
 * **Hint:** ...
 */
export function importFromMarkdown(raw: string): ExportFlashcard[] {
  const blocks = raw
    .split(/^##\s+/m)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    const lines = block.split(/\r?\n/).map((l) => l.trim());
    const front = lines[0] ?? '';
    const field = (label: string): string | undefined => {
      // Export format: **Label:** value (colon inside bold markers)
      const pattern = new RegExp(
        `^\\*\\*${label}:\\*\\*\\s*(.*)$`,
        'i',
      );
      for (const line of lines) {
        const match = line.match(pattern);
        if (match?.[1] !== undefined) {
          const value = match[1].trim();
          return value || undefined;
        }
      }
      return undefined;
    };

    const tagsRaw = field('Tags');
    const difficulty = parseDifficulty(field('Difficulty'));

    return {
      front,
      back: field('Back') ?? '',
      hint: field('Hint'),
      example: field('Example'),
      tags: tagsRaw
        ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      difficulty: difficulty ?? 'beginner',
      notes: field('Notes'),
    };
  });
}
