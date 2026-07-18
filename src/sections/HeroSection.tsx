import { Button } from "../../@/components/ui/button";
import { TrendingUp, Search, ArrowRight, Briefcase } from "lucide-react";
import { Link } from 'react-router-dom';
import Hero from '../assets/hero.png';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-blue-100/30">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl">

        </div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl">
            
        </div>
      </div>
      <div className="container mx-auto px-5 py-16 md:py-24 relative">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                {/** Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50 backdrop-blur-sm">
                    <TrendingUp size={16} className="text-blue-600" />
                    <span className="text-sm font-medium">#1 place to find your ideal job</span>
                </div>
                {/** Main headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                    Land your dream job at <span className="inline-block">Hire <span className="text-red-500">Heaven. </span></span>
                </h1>
                {/** Description */}
                <p className="text-lg md:text-xl leading-relaxed opacity-80 max-w-2xl">
                    Connect with top employers and discover opportunities that match your skills. Whether you 
                    are a job seeker or recruiter we've got you covered with awesome tools and a seamless experience.
                </p>
                {/** stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-8 py-4">
                    <div className="text-center md:text-left">
                        <p className="text-3xl font-bold text-blue-600">10k+</p>
                        <p className="text-sm opacity-70">Active jobs</p>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-3xl font-bold text-blue-600">6k+</p>
                        <p className="text-sm opacity-70">Companies</p>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-3xl font-bold text-blue-600">100k+</p>
                        <p className="text-sm opacity-70">Job seekers</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Link to='/jobs'>
                        <Button size={"lg"} className="text-base px-8 h-12 gap-2 group transition-all">
                            <Search size={18} />
                            Browse jobs
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link to='/about'>
                        <Button size={"lg"} variant={"outline"} className="text-base px-8 h-12 gap-2">
                            <Briefcase size={18} />
                            <span>Lear more</span>
                        </Button>
                    </Link>
                </div>
                {/** Trust indicator */}
                <div className="flex items-center gap-2 text-sm opacity-60 pt-4">
                    <span>✔️Free to use</span>
                    <span>•</span>
                    <span>✔️Verified employers</span>
                    <span>•</span>
                    <span>✔️Secured platform</span>
                </div>
            </div>
            {/** image section */}
            <div className="flex-1 relative">
                <div className="relative-group">
                    <div className="absolute -inset-4 bg-blue-400 opacity-20 blur-xl group-hover:opacity-30 transition-opacity">
                        
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-background">
                        <img src={Hero} alt="hero_image" className="object-cover object-center w-full h-full transform transition-transform duration-500 group-hover:scale-105" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
