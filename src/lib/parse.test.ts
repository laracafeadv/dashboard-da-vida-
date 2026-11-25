import { describe, expect, it } from 'vitest';
import { parseCapture } from './parse';

// 25/11/2026 é uma quarta-feira.
const TODAY = '2026-11-25';

describe('parseCapture', () => {
  it('entende dia da semana, hora, área e prioridade', () => {
    const p = parseCapture('pagar IPVA sexta 15h #finanças !', TODAY);
    expect(p).toMatchObject({ title: 'Pagar IPVA', date: '2026-11-27', time: '15:00', area: 'Finanças', star: true });
  });
  it('entende amanhã com acento', () => {
    expect(parseCapture('ligar para a vovó amanhã', TODAY)).toMatchObject({ title: 'Ligar para a vovó', date: '2026-11-26' });
  });
  it('mesmo dia da semana vai para a próxima semana', () => {
    expect(parseCapture('reunião quarta', TODAY).date).toBe('2026-12-02');
  });
  it('dia do mês já passado vai para o mês seguinte', () => {
    expect(parseCapture('pagar cartão dia 10', TODAY).date).toBe('2026-12-10');
  });
  it('data dd/mm', () => {
    expect(parseCapture('consulta 03/12 9h30', TODAY)).toMatchObject({ date: '2026-12-03', time: '09:30', title: 'Consulta' });
  });
  it('aguardando alguém', () => {
    expect(parseCapture('retorno do contador @espera', TODAY)).toMatchObject({ waiting: true, title: 'Retorno do contador' });
  });
  it('sem marcações fica para hoje', () => {
    expect(parseCapture('comprar café', TODAY)).toMatchObject({ date: TODAY, title: 'Comprar café', star: false });
  });
  it('não confunde "sexta" dentro de outra palavra', () => {
    expect(parseCapture('sextante antigo', TODAY).date).toBe(TODAY);
  });
});
