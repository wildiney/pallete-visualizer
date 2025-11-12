import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pallete-visualizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pallete-visualizer.html',
  styleUrls: ['./pallete-visualizer.scss'],
})
export class PalleteVisualizer {
  json = '';

  @ViewChild('resultado') result!: ElementRef<HTMLDivElement>;

  constructor(private renderer: Renderer2) {}

  generate() {
    const out = this.result?.nativeElement;
    if (!out) return;

    out.innerHTML = '';

    let data: any;
    try {
      data = JSON.parse(this.json.trim());
    } catch {
      alert('JSON inválido!');
      return;
    }

    const rootKey = Object.keys(data)[0];
    const palettes = data[rootKey];

    if (!palettes || typeof palettes !== 'object') {
      alert('Estrutura inesperada: não encontrei paletas no JSON.');
      return;
    }

    Object.entries(palettes).forEach(([paletteName, colors]) => {
      this.desenharPaleta(
        paletteName,
        colors as Record<string, string>,
        out
      );
    });
  }

  private desenharPaleta(
    nome: string,
    colors: Record<string, string>,
    out: HTMLElement
  ) {
    const container = this.renderer.createElement('div');
    this.renderer.addClass(container, 'paleta');

    const title = this.renderer.createElement('h3');
    this.renderer.setProperty(title, 'textContent', nome);
    this.renderer.appendChild(container, title);

    const canvas = this.renderer.createElement('canvas') as HTMLCanvasElement;
    const w = 480;
    const h = 480;
    canvas.width = w;
    canvas.height = h;
    this.renderer.appendChild(container, canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1) Calcular matiz médio da paleta
    const hsls = Object.values(colors).map((hex) => this.hexToHsl(hex));
    const meanHue =
      hsls.reduce((sum, hsl) => sum + hsl.h, 0) / (hsls.length || 1);

    // 2) Desenhar plano HSL (branco → preto)
    for (let y = 0; y < h; y++) {
      const L = 100 - (y / h) * 100;
      for (let x = 0; x < w; x++) {
        const S = (x / w) * 100;
        ctx.fillStyle = `hsl(${meanHue}, ${S}%, ${L}%)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // 3) Linha curva (Catmull–Rom → Bézier)
    const steps = Object.entries(colors)
      .map(([k, hex]) => ({ step: k, ...this.hexToHsl(hex) }))
      .sort((a: any, b: any) => parseInt(a.step) - parseInt(b.step));

    const points = steps.map((p: any) => ({
      x: (p.s / 100) * w,
      y: ((100 - p.l) / 100) * h,
    }));

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fff';
    ctx.beginPath();

    if (points.length > 1) {
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
      }
    }
    ctx.stroke();

    // 4) Pontos e labels
    ctx.font = '12px system-ui';
    ctx.textBaseline = 'middle';

    steps.forEach((p: any) => {
      const x = (p.s / 100) * w;
      const y = ((100 - p.l) / 100) * h;

      // bolinha
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${p.h}, ${p.s}%, ${p.l}%)`;
      ctx.fill();
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 2;
      ctx.stroke();

      // label
      const text = p.step;
      const textWidth = ctx.measureText(text).width;
      const paddingX = 8;
      const paddingY = 4;
      const radius = 6;

      let textX = x + 12;
      let textY = y;
      ctx.textAlign = 'left';

      if (x + textWidth + 30 > w) {
        textX = x - 12;
        ctx.textAlign = 'right';
      }

      const bgX =
        ctx.textAlign === 'left'
          ? textX - paddingX
          : textX - textWidth - paddingX;
      const bgY = textY - paddingY - 6;
      const bgW = textWidth + paddingX * 2;
      const bgH = paddingY * 2 + 12;

      const bgColor =
        p.l > 50 ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)';
      const textColor = p.l > 50 ? '#fff' : '#000';

      ctx.beginPath();
      this.roundRect(ctx, bgX, bgY, bgW, bgH, radius);
      ctx.fillStyle = bgColor;
      ctx.fill();

      ctx.fillStyle = textColor;
      ctx.fillText(text, textX, textY);
    });

    // 5) Steps abaixo
    const stepsDiv = this.renderer.createElement('div');
    this.renderer.addClass(stepsDiv, 'steps');
    this.renderer.setProperty(
      stepsDiv,
      'textContent',
      steps.map((s: any) => s.step).join(' • ')
    );
    this.renderer.appendChild(container, stepsDiv);

    this.renderer.appendChild(out, container);
  }

  // utilitários
  private hexToHsl(hex: string) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h *= 60;
    }
    return { h, s: s * 100, l: l * 100 };
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}
