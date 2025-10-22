"use client";
import { useState, useEffect } from "react";
import Queue from "./queue";
import styles from "./queuelayout.module.css";

export default function QueueLayout() {
    const [waitingLine, setWaitingLine] = useState([]);
    const [priorityQueue, setPriorityQueue] = useState([[]]);
    const [regularQueues, setRegularQueues] = useState([[], [], []]);

    const addRandomTask = () => {
        const value = Math.floor(Math.random() * 200) + 50;
        const isPriority = Math.random() < 0.1;
        setWaitingLine((prev) => [
            ...prev,
            { id: Date.now() + Math.random(), value, remaining: value, isPriority },
        ]);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setPriorityQueue((prevQueues) =>
                prevQueues.map((queue) => {
                    if (queue.length === 0) return queue;

                    const [head, ...rest] = queue;
                    const updated = { ...head, remaining: head.remaining - 1 };

                    return updated.remaining <= 0 ? rest : [updated, ...rest];
                })
            );

            setRegularQueues((prevQueues) =>
                prevQueues.map((queue) => {
                    if (queue.length === 0) return queue;

                    const [head, ...rest] = queue;
                    const updated = { ...head, remaining: head.remaining - 1 };

                    return updated.remaining <= 0 ? rest : [updated, ...rest];
                })
            );
        }, 100);

        return () => clearInterval(interval);
    }, []);


    const admitTask = () => {
        if (waitingLine.length === 0) return;

        const [next, ...rest] = waitingLine;
        setWaitingLine(rest);

        if (next.isPriority) {
            const totals = priorityQueue.map((q) =>
                q.reduce((sum, t) => sum + t.remaining, 0)
            );
            const minIndex = totals.indexOf(Math.min(...totals));

            const newQueues = [...priorityQueue];
            newQueues[minIndex] = [...newQueues[minIndex], next];
            setPriorityQueue(newQueues);
        } else {
            const totals = regularQueues.map((q) =>
                q.reduce((sum, t) => sum + t.remaining, 0)
            );
            const minIndex = totals.indexOf(Math.min(...totals));

            const newQueues = [...regularQueues];
            newQueues[minIndex] = [...newQueues[minIndex], next];
            setRegularQueues(newQueues);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.flexRow}>
                <div className={styles.leftPanel}>
                    {/*<span style={{marginRight: "10px", marginBottom: "40px"}}>HOVER HERE🦇 ➡️</span>*/}
                    <button className={styles.buttonTop} style={{marginRight: "10px", marginBottom: "40px"}} onClick={addRandomTask}>
                        <span>ADD RANDOM TASK</span>
                    </button>

                    <h3 className={styles.taskQueueTitle}>Task Queue</h3>
                    <div className={styles.taskQueue}>
                        {waitingLine.map((t) => (
                            <div
                                key={t.id}
                                className={t.isPriority ? styles.taskPriority : styles.task}
                            >
                                {t.value}
                            </div>
                        ))}
                    </div>

                    <button className={styles.buttonBottom} onClick={admitTask}>
                        ADMIT TASK
                    </button>
                </div>

                <div className={styles.rightPanel}>
                    <Queue title="High Priority Queue 1" tasks={priorityQueue[0]} />
                    <Queue title="Regular Queue 1" tasks={regularQueues[0]} />
                    <Queue title="Regular Queue 2" tasks={regularQueues[1]} />
                    <Queue title="Regular Queue 3" tasks={regularQueues[2]} />
                </div>
            </div>
        </div>
    );
}
