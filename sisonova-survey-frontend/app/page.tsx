'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StoryLineContent from "@/components/landing/storyline-content";

export default function Home() {
  const [selectedGender, setSelectedGender] = useState<string | undefined>(undefined);

  return (

    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.h1 
        className="text-5xl md:text-7xl font-so text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        SisoNova
      </motion.h1>
      
      <motion.p 
        className="text-xl md:text-2xl text-center text-muted-foreground mb-16 font-grape-nuts"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Empowering South Africans through financial inclusion and understanding
      </motion.p>
      
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-2xl mb-6 font-grape-nuts">
          Let's go through the average 
          <span className="inline-block mx-2 min-w-[150px]">
            <Select onValueChange={(value) => setSelectedGender(value === 'all' ? undefined : value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="South African" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">South African</SelectItem>
                <SelectItem value="Male">Male South African</SelectItem>
                <SelectItem value="Female">Female South African</SelectItem>
              </SelectContent>
            </Select>
          </span>
          financial story
        </p>
      </motion.div>

      <StoryLineContent gender={selectedGender} />
    </main>
  );
}
