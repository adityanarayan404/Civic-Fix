const styles = {
  REPORTED: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  VERIFIED: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
  ASSIGNED: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',
  IN_PROGRESS: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300',
  RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300'
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full ${styles[status] || 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300'}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}

export default StatusBadge;
