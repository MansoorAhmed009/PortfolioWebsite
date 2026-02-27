type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {eyebrow ? (
        <p className="mb-2 text-xs uppercase tracking-[0.24em] text-cyan-300/90">{eyebrow}</p>
      ) : null}
      <h2 className="text-balance text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl\">{title}</h2>
      {description ? (
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm text-slate-300 md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
