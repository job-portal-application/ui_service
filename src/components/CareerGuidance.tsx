import { useState } from "react";
import { Sparkles, ArrowRight, X, Loader2, Target, Lightbulb, Briefcase, TrendingUp, BookOpen } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../@/components/ui/dialog";
import type { CareerGuidanceResponse } from "@/lib/type";
import axios from "axios";
import { env } from "../config/env";
import { Button } from "../../@/components/ui/button";
import { Label } from "../../@/components/ui/label";
import { Input } from "../../@/components/ui/input";

const CareerGuidance = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<CareerGuidanceResponse | null>(null);

  const addSkill = () => {
    if(currentSkill.trim() && !skills.includes(currentSkill.trim())) {
        setSkills([...skills, currentSkill.trim()]);
        setCurrentSkill("");
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s!== skillToRemove));
  }

  const handlePressKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter") {
        addSkill();
    }
  }

  const getCareerGuidance = async() => {
    if(skills.length === 0) {
        alert("Please enter at least one skill");
        return;
    }
    setLoading(true);
    try {
        const { data } = await axios.post(`${env.aiServiceBaseUrl}/api/v1/ai/career`, {
            skills: skills,
            Headers: {
                "Content-Type": "application/json"
            }
        });
        setResponse(data);
        alert("Data received successfully");
    } catch (error: any) {
        alert(error.response.data.message);
    } finally {
        setLoading(false);
    }
  }

  const resetDialog = () => {
    setSkills([]);
    setCurrentSkill("");
    setResponse(null);
    setOpen(false);
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-blue-50 dark:bg-blue-950 mb-4">
            <Sparkles size={16} className="text-blue-600" />
            <span className="text-sm font-medium">AI powered Job search</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose your career path</h2>
        <p className="text-lg opacity-70 max-w-2xl mx-auto mb-8">
            Get personalized job recommendations and learning roadmaps based on your skills and interests.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button size={"lg"} className="gap-2 h-12 px-8">
                    <Sparkles size={18} />
                    <span>Get Career Guidance</span>
                    <ArrowRight size={18} />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                {
                    !response ? (<>
                        <DialogHeader className="rounded-2xl">
                            <DialogTitle className="text-2xl flex items-center gap-2">
                                <Sparkles className="text-blue-600">Tell us about your skills</Sparkles>
                            </DialogTitle>
                            <DialogDescription>Add your technical skills to receive personalized career recommendations</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="skill">Add skills</Label>
                                <div className="flex gap-2">
                                    <Input id="skill" placeholder="e.g. React, Node.js, Java, Python etc." value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)} className="h-ll" onKeyPress={handlePressKey} />
                                    <Button onClick={addSkill} className="gap-2">Add</Button>
                                </div>
                            </div>
                            {
                                skills.length > 0 && 
                                    <div className="space-y-2">
                                        <Label>Your skills ({skills.length})</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {
                                                skills.map((s) => (
                                                    <div key={s} className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                                                        <span className="text-sm font-medium">{s}</span>
                                                        <Button onClick={() => removeSkill(s)} className="h-5 w-5 rounded-full bg-red-500 text-white flex in-checked: justify-center">
                                                            <X size={13} />
                                                        </Button>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                            }
                            <Button onClick={getCareerGuidance} disabled={loading || skills.length === 0} className="w-full h-11 gap-2">
                                {
                                    loading ? (<>
                                        <Loader2 size={18} className="animate-spin" />
                                        Analyzing your skills...
                                        </>) : (<>
                                            <Sparkles size={18} />
                                            Generate career guidance
                                        </>)
                                }
                            </Button>
                        </div>
                        </>) : (<>
                            <DialogHeader>
                                <DialogTitle className="text-2xl flex items-center gap-2">
                                    <Target className="text-blue-600" />
                                    Your personalized career guide
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                {/** Summary */}
                                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border boder-b-blue-200 dark:border-b-blue-800">
                                    <div className="flex items-start gap-3">
                                        <Lightbulb size={20} className="text-blue-600 mt-1 shrink-0" />
                                        <div>
                                            <h3 className="font-semibold mb-2">Career summary</h3>
                                            <p className="text-sm leading-relaxed opacity-90">{response.summary}</p>
                                        </div>
                                    </div>
                                </div>
                                {/** Job options */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Briefcase size={20} className="text-blue-600" />
                                        Recommended career paths
                                    </h3>
                                    <div className="space-y-3">
                                        {
                                            response.jobOptions.map((job, index) => (
                                                <div key={index} className="p-4 rounded-lg border hover:border-blue-500 transition-colos">
                                                    <h4 className="font-semibold text-base mb-2">{job.title}</h4>
                                                    <div className="space-y-2 text-sm">
                                                        <div>
                                                            <span className="font-medium opacity-70">Responsibilities:</span>
                                                            <span className="opacity-80">{job.responsibilities}</span>
                                                        </div>
                                                        <span className="font-medium opacity-70">Why this role?</span>
                                                        <span className="opacity-80">{job.why}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                {/** Skills to learn */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <TrendingUp size={20} className="text-blue-600" />
                                        Skills to enhance your career
                                    </h3>
                                    <div className="space-y-4">
                                        {
                                            response.skillsToLearn.map((category, index) => (
                                                <div key={index} className="space-y-2">
                                                    <h4 className="font-semibold text-sm text-blue-600">
                                                        {category.category}
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {
                                                            category.skills.map((skill, index) => (
                                                                <div key={index} className="p-3 rounded-lg bg-secondary border text-sm">
                                                                    <p className="font-medium mb-1">{skill.title}</p>
                                                                    <p className="text-xs opacity-70 mb-1">
                                                                        <span className="font-medium">How?</span>
                                                                        {skill.how}
                                                                    </p>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                {/** Learning approach */}
                                <div className="p-4 rounded-lg border bg-blue-950/20 dark:bg-red-950/20">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <BookOpen size={20} className="text-blue-600" />
                                        {response?.learningApproach?.title}
                                    </h3>
                                    <ul className="space-y-2">
                                        {
                                            response?.learningApproach?.points?.map((point, index) => (
                                                <li key={index}  className="text-sm flex items-start gap-2">
                                                    <span className="text-blue-600 mt-0.5">•</span>
                                                    <span className="opacity-90" dangerouslySetInnerHTML={{__html: point}} />
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                <Button onClick={resetDialog} variant={"outline"} className="w-full">Start new analysis</Button>
                            </div>
                        </>)
                }
            </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default CareerGuidance
