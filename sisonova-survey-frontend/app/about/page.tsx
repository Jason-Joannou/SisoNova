// app/about/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UbuntuHeading } from "@/components/ui/ubuntu-heading";

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4 font-so"
      >
        <UbuntuHeading>About SisoNova</UbuntuHeading>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="ubuntu-card">
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-lg">
              SisoNova is dedicated to promoting financial inclusion and
              literacy in South Africa. We believe that everyone deserves access
              to appropriate financial services and the knowledge to make
              informed financial decisions.
            </p>
            <p className="text-lg">
              Through our research, we aim to identify barriers to financial
              inclusion and provide insights that can help create more
              accessible and user-friendly financial products and services for
              all South Africans.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="ubuntu-card">
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-2xl font-semibold">The Survey</h2>
            <p className="text-lg">
              Our financial inclusion survey collects data from diverse
              participants across South Africa to understand:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>
                Financial behaviors and challenges faced by South Africans
              </li>
              <li>Access to and usage of financial services</li>
              <li>Barriers to financial inclusion</li>
              <li>Technology adoption for financial management</li>
              <li>Psychological factors affecting financial decisions</li>
            </ul>
            <p className="text-lg mt-4">
              The insights gained from this survey help us identify patterns and
              trends that can inform the development of more inclusive financial
              products and services.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="ubuntu-card">
          <CardContent className="pt-6 space-y-4">
            <h2 className="text-2xl font-semibold">Our Approach</h2>
            <p className="text-lg">
              We believe in a data-driven approach to understanding financial
              inclusion. By collecting and analyzing survey data, we can
              identify patterns and trends that might otherwise go unnoticed.
            </p>
            <p className="text-lg">
              Our goal is to share these insights with financial service
              providers, policymakers, and the public to promote more inclusive
              financial systems and practices.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/">View Survey Results</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
        >
          <Link href="/dashboard">Explore Dashboard</Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center text-muted-foreground"
      >
        <p>© {new Date().getFullYear()} SisoNova. All rights reserved.</p>
        <p className="mt-2">
          For inquiries, contact us at{" "}
          <a
            href="mailto:info@sisonova.com"
            className="underline hover:text-primary"
          >
            info@sisonova.com
          </a>
        </p>
      </motion.div>
    </div>
  );
}
