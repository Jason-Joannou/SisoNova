import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <LoadingSection />
      <LoadingSection />
      <LoadingSection />
    </motion.div>
  );
}

function LoadingSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <Skeleton className="h-10 w-48 mx-auto mb-6" />
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}