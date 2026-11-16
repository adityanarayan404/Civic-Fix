const styles = {
  REPORTED: 'bg-amber-100 text-amber-800',
  VERIFIED: 'bg-sky-100 text-sky-800',
  ASSIGNED: 'bg-violet-100 text-violet-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-green-100 text-green-800'
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full ${styles[status] || 'bg-stone-100 text-stone-600'}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}

export default StatusBadge;
