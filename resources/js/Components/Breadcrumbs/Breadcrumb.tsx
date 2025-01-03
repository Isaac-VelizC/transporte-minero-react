import { Link } from "@inertiajs/react";

interface BreadcrumbItem {
  name: string;
  path?: string; // Opcional para el último elemento que no necesita un enlace
}

interface BreadcrumbProps {
  breadcrumbs: BreadcrumbItem[];
}

const Breadcrumb = ({ breadcrumbs }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {breadcrumbs[breadcrumbs.length - 1]?.name}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className="flex items-center">
              {breadcrumb.path ? (
                <a className="font-medium" href={breadcrumb.path}>
                  {breadcrumb.name}
                </a>
              ) : (
                <span className="font-medium text-primary">{breadcrumb.name}</span>
              )}
              {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
