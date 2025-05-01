import { StorylineContentProps } from "@/lib/types/component";
import { UbuntuHeading } from "../ui/ubuntu-heading";
import { Card, CardContent } from "../ui/card";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";

export default function({gender}: StorylineContentProps){
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6,
            staggerChildren: 0.2
          }
        }
      };
      
      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5 }
        }
      };

    return (
        <motion.section
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-3xl mx-auto">

            <motion.div variants={itemVariants}>
                <UbuntuHeading>Together, we move forward</UbuntuHeading>
            </motion.div>

            <Card className="ubuntu-card">
                <CardContent className="pt-6">
                <motion.p variants={itemVariants} className="text-lg mb-4">
                    While financial institutions strive to serve the public, many South Africans still remain underserved or overlooked. At SisoNova, we believe that financial opportunity should be within everyone's reach — regardless of background or circumstance.
                </motion.p>

                <motion.p variants={itemVariants} className="text-lg mb-4">
                    Your voice matters. Share your financial journey and help us shape solutions that truly reflect the needs of all South Africans: <a href="https://forms.gle/DkVr4PKFHieHoiTb8" className="underline">Bridging the Gap</a>
                </motion.p>

                </CardContent>
            </Card>



        </motion.section>

    )
}