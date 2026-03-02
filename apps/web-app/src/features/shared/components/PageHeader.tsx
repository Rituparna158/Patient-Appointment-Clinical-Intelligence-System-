  import type { PageHeaderProps } from "../types/shared.types"

  export default function PageHeader({
    title,
    description,
    action,
  }: PageHeaderProps) {
    return (
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">{title}</h1>
            {description && (
              <p className="page-description">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
    )
  }
