import { StorylineContentProps } from "@/lib/types/component";
import { UbuntuHeading } from "../ui/ubuntu-heading";
import { Card, CardContent } from "../ui/card";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BarChart2, BookOpen, MessageSquare } from "lucide-react"; // Import icons

export default function CallToAction({ gender }: StorylineContentProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.section
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="max-w-3xl mx-auto mb-16"
    >
      <motion.div variants={itemVariants}>
        <UbuntuHeading>Together, we move forward</UbuntuHeading>
      </motion.div>

      <Card className="ubuntu-card">
        <CardContent className="pt-8 pb-6">
          <motion.div
            variants={itemVariants}
            className="text-lg mb-6 leading-relaxed"
          >
            <p className="mb-4">
              Despite efforts by financial institutions, many South Africans
              remain underserved and overlooked. At{" "}
              <span className="font-bold text-[#24713F]">SisoNova</span>, we're
              committed to making financial opportunity accessible to everyone —
              regardless of background or circumstance.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-5 mb-6">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="mt-1 bg-[#24713F]/10 p-2 rounded-full">
                <BarChart2 className="h-5 w-5 text-[#24713F]" />
              </div>
              <div>
                <h3 className="font-medium text-[#291009]">
                  Explore our data insights
                </h3>
                <p className="text-gray-600 mb-1">
                  Discover patterns and trends from our comprehensive survey
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center text-[#24713F] font-medium hover:underline"
                >
                  View dashboard <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="mt-1 bg-[#24713F]/10 p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-[#24713F]" />
              </div>
              <div>
                <h3 className="font-medium text-[#291009]">
                  Read the full story
                </h3>
                <p className="text-gray-600 mb-1">
                  Get a detailed overview of South Africa's financial landscape
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center text-[#24713F] font-medium hover:underline"
                >
                  Read our story <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-[#24713F]/10 p-5 rounded-lg border border-[#24713F]/20"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <MessageSquare className="h-5 w-5 text-[#24713F]" />
              </div>
              <div>
                <h3 className="font-medium text-[#291009] mb-1">
                  Share your journey
                </h3>
                <p className="text-gray-700 mb-3">
                  Your voice matters. Help us shape solutions that truly reflect
                  the needs of all South Africans.
                </p>
                <a
                  href="https://forms.gle/DkVr4PKFHieHoiTb8"
                  className="inline-flex items-center justify-center px-4 py-2 bg-[#24713F] text-white rounded-md font-medium hover:bg-[#1c5a32] transition-colors"
                >
                  Participate in our survey
                </a>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.section>
  );
}

