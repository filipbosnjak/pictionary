import { useEffect } from "react";
import confetti from "canvas-confetti";

interface CelebrationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export default function Celebration({
  isVisible,
  onComplete,
}: CelebrationProps) {
  useEffect(() => {
    if (isVisible) {
      // Create a confetti burst
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          onComplete?.();
        }
      };

      frame();
    }
  }, [isVisible, onComplete]);

  return null;
}
