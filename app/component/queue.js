import styles from "./queuelayout.module.css";

export default function Queue({ title, tasks }) {
  // Head of the queue
  const currentTask = tasks.length > 0 ? tasks[0] : null;

  return (
    <div className={styles.queue}>
      <h3 style={{ flex: "1" }}>{title}</h3>

      {/* Task list */}
      <div style={{ flex: "1" }}>
        <strong>Queue List:</strong>{" "}
        {tasks.map((t) => (
          <span key={t.id} className={styles.taskChip}>
            {t.value}
          </span>
        ))}
      </div>

      {/* Duration preview (progress bar of the *current task only*) */}
      <div className={styles.durationWrapper}>
        <strong>Duration:</strong>
        <div className={styles.taskBar}>
          <div
            className={styles.taskFill}
            style={{
              width: currentTask
                ? `${(currentTask.remaining / currentTask.value) * 100}%`
                : "0%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
