export function OfflineBanner({ show }: { show: boolean }) {
  return (
    <div className="offline-banner" style={{ display: show ? 'flex' : 'none' }}>
      断线，展示旧案
    </div>
  );
}
