import { useEffect, useState } from "react";

const getRemaining = (deadline) => {
  if (!deadline) {
    return null;
  }

  const difference =
    new Date(deadline).getTime() -
    new Date().getTime();

  if (difference <= 0) {
    return {
      overdue: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSeconds = Math.floor(
    difference / 1000
  );

  const days = Math.floor(
    totalSeconds / (24 * 60 * 60)
  );

  const hours = Math.floor(
    (totalSeconds % (24 * 60 * 60)) /
      (60 * 60)
  );

  const minutes = Math.floor(
    (totalSeconds % (60 * 60)) / 60
  );

  const seconds =
    totalSeconds % 60;

  return {
    overdue: false,
    days,
    hours,
    minutes,
    seconds,
  };
};

const SLACountdown = ({
  deadline,
  status,
}) => {
  const [remaining, setRemaining] =
    useState(() =>
      getRemaining(deadline)
    );

  useEffect(() => {
    if (!deadline) {
      return;
    }

    const update = () => {
      setRemaining(
        getRemaining(deadline)
      );
    };

    update();

    const timer = setInterval(
      update,
      1000
    );

    return () =>
      clearInterval(timer);
  }, [deadline]);

  // No SLA configured
  if (!deadline) {
    return (
      <span className="sla-countdown sla-none">
        SLA not set
      </span>
    );
  }

  // Completed complaints don't need countdown
  if (
    status === "RESOLVED" ||
    status === "CLOSED"
  ) {
    return (
      <span className="sla-countdown sla-completed">
        ✓ Completed
      </span>
    );
  }

  // Overdue
  if (remaining?.overdue) {
    return (
      <span className="sla-countdown sla-overdue">
        🔴 OVERDUE
      </span>
    );
  }

  // Less than 2 hours
  const totalMinutes =
    remaining.days * 24 * 60 +
    remaining.hours * 60 +
    remaining.minutes;

  let className =
    "sla-countdown sla-safe";

  if (totalMinutes <= 120) {
    className =
      "sla-countdown sla-danger";
  } else if (totalMinutes <= 360) {
    className =
      "sla-countdown sla-warning";
  }

  return (
    <span className={className}>
      ⏱️{" "}
      {remaining.days > 0 &&
        `${remaining.days}d `}

      {String(
        remaining.hours
      ).padStart(2, "0")}
      :
      {String(
        remaining.minutes
      ).padStart(2, "0")}
      :
      {String(
        remaining.seconds
      ).padStart(2, "0")}
    </span>
  );
};

export default SLACountdown;