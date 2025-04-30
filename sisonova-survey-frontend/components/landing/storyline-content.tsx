'use client';

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useStoryLine } from "@/lib/hooks/use-storyline";
import { Card, CardContent } from "../ui/card";
import { StorylineContentProps } from "@/lib/types/component";
import LoadingState from "../shared/loading-state";
import { UbuntuHeading } from "../ui/ubuntu-heading";

export default function StoryLineContent({gender}: StorylineContentProps) {
    const { data, loading, error } = useStoryLine(gender);

    if (loading){
        return <LoadingState />
    }

    if (error) {
        return (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        );
      }

      return (
        <div className="space-y-24 pb-24">
          <DemographicsSection data={data?.stats} />
          <IncomeSection data={data?.stats} />
          <FinancialManagementSection data={data?.stats} />
          <FinancialAccessSection data={data?.stats} />
          <BarriersSection data={data?.stats} />
          <TechnologySection data={data?.stats} />
        </div>
      );
}

// Animation variants for sections
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
  
  // Demographics Section
  function DemographicsSection({ data }: { data: any }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    
    return (
      <motion.section
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-3xl mx-auto"
      >
        <motion.div variants={itemVariants}>
            <UbuntuHeading>Demographics</UbuntuHeading>
        </motion.div>
        
        <Card className="ubuntu-card">
          <CardContent className="pt-6">
            <motion.p variants={itemVariants} className="text-lg mb-4">
                Our average respondent is in the <strong>{data?.most_frequent_age_group || 'N/A'}</strong> age group, 
              living in <strong>{data?.most_frequent_province || 'N/A'}</strong>, typically in a 
              <strong> {data?.most_frequent_living_location?.toLowerCase() || 'N/A'}</strong> area.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg mb-4">
              They are most commonly <strong>{data?.most_frequent_employment_status?.toLowerCase() || 'N/A'}</strong> and 
              have completed <strong>{data?.most_frequent_education_level?.toLowerCase() || 'N/A'}</strong> education.
            </motion.p>
          </CardContent>
        </Card>
      </motion.section>
    );
  }
  
  // Income Section
  function IncomeSection({ data }: { data: any }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    
    return (
      <motion.section
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-3xl mx-auto"
      >
        <motion.h2 variants={itemVariants}>
          <UbuntuHeading>Income & Household</UbuntuHeading>
        </motion.h2>
        
        <Card className="ubuntu-card">
          <CardContent className="pt-6">
            <motion.p variants={itemVariants} className="text-lg mb-4">
              Their personal monthly income typically falls in the 
              <strong> {data?.most_frequent_personal_income || 'N/A'}</strong> range, 
              while their household income is in the 
              <strong> {data?.most_frequent_household_income || 'N/A'}</strong> range.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg mb-4">
              The main source of income is <strong>{data?.most_frequent_source_of_income || 'N/A'}</strong>.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg">
              They live in a household with an average of <strong>{data?.average_household_size || 'N/A'}</strong> people, 
              with <strong>{data?.average_income_earners || 'N/A'}</strong> income earners contributing to the household finances.
            </motion.p>
          </CardContent>
        </Card>
      </motion.section>
    );
  }
  
  // Financial Management Section
  function FinancialManagementSection({ data }: { data: any }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    
    return (
      <motion.section
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-3xl mx-auto"
      >
        <motion.h2 variants={itemVariants}>
          <UbuntuHeading>Financial Management</UbuntuHeading>
        </motion.h2>
        
        <Card className="ubuntu-card">
          <CardContent className="pt-6">
            <motion.p variants={itemVariants} className="text-lg mb-4">
              When it comes to managing money, they typically create a spending plan 
              <strong> {data?.most_frequent_spending_plan_frequency?.toLowerCase() || 'N/A'}</strong>, 
              usually <strong>{data?.most_frequent_spending_plan_timing?.toLowerCase() || 'N/A'}</strong>.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg mb-4">
              Their budgeting style can be described as 
              <strong> {data?.most_frequent_budgeting_style?.toLowerCase() || 'N/A'}</strong>, 
              and they track expenses <strong>{data?.most_frequent_expense_tracking?.toLowerCase() || 'N/A'}</strong>.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg mb-4">
              The most common tools used for managing spending are 
              <strong> {data?.most_frequent_spending_management_tool || 'N/A'}</strong>.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg">
              When thinking about money, they most often feel 
              <strong> {data?.most_frequent_money_emotion?.toLowerCase() || 'N/A'}</strong>.
            </motion.p>
          </CardContent>
        </Card>
      </motion.section>
    );
  }
  
  // Financial Access Section
  function FinancialAccessSection({ data }: { data: any }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    
    return (
      <motion.section
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-3xl mx-auto"
      >
        <motion.h2 variants={itemVariants}>
          <UbuntuHeading>Financial Access</UbuntuHeading>
        </motion.h2>
        
        <Card className="ubuntu-card">
          <CardContent className="pt-6">
            <motion.p variants={itemVariants} className="text-lg mb-4">
              They typically have <strong>{data?.most_frequent_account_type || 'N/A'}</strong> accounts, 
              with <strong>{data?.most_frequent_active_accounts_count || 'N/A'}</strong> active accounts.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg mb-4">
              The main reasons for having multiple accounts include 
              <strong> {data?.most_frequent_multiple_accounts_reason || 'N/A'}</strong>.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg mb-4">
              They primarily use their accounts for 
              <strong> {data?.most_frequent_account_usage_purpose || 'N/A'}</strong>.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg">
              The financial services they trust most are 
              <strong> {data?.most_frequent_trusted_financial_service || 'N/A'}</strong>.
            </motion.p>
          </CardContent>
        </Card>
      </motion.section>
    );
  }
  
  // Barriers Section
  function BarriersSection({ data }: { data: any }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    
    return (
      <motion.section
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-3xl mx-auto"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6 text-center">
          <UbuntuHeading>Financial Barriers</UbuntuHeading>
        </motion.h2>
        
        <Card className="ubuntu-card">
          <CardContent className="pt-6">
            <motion.p variants={itemVariants} className="text-lg mb-4">
              When it comes to paperwork, they 
              <strong> {data?.most_frequent_paperwork_avoidance?.toLowerCase() || 'N/A'}</strong> avoid it.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg mb-4">
              Their financial literacy level is 
              <strong> {data?.most_frequent_financial_literacy?.toLowerCase() || 'N/A'}</strong>, 
              and their confidence in financial matters scores 
              <strong> {data?.most_frequent_financial_confidence || 'N/A'}</strong> out of 10.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg mb-4">
              The main concerns they have about financial services are 
              <strong> {data?.most_frequent_financial_service_concern || 'N/A'}</strong>.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg">
              Their trust in financial institutions is 
              <strong> {data?.most_frequent_financial_institution_trust?.toLowerCase() || 'N/A'}</strong>.
            </motion.p>
          </CardContent>
        </Card>
      </motion.section>
    );
  }
  
  // Technology Section
  function TechnologySection({ data }: { data: any }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    
    return (
      <motion.section
        ref={ref}
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-3xl mx-auto"
      >
        <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6 text-center">
          <UbuntuHeading>Technology Usage</UbuntuHeading>
        </motion.h2>
        
        <Card className="ubuntu-card">
          <CardContent className="pt-6">
            <motion.p variants={itemVariants} className="text-lg mb-4">
              Their comfort level with financial technology is 
              <strong> {data?.most_frequent_fintech_comfort_level?.toLowerCase() || 'N/A'}</strong>.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg mb-4">
              They primarily use 
              <strong> {data?.most_frequent_financial_management_device || 'N/A'}</strong> 
              for managing their finances.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg mb-4">
              They use the internet 
              <strong> {data?.most_frequent_internet_usage?.toLowerCase() || 'N/A'}</strong>.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg mb-4">
              The main challenges they face with digital finance are 
              <strong> {data?.most_frequent_digital_finance_challenge || 'N/A'}</strong>.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-lg">
              Their trust in digital security scores 
              <strong> {data?.most_frequent_digital_security_trust || 'N/A'}</strong> out of 10.
            </motion.p>
          </CardContent>
        </Card>
      </motion.section>
    );
  }

