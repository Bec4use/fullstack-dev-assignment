const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="h-full flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%),
        linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%),
        url('/background.jpg')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      {children}
    </div>
  );
};

export default AuthLayout;
