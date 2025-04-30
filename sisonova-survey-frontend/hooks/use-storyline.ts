import { useState, useEffect } from "react";
import { fetchStoryline } from "@/services/storyline-service";
import { StorylineResponse } from "@/types/api";

export function useStoryLine(gender?: string) {
    const [data, setData] = useState<StorylineResponse>({ stats: {}, messaged: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try{
                const response = await fetchStoryline(gender);
                setData(response);
            } catch (error){
                setError("Error fetching storyline");
                console.error(error);
            } finally{
                setLoading(false);
            }
        };

        loadData();
    }, [gender])

    return { data, loading, error }
}