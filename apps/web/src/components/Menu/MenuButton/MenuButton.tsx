import { motion } from 'framer-motion';

export interface MenuButtonProps {
    onClick: () => void;
}

export const MenuButton = ({ onClick }: MenuButtonProps) => {
    return (
        <motion.button
            className="rounded-full w-12 h-12 p-2 flex flex-col items-center justify-center bg-white shadow-lg focus:border-none focus-visible:outline-none"
            whileHover="hover"
            initial="initial"
            onClick={onClick}
        >
            {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                    key={i}
                    variants={{
                        initial: {
                            y: i === 0 ? -5 : 5, // top for the first circle, bottom for the others
                            x: i === 0 ? 0 : i === 1 ? -5 : 5 // center for the first circle, left for the second, right for the third
                        },
                        hover: {
                            x: 0,
                            y: 0,
                            transition: {
                                ease: [0.86, 0, 0.14, 1],
                                duration: 0.8
                            }
                        }
                    }}
                    className="absolute w-[3px] h-[3px] bg-black rounded-full"
                />
            ))}
            <motion.div
                className="absolute w-12 h-12 rounded-full bg-black"
                variants={{
                    initial: { scale: 0 },
                    hover: { scale: 0.8, opacity: 0, transition: { duration: 0.5, delay: 0.5 } }
                }}
            />
        </motion.button>
    );
};