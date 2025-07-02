
import AttendanceSheet from "@/components/AttendanceSheet";
import FloatingDots from "@/components/FloatingDots";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-mesh relative overflow-hidden">
      {/* Floating Dots Animation */}
      <FloatingDots />
      
      {/* Premium Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/15 to-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 0],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[120vw] h-[120vw] max-w-[600px] max-h-[600px] bg-gradient-to-br from-secondary/10 to-accent/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -120, 0],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-accent/8 to-primary/12 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 90, 0],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Additional mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/95 to-background/90" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{
              backgroundSize: "200% 200%"
            }}
          >
            Student Attendance Hub
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Modern, student-friendly attendance tracking with powerful analytics, instant notifications, and seamless mobile experience
          </motion.p>
          
          {/* Premium CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="premium" size="lg" className="text-lg font-bold shadow-premium hover:shadow-glow px-10 py-6">
                🚀 Start Taking Attendance
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="glass" size="lg" className="text-lg font-bold px-10 py-6">
                📊 View Analytics Dashboard
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Premium Feature highlights */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {[
              { icon: "🎯", text: "AI-Powered Analytics", color: "from-primary/20 to-accent/20" },
              { icon: "⚡", text: "Instant Notifications", color: "from-accent/20 to-primary/20" }, 
              { icon: "📱", text: "Mobile-First Design", color: "from-secondary/20 to-primary/20" },
              { icon: "📊", text: "Advanced Reports", color: "from-primary/20 to-secondary/20" },
              { icon: "☁️", text: "Real-time Sync", color: "from-accent/20 to-secondary/20" },
              { icon: "🔒", text: "Secure & Private", color: "from-secondary/20 to-accent/20" }
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                className={`bg-gradient-glass backdrop-blur-xl px-6 py-4 rounded-2xl text-sm font-semibold text-foreground shadow-glass border border-white/10 hover-lift`}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "var(--shadow-premium)",
                  borderColor: "hsl(var(--primary) / 0.3)"
                }}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1, type: "spring", bounce: 0.4 }}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-50 blur-xl -z-10`} />
                <span className="text-xl mr-3">{feature.icon}</span>
                {feature.text}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, type: "spring", bounce: 0.3 }}
          className="relative"
        >
          {/* Glow effect behind the main card */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 rounded-3xl blur-3xl scale-105" />
          <AttendanceSheet />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
