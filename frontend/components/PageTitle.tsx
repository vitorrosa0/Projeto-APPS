interface PageTitleProps {
  children: React.ReactNode;
}

export default function PageTitle({ children }: PageTitleProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-wide uppercase text-[#2DB38B]">
        {children}
      </h1>
    </div>
  );
}