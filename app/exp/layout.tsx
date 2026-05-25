import Topbar from '../components/Topbar';

export default function ExpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topbar active="exp" subtitle="EXP Scaler" />
      {children}
    </>
  );
}
