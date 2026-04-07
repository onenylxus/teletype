import { useSelector } from 'react-redux';
import '../styles/Result.scss';

function countWordStats(target, typed) {
  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;

  const shared = Math.min(target.length, typed.length);
  for (let index = 0; index < shared; index += 1) {
    if (target[index] === typed[index]) {
      correct += 1;
    } else {
      incorrect += 1;
    }
  }

  if (typed.length > target.length) {
    extra += typed.length - target.length;
  }

  if (target.length > typed.length) {
    missed += target.length - typed.length;
  }

  return { correct, incorrect, extra, missed };
}

function resolveKind(input) {
  if (input.kind) {
    return input.kind;
  }

  if (input.key === 'Backspace') {
    return 'correction';
  }

  if (input.key === ' ') {
    return input.typed === input.word ? 'commit' : 'error';
  }

  const typedBefore = input.typed ?? '';
  const word = input.word ?? '';
  const nextTyped = typedBefore + input.key;

  return word.slice(0, nextTyped.length) === nextTyped ? 'input' : 'error';
}

function buildTicks(totalSeconds) {
  const alignedTotal = Math.max(5, Math.floor(totalSeconds / 5) * 5);
  let step = 5;

  for (let candidate = 5; candidate <= alignedTotal; candidate += 5) {
    const count = Math.floor(alignedTotal / candidate) + 1;
    if (count >= 3 && count <= 5) {
      step = candidate;
      break;
    }
  }

  const ticks = [];
  for (let second = 0; second <= alignedTotal; second += step) {
    ticks.push(second);
  }

  if (ticks[ticks.length - 1] !== alignedTotal) {
    ticks.push(alignedTotal);
  }

  return ticks;
}

function buildSeries(inputs, limit) {
  if (!inputs.length) {
    return { values: [0], errors: [0], corrections: [0], max: 1, ticks: [{ index: 0, label: '0s' }] };
  }

  const start = inputs[0].at;
  const duration = Math.max(limit * 1000, inputs[inputs.length - 1].at - start + 1);
  const bucketCount = Math.max(1, Math.ceil(duration / 1000));
  const values = Array(bucketCount).fill(0);
  const errors = Array(bucketCount).fill(0);
  const corrections = Array(bucketCount).fill(0);

  inputs.forEach((input) => {
    const bucket = Math.min(bucketCount - 1, Math.floor((input.at - start) / 1000));
    const kind = resolveKind(input);

    values[bucket] += 1;
    if (kind === 'error') {
      errors[bucket] += 1;
    }
    if (kind === 'correction') {
      corrections[bucket] += 1;
    }
  });

  const max = Math.max(1, ...values, ...errors, ...corrections);
  const ticks = buildTicks(bucketCount)
    .map((second) => ({
      index: Math.min(bucketCount - 1, second),
      label: `${second}s`
    }));

  return { values, errors, corrections, max, ticks };
}

