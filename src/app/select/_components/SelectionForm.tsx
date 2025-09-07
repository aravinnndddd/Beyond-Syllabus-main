"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, GraduationCap, BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useData } from "@/contexts/dataContext";
import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import ErrorDisplay from "@/components/common/ErrorDisplay";

function capitalizeWords(str: string | undefined): string {
  if (!str) return "";
  return str.replace(/-/g, " ").toUpperCase(); // replace "-" with space and uppercase everything
}
function formatSemesterName(semesterId: string): string {
  if (!semesterId) return "";
  return `Semester ${semesterId.replace("s", "").replace(/^0+/, "")}`;
}

const stepVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const MotionDiv = motion.div;

export function SelectionForm() {
  const router = useRouter();
  const { data: directoryStructure, isFetching, isError, error } = useData();
  const [selectedUniversityId, setSelectedUniversityId] = useState<
    string | null
  >(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null
  );
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(
    null
  );
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const stepsConfig = [
    { step: 1, label: "University" },
    { step: 2, label: "Program" },
    { step: 3, label: "Scheme" },
    { step: 4, label: "Semester" },
  ];

  const handleUniversitySelect = async (universityId: string) => {
    setIsLoading(true);
    setLoadingMessage("Loading programs...");
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSelectedUniversityId(universityId);
    setIsLoading(false);
    setStep(2);
  };

  const handleProgramSelect = async (programId: string) => {
    setIsLoading(true);
    setLoadingMessage("Loading schemes...");
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSelectedProgramId(programId);
    setIsLoading(false);
    setStep(3);
  };

  const handleSchemeSelect = async (schemeId: string) => {
    setIsLoading(true);
    setLoadingMessage("Loading semesters...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSelectedSchemeId(schemeId);
    setIsLoading(false);
    setStep(4);
  };

  const handleSemesterSelect = (semesterId: string) => {
    setSelectedSemesterId(semesterId);
  };

  const resetToLevel = (level: number) => {
    if (level <= 1) {
      setSelectedUniversityId(null);
      setSelectedProgramId(null);
      setSelectedSchemeId(null);
      setSelectedSemesterId(null);
    } else if (level === 2) {
      setSelectedProgramId(null);
      setSelectedSchemeId(null);
      setSelectedSemesterId(null);
    } else if (level === 3) {
      setSelectedSchemeId(null);
      setSelectedSemesterId(null);
    } else if (level === 4) {
      setSelectedSemesterId(null);
    }
    setStep(level);
  };
  if (isFetching) return;
  if (isError) return <ErrorDisplay errorMessage={error} />;
  if (!directoryStructure || Object.keys(directoryStructure).length === 0) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-12 md:py-20 flex justify-center items-center flex-1">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">No Syllabus Data Found</h1>
            <p className="text-muted-foreground">
              Please ensure your 'universities' folder and its subdirectories
              contain valid syllabus data.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  const selectedUniversityData = selectedUniversityId
    ? directoryStructure[selectedUniversityId]
    : null;
  const selectedProgramData =
    selectedUniversityData && selectedProgramId
      ? selectedUniversityData[selectedProgramId]
      : null;
  const selectedSchemeData =
    selectedProgramData && selectedSchemeId
      ? selectedProgramData[selectedSchemeId]
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      selectedUniversityId &&
      selectedProgramId &&
      selectedSchemeId &&
      selectedSemesterId
    ) {
      setIsLoading(true);
      setLoadingMessage("Loading syllabus modules...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(
        `/${selectedUniversityId}/${selectedProgramId}/${selectedSchemeId}/${selectedSemesterId}`
      );
    }
  };

  return (
    <Card className="w-full shadow-2xl rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm mt-[5vh]">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-center flex-wrap gap-2 p-4 border-b border-muted">
        {stepsConfig.map(({ step: stepNumber, label }, index) => {
          const isActive = step === stepNumber;
          const isCompleted = step > stepNumber;
          return (
            <div key={label} className="flex items-center">
              <button
                type="button"
                disabled={!isCompleted && !isActive}
                onClick={() => resetToLevel(stepNumber)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-white"
                    : isCompleted
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {label}
              </button>
              {index < stepsConfig.length - 1 && (
                <span className="mx-2 text-muted-foreground">›</span>
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center font-bold">
            Find Your Syllabus
          </CardTitle>
          <CardDescription className="text-center">
            Follow the steps to find the curriculum for your course.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8  flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <MotionDiv
                key="loading"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full text-center space-y-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 mx-auto mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                    <Loader2 className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-xl font-semibold text-primary">
                      {loadingMessage}
                    </h3>
                    <p className="text-muted-foreground">
                      Please wait while we prepare your content...
                    </p>
                  </motion.div>
                </div>
              </MotionDiv>
            ) : (
              <>
                {step === 1 && (
                  <MotionDiv
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full flex items-start justify-center"
                  >
                    <div className="space-y-6 flex flex-col items-center justify-center rounded-2xl p-6">
                      <Label className="text-xl font-bold text-center text-purple-900 dark:text-purple-200">
                        1. Select Your University
                      </Label>

                      <Select
                        onValueChange={(value) => {
                          handleUniversitySelect(value); // ✅ sets selected university
                          setStep(2); // ✅ instantly move to next step
                        }}
                      >
                        <SelectTrigger className="w-[320px] py-4 px-4 text-lg font-medium rounded-xl border border-purple-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-all">
                          <SelectValue placeholder="Choose a university" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          side="bottom"
                          sideOffset={8}
                          avoidCollisions={false}
                          className="w-[320px] rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                        >
                          {Object.keys(directoryStructure).map(
                            (universityId) => (
                              <SelectItem
                                key={universityId}
                                value={universityId}
                                className="capitalize px-3 py-2 text-base hover:bg-purple-100 dark:hover:bg-purple-800 rounded-lg cursor-pointer transition-colors"
                              >
                                {capitalizeWords(universityId)}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </MotionDiv>
                )}

                {step === 2 && selectedUniversityData && (
                  <MotionDiv
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full"
                  >
                    <div className="space-y-6 flex flex-col items-center justify-center rounded-2xl p-6">
                      <Label className="text-xl font-bold text-center text-purple-900 dark:text-purple-200">
                        2. Choose Your Program
                      </Label>

                      <Select
                        onValueChange={handleProgramSelect}
                        value={selectedProgramId ?? ""}
                      >
                        <SelectTrigger className="w-[320px] py-4 px-4 text-lg font-medium rounded-xl border border-purple-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-all">
                          <SelectValue placeholder="Select Program" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          side="bottom"
                          sideOffset={8}
                          avoidCollisions={false}
                          className="w-[320px] rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 max-h-[300px] overflow-y-auto"
                        >
                          {Object.keys(selectedUniversityData).map(
                            (programId) => (
                              <SelectItem
                                key={programId}
                                value={programId}
                                className="capitalize px-3 py-2 text-base hover:bg-purple-100 dark:hover:bg-purple-800 rounded-lg cursor-pointer transition-colors"
                              >
                                {capitalizeWords(programId)}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </MotionDiv>
                )}

                {step === 3 && selectedProgramData && (
                  <MotionDiv
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 justify-center">
                        <Label
                          htmlFor="scheme"
                          className="text-lg font-semibold"
                        >
                          3. Select Your Scheme
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Your syllabus depends on the academic scheme you
                                follow.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.keys(selectedProgramData).map((schemeId) => (
                          <motion.div
                            key={schemeId}
                            whileHover={{ scale: 1.05, y: -3 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Card
                              className={cn(
                                "cursor-pointer border-transparent bg-transparent border-2 border-purple-700 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-gradient-to-br hover:from-purple-900 hover:to-purple-700 dark:hover:from-purple-800 dark:hover:to-purple-600 transition-all rounded-xl p-6 text-center",
                                selectedSchemeId === schemeId &&
                                  "border-primary bg-primary/10"
                              )}
                              onClick={() => handleSchemeSelect(schemeId)}
                            >
                              <BookOpen className="h-10 w-10 text-primary mx-auto mb-3" />
                              <p className="font-semibold capitalize">
                                {schemeId.replace(/-/g, " ")}
                              </p>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </MotionDiv>
                )}

                {step === 4 && selectedSchemeData && (
                  <MotionDiv
                    key="step4"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full"
                  >
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold text-center block">
                        4. Pick Your Semester
                      </Label>
                      <RadioGroup
                        value={selectedSemesterId ?? ""}
                        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
                      >
                        {Object.keys(selectedSchemeData).map((semesterId) => (
                          <div
                            key={semesterId}
                            onClick={() => {
                              handleSemesterSelect(semesterId);
                              handleSubmit(
                                new Event(
                                  "submit"
                                ) as unknown as React.FormEvent
                              );
                            }}
                            className={cn(
                              "flex flex-col items-center justify-center hover:border-primary  cursor-pointer border-2 border-purple-700 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/30 hover:bg-gradient-to-br hover:from-purple-900 hover:to-purple-700 dark:hover:from-purple-800 dark:hover:to-purple-600 transition-all rounded-xl p-6 text-center",
                              selectedSemesterId === semesterId &&
                                "border-primary bg-primary/10"
                            )}
                          >
                            <RadioGroupItem
                              value={semesterId}
                              id={semesterId}
                              className="sr-only"
                            />
                            <BookOpen className="h-6 w-6 mb-2 text-primary" />
                            <p className="font-semibold">
                              {formatSemesterName(semesterId)}
                            </p>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </MotionDiv>
                )}
              </>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex justify-between items-center bg-muted/50 p-4 rounded-b-2xl">
          <Button
            variant="ghost"
            type="button"
            onClick={() => {
              if (step === 1) {
                router.push("/"); // go to homepage
              } else {
                resetToLevel(step - 1); // go to previous step
              }
            }}
          >
            Back
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
