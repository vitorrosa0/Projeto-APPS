interface PageTitleProps {
  children: React.ReactNode;
}

export default function PageTitle({ children }: PageTitleProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-3.5 h-3.5 rounded-full border-2 border-black flex-shrink-0" />
      <h1
        className="text-2xl font-bold tracking-wide uppercase text-transparent"
        style={{ WebkitTextStroke: "1px black" }}
      >
        {children}
      </h1>
    </div>
  );
}