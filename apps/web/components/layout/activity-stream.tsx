"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const mockActivities = [
  { id: 1, time: "11:42", text: "OCR finished" },
  { id: 2, time: "11:42", text: "Summary generated" },
  { id: 3, time: "11:43", text: "Relationship added" },
  { id: 4, time: "11:44", text: "Steam plugin synced" },
  { id: 5, time: "11:44", text: "Docker worker complete" },
];

export function ActivityStream() {
  const [activities, setActivities] = useState(mockActivities);

  return (
    <div className="absolute bottom-6 left-6 z-40 w-72 pointer-events-none">
      <div className="flex flex-col justify-end h-32 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%)]">
        <AnimatePresence>
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10, x: -10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center space-x-3 text-xs py-1"
            >
              <span className="text-neutral-600 font-mono text-[10px]">{activity.time}</span>
              <span className="text-neutral-400 truncate">{activity.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
