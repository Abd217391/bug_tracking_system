export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* LEFT IMAGE */}
      <div className="hidden md:block w-1/3">
        <img
          src="/Left.png"
          alt="workspace"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative">
        {children}
      </div>
    </div>
  );
}
