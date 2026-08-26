import { statusToColorMap } from "../constants/constants";
import { Section } from "../molecules/Section";
import { StatusBadge } from "../molecules/StatusBadge";
import { formatDate } from "../utils/dateUtils";

export const RunOverview = ({
    status,
    createdAt,
    startedAt,
    completedAt,
    deletedAt,
}) => {
    return (
        <Section title="Run Overview">
            <div style={styles.timeline}>
                <TimelineItem label="Created" value={createdAt} />
                <TimelineItem label="Started" value={startedAt} />
                <TimelineItem label="Completed" value={completedAt} />
                <TimelineItem label="Deleted" value={deletedAt} last />
            </div>
            <div style={styles.runStatus}>
                <span style={styles.detailLabel}>Current Status</span>
                <StatusBadge status={status} color={statusToColorMap[status]} />
            </div>
        </Section>
    );
};

/* -------------------------------------------------- */
/* Timeline */
/* -------------------------------------------------- */

const TimelineItem = ({ label, value, last }) => {
    return (
        <div style={styles.timelineItem}>
            <div style={styles.timelineIndicator}>
                <div style={styles.timelineDot} />

                {!last && <div style={styles.timelineLine} />}
            </div>

            <div>
                <div style={styles.timelineLabel}>{label}</div>

                <div style={styles.timelineValue}>{formatDate(value)}</div>
            </div>
        </div>
    );
};

const styles = {
    timeline: {
        display: "flex",
        flexDirection: "column",
    },
    timelineItem: {
        display: "flex",
        gap: "12px",
        minHeight: "58px",
    },

    timelineIndicator: {
        position: "relative",
        width: "12px",
        flexShrink: 0,
    },

    timelineDot: {
        position: "absolute",
        top: "4px",
        left: "2px",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "#6366f1",
    },

    timelineLine: {
        position: "absolute",
        top: "12px",
        left: "5px",
        width: "2px",
        height: "52px",
        background: "#e5e7eb",
    },

    timelineLabel: {
        fontSize: "12px",
        color: "#9ca3af",
    },

    timelineValue: {
        marginTop: "3px",
        fontSize: "13px",
        fontWeight: 500,
        color: "#374151",
    },
    runStatus: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "8px",
        paddingTop: "15px",
        borderTop: "1px solid #f0f0f0",
    },
};
