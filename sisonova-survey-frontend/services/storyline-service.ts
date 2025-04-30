import api from "./api";
import { StorylineResponse } from "../lib/types/api";

export const fetchStoryline = async (gender?: string): Promise<StorylineResponse> => {
    try{
        let url = '/api/storyline'
        if (gender) url += `?gender=${gender}`
        const response = await api.get(url)
        return response.data
    }
    catch(error){
        console.log('Error fetching storyline', error)
        throw error
    }
}