export default function Result() {
  const {
    pref: { limit, type },
    tester: { list, history, inputs },
  } = useSelector((state) => state);

  const typedWords = history.length;
  const correctWords = history.filter((word, index) => word === list[index]).length;
  const charStats = history.map((word, index) => countWordStats(list[index] ?? '', word));
  const correctChars = charStats.reduce((sum, stat) => sum + stat.correct, 0);
  const incorrectChars = charStats.reduce((sum, stat) => sum + stat.incorrect, 0);
  const extraChars = charStats.reduce((sum, stat) => sum + stat.extra, 0);
  const missedChars = charStats.reduce((sum, stat) => sum + stat.missed, 0);
  const totalTypedChars = correctChars + incorrectChars + extraChars;
  const wpm = (correctChars * 12) / limit;
  const raw = (totalTypedChars * 12) / limit;
  const accuracy = totalTypedChars === 0 ? 0 : Math.round((correctChars / totalTypedChars) * 100);
  const consistency = (() => {
    const buckets = buildSeries(inputs, limit).values;
    if (buckets.length < 2) {
      return 100;
    }

    const average = buckets.reduce((sum, value) => sum + value, 0) / buckets.length;
    if (average === 0) {
      return 100;
    }

    const variance = buckets.reduce((sum, value) => sum + ((value - average) ** 2), 0) / buckets.length;
    const deviation = Math.sqrt(variance);
    return Math.max(0, Math.round((1 - deviation / average) * 100));
  })();

  const graph = buildSeries(inputs, limit);
  const width = 760;
  const height = 220;
  const padding = 26;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  const bucketWidth = plotWidth / Math.max(graph.values.length, 1);
  const barWidth = Math.max(5, Math.min(16, bucketWidth * 0.36));
  const linePoints = graph.values
    .map((value, index) => {
      const x = padding + (index / Math.max(graph.values.length - 1, 1)) * plotWidth;
      const y = height - padding - (value / graph.max) * plotHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="result-shell">
      <section className="result-overview">
        <div className="hero-card">
          <span className="eyebrow">result</span>
          <h1>{`${Math.round(wpm)} wpm`}</h1>
          <p>{`${accuracy}% accuracy`}</p>
          <p>{`${correctWords}/${typedWords} words correct`}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>raw</span>
            <strong>{Math.round(raw)}</strong>
          </div>
          <div className="stat-card">
            <span>characters</span>
            <strong>{`${correctChars}/${incorrectChars}/${extraChars}/${missedChars}`}</strong>
          </div>
          <div className="stat-card">
            <span>consistency</span>
            <strong>{`${consistency}%`}</strong>
          </div>
          <div className="stat-card">
            <span>time</span>
            <strong>{`${limit}s`}</strong>
          </div>
          <div className="stat-card">
            <span>test type</span>
            <strong>{type}</strong>
          </div>
          <div className="stat-card">
            <span>key inputs</span>
            <strong>{inputs.length}</strong>
          </div>
        </div>
      </section>

      <section className="graph-card">
        <div className="section-heading">
          <span>typing history graph</span>
          <span>{inputs.length ? `${inputs.length} inputs recorded` : 'no inputs recorded'}</span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="typing history graph">
          {[0, 0.25, 0.5, 0.75, 1].map((mark) => (
            <line
              key={mark}
              x1={padding}
              x2={width - padding}
              y1={padding + (height - padding * 2) * mark}
              y2={padding + (height - padding * 2) * mark}
              className="grid-line"
            />
          ))}

          <polyline className="graph-area" points={`${padding},${height - padding} ${linePoints} ${width - padding},${height - padding}`} />
          <polyline className="graph-line history-line" points={linePoints} />

          {graph.values.map((value, index) => {
            const centerX = padding + (index + 0.5) * bucketWidth;
            const baseY = height - padding;
            const inputHeight = (value / graph.max) * plotHeight;
            const errorHeight = graph.errors[index] > 0 ? Math.max(4, (graph.errors[index] / graph.max) * plotHeight) : 0;
            const correctionHeight = graph.corrections[index] > 0 ? Math.max(4, (graph.corrections[index] / graph.max) * plotHeight) : 0;

            return (
              <g key={`${index}-${value}`}>
                {graph.errors[index] > 0 ? (
                  <rect
                    className="graph-bar error-bar"
                    x={centerX - barWidth - 3}
                    y={baseY - errorHeight}
                    width={barWidth}
                    height={errorHeight}
                    rx="2"
                  />
                ) : null}

                {graph.corrections[index] > 0 ? (
                  <rect
                    className="graph-bar correction-bar"
                    x={centerX + 3}
                    y={baseY - correctionHeight}
                    width={barWidth}
                    height={correctionHeight}
                    rx="2"
                  />
                ) : null}
              </g>
            );
          })}

          {graph.ticks.map(({ index, label }) => {
            const x = padding + (index / Math.max(graph.values.length - 1, 1)) * plotWidth;
            return (
              <text key={label} x={x} y={height - 8} textAnchor="middle" className="axis-label">
                {label}
              </text>
            );
          })}
        </svg>
        <div className="legend">
          <span><i className="legend-swatch history" />inputs per second</span>
          <span><i className="legend-swatch error" />errors</span>
          <span><i className="legend-swatch correction" />corrections</span>
        </div>
      </section>
    </div>
  );
};
