export default function SectionTitle({ eyebrow, title, description, align = 'center' }) {
  const alignCls = align === 'left' ? 'text-left' : 'text-center'
  return (
    <div className={`${alignCls} mx-auto max-w-2xl`}>
      {eyebrow && (
        <p className="text-gradient-ice font-display text-xs font-bold uppercase tracking-wider">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-frost/65">
          {description}
        </p>
      )}
    </div>
  )
}