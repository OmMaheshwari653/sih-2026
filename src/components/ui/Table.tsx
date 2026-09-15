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
    <tr className="border-b border-line">
      {columns.map((column) => (
        <th
          className="px-5 py-3 text-[10.5px] font-medium uppercase tracking-[0.08em] text-ink-muted"
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
  <tbody className="divide-y divide-line-soft text-ink [&>tr:hover]:bg-white/45 [&>tr]:transition-colors">
    {children}
  </tbody>
);

export const Td = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <td className={`px-5 py-3.5 align-middle ${className}`}>{children}</td>;
