/** Título no estilo da referência: a primeira palavra em itálico condensado, o resto em versais finas. */
export function MixTitle({ text }: { text: string }) {
  const [first, ...rest] = text.split(' ');
  if (!rest.length) return <span className="mix">{first}</span>;
  return (
    <>
      <span className="mix">{first}</span> {rest.join(' ')}
    </>
  );
}
