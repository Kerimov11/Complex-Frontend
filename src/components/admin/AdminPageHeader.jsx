export default function AdminPageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-4 flex flex-col gap-2.5 sm:mb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-ice-300">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-0.5 font-display text-xl font-bold text-white sm:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-frost/55 sm:text-sm">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}
