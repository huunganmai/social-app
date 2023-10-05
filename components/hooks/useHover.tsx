import { RefObject, useEffect } from "react";

const useHover = (ref : RefObject<HTMLDivElement>, onHover: any, onLeave: any) => {
    useEffect(() => {
        const mouseEnterListener = () => {
            onHover();
        }

        const mouseLeaveListener = () => {
            onLeave();
        }

        if (ref.current) {
            ref.current.addEventListener("mouseenter", mouseEnterListener);
            ref.current.addEventListener("mouseleave", mouseLeaveListener);
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener("mouseenter", mouseEnterListener);
                ref.current.removeEventListener("mouseleave", mouseLeaveListener);
            }
        }
    }, [ref, onHover, onLeave])
}

export default useHover;