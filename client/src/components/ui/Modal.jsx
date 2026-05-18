import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ open, title, description, onClose, children }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 px-3 py-3 sm:items-center sm:px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-[calc(100vw-1.5rem)] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-3xl border border-white/10 bg-[#111827] p-4 shadow-neon backdrop-blur-xl sm:max-w-md sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white sm:text-xl">{title}</h3>
            {description ? <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p> : null}
            <div className="mt-4 sm:mt-5">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
