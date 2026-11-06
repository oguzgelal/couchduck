export type PillLayout = {
  x: number;
  y: number;
  width: number;
  tag: number;
};

export type PillNeighbors = {
  nextFocusUp?: number;
  nextFocusDown?: number;
  nextFocusLeft?: number;
  nextFocusRight?: number;
};

function nearestByCenter(row: PillLayout[], center: number) {
  return row.reduce((best, pill) =>
    Math.abs(pill.x + pill.width / 2 - center) < Math.abs(best.x + best.width / 2 - center) ? pill : best,
  );
}

export function pillNeighbors(layouts: PillLayout[], belowTag?: number): Map<number, PillNeighbors> {
  const rows: PillLayout[][] = [];
  for (const pill of [...layouts].sort((a, b) => a.y - b.y || a.x - b.x)) {
    const row = rows.at(-1);
    if (row && Math.abs(row[0].y - pill.y) < 1) row.push(pill);
    else rows.push([pill]);
  }

  const first = rows[0]?.[0];
  const last = rows.at(-1)?.at(-1);
  const neighbors = new Map<number, PillNeighbors>();
  rows.forEach((row, rowIndex) => {
    const above = rows[rowIndex - 1];
    const below = rows[rowIndex + 1];
    row.forEach((pill, column) => {
      const center = pill.x + pill.width / 2;
      const isRowEnd = column === row.length - 1;
      neighbors.set(pill.tag, {
        nextFocusUp: above && nearestByCenter(above, center).tag,
        nextFocusDown: below ? nearestByCenter(below, center).tag : belowTag,
        nextFocusLeft: column === 0 ? (above?.at(-1) ?? last)?.tag : undefined,
        nextFocusRight: isRowEnd ? (below?.[0] ?? first)?.tag : undefined,
      });
    });
  });
  return neighbors;
}
