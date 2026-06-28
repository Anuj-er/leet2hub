export default function Logo() {
  return (
    <div className="flex items-center space-x-3 drop-shadow-sm">
      <div className="flex items-center justify-center">
        <img src="logo.png" alt="leet2hub logo" width={38} height={38} className="rounded-lg object-contain" />
      </div>
      <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
        Leet2Hub
      </h1>
    </div>
  );
}
