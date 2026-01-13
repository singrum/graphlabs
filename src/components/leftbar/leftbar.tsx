export default function Leftbar({ children }: { children: React.ReactNode }) {
  return <div className="fixed w-75 h-dvh top-0 left-0 p-4">{children}</div>;
}
