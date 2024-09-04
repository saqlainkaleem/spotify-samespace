import axios from "axios";

const API_URL = "https://cms.samespace.com/items/songs"; // Replace with your API endpoint

export const fetchAPI = async () => {
	try {
		const response = await axios.get(API_URL);
		const data = response.data;
		return data; // Adjust this if your API response structure is different
	} catch (error) {
		throw new Error(`API request failed: ${error.message}`);
	}
};
