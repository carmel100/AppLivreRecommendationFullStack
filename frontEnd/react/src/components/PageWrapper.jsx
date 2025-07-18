// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -100 }
};

const pageTransition = {
  type: "tween",
  duration: 0.7
};

export default function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      
    >
      {children}
    </motion.div>
  );
}
