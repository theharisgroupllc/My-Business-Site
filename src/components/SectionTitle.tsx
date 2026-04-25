type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionTitle({ eyebrow, title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-8">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-widest text-brand-teal">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-bold text-brand-navy md:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-2 max-w-2xl text-sm text-slate-600">{subtitle}</p> : null}
    </div>
  );
}
