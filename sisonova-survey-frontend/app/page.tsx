'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StoryLineContent from "@/components/landing/storyline-content";
import FooterContent from "@/components/landing/footer-content";

export default function Home() {
  const [selectedGender, setSelectedGender] = useState<string | undefined>(undefined);

  return (

    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl bg-[#291009]/80 rounded-xl shadow-lg py-8">
      <motion.h1 
        className="text-5xl md:text-7xl font-so text-center mb-2 text-[#24713F]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        SisoNova
      </motion.h1>
      
      <motion.p 
        className="text-center mb-4 text-[#4A9051] font-oswald font-bold"
        style={{ fontSize: '2rem' }}
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
        <p className="text-3xl mb-6 font-oswald text-[#4A9051]">
          Let's go through the average 
          <span className="inline-block mx-2 min-w-[150px] text-[#24713F]" >
            <Select onValueChange={(value) => setSelectedGender(value === 'all'? undefined : value)}>
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
      <FooterContent gender={selectedGender} />
      </div>
    </div>
  );
}
