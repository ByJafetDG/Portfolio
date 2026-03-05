import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

export function ShapeBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

            <ElegantShape
                delay={0.3}
                width={500}
                height={120}
                rotate={12}
                gradient="from-indigo-500/[0.12]"
                className="left-[-10%] top-[15%]"
            />

            <ElegantShape
                delay={0.5}
                width={400}
                height={100}
                rotate={-15}
                gradient="from-rose-500/[0.12]"
                className="right-[-5%] top-[70%]"
            />

            <ElegantShape
                delay={0.4}
                width={250}
                height={70}
                rotate={-8}
                gradient="from-violet-500/[0.12]"
                className="left-[5%] bottom-[5%]"
            />

            <ElegantShape
                delay={0.6}
                width={180}
                height={50}
                rotate={20}
                gradient="from-amber-500/[0.12]"
                className="right-[15%] top-[10%]"
            />

            <ElegantShape
                delay={0.7}
                width={130}
                height={35}
                rotate={-25}
                gradient="from-cyan-500/[0.12]"
                className="left-[20%] top-[5%]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]/80" />
        </div>
    );
}
