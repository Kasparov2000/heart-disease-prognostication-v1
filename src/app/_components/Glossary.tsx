import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IconButton } from "@radix-ui/themes";
import { InfoIcon } from "lucide-react";
import {Button} from "@/components/ui/button";

const Glossary = () => {
    return (
        <div className="flex justify-center">
            <Popover>
                <PopoverTrigger asChild>
                    <Button className="flex m-2 gap-2 p-2">
                        <InfoIcon/>
                        Open Glossary
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[50vw] overflow-y-scroll h-[70vh] mr-4">
                    <ol className="flex flex-col divide-slate-100 divide-y-2 px-6">
                        <li className="mb-2 p-5 font-md">Age: How old the patient is. It can be between 0 and 120 years.</li>
                        <li className="mb-2 p-5 font-md">Chest Pain Type (cp): Describes the kind of chest pain. 0 for common angina (chest pain), 1 for less common types, 2 for non-heart-related pain, 3 if there’s no pain or discomfort.</li>
                        <li className="mb-2 p-5 font-md">Resting Blood Pressure (trtbps): The patient's blood pressure during rest, in mm Hg. A normal range is between 90-120.</li>
                        <li className="mb-2 p-5 font-md">Serum Cholesterol (chol): Cholesterol levels in the blood, measured in mg/dl. The healthy range can vary.</li>
                        <li className="mb-2 p-5 font-md">Fasting Blood Sugar (fbs): Indicates if the patient’s blood sugar is high (over 120 mg/dl) after fasting. Mark 1 for high, 0 for normal.</li>
                        <li className="mb-2 p-5 font-md">Resting ECG (restecg): Results of the heart's electrical activity test. 0 is normal, 1 indicates some abnormalities, and 2 suggests changes usually linked to an enlarged heart.</li>
                        <li className="mb-2 p-5 font-md">Exercise-Induced Angina (exang): Chest pain triggered by physical activity. Indicate 1 for yes, 0 for no.</li>
                        <li className="mb-2 p-5 font-md">ST Depression (oldpeak): A measurement related to heart stress from exercise, lower values are generally better.</li>
                        <li className="mb-2 p-5 font-md">Slope of Peak Exercise ST (slope): Describes the ST segment changes on an ECG during exercise. 0 indicates an upsloping (good sign), 1 is flat, and 2 is downsloping (less favorable).</li>
                        <li className="mb-2 p-5 font-md">Major Vessels (ca): The number of major blood vessels visible on a fluoroscopy, ranging from 0 (none visible) to 4.</li>
                        <li className="mb-2 p-5 font-md">Thalassemia (thal): A type of blood disorder. 0 if not present, 1 for normal, 2 for a minor defect, 3 for a major defect.</li>
                    </ol>

                </PopoverContent>
            </Popover>
        </div>
    );
};

export default Glossary;
