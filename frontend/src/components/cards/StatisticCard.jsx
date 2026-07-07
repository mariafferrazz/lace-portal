import { motion } from "framer-motion";

export default function StatisticCard({
  number,
  title,
  description,
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: .25 }}
      className="
        rounded-2xl
        bg-card
        border
        border-border
        p-8
        text-center
        transition
      "
    >
      <h2 className="text-5xl font-bold text-primary">
        {number}
      </h2>

      <h3 className="mt-4 text-xl font-semibold">
        {title}
      </h3>

      {description && (
        <p className="mt-3 text-sm text-muted leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
