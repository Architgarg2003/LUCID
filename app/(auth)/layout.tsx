

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen w-screen flex justify-center items-center bg-[#efeae3]">
      <div className="z-50">
        {children}
      </div>
    </main>
  );
}
