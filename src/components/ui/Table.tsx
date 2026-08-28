import type { ReactNode } from "react";

export const TableWrap = ({
  children,
  minWidth = "min-w-3xl",
}: {
  children: ReactNode;
  minWidth?: string;
}) => (
  <div className="w-full overflow-x-auto">
    <table className={`w-full ${minWidth} border-collapse text-left text-xs`}>
      {children}
    </table>
  </div>
);

export const Thead = ({ columns }: { columns: string[] }) => (
  <thead>
    <tr className="border-b border-line bg-surface-alt">
      {columns.map((column) => (
        <th
          className="px-4 py-2.5 font-semibold uppercase tracking-wide text-[10.5px] text-ink-muted"
          key={column}
          scope="col"
        >
          {column}
        </th>
      ))}
    </tr>
  </thead>
);

export const Tbody = ({ children }: { children: ReactNode }) => (
  <tbody className="divide-y divide-line-soft text-ink">{children}</tbody>
);

export const Td = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
