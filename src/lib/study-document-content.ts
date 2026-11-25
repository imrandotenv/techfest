export interface StudySection {
  heading: string;
  bullets: string[];
  code?: { language: string; snippet: string };
}

export interface StudyDocumentContent {
  summary: string;
  keyFormulas: string[];
  sections: StudySection[];
  solvedPyqs: Array<{ q: string; a: string }>;
}

export function getStudyContentForSubject(
  subjectCode: string,
  subjectName: string,
  title: string
): StudyDocumentContent {
  const code = subjectCode.toUpperCase().replace(/\s+/g, '');

  if (code.includes('CS301') || code.includes('CS391')) {
    return {
      summary: `${title} — Complete MAKAUT module summary covering Asymptotic Analysis, Stacks/Queues, Linked Lists, Trees (BST/AVL/B+), Graphs (BFS/DFS/Dijkstra), and Sorting/Hashing.`,
      keyFormulas: [
        'Binary Search / Balanced BST / AVL Search: O(log n)',
        'MergeSort / HeapSort Worst Case: O(n log n) | QuickSort Worst Case: O(n²)',
        'Stack via 2 Queues: Push O(n) or Pop O(n) via element rotation',
        'AVL Balance Factor: BF = height(Left) - height(Right) ∈ {-1, 0, +1}',
      ],
      sections: [
        {
          heading: 'Module 1–2: Stacks, Queues & Linked Lists',
          bullets: [
            'Arrays provide O(1) random access and superior CPU cache spatial locality via contiguous memory.',
            'Singly Linked Lists allow O(1) insertion/deletion at known pointers without contiguous reallocation.',
            'Infix to Postfix conversion uses an operator stack respecting precedence (^ > * / > + -) and associativity.',
          ],
          code: {
            language: 'c',
            snippet: `// Iterative Binary Search in C — O(log n) time, O(1) space
int binarySearch(int arr[], int n, int key) {
  int low = 0, high = n - 1;
  while (low <= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == key) return mid;
    if (arr[mid] < key) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
          },
        },
        {
          heading: 'Module 3–5: Trees, Graphs & Hashing',
          bullets: [
            'AVL Trees perform LL, RR, LR, and RL rotations in O(1) pointer updates to maintain logarithmic height.',
            'B+ Trees link all leaf nodes in a doubly-linked list for fast SQL range queries.',
            'Kruskal (DSU) and Prim build Minimum Spanning Trees; Dijkstra requires non-negative edge weights.',
          ],
        },
      ],
      solvedPyqs: [
        {
          q: 'Why does QuickSort degrade to O(n²) and how is it prevented?',
          a: 'When the input is already sorted and the first/last element is picked as pivot, partitions are 0 and n-1. Randomized pivot or median-of-three restores expected O(n log n).',
        },
        {
          q: 'Minimum queues required to implement a LIFO Stack?',
          a: '2 queues (or 1 queue with rotation of n-1 elements after every enqueue).',
        },
      ],
    };
  }

  if (code.includes('ESC301') || code.includes('ESC391') || code.includes('EC302')) {
    return {
      summary: `${title} — MAKAUT Analog & Digital Electronics quick-revision guide covering BJT/Op-Amp Oscillators, K-Map Minimization, Combinational MUX/Adder design, and Sequential Flip-Flops.`,
      keyFormulas: [
        'Barkhausen Criterion: |Aβ| = 1 and total loop phase shift = 0° or 360°',
        'Op-Amp Inverting Gain: Av = -Rf / Rin | Non-Inverting: Av = 1 + (Rf / Rin)',
        'Boolean De Morgan Laws: (A·B)\' = A\' + B\' and (A+B)\' = A\'·B\'',
        'Mod-N Ripple Counter requires ceil(log2(N)) Flip-Flops',
      ],
      sections: [
        {
          heading: 'Analog Circuits & Feedback Oscillators',
          bullets: [
            'Common Emitter (CE) BJT amplifier provides high voltage/current gain with 180° phase inversion.',
            'Negative feedback stabilizes gain, reduces distortion, and increases closed-loop bandwidth.',
            'RC Phase-Shift Oscillator uses 3 RC sections (60° each = 180°) plus CE stage (180°) to satisfy 360° Barkhausen phase.',
          ],
        },
        {
          heading: 'Digital Logic, K-Maps & Sequential Circuits',
          bullets: [
            '4-variable K-Map groups powers of 2 (16, 8, 4, 2, 1) to eliminate redundant literals; Don\'t-Care (X) cells maximize group size.',
            'J-K Flip-Flop Race-Around Condition occurs when J=K=1 and clock pulse width > propagation delay; solved by Master-Slave or edge triggering.',
          ],
          code: {
            language: 'verilog',
            snippet: `// 4:1 Multiplexer in Verilog HDL
module mux4to1(input [3:0] d, input [1:0] sel, output reg y);
  always @(*) begin
    case (sel)
      2'b00: y = d[0];
      2'b01: y = d[1];
      2'b10: y = d[2];
      2'b11: y = d[3];
    endcase
  end
endmodule`,
          },
        },
      ],
      solvedPyqs: [
        {
          q: 'Why do CMOS gates consume near-zero static power compared to TTL?',
          a: 'In steady state, either the pull-up PMOS or pull-down NMOS network is OFF, leaving no direct DC path from VDD to GND.',
        },
      ],
    };
  }

  if (code.includes('CS302') || code.includes('CS392') || code.includes('CS402')) {
    return {
      summary: `${title} — Computer Organisation & Architecture notes covering IEEE-754 Floating Point, Booth's Multiplication, 5-Stage Pipelining, Cache Mapping, and Virtual Memory.`,
      keyFormulas: [
        'Average Memory Access Time (AMAT) = Hit Time + (Miss Rate × Miss Penalty)',
        '5-Stage Pipeline Speedup (ideal): k = 5 stages; CPI → 1 without hazards',
        'Direct Mapped Cache Index bits = log2(Number of Cache Lines)',
      ],
      sections: [
        {
          heading: 'ALU, Booth\'s Algorithm & Pipelining',
          bullets: [
            'Booth\'s algorithm handles signed 2\'s complement multiplication by scanning adjacent bit pairs (01 -> +M, 10 -> -M).',
            'Three pipeline hazards: Structural (hardware conflict), Data (RAW/WAR/WAW), and Control (branch misprediction).',
            'Operand forwarding (bypassing) resolves most RAW hazards without stalling the pipeline.',
          ],
          code: {
            language: 'python',
            snippet: `# Booth's Multiplication Step Trace Helper
def arithmetic_right_shift(a, q, q_1, bits=4):
    combined = (a << (bits + 1)) | (q << 1) | q_1
    if a & (1 << (bits - 1)):
        combined |= (1 << (2 * bits + 1))
    shifted = combined >> 1
    return (shifted >> (bits + 1)) & ((1 << bits) - 1), (shifted >> 1) & ((1 << bits) - 1), shifted & 1`,
          },
        },
      ],
      solvedPyqs: [
        {
          q: 'Distinguish Spatial Locality vs Temporal Locality.',
          a: 'Temporal locality means recently accessed data is likely accessed again soon; spatial locality means nearby memory addresses (same cache line) are likely accessed next.',
        },
      ],
    };
  }

  if (code.includes('BSC301') || code.includes('BSM301') || code.includes('MATH')) {
    return {
      summary: `${title} — MAKAUT Mathematics-III (Differential Calculus, PDEs, Laplace Transforms & Probability) solved module notes & PYQ formulas.`,
      keyFormulas: [
        'Laplace Transform: L{e^(at)} = 1 / (s - a), s > a',
        'Bayes Theorem: P(A|B) = [P(B|A) · P(A)] / P(B)',
        'Normal Distribution: Z = (X - μ) / σ | Poisson Mean = Variance = λ',
      ],
      sections: [
        {
          heading: 'Differential Calculus, PDEs & Probability',
          bullets: [
            'Rolle\'s Theorem and Lagrange\'s Mean Value Theorem (LMVT) require continuity on [a,b] and differentiability on (a,b).',
            '1D Wave Equation: ∂²u/∂t² = c²(∂²u/∂x²) and 1D Heat Equation: ∂u/∂t = c²(∂²u/∂x²) solved by separation of variables.',
          ],
        },
      ],
      solvedPyqs: [
        {
          q: 'State the condition for an exact differential equation M dx + N dy = 0.',
          a: '∂M/∂y = ∂N/∂x across the simply connected domain.',
        },
      ],
    };
  }

  return {
    summary: `${title} — Official MAKAUT B.Tech study guide for ${subjectName} (${subjectCode}) curated for SETGOI students.`,
    keyFormulas: [
      `Course Code: ${subjectCode} — ${subjectName}`,
      'Focus on core definitions, edge cases, complexity/efficiency tradeoffs, and MAKAUT 5-mark/15-mark derivations.',
    ],
    sections: [
      {
        heading: 'Core Syllabus Highlights & Exam Strategy',
        bullets: [
          `Review foundational principles and standard derivations for ${subjectName}.`,
          'Practice drawing clean labeled block diagrams, truth tables, or pseudocode traces for 15-mark MAKAUT questions.',
          'Cross-check your preparation in SETTech AI Viva Studio (/viva) before internal CA/PCA and semester exams.',
        ],
      },
    ],
    solvedPyqs: [
      {
        q: `What is the most frequently asked exam topic in ${subjectCode}?`,
        a: `Core architectural mechanisms, boundary-condition analysis, and comparative tradeoffs in ${subjectName}.`,
      },
    ],
  };
}

export function buildPrintableHtmlDocument(params: {
  title: string;
  subjectCode: string;
  subjectName: string;
  branch: string;
  semester: number;
  academicYear?: string;
  verified?: boolean;
  markdownContent?: string | null;
}): string {
  const content = getStudyContentForSubject(
    params.subjectCode,
    params.subjectName,
    params.title
  );

  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(params.subjectCode)} — ${escapeHtml(params.title)} | SETTech SETGOI</title>
  <style>
    @page { size: A4; margin: 16mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #09090B; background: #FAFAFA; margin: 0; padding: 32px; line-height: 1.6; }
    .sheet { max-width: 820px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E4E4E7; border-radius: 14px; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #09090B; padding-bottom: 16px; margin-bottom: 24px; }
    .inst { font-size: 11px; font-family: monospace; color: #52525B; text-transform: uppercase; letter-spacing: 0.08em; }
    h1 { font-size: 22px; margin: 6px 0; color: #09090B; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-family: monospace; font-size: 11px; font-weight: 700; background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }
    .verified { background: #ECFDF5; color: #047857; border-color: #A7F3D0; margin-left: 6px; }
    h2 { font-size: 15px; color: #2563EB; margin-top: 24px; border-bottom: 1px solid #E4E4E7; padding-bottom: 6px; }
    ul { padding-left: 20px; }
    li { margin-bottom: 6px; font-size: 14px; }
    .formula-box { background: #F8FAFC; border: 1px solid #E4E4E7; border-radius: 10px; padding: 14px 18px; font-family: monospace; font-size: 12.5px; }
    pre { background: #09090B; color: #F4F4F5; padding: 14px; border-radius: 10px; overflow-x: auto; font-size: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .qa { background: #FAFAFA; border: 1px solid #E4E4E7; border-radius: 10px; padding: 12px 16px; margin-bottom: 10px; }
    .footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid #E4E4E7; font-size: 11px; font-family: monospace; color: #71717A; display: flex; justify-content: space-between; }
    @media print { body { background: #FFFFFF; padding: 0; } .sheet { border: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div>
        <div class="inst">Sanaka Educational Trust's Group of Institutions (SETGOI) • MAKAUT Vault</div>
        <h1>${escapeHtml(params.title)}</h1>
        <div>
          <span class="badge">${escapeHtml(params.subjectCode)}</span>
          ${params.verified ? '<span class="badge verified">Faculty Verified</span>' : ''}
        </div>
      </div>
      <div style="text-align:right; font-family:monospace; font-size:12px; color:#52525B;">
        <div><strong>${escapeHtml(params.branch)}</strong> • Sem ${params.semester}</div>
        <div>${escapeHtml(params.academicYear || '2026-2027')}</div>
        <div>settech.ceimran.in</div>
      </div>
    </div>

    <p style="font-size:14px; color:#3F3F46;">${escapeHtml(content.summary)}</p>

    ${
      params.markdownContent
        ? `<div style="margin-top:16px; white-space:pre-wrap; font-size:13.5px; line-height:1.7; color:#18181B;">${escapeHtml(params.markdownContent)}</div>`
        : `<h2>Key Formulas &amp; Quick Reference</h2>
    <div class="formula-box">
      <ul>${content.keyFormulas.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
    </div>

    ${content.sections
      .map(
        (sec) => `
      <h2>${escapeHtml(sec.heading)}</h2>
      <ul>${sec.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
      ${sec.code ? `<pre><code>${escapeHtml(sec.code.snippet)}</code></pre>` : ''}
    `
      )
      .join('')}

    <h2>Solved MAKAUT PYQs</h2>
    ${content.solvedPyqs
      .map(
        (qa) => `
      <div class="qa">
        <div style="font-weight:700; font-size:13.5px;">Q: ${escapeHtml(qa.q)}</div>
        <div style="font-size:13px; color:#3F3F46; margin-top:4px;"><strong>Ans:</strong> ${escapeHtml(qa.a)}</div>
      </div>
    `
      )
      .join('')}`
    }

    <div class="footer">
      <span>Generated by SETTech Academic Vault • SETGOI Durgapur</span>
      <span>Press Ctrl+P / Cmd+P to Save as PDF</span>
    </div>
  </div>
</body>
</html>`;
}
